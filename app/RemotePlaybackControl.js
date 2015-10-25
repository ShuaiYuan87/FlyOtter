/* @flow */

'use strict';

var io = require('socket.io-client');
var Protocol = require('./Protocol.js');
var PlayerState = require('./PlayerState.js')

var UNIVERSE = 1024;

class RemotePlaybackControl {
  onPlay: () => void;
  onLoadVideo: (videoURL: string, time: number, state: PlayerState) => void;
  onSeek: (sec: number) => void;
  onReceiveMessage: (text: string) => void;
  getState: () => number;
  getCurrentTime: () => number;

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
        case Protocol.CHAT:
          this.onReceiveMessage && this.onReceiveMessage(data.text);
        }
        return;
      }
    );

    this.socket.on(
      'check_state',
      (response) => {
      var data = JSON.parse(response.message);
      console.log(data);
      
      if (this.getState) {
        var player_action;
        var state = this.getState();
        switch(state) {
          case PlayerState.UNSTARTED:
          case PlayerState.PAUSED:
            player_action = Protocol.PAUSE;
            break;
          case PlayerState.PLAYING:
            player_action = Protocol.PLAY;
            break;
        }
        
        if (this.getCurrentTime) {
          var time = this.getCurrentTime();
          this.socket.emit('init', JSON.stringify(Protocol.createMessage(false, this.clientID, time, player_action, data.videoId)));
        }
      }
      }
    );

    this.socket.on(
      'init',
      (response) => {
      if (this.getState) {
        var data = JSON.parse(response.message);
        console.log(data);
        var state = this.getState();
        if (state === undefined
         || state == PlayerState.UNSTARTED) {
          switch(data.playerAction) {
          case Protocol.PLAY:
            this.onLoadVideo && this.onLoadVideo(data.videoId, data.playerTime, PlayerState.PLAYING);
            break;
          case Protocol.PAUSE:
            this.onLoadVideo && this.onLoadVideo(data.videoId, data.playerTime, PlayerState.PAUSED);
            break;
          default:
            break;
          }
        }
      }
      }
    );
  }

  sleepFor(sleepDuration: number){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
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

  sendChat(text: string, time: number): void {
    var message = Protocol.createMessage(
      false,
      this.clientID,
      time,
      Protocol.CHAT
    );
    message.text = text;
    this.socket.emit('postData', JSON.stringify(message));
  }

  disconnect(): void {

  }
}

module.exports = RemotePlaybackControl;
