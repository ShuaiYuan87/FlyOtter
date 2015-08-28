/* @flow */

'use strict';

var IVideoLoader = require('./IVideoLoader');
var IVideoPlayback = require('../VideoPlayback/IVideoPlayback');
var YoukuPlayback = require('../VideoPlayback/YoukuPlayback');

class YoukuLoader extends IVideoLoader {
  getScriptURL(): string {
    return 'http://player.youku.com/jsapi';
  }

  isVideoURLValid(url: string): boolean {
    return url.search(/youku\.com/) !== -1;
  }

  parseVideoID(url: string): string {
    return url.match(/([A-Z])\w+/g)[0];
  }

  loadVideo(htmlElementID: string, videoID: string): IVideoPlayback {
    var player = new YKU.Player(htmlElementID,{
      styleid: '7',
      client_id: '716d2b2fc5573842',
      vid: videoID,
    });
    // This is hacky: we used to call the youku api too
    // soon to get current time, and that somehow broke the youku
    // object. So here, we sleep for a certain period just so
    // current time is not called too soon
    setTimeout(() => super.onVideoPlayerReady(), 3000);
    return new YoukuPlayback(player);
  }

  onScriptLoaded(): void {
    this.videoScriptReady && this.videoScriptReady();
  }
}

module.exports = YoukuLoader;
