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
}

module.exports = YoukuPlayback;
