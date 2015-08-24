var React = require("react");
var VideoPlayer = require('../VideoPlayer.react.js');

module.exports = React.createClass({
	render: function() {
		// <YoukuWrapper width='70%' height='700px' className={'center'}/>
		return (
			<div>
				<VideoPlayer />
		 	</div>
		);
	}
});
