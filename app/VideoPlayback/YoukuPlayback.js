/* @flow */

'use strict';

var IVideoPlayback = require('./IVideoPlayback');

class YoukuPlayback extends IVideoPlayback {
  player: Object;

  constructor(player: Object) {
    this.player = player;
  }

  play(): void {
    try {
      this.player.playVideo();
    } catch(e) {}
  }

  pause(): void {
    try {
    this.player.pauseVideo();
    } catch(e) {}
  }

  seekTo(sec: number): void {
    try {
      this.player.seekTo(sec);
    } catch(e) {}
  }

  getCurrentTime(): number {
    try {
      return parseInt(this.player.currentTime());
    } catch(e) {
      return 0;
    }
  }

  getTotalTime(): number {
    return parseInt(this.player.totalTime(), 10);
  }

  getWidth(): number {
    return 0;
  }
}

module.exports = YoukuPlayback;
