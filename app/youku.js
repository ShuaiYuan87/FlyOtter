var React = require('react');

var ReactScriptLoaderMixin = require('./ReactScriptLoader.js').ReactScriptLoaderMixin;
var io = require('socket.io-client');
var http = require('http');
var UNIVERSE = 100000;
var rid = Math.floor(Math.random() * UNIVERSE);
var defaultRoomID = Math.floor(Math.random() * UNIVERSE);
var PlayerState = require('lib/player_state');
var PlayerAction = require('lib/player_action');
var Progress = require('react-progressbar');
var Router = require("react-router");
var msg = require('lib/msg');

var serverIP = '67.161.30.248';
//var serverIP = 'localhost';
var port = '8989';

var socket = io.connect('http://' + serverIP + ':' + port);

var defaultVideo = 'XODk5MTIyNjE2';

// tutorial1.js
var Youku = React.createClass({
  mixins: [ReactScriptLoaderMixin, Router.Navigation],
  contextTypes: {
    router: React.PropTypes.func
  },
  getInitialState: function() {
    return {
      scriptLoading: true,
      scriptLoadError: false,
      player: null,
      'playerState': PlayerState.UNSTARTED,
      progress: 0,
      interval: null,
    };
  },

  componentDidMount: function() {
    var { router } = this.context;
    var roomID = router.getCurrentQuery().roomID;
    roomID = roomID ? roomID : defaultRoomID;
    socket.emit('create', 'room' + roomID.toString());
    socket.on('notification', this.messageRecieve);
    this.context.router.transitionTo('/', {}, {roomID: roomID});
  },

  // this function tells ReactScriptLoaderMixin where to load the script from
  getScriptURL: function() {
    return 'http://player.youku.com/jsapi';
  },

  // ReactScriptLoaderMixin calls this function when the script has loaded
  // successfully.
  onScriptLoaded: function() {
    this.setState({scriptLoading: false});
    this.loadVideo(defaultVideo);
  },

  loadVideo: function(video_id) {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }

    var player = new YKU.Player('youkuplayer',{
      styleid: '7',
      client_id: '716d2b2fc5573842',
      vid: video_id,
      events:{
        onPlayStart: function(){ document.getElementById("title").style.color = "red";playVideo();},
        onPlayerReady: function(){   document.getElementById("title").style.color = "red";playVideo();}
      }
    });
    var interval = setInterval(this.tick, 1000);

    this.setState({
      player: player,
      'playerState': PlayerState.UNSTARTED,
      progress: 0,
      interval: interval
    });

    
  },

  tick: function() {
    if (!this.state.player) {
      this.setState({
        progress: 0
      });
    } else {
      this.setState({
        progress: (this.state.player.currentTime() / this.state.player.totalTime()) * 100
      });
    }
  },

  // ReactScriptLoaderMixin calls this function when the script has failed to load.
  onScriptError: function() {
    this.setState({scriptLoading: false, scriptLoadError: true});
  },

  pauseVideo: function() {
    if (this.state.player !== null) {
      /*if (!this.state.playing) {
       this.state.player.playVideo();
       message = this.createMessage(false, rid, 0, PlayerAction.PLAY);
       this.setState({
       playing: true
       });
       } else {
       this.state.player.pauseVideo();
       message = this.createMessage(false, rid, 0, PlayerAction.PAUSE); 
       this.setState({
       playing: false
       });
       }
       console.log(message);
       this.postData(message);*/
      switch(this.state.playerState) {
      case PlayerState.UNSTARTED:
      case PlayerState.ENDED:
      case PlayerState.PAUSED:
        this.state.playerState = PlayerState.PLAYING;
        this.state.player.playVideo();
        message = this.createMessage(false, rid, 0, PlayerAction.PLAY); 
        break;
      default:
        this.state.playerState = PlayerState.PAUSED;
        this.state.player.pauseVideo();
        message = this.createMessage(false, rid, 0, PlayerAction.PAUSE); 
        break;
      }
      console.log(message);
      //this.postData(message);
      socket.emit('postData', JSON.stringify(message));
    }

  },

  _handleProgressChange: function(percent) {
    var player = this.state.player;
    if (player) {
      var time = percent * player.totalTime() / 100;
      player.seekTo(time);
      message = this.createMessage(false, rid, time, PlayerAction.SEEK); 
      socket.emit('postData', JSON.stringify(message));
    }
    this.setState({
      progress: percent,
    });
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
      input =  <button onClick={this.pauseVideo} style={{float: 'left'}}> Pause </button>;
    }
    return <div className="youku-container" style={{'display': 'inline-block'}}>
      <div id="youkuplayer" style={{'width': '480px', 'height': '400px'}}>  </div>
      <div style={{overflow: 'hidden'}}>
          {input}
            <div style={{backgroundColor: '#080000',  float: 'left', 'display': 'inline-block', width: '90%'}}>
          <Progress onProgressChange={this._handleProgressChange} completed={this.state.progress} />
              </div>
      </div>
      <input type="text" ref='video_id' defaultValue={defaultVideo}/>
      <button onClick={this.onLoadClick}> Load Video </button>
      <span>{message}</span>

      <button onClick={this.redirect}> Redirect </button>
      </div>;
  },

  redirect: function() {
     this.context.router.transitionTo('/', {}, {roomID: roomID});
  },

  onLoadClick: function() {
    var video_id = '';
    if (this.isMounted() && this.refs.video_id) {
      video_id = React.findDOMNode(this.refs.video_id).value.trim();
    } else video_id = defaultVideo;
    var message = this.createMessage(false, rid, 0, PlayerAction.RELOAD, video_id);
    this.loadVideo(video_id);
    socket.emit('postData', JSON.stringify(message));
  },

  createMessage: function (ack_msg_id, rid, time, action, vid) {
    var message = {
      clientTime: Date.now() / 1000,
      clientId: rid,
      playerTime: time,
      playerAction: action,
      videoId: vid,
    };
    if (ack_msg_id) {
      message.ackMsgID = ack_msg_id;
      message.msgType = msg.MsgType.ACK;
    } else {
      message.msgType = msg.MsgType.REQUEST;
    }
    return message;
  },

  messageRecieve: function(data){
    data = JSON.parse(data.message);
    if (parseInt(data.clientId) === rid) {
      return;
    }
    console.log(data);
    
    switch(data.msgType) {
    case msg.MsgType.CHECK_LATENCY:
      //this.postData(createMessage(true, rid));
      socket.emit('postData', JSON.stringify(createMessage(true, rid)));
      break;
    case msg.MsgType.ACTION:
      this.applyActionToPlayer(data, this.state.player);
      break;
    }
    
    return;
  },

  applyActionToPlayer: function (data, player) {
    if (this.state.player !== null) {
      switch (data.playerAction) {
      case PlayerAction.PLAY:
        this.state.player.playVideo();
        this.state.playerState = PlayerState.PLAY;
        break;
      case PlayerAction.PAUSE:
        this.state.playerState = PlayerState.PAUSED;
        this.state.player.pauseVideo();
        break;
      case PlayerAction.SEEK:
        this.state.player.seekTo(data.playerTime);
        break;
      case PlayerAction.RELOAD:
        this.loadVideo(data.videoId);
      }
    }
  },
});

module.exports = Youku;
