/* @flow */

'use strict';

class PlayerState {
  static PLAYING: string;
  static PAUSED: string;
}

Object.assign(
  PlayerState, {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
  }
);

module.exports = PlayerState;
