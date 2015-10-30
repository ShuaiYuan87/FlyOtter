/* @flow */

'use strict';

var IVideoLoader = require('./IVideoLoader');
var IVideoPlayback = require('../VideoPlayback/IVideoPlayback');
var YoutubePlayback = require('../VideoPlayback/YoutubePlayback');

class YoutubeLoader extends IVideoLoader {
  player: any;

  constructor() {
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
    var id = '';
    var splitted = url.replace(/(>|<)/gi,'')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(splitted[2] !== undefined) {
      id = splitted[2].split(/[^0-9a-z_\-]/i)[0];
    }
    return id;
  }

  loadVideo(htmlElementID: string, videoID: string, time: number, state: string): IVideoPlayback {
    if (this.player) {
      this.clearVideo(htmlElementID);
    }

    this.player = new YT.Player(htmlElementID, {
      videoId: videoID,
      playerVars: {
        controls: 0,
        showinfo: 0,
        rel: 0,
        autoplay: 0,
        start: time,
      },
      events: {
        'onReady': () => super.onVideoPlayerReady(time, state),
      },
    });
    //super.onVideoPlayerReady();
    return new YoutubePlayback(this.player);
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
