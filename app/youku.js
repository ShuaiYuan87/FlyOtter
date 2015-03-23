var React = require('react');
var ReactScriptLoaderMixin = require('./ReactScriptLoader.js').ReactScriptLoaderMixin;

// tutorial1.js
var Youku = React.createClass({
      mixins: [ReactScriptLoaderMixin],
    getInitialState: function() {
        return {
            scriptLoading: true,
            scriptLoadError: false,
            player: null,
            playing: false
        };
    },

    // this function tells ReactScriptLoaderMixin where to load the script from
    getScriptURL: function() {
        return 'http://player.youku.com/jsapi';
    },

    // ReactScriptLoaderMixin calls this function when the script has loaded
    // successfully.
    onScriptLoaded: function() {
        this.setState({scriptLoading: false});

      var player = new YKU.Player('youkuplayer',{
        styleid: '0',
        client_id: '716d2b2fc5573842',
        vid: 'XOTA1MjgyMDYw',
        events:{
          onPlayStart: function(){ document.getElementById("title").style.color = "red";playVideo();},
          onPlayerReady: function(){   document.getElementById("title").style.color = "red";playVideo();}
        }
      });

      this.setState({
        player: player
      });
    },

    // ReactScriptLoaderMixin calls this function when the script has failed to load.
    onScriptError: function() {
        this.setState({scriptLoading: false, scriptLoadError: true});
    },

  pauseVideo: function() {
    if (this.state.player !== null) {
      if (!this.state.playing) {
        this.state.player.playVideo();
        this.setState({
          playing: true
        });
      } else {
        this.state.player.pauseVideo();
        this.setState({
          playing: false
        });
      }
    }
  },
    render: function() {
        var message;
        var input;
        if (this.state.scriptLoading) {
            message = 'loading script...';
        } else if (this.state.scriptLoadError) {
            message = 'loading failed';
        } else {
            message = 'loading succeeded';
          input =  <button onClick={this.pauseVideo}> Pause </button>;
          
        }
        return <div>
        {input}
           <div id="youkuplayer" style={{'width': '480px', 'height': '400px'}}> </div>
            <span>{message}</span>
        </div>;

    }
});

module.exports = Youku;