/* @flow */

'use strict';

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
}

module.exports = YoutubePlayback;
