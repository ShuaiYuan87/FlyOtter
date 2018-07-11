var React = require("react");
var Link = require("react-router").Link;
require("./style.css");
var Checkbox = require('react-checkbox');
var Progress = require('react-progressbar');
//var Progress = require('react-progress');
var YoukuWrapper = require('../youtube-wrapper.js');

module.exports = React.createClass({
	render: function() {
		return <div>
			<div id="hero" className="Hero" style={{backgroundImage: 'url(https://images.alphacoders.com/633/633643.jpg)'}}></div>
			<YoukuWrapper />
		</div>;
	}
});
