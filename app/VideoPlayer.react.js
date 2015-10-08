/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Arbiter = require('arbiter-subpub');
var Chathead = require('./Chathead.react');
var ChatPane = require('./ChatPane.react');
var ControlPane = require('./ControlPane.react');
var Icon = require('./Icons/Icon.react');
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
  componentDidMount: function(): void {
    Arbiter.subscribe('video/load', (data) => {
      this._loadVideo(data.url);
    });
  },

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
      PlaybackControl.getControl().playerTick =
        (time) => this.setState({currentTime: time});
    };
    remote.onPlay = () => {
      PlaybackControl.getControl().toggle();
    };
    remote.onSeek = (time) => {
      PlaybackControl.getControl().seekTo(time);
    }

    return {
      videoURL: '',
      playerSec: 0,
      currentTime: 0,
      isControlPanelVisible: false,
      remotePlaybackControl: remote,
      text: '',
      chatheads: [],
    };
  },

  render: function(): Object {
    var control = PlaybackControl.getControl();
    var totalTime = control.getTotalTime
      ? control.getTotalTime()
      : 0;

    return (
      <div style={{height: 700}}>
        <input
          type="text"
          value={this.state.text}
          onChange={evt => this.setState({
            text: evt.target.value
        })}/>

        <Icon icon="my-icon"/>
        <button onClick={() => {
          var chatheads = this.state.chatheads;
          chatheads.push(
            <Chathead text={this.state.text} />
          );
          this.setState({
            chatheads: chatheads,
          })
        }}>
          add chat
        </button>
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
            <ChatPane>
              {this.state.chatheads}
            </ChatPane>
            <ControlPane
              currentTime={this.state.currentTime}
              totalTime={totalTime}
              handleProgressChange={this._handleProgressChange}
            />
          </div>
        </div>
      </div>
    );
  },

  _handleProgressChange: function (percent: number): void {
    var playbackControl = PlaybackControl.getControl();
    if (playbackControl) {
      var time = percent * playbackControl.getTotalTime() / 100
      playbackControl.seekTo(time);
      this.setState({
        currentTime: time,
      });
      this.state.remotePlaybackControl.seekTo(time);
    }
  },

  _togglePlayerState: function(): void {
    this.state.remotePlaybackControl.toggle();
    PlaybackControl.getControl().toggle();
  },

  _loadVideo: function(url: string): void {
    var playbackControl = PlaybackControl.getControl();
    this.state.remotePlaybackControl.loadVideo(url);
    playbackControl.loadVideo(VIDEO_PLAYER_ID, url);
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
    justifyContent: 'flex-end',
  },
  videoContainer: {
    width: '100%',
    height: '700px',
    position: 'relative',
  },
});

module.exports = VideoPlayer;
