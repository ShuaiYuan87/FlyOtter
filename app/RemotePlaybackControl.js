/* @flow */

'use strict';

var io = require('socket.io-client');
var Protocol = require('./Protocol.js');

var UNIVERSE = 1024;

class RemotePlaybackControl {
  onPlay: () => void;
  onLoadVideo: (videoURL: string) => void;
  onSeek: (sec: number) => void;

  socket: any;
  roomID: number;
  clientID: number;

  constructor(host: string, port: number, roomID: number) {
    this.socket = io.connect(`http://${host}:${port.toString()}`);
    this.socket.emit(Protocol.CREATE_ROOM, `room${roomID}`);
    this.roomID = roomID;
    this.clientID = Math.floor(Math.random() * UNIVERSE);
    console.log('construct');

    this.socket.on(
      Protocol.LOAD_VIDEO,
      (response) => {
        var data = JSON.parse(response.message);
        if (parseInt(data.clientId) === this.clientID) {
          return;
        }
        this.onLoadVideo && this.onLoadVideo(data.videoId);
      }
    );

    this.socket.on(
      'notification',
      (response) => {
        var data = JSON.parse(response.message);
        if (parseInt(data.clientId) === this.clientID) {
          return;
        }

        switch(data.playerAction) {
        case Protocol.PLAY:
        case Protocol.PAUSE:
          this.onPlay && this.onPlay();
          break;
        case Protocol.SEEK:
          this.onSeek && this.onSeek(data.playerTime);
          break;
        }
        return;
      }
    );
  }

  loadVideo(videoUrl: string): void {
    var message = Protocol.createMessage(
      false,
      this.clientID,
      0,
      Protocol.RELOAD,
      videoUrl
    );
    this.socket.emit(Protocol.LOAD_VIDEO, JSON.stringify(message));
  }

  // false, rid, 0, PlayerAction.PLAY);
  play(): void {
    var message = Protocol.createMessage(
      false,
      this.clientID,
      0,
      Protocol.PLAY
    );
    this.socket.emit('postData', JSON.stringify(message));
  }

  pause(): void {
    var message = Protocol.createMessage(
      false,
      this.clientID,
      0,
      Protocol.PAUSE
    );
    this.socket.emit('postData', JSON.stringify(message));
  }

  toggle(): void {
    this.play();
  }

  seekTo(time: number): void {
    var message = Protocol.createMessage(
      false,
      this.clientID,
      time,
      Protocol.SEEK
    );
    this.socket.emit('postData', JSON.stringify(message));
  }

  disconnect(): void {

  }
}

module.exports = RemotePlaybackControl;
