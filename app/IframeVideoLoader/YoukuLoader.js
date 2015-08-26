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
    super.onVideoPlayerReady();
    return new YoukuPlayback(player);
  }

  onScriptLoaded(): void {
    this.videoScriptReady && this.videoScriptReady();
  }
}

module.exports = YoukuLoader;
