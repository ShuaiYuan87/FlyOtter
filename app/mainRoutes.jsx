var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

// export routes
module.exports = (
	<Route name="app" path="/" handler={require("./Application")}>
		<Route name="video" path="/video" handler={require("react-proxy!./VideoPlayer")} />
		<Route name="readme" path="/readme" handler={require("react-proxy!./Readme")} />
		<Route name="todolist" path="/:list" handler={require("./TodoList")} />
		<Route name="todoitem" path="/todo/:item" handler={require("./TodoItem")} />
		<Route name="home" path="/home" handler={require("./Home")} />
		<DefaultRoute handler={require("./Home")} />
	</Route>
);
