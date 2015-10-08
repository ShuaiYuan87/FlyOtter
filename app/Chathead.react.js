/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Progress = require('react-progressbar');
var React = require('react');
var StyleSheet = require('react-style');

var {PropTypes} = React;

var Chathead = React.createClass({
  propTypes: {
    text: PropTypes.string.isRequired,
  },

  render(): Object {
    return (
      <div style={styles.message}>
        {this.props.text}
        <div style={styles.arrow} />
        <img
          style={styles.head}
          src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/v/t1.0-1/c27.0.160.160/p160x160/10455055_10201367490508021_5069266853102258405_n.jpg?oh=435eadd5a4d83d939c1817cbfc8508c2&oe=56CDD04D&__gda__=1456395536_29c33b9536d2f1080c691299fd41ea5a"/>
      </div>
    );
  }
});

var styles = StyleSheet.create({
  message: {
    borderColor: 'rgb(127, 127, 127)',
    color: 'rgba(240, 240, 250, 1)',
    borderWidth: '3px',
    width: '220px',
    minHeight: '40px',
    maxHeight: '120px',
    position: 'relative',
    borderRadius: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '10px',
    marginLeft: '80px',
  },

  arrow: {
    content: '',
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '8px 8px 8px 0',
    borderColor: 'transparent rgba(0, 0, 0, 0.6)',
    display: 'block',
    width: 0,
    zIndex: 1,
    left: '-8px',
    top: '20%',
  },

  head: {
    top: '10%',
    borderRadius: '50%',
    height: '50px',
    width: '50px',
    position: 'absolute',
    display: 'block',
    left: '-65px',
  }
});

module.exports = Chathead;
