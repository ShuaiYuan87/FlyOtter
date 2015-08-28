/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var PlaybackControl = require('./PlaybackControl');
var React = require('react');
var StyleSheet = require('react-style')

var VIDEO_PLAYER_ID = 'keekwoon-player';

var VideoPlayer = React.createClass({
  getInitialState: function(): Object {
    return {
      videoURL: '',
      playerSec: 0,
      currentTime: 0,
      isControlPanelVisible: false,
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
    PlaybackControl.getControl().toggle();
  },

  _loadVideo: function(evt: Object): void {
    var playbackControl = PlaybackControl.getControl();
    playbackControl.loadVideo(VIDEO_PLAYER_ID, this.state.videoURL);
    playbackControl.playerTick = (time) => this.setState({currentTime: time});
  },

  _playVideo: function(evt: Object): void {
    PlaybackControl.getControl().play();
  },

  _pauseVideo: function(evt: Object): void {
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
