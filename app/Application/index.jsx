/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Arbiter = require('arbiter-subpub');
var Bootstrap = require('react-bootstrap');
var Button = require('react-button');
var Icon = require('../Icons/Icon.react');
var LoginWindow = require('../Accounts/LoginWindow.react');
var ParseFactory = require('../ParseFactory');
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var SignupWindow = require('../Accounts/SignupWindow.react');
var StyleSheet = require('react-style');

require('./style.css');
require('../bootstrap/css/bootstrap.min.css');

var ButtonToolbar = Bootstrap.ButtonToolbar;
var DropdownButton = Bootstrap.DropdownButton;
var MenuItem = Bootstrap.MenuItem;
var {ModalContainer, ModalDialog} = require('react-modal-dialog');

var ROOM_ID = 1234;
var UNIVERSE = 100000;

var Application = React.createClass({
	getInitialState(): Object {
		return {
			isButtonDown: false,
			videoURL: 'Please enter your video url here.',
			showLoginWindow: false,
			isSigningup: false,
			username: this._getLoginName(),
			showCopyURLWindow: false,
		};
	},

	_getLoginName(): ?string {
		var Parse = ParseFactory.getParse();
		var currentUser = Parse.User.current();
		if (currentUser) {
			return currentUser.get('username');
		}
		return null;
	},

	_signout(): void {
		ParseFactory.getParse().User.logOut();
		this.setState({username: ''});
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
							onKeyDown={evt => this._add(evt)}
							value={this.state.videoURL}
						>  </input>
						<span
							style={style}
							onClick={() => {
							  ROOM_ID = Math.floor(Math.random() * UNIVERSE);;
							  Arbiter.publish("video/load", {url: this.state.videoURL, roomID: ROOM_ID});
							  //this.state.showCopyURLWindow = true;
							  this.setState({showCopyURLWindow: true});
							}}
							onMouseDown={() => {
								this.setState({isButtonDown: true});
							}}
							onMouseUp={() => this.setState({isButtonDown: false})}>
							<Icon
								style={styles.icon}
								icon='add-circle'
							/>
							{
								this._copyURLWindow()
							}
							
						</span>
					</span>
					<span style={styles.loginSection}>
						{
							this.state.username
								? this._getUserDropdown(this.state.username)
								: <Button
										style={styles.loginButton}
										theme={styles.loginButtontheme}
										onClick={() => this.setState({showLoginWindow: true})}>
										<Icon icon='account-circle' style={{marginRight: 5}}/>
										{'sign in'}
										{
											this._getSignupOrLoginWindow()
										}
									</Button>
						}
					</span>
					<span className="fb-login-button" onlogin="checkLoginState();" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="false"></span>
					<span style={styles.logoutButton}>
					<Button 
						onClick={() => {
							  Arbiter.publish("fb/logout", {});
							}}>
						{'logout'}
					</Button>
					</span>
				</div>

				<RouteHandler/>
			</div>
		);
	},

	_add(e: event): void{
       if(e.keyCode == 13){
          Arbiter.publish("video/load", {url: this.state.videoURL});
       }
    },

	_getUserDropdown(username: string): any {
		return (
			<DropdownButton title={username} id={`dropdown-basic-i`}>
      	<MenuItem onSelect={() => this._signout()}>Sign out</MenuItem>
    	</DropdownButton>
		);

	},

	_getSignupOrLoginWindow(): any {
		var accountWindow = !this.state.isSigningup
			? (
				<LoginWindow
					onSignupRequest={() => this.setState({isSigningup: true})}
					onSigninSuccess={(name) => this.setState({
						username: name,
						showLoginWindow: false,
					})}/>
			) : <SignupWindow onSignupSuccess={() => this.setState({
				showLoginWindow: false,
				isSigningup: false,
			})}/>;

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

	_copyURLWindow(): any {
		
		return this.state.showCopyURLWindow
			? (
				<ModalContainer
					onClose={() => this.setState({showCopyURLWindow: false})}>
					<ModalDialog
						onClose={() => {}}>
						{<div style={styles.dialogContainer}> 
							<h3>Please share the URL http://da165706.ngrok.io/{ROOM_ID}	to watch together with friends.</h3>
						</div>}
					</ModalDialog>
				</ModalContainer>
			) : null;
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
		opacity: 0.5,
	},
	loginSection: {
		marginLeft: 20,
		padding: 0,
		display: 'inline-block',
	},
	loginButton: {
		padding: '5px 15px',
	},
	logoutButton: {
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
