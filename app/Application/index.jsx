/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Icon = require('../Icons/Icon.react');
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var StyleSheet = require('react-style');

var Application = React.createClass({
	getInitialState(): Object {
		return {
			isButtonDown: false,
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
						/>
						<span
							style={style}
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
				</div>
				<RouteHandler />
			</div>
		);
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
});

module.exports = Application;
