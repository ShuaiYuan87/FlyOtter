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
  static playbackControl: ?PlaybackControl;

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

  loadVideo(url: string): void {
    var loader = this._findLoader(url);

    PlaybackControl.configLoaders().forEach(x => {
      if (x !== loader) {
        x.clearVideo('youkuplayer');
      }
    });
    var iframeScript = loader.getScriptURL();

    if (!(iframeScript in PlaybackControl.isLoadedByScripts)) {
      loader.videoScriptReady = function() {
        PlaybackControl.isLoadedByScripts[iframeScript] = true;
        this._loadVideo(url, loader);
      }.bind(this);

      ReactScriptLoader.componentDidMount(
        PlaybackControl.scriptLoaderID++,
        loader,   // this provides the scriptLoadSuccess/Error handlers
        iframeScript
      );
    } else {
      this._loadVideo(url, loader);
    }
  }

  _findLoader(videoUrl: string): IVideoLoader {
    var loaders = PlaybackControl.configLoaders().map(
      loader => loader.isVideoURLValid(videoUrl) ? loader : null
    ).filter(x => x !== null);

    invariant(loaders.length > 0, 'Input url does not have a loader');
    return loaders[0];
  }

  _loadVideo(url: string, loader: any): void {
    loader.loadVideo('youkuplayer', loader.parseVideoID(url));
  }
}

Object.assign(
  PlaybackControl,
  {
    isLoadedByScripts: {},
  }
);

module.exports = PlaybackControl;
