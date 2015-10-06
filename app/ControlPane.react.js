/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Progress = require('react-progressbar');
var React = require('react');
var StyleSheet = require('react-style');

var ControlPane = React.createClass({
  propTypes: {
    currentTime: React.PropTypes.number,
    totalTime: React.PropTypes.number,
    handleProgressChange: React.PropTypes.func.isRequired,
  },

  render(): Object {
    var progress = 0;
    if (this.props.currentTime && this.props.totalTime) {
      progress = this.props.currentTime * 100.0 / this.props.totalTime;
    }
    return (
      <div style={styles.progress} onClick={(e) => e.stopPropagation()}>
        <Progress
          onProgressChange={this.props.handleProgressChange}
          completed={progress}/>
      </div>
    );
  }
});

var styles = StyleSheet.create({
  progress: {
    width: '80%',
    height: '25px',
    paddingTop: '10px',
    cursor: 'pointer',
  },
});

module.exports = ControlPane;
