/* @flow */

'use strict';

var ReactScriptLoader = require('./ReactScriptLoader.js').ReactScriptLoader;
var IVideoLoader = require('./IframeVideoLoader/IVideoLoader');
var IVideoPlayback = require('./VideoPlayback/IVideoPlayback')
var YoukuLoader = require('./IframeVideoLoader/YoukuLoader');
var YoutubeLoader = require('./IframeVideoLoader/YoutubeLoader');

var invariant = require('invariant');

class PlaybackControl {
  // static variables / methods
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

  // instance variables / methods
  videoPlayback: IVideoPlayback;
  isVideoPlayerReady: boolean;

  loadVideo(htmlElementID: string, url: string): PlaybackControl {
    var loader = this._findLoader(url);

    PlaybackControl.configLoaders().forEach(x => {
      if (x !== loader) {
        this._clearVideo(htmlElementID, x);
      }
    });
    var iframeScript = loader.getScriptURL();

    // video playback might not be loaded immediately in the case that we'll
    // need to download the script, therefore we will set it to default to
    // prevent something malicious happening
    this.videoPlayback = new IVideoPlayback();
    if (!(iframeScript in PlaybackControl.isLoadedByScripts)) {
      loader.videoScriptReady = function() {
        PlaybackControl.isLoadedByScripts[iframeScript] = true;
        this.videoPlayback = this._loadVideo(htmlElementID, url, loader);
      }.bind(this);

      ReactScriptLoader.componentDidMount(
        PlaybackControl.scriptLoaderID++,
        loader,   // this provides the scriptLoadSuccess/Error handlers
        iframeScript
      );
    } else {
      this.videoPlayback = this._loadVideo(htmlElementID, url, loader);
    }

    return this;
  }

  // Video playback callbacks
  videoPlayerReady: () => void;

  // Video playback Operations
  play(): PlaybackControl {
    this.videoPlayback.play();
    return this;
  }

  pause(): PlaybackControl {
    this.videoPlayback.pause();
    return this;
  }

  seekTo(sec: number): PlaybackControl {
    this.videoPlayback.seekTo(sec);
    return this;
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

  _loadVideo(
    htmlElementID: string,
    url: string,
    loader: IVideoLoader
  ): IVideoPlayback {
    // preserve the css class
    // Replace the iframe element with a div
    var iframeElement = document.getElementById(htmlElementID);
    var style = iframeElement.getAttribute('style');
    this.isVideoPlayerReady = false;
    loader.videoPlayerReady = () => {
      this.videoPlayerReady && this.videoPlayerReady();
      this.isVideoPlayerReady = true;
    }
    var playback = loader.loadVideo(htmlElementID, loader.parseVideoID(url));
    document.getElementById(htmlElementID).setAttribute('style', style);
    return playback;
  }

  _clearVideo(htmlElementID: string, loader: IVideoLoader): void {
    // preserve the css class
    // Replace the iframe element with a div
    var iframeElement = document.getElementById(htmlElementID);
    var style = iframeElement.getAttribute('style');
    loader.clearVideo(htmlElementID);
    document.getElementById(htmlElementID).setAttribute('style', style);
  }
}

Object.assign(
  PlaybackControl,
  {
    isLoadedByScripts: {},
  }
);

module.exports = PlaybackControl;
