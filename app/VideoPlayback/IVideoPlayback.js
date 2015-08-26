/* @flow */

'use strict';

class IVideoPlayback {
  // events
  onVideoReady(): void {}

  // controls
  play(): void {}
  pause(): void {}
  seekTo(sec: number): void {}
}

module.exports = IVideoPlayback;
