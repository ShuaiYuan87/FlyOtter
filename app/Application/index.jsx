/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var StyleSheet = require('react-style');

var Application = React.createClass({
	render: function(): Object {
		return (
			<div>
				<div style={styles.banner}>
					<div style={styles.icon}>
						KeeKwoon
					</div>
				</div>
				<RouteHandler />
			</div>
		);
	},
});

var styles = StyleSheet.create({
	banner: {
		height: '58px',
		backgroundColor: 'rgb(38, 38, 38)',
		display: 'flex',
		flexDirection: 'row',
    alignItems: 'center',
    WebkitFlex: 1, /* Safari 6.1+ */
    msFlex: 1, /* IE 10 */
    flex: 1,
    justifyContent: 'flex-start',
	},
	icon: {
		color: 'rgb(195, 195, 195)',
		marginLeft: '15px',
		fontSize: '20px',
		fontFamily: 'Trajan',
		cursor: 'pointer',
	}
});

module.exports = Application;
