/* @flow */

'use strict';

var ReactScriptLoader = require('./ReactScriptLoader.js').ReactScriptLoader;
var IVideoLoader = require('./IframeVideoLoader/IVideoLoader');
var YoukuLoader = require('./IframeVideoLoader/YoukuLoader');
var YoutubeLoader = require('./IframeVideoLoader/YoutubeLoader');

var invariant = require('invariant');

class PlaybackControl {
  static isLoadedByScripts: Object;  // a map of script to loaded
  static scriptLoaderID: number;
  static loaders: Array<IVideoLoader>;
  static playbackControl: PlaybackControl;

  static getControl(): PlaybackControl {
    if (!PlaybackControl.playbackControl) {
      PlaybackControl.playbackControl = new PlaybackControl();
    }
    return PlaybackControl.playbackControl;
  }

  static configLoaders(): Array<IVideoLoader> {
    if (!PlaybackControl.loaders) {
      PlaybackControl.loaders = [
        new YoukuLoader(),
        new YoutubeLoader(),
      ];
    }
    return PlaybackControl.loaders;
  }

  loadVideo(htmlElementID: string, url: string): void {
    var loader = this._findLoader(url);

    PlaybackControl.configLoaders().forEach(x => {
      if (x !== loader) {
        x.clearVideo(htmlElementID);
      }
    });
    var iframeScript = loader.getScriptURL();

    if (!(iframeScript in PlaybackControl.isLoadedByScripts)) {
      loader.videoScriptReady = function() {
        PlaybackControl.isLoadedByScripts[iframeScript] = true;
        this._loadVideo(htmlElementID, url, loader);
      }.bind(this);

      ReactScriptLoader.componentDidMount(
        PlaybackControl.scriptLoaderID++,
        loader,   // this provides the scriptLoadSuccess/Error handlers
        iframeScript
      );
    } else {
      this._loadVideo(htmlElementID, url, loader);
    }
  }

  _findLoader(videoUrl: string): IVideoLoader {
    var loaders = PlaybackControl.configLoaders().map(
      loader =>
        loader.isVideoURLValid(videoUrl) && loader.parseVideoID(videoUrl)
        ? loader
        : null
    );

    loaders = loaders.filter(x => x !== null);

    invariant(loaders.length > 0, 'Input url does not have a loader');
    var loader = loaders[0];
    invariant(loader instanceof IVideoLoader, 'For flow');
    return loader;
  }

  _loadVideo(htmlElementID: string, url: string, loader: IVideoLoader): void {
    loader.loadVideo(htmlElementID, loader.parseVideoID(url));
  }
}

Object.assign(
  PlaybackControl,
  {
    isLoadedByScripts: {},
  }
);

module.exports = PlaybackControl;
