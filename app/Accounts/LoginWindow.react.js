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

var LoginWindow = React.createClass({
  mixins: [LinkedStateMixin],

  propTypes: {
    onSignupRequest: React.PropTypes.func.isRequired,
    onSigninSuccess: React.PropTypes.func.isRequired,
  },

  getInitialState(): Object {
    return {
      email: '',
      password: '',
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
          valueLink={this.linkState('email')}/>
        <Input
          style={styles.inputRow}
          label='Password'
          placeholder="Password"
          valueLink={this.linkState('password')} />
        <div>
          <Button
            style={styles.loginButton}
            onClick={this._onLogin}>
            Log in
          </Button>
          <Button
            style={styles.signupButton}
            onClick={() => this.props.onSignupRequest()}>
            I don't have an account yet
          </Button>
        </div>
      </div>
    )
  },

  _onLogin(): void {
    var Parse = ParseFactory.getParse();
    Parse.User.logIn(this.state.email, this.state.password, {
      success: (user) => {
        var currentUser = Parse.User.current();
        if (currentUser) {
          this.props.onSigninSuccess(currentUser.get('username'));
        } else {
            // show the signup or login page
        }
        console.log('login successful');
      },
      error: (user, error) => {
          // TODO display error
        debugger;
      }
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
  },
  inputRow: {
    width: 350,
    marginBottom: 15,
  },
  loginButton: {
    display: 'inline-block',
    padding: '5px 15px',
  },
  signupButton: {
    display: 'inline-block',
    padding: '5px 15px',
  },
});

module.exports = LoginWindow;
