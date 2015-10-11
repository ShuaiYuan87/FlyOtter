/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Button = require('react-button');
var Input = require('../Controls/Input.react');
var React = require('react');
var StyleSheet = require('react-style');

var LoginWindow = React.createClass({
  propTypes: {
    onSignupRequest: React.PropTypes.func.isRequired,
  },

  render(): ?Object {
    return (
      <div style={styles.dialogContainer}>
        <h3>Sign in to watch videos with friends.</h3>
        <Input
          style={styles.inputRow}
          label='Email'
          placeholder="Email address"/>
        <Input
          style={styles.inputRow}
          label='Password'
          placeholder="Password" />
        <div>
          <Button
            style={styles.signupButton} 
            onClick={() => this.props.onSignupRequest()}>
            I don't have an account yet
          </Button>
        </div>
      </div>
    )
  }
});

var styles = StyleSheet.create({
  dialogContainer: {
    borderRadius: 20,
    background: '#fafdff',
    color: '#5a6b77',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputRow: {
    width: 350,
    marginBottom: 15,
  },
  signupButton: {
    display: 'inline-block',
    padding: '5px 15px',
  },
});

module.exports = LoginWindow;
