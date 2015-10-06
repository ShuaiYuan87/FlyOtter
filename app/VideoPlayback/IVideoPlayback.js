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
  getTotalTime:() => number;
}

module.exports = IVideoPlayback;
