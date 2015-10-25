/* @flow */

'use strict';

var IVideoPlayback = require('../VideoPlayback/IVideoPlayback');
var PlayerState = require('../PlayerState.js')
/**
 * An interface for all different types of video loaders
 */
class IVideoLoader {
  // event that's fired when the video loader has all scripts initialized
  videoScriptReady: () => void;
  videoPlayerReady: (time: number, state: string) => void;

  // Event handlers for script loader
  onScriptLoaded(): void {}
  onScriptError(): void {}

  getScriptURL(): string {
    return '';
  }

  isVideoURLValid(url: string): boolean {
    return false;
  }

  parseVideoID(url: string): string {
    return '';
  }

  loadVideo: (htmlElementID: string, videoID: string, time: number, state: string) => IVideoPlayback;

  clearVideo(htmlElementID: string): void {}

  onVideoPlayerReady(time: number, state: string): void {
    this.videoPlayerReady && this.videoPlayerReady(time, state);
  }
}

module.exports = IVideoLoader;
