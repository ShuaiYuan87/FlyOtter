/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Icon = require('Icons/Icon.react');
var PlaybackControl = require('./PlaybackControl');
var React = require('react');
var RemotePlaybackControl = require('./RemotePlaybackControl');
var StyleSheet = require('react-style');

var VIDEO_PLAYER_ID = 'keekwoon-player';
//var serverIP = '73.231.32.235';
var HOST = 'localhost';
var PORT = 8989;
var ROOM_ID = 1234;

var VideoPlayer = React.createClass({
  getInitialState: function(): Object {
    var remote = new RemotePlaybackControl(
      HOST,
      PORT,
      ROOM_ID
    );

    remote.onLoadVideo = (videoURL) => {
      this.setState({
        videoURL: videoURL,
      });
      PlaybackControl.getControl().loadVideo(VIDEO_PLAYER_ID, videoURL);
    };
    remote.onPlay = () => {
      PlaybackControl.getControl().toggle();
    };

    return {
      videoURL: '',
      playerSec: 0,
      currentTime: 0,
      isControlPanelVisible: false,
      remotePlaybackControl: remote,
    };
  },

  render: function(): Object {
    return (
      <div style={{height: 700}}>
        <input
          type="text"
          value={this.state.videoURL}
          onChange={evt => this.setState({
            videoURL: evt.target.value
        })} />

        <Icon icon="my-icon"/>
        <button onClick={this._loadVideo}>Load</button>
        <button onClick={this._playVideo}>Play</button>
        <button onClick={this._pauseVideo}>Pause</button>
        <input
          type="text"
          value={this.state.playerSec}
          onChange={evt => this.setState({
            playerSec: parseInt(evt.target.value)}
          )}
        />
        <button onClick={this._seekVideo}>Seek</button>
        <div> {this.state.currentTime} </div>
        <div style={styles.videoContainer}>
          <div style={styles.overlay} id={VIDEO_PLAYER_ID}/>
          <div
            styles={[
              styles.overlay,
              styles.canvas,
            ]}
            onClick={this._togglePlayerState}
          >
          </div>
        </div>
      </div>
    );
  },

  _togglePlayerState: function(): void {
    this.state.remotePlaybackControl.toggle();
    PlaybackControl.getControl().toggle();
  },

  _loadVideo: function(evt: Object): void {
    var playbackControl = PlaybackControl.getControl();
    this.state.remotePlaybackControl.loadVideo(this.state.videoURL);
    playbackControl.loadVideo(VIDEO_PLAYER_ID, this.state.videoURL);
    playbackControl.playerTick = (time) => this.setState({currentTime: time});
  },

  _playVideo: function(evt: Object): void {
    this.state.remotePlaybackControl.play();
    PlaybackControl.getControl().play();
  },

  _pauseVideo: function(evt: Object): void {
    this.state.remotePlaybackControl.pause();
    PlaybackControl.getControl().pause();
  },

  _seekVideo: function(evt: Object): void {
    PlaybackControl.getControl().seekTo(this.state.playerSec);
  },
});

var styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  canvas: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    WebkitFlex: 1, /* Safari 6.1+ */
    msFlex: 1, /* IE 10 */
    flex: 1,
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    height: '700px',
    position: 'relative',
  },
});

module.exports = VideoPlayer;
