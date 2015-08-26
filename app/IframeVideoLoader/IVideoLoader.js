/* @flow */

'use strict';

var IVideoPlayback = require('../VideoPlayback/IVideoPlayback');

/**
 * An interface for all different types of video loaders
 */
class IVideoLoader {
  // event that's fired when the video loader has all scripts initialized
  videoScriptReady: () => void;
  videoPlayerReady: () => void;

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

  loadVideo: (htmlElementID: string, videoID: string) => IVideoPlayback;

  clearVideo(htmlElementID: string): void {}

  onVideoPlayerReady(): void {
    this.videoPlayerReady && this.videoPlayerReady();
  }
}

module.exports = IVideoLoader;
