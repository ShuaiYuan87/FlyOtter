var React = require('react')
var Layout = require('react-layout')

var VerticalLayout = React.createClass({
  render: function() {
    return (
      <Layout layoutWidth={this.props.width} layoutHeight={this.props.height}>
        <Layout className="nav" layoutHeight={100} style={{background: 'pink'}}>
          <div>nav</div>
        </Layout>
        <Layout className="main" layoutHeight="flex" style={{background: 'lightblue'}}>
          <div>main</div>
        </Layout>
      </Layout>
    )
  },
})



module.exports = VerticalLayout;