/* @flow */

'use strict';

/**
 * An interface for all different types of video loaders
 */
class IVideoLoader {
  // event that's fired when the video loader has all scripts initialized
  videoScriptReady: () => void;

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

  loadVideo(htmlElementID: string, videoID: string): void {}

  clearVideo(htmlElementID: string): void {}
}

module.exports = IVideoLoader;
