/* @flow */

'use strict';

var DOMParser = require('xmldom').DOMParser;
var IVideoPlayback = require('./IVideoPlayback');

class YoutubePlayback extends IVideoPlayback {
  player: Object;

  constructor(player: Object) {
    this.player = player;
  }

  play(): void {
    this.player.playVideo();
  }

  pause(): void {
    this.player.pauseVideo();
  }

  seekTo(sec: number): void {
    this.player.seekTo(sec);
  }

  getCurrentTime(): number {
    return this.player.getCurrentTime ? this.player.getCurrentTime() : 0;
  }

  getTotalTime(): number {
    return this.player.getDuration();
  }

  getWidth(): number {
    return parseInt(this.player.getIframe().getAttribute('width'), 10);
  }

  getHeight(): number {
    return parseInt(this.player.getIframe().getAttribute('height'), 10);
  }
}

module.exports = YoutubePlayback;
