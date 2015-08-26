/* @flow */

'use strict';

var IVideoPlayback = require('./IVideoPlayback');

class YoukuPlayback extends IVideoPlayback {
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
    try {
      return parseInt(this.player.currentTime());
    } catch(e) {
      return 0;
    }
  }
}

module.exports = YoukuPlayback;
