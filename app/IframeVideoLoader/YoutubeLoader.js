/* @flow */

'use strict';

var IVideoLoader = require('./IVideoLoader');

class YoutubeLoader extends IVideoLoader {
  player: any;

  constructor() {
    console.log('new youtube');
    window.onYouTubeIframeAPIReady = function() {
      // fire the scriptReady event if there's a handler
      this.videoScriptReady && this.videoScriptReady();
      delete window.onYouTubeIframeAPIReady;
    }.bind(this);
  }

  getScriptURL(): string {
    return 'https://www.youtube.com/iframe_api';
  }

  isVideoURLValid(url: string): boolean {
    return url.search(/youtube\.com/) !== -1;
  }

  parseVideoID(url: string): string {
    return url.match(/([A-Z])\w+/g)[0];
  }

  loadVideo(htmlElementID: string, videoID: string): void {
    if (!this.player) {
      this.player = new YT.Player(htmlElementID, {
          height: '390',
          width: '640',
          videoId: videoID,
      });
    } else {
      this.player.loadVideoById(videoID);
    }
  }

  clearVideo(htmlElementID: string): void {
    this.player = null;

    // Replace the iframe element with a div
    var iframeElement = document.getElementById(htmlElementID);
    var div = document.createElement('div');
    div.id = htmlElementID;
    iframeElement.parentNode.replaceChild(div, iframeElement);
  }
}

module.exports = YoutubeLoader;
