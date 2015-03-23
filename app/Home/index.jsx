var React = require("react");
var Link = require("react-router").Link;
require("./style.css");
var Checkbox = require('react-checkbox');
var Progress = require('react-progressbar');
//var Progress = require('react-progress');
var YoukuWrapper = require('../youku.js');

module.exports = React.createClass({
	render: function() {
		return <div>
			<h2>Homepage</h2>
			<p>This is the homepage.</p>
			<YoukuWrapper />
			<p>Try to go to a todo list page:</p>
			<ul>
				<li><Link to="todolist" params={{list: "mylist"}}>mylist</Link></li>
				<li><Link to="todolist" params={{list: "otherlist"}}>otherlist</Link></li>
			</ul>
			<p>Or try to switch to <Link to="some-page">some page</Link>.</p>
			<p>Or open the page that shows <Link to="readme">README.md</Link>.</p>
		</div>;
	}
});
