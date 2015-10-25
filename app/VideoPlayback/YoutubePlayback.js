/* @flow */

'use strict';

var IVideoPlayback = require('./IVideoPlayback');
var PlayerState = require('../PlayerState');

class YoutubePlayback extends IVideoPlayback {
  player: Object;

  constructor(player: Object) {
    this.player = player;
  }

  play(): void {
    console.log(this.player);
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

  getState() : number {
    swtich (this.player.getPlayerState())
    {
      return PlayerState.UNSTARTED;
    }
  }
}

module.exports = YoutubePlayback;
