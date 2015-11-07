/*global  */
var React = require("react");
var Link = require("react-router").Link;
require("./style.css");
var Checkbox = require('react-checkbox');
var Progress = require('react-progressbar');
//var Progress = require('react-progress');
var YoukuWrapper = require('../youku.js');

var FullScreen = require('react-fullscreen');

//var YoutubePlayerWrapper = require('../youtube-wrapper.js');
//var cx = require('cx');

module.exports = React.createClass({
	render: function() {
		return <div>
				<FullScreen>
					<div>
						<div> hello </div>
						<FullScreen>
							<div>
            		hello world 2 2 2
							</div>
						</FullScreen>
					</div>
       </FullScreen>
			 </div>;
	},
});
