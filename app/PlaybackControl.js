/* @flow */

'use strict';

var ReactScriptLoader = require('./ReactScriptLoader.js').ReactScriptLoader;
var IVideoLoader = require('./IframeVideoLoader/IVideoLoader');
var IVideoPlayback = require('./VideoPlayback/IVideoPlayback');
var PlayerState = require('./PlayerState');
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
  timer: any;
  playerState: string;
  playerTick: (sec: number) => void;

  loadVideo(htmlElementID: string, url: string, time: number, state: string): PlaybackControl {
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
        this.videoPlayback = this._loadVideo(htmlElementID, url, loader, time, state);
      }.bind(this);

      ReactScriptLoader.componentDidMount(
        PlaybackControl.scriptLoaderID++,
        loader,   // this provides the scriptLoadSuccess/Error handlers
        iframeScript
      );
    } else {
      this.videoPlayback = this._loadVideo(htmlElementID, url, loader, time, state);
    }

    return this;
  }

  // Video playback Operations
  play(): PlaybackControl {
    this.videoPlayback.play();
    this.playerState = PlayerState.PLAYING;
    return this;
  }

  pause(): PlaybackControl {
    this.videoPlayback.pause();
    this.playerState = PlayerState.PAUSED;
    return this;
  }

  getCurrentTime(): number {
    return this.videoPlayback.getCurrentTime();
  }

  toggle(): PlaybackControl {
    if (this.playerState === PlayerState.PLAYING) {
      return this.pause();
    } else if (this.playerState === PlayerState.PAUSED
            || this.playerState === PlayerState.UNSTARTED
            || this.playerState === undefined) {
      return this.play();
    }
    invariant(false, 'Toggling a player with unknown state.');
  }

  seekTo(sec: number): PlaybackControl {
    this.videoPlayback.seekTo(sec);
    return this;
  }

  getTotalTime(): number {
    var totalTime = this.videoPlayback && this.videoPlayback.getTotalTime
      ? this.videoPlayback.getTotalTime()
      : 0;
    return totalTime;
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
    loader: IVideoLoader,
    time: number,
    state: string
  ): IVideoPlayback {
    // preserve the css class
    // Replace the iframe element with a div
    var iframeElement = document.getElementById(htmlElementID);
    var style = iframeElement.getAttribute('style');

    loader.videoPlayerReady = this._onVideoPlayerReady.bind(this);
    var playback = loader.loadVideo(htmlElementID, loader.parseVideoID(url), time, state);
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

  _onVideoPlayerReady(time: number, state: string): void {
    this.playerState = state;

    // clear the timer and set the tick to 0
    if (this.timer) {
      this.playerTick && this.playerTick(0);
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(
      function() {
        var time = this.videoPlayback ? this.videoPlayback.getCurrentTime() : 0;
        this.playerTick && this.playerTick(time);
      }.bind(this),
      500
    );
    if (time != 0) {
      this.seekTo(time);
    }
    if (state == PlayerState.PLAYING){
      this.play();
    }
  }
}

Object.assign(
  PlaybackControl,
  {
    isLoadedByScripts: {},
  }
);

module.exports = PlaybackControl;
