/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Progress = require('react-progressbar');
var React = require('react');
var StyleSheet = require('react-style');

var Chathead = React.createClass({
  propTypes: {
  },

  render(): Object {
    return (
      <div style={styles.message}>
        message hello world and more more more more more more more lines lines
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
    width: '210px',
    height: '80px',
    position: 'relative',
    borderRadius: '16px',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: '10px',
  },

  arrow: {
    content: '',
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: '15px 15px 15px 0',
    borderColor: 'transparent #FFFFFF',
    display: 'block',
    width: 0,
    zIndex: 1,
    left: '-15px',
    top: '50%',
  },
  head: {
    top: '40%',
    borderRadius: '50%',
    height: '50px',
    width: '50px',
    position: 'absolute',
    display: 'block',
    left: '-80px',
  }
});

module.exports = Chathead;
