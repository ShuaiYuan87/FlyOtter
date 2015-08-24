/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var styles = require('./style.css');

var Application = React.createClass({
	render: function(): Object {
		return (
			<div>
				<div className={styles.banner}> keekwoon </div>
				<RouteHandler />
			</div>
		);
	},
});

module.exports = Application;
