/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Arbiter = require('arbiter-subpub');
var Button = require('react-button');
var Icon = require('../Icons/Icon.react');
var LoginWindow = require('../Accounts/LoginWindow.react');
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var SignupWindow = require('../Accounts/SignupWindow.react');
var StyleSheet = require('react-style');

var {ModalContainer, ModalDialog} = require('react-modal-dialog');

var Application = React.createClass({


	getInitialState(): Object {
		return {
			isButtonDown: false,
			videoURL: 'https://www.youtube.com/watch?v=yASopBwB_t4',
			showLoginWindow: false,
			isSigningup: false,
		};
	},

	render: function(): Object {
		var style = {};
		Object.assign(style, styles.buttonSpan);
		if (this.state.isButtonDown) {
			Object.assign(style, styles.buttonSpanButtonDown);
		}

		return (
			<div>
				<div style={styles.banner}>
					<span style={styles.logo}>
						KeeKwoon
					</span>
					<span style={styles.inputPane}>
						<input
							style={styles.videoInput}
							placeholder='enter video url here'
							onChange={evt => this.setState({
		            videoURL: evt.target.value
							})}
							value={this.state.videoURL}
						>  </input>
						<span
							style={style}
							onClick={() => {
							  Arbiter.publish("video/load", {url: this.state.videoURL});
							}}
							onMouseDown={() => {
								this.setState({isButtonDown: true});
							}}
							onMouseUp={() => this.setState({isButtonDown: false})}>
							<Icon
								style={styles.icon}
								icon='add-circle'
							/>
						</span>
					</span>
					<span style={styles.loginSection}>
						<Button
							style={styles.loginButton}
							theme={styles.loginButtontheme}
							onClick={() => this.setState({showLoginWindow: true})}>
							<Icon icon='account-circle' style={{marginRight: 5}}/>
							sign in
							{
								this._getSignupOrLoginWindow()
							}
						</Button>
					</span>
				</div>
				<RouteHandler />

			</div>
		);
	},

	_getSignupOrLoginWindow(): any {
		var accountWindow = !this.state.isSigningup
			? (
				<LoginWindow
					onSignupRequest={() => this.setState({isSigningup: true})}
				/>
			) : <SignupWindow />;

		return this.state.showLoginWindow
			? (
				<ModalContainer
					onClose={() => this.setState({showLoginWindow: false})}>
					<ModalDialog
						onClose={() => {}}>
						{accountWindow}
					</ModalDialog>
				</ModalContainer>
			) : null;
	},
});

var styles = StyleSheet.create({
	banner: {
		height: '44px',
		backgroundColor: 'rgb(38, 38, 38)',
		display: 'flex',
		flexDirection: 'row',
	    alignItems: 'center',
	    WebkitFlex: 1, /* Safari 6.1+ */
	    msFlex: 1, /* IE 10 */
	    flex: 1,
	    justifyContent: 'center',
	},
	logo: {
		color: 'rgb(195, 195, 195)',
		marginRight: '20px',
		fontSize: '20px',
		fontFamily: 'Trajan',
		cursor: 'pointer',
	},
	inputPane: {
		backgroundColor: 'white',
		borderRadius: '4px',
	},
	buttonSpan: {
		display: 'inline-block',
		height: '100%',
		borderRadius: '50%',
		padding: '3px',
	},
	buttonSpanButtonDown: {
		backgroundColor: 'rgb(200, 200, 200)',
	},
	videoInput: {
		width: '500px',
		height: '28px',
		fontSize: '16px',
	},
	loginSection: {
		marginLeft: 20,
		padding: 0,
		display: 'inline-block',
	},
	loginButton: {
		padding: '5px 15px',
	},
	loginButtontheme: {
		style: {
			color: 'white',
			borderWidth: 0,
			borderRadius: '10px',
		},
    overStyle: {
			background: 'rgba(255, 255, 255, 0.5)',
		},
  	activeStyle: { background: 'rgba(255, 255, 255, 0.3)'},
	},
});

module.exports = Application;
