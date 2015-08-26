/* @flow */

'use strict';

class IVideoPlayback {
  // events
  onVideoReady(): void {}

  // controls
  play(): void {}
  pause(): void {}
  seekTo(sec: number): void {}

  // info
  getCurrentTime: () => number;
}

module.exports = IVideoPlayback;
