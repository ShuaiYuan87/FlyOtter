/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Progress = require('react-progressbar');
var React = require('react');
var StyleSheet = require('react-style');

var {PropTypes} = React;

var ChatPane = React.createClass({
  render(): Object {
    return (
      <div style={styles.container}>
        {this.props.children}
      </div>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'flex-end',
  }
});

module.exports = ChatPane;
