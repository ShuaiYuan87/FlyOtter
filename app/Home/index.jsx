/*global  */
var React = require("react");
var Link = require("react-router").Link;
require("./style.css");
var Checkbox = require('react-checkbox');
var Progress = require('react-progressbar');
//var Progress = require('react-progress');
var YoukuWrapper = require('../youku.js');

//var cx = require('cx');

module.exports = React.createClass({
	render: function() {
		return <div>
			<YoukuWrapper width='70%' height='700px' className={'center'}/>
		</div>;
	}
});
