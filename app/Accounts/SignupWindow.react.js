/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Button = require('react-button');
var Input = require('../Controls/Input.react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var ParseFactory = require('../ParseFactory');
var React = require('react');
var StyleSheet = require('react-style');


var SignupWindow = React.createClass({
  mixins: [LinkedStateMixin],

  propTypes: {
    onSignupSuccess: React.PropTypes.func.isRequired,
  },

  getInitialState(): Object {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    };
  },

  render(): ?Object {
    return (
      <div style={styles.dialogContainer}>
        <h3>Sign in to watch videos with friends.</h3>
        <Input
          style={styles.inputRow}
          label='Email'
          placeholder="Email address"
          valueLink = {this.linkState('email')}
          />
        <Input
          style={styles.inputRow}
          label='Password'
          placeholder="Password"
          valueLink = {this.linkState('password')}
          />
        <Input
          style={styles.inputRow}
          label='Confirm'
          placeholder="Enter password again"
          valueLink = {this.linkState('passwordConfirm')}
          />
        <Input
          style={styles.inputRow}
          label='Name'
          placeholder="Name or nickname"
          valueLink = {this.linkState('name')}
          />
        <Button
          style={styles.signupButton}
          onClick={this._onSignup}>
          Sign up
        </Button>
      </div>
    )
  },

  _onSignup(): void {
    var user = ParseFactory.getObjectByType('User');
    user.set("username", this.state.name);
    user.set("password", this.state.password);
    user.set("email", this.state.email);

//    user.set("phone", "650-555-0001");

    user.signUp(null, {
      success: user => {
        this.props.onSignupSuccess();
      },
      error: (user, error) => {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      },
    });
  },
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
    padding: 20,
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

module.exports = SignupWindow;
