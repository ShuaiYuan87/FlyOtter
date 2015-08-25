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
        <div style={styles.fullsizePlayer} id={VIDEO_PLAYER_ID}/>
      </div>
    );
  },

  _loadVideo: function(evt: Object): void {
    var playbackControl = PlaybackControl.getControl();
    playbackControl.loadVideo(VIDEO_PLAYER_ID, this.state.videoURL);
  },
});

var styles = StyleSheet.create({
  fullsizePlayer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  }
});

module.exports = VideoPlayer;
