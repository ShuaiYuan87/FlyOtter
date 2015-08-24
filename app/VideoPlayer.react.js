/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var PlaybackControl = require('./PlaybackControl');
var React = require('react');

var VideoPlayer = React.createClass({
  getInitialState: function(): Object {
    return {
      videoURL: '',
    };
  },

  render: function(): Object {
    return (
      <div>
        <input
          type="text"
          value={this.state.videoURL}
          onChange={evt => this.setState({
            videoURL: evt.target.value
        })} />

        <button onClick={this._loadVideo}>Load</button>
        <div id='youkuplayer' />
      </div>
    );
  },

  _loadVideo: function(evt: Object): void {
    var playbackControl = PlaybackControl.getControl();
    playbackControl.loadVideo(this.state.videoURL);
  },

  getNumber: function(a: number): number {
    return a;
  },
});

module.exports = VideoPlayer;
