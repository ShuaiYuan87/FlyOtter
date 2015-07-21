var React = require('react');
var Parse = require('parse').Parse;
Parse.initialize("90I4DZgPdtQ4M0bYeaMMfWKpNqTlwCxdfgbAr7ef", "RT7oaftVYrCAyt9Nm5rTe1f2ij1ViGDPQsXvGiyi");
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
var init = false;
var roomID;
require('youku-style.css');

var serverIP = '73.231.32.235';
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

  propTypes: {
    width: React.PropTypes.string,
    height: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      scriptLoading: true,
      scriptLoadError: false,
      scriptLoaded: false,
      player: null,
      playerState: PlayerState.UNSTARTED,
      progress: 0,
      interval: null,
    };
  },

  componentDidMount: function() {
    var { router } = this.context;
    roomID = router.getCurrentQuery().roomID;
    roomID = roomID ? roomID : defaultRoomID;
    socket.emit('create', 'room' + roomID.toString());
    socket.on('notification', this.messageRecieve);
    socket.on('check_state', this.checkRecieve);
    socket.on('init', this.initRecieve);
    this.context.router.transitionTo('/', {}, {roomID: roomID});
  },

  // this function tells ReactScriptLoaderMixin where to load the script from
  getScriptURL: function() {
    return 'http://player.youku.com/jsapi';
  },

  // ReactScriptLoaderMixin calls this function when the script has loaded
  // successfully.
  onScriptLoaded: function() {
    this.setState({scriptLoading: false, scriptLoaded:true});
    this.loadVideo(defaultVideo);
  },
sleepFor:function ( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
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
        onPlayStart: function(){ socket.emit('check_state', 'room' + roomID.toString());
                                document.getElementById("title").style.color = "red";
                                //this.state.player.pauseVideo();
                              },
        onPlayerReady: function(){ document.getElementById("title").style.color = "red";},
        onPlayEnd: function() { }
      }
    });
    var interval = setInterval(this.tick, 1000);
    
    this.setState({
      player: player,
      'playerState': PlayerState.UNSTARTED,
      progress: 0,
      interval: interval
    });
    //this.sleepFor(5000);
    //this.state.player.playVideo();
    
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

  toggleVideoState: function() {
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
       }*/
       //console.log(message);
       //this.postData(message);
      switch(this.state.playerState) {
      case PlayerState.UNSTARTED:
      case PlayerState.ENDED:
      case PlayerState.PAUSED:
        this.state.playerState = PlayerState.PLAYING;
        this.state.player.playVideo();
        message = this.createMessage(false, rid, 0, PlayerAction.PLAY);
        this.setState({playerState: PlayerState.PLAYING});
        break;
      default:
        this.state.playerState = PlayerState.PAUSED;
        this.state.player.pauseVideo();
        message = this.createMessage(false, rid, 0, PlayerAction.PAUSE);
        this.setState({playerState: PlayerState.PAUSED});
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
    var controlPanel;
    var controlPanelHeight = '52px';
    if (this.state.scriptLoading) {
      message = 'loading script...';
    } else if (this.state.scriptLoadError) {
      message = 'loading failed';
    } else {
      message = 'loading succeeded';
      var playButtonText = 'Play';
      if (this.state.playerState === PlayerState.PLAYING) {
        playButtonText = 'Pause';
      }
      
      controlPanel = <div id="control-panel" style={{top: '-' + controlPanelHeight, height: controlPanelHeight}}>
        <Progress onProgressChange={this._handleProgressChange} completed={this.state.progress} background="black"/>
        <div>
          <button onClick={this.toggleVideoState} style={{float: 'left'}}>  {playButtonText} </button>
        </div>
      </div>;
    }

    var height = this.props.height;
    var containerNode = React.findDOMNode(this.refs.video_container);
    if (containerNode) {
      var actualWidth = containerNode.offsetWidth;
      height = actualWidth * 9.0 / 16;
    }
        
    return <div className="youku-container" ref='video_container'
            style={{width: this.props.width, height: height}} className={this.props.className}>
      <input type="text" ref='username' defaultValue='username'/>
      <input type="text" ref='password' defaultValue='password'/>
      <button onClick={this.signUp}> Sign Up </button>
      <div id="youkuplayer" >  </div>
     {controlPanel}
      <div style={{overflow: 'hidden'}}>
      </div>
      <input type="text" ref='video_id' defaultValue={defaultVideo}/>
      <button onClick={this.onLoadClick}> Load Video </button>
      <span>{message}</span>

      <button onClick={this.redirect}> Redirect </button>
      </div>;
  },

  signUp: function() {
    var user = new Parse.User();
    var username = 'username';
    var password = 'password';
    if (this.isMounted() 
     && this.refs.username
     && this.refs.password) {
      username = React.findDOMNode(this.refs.username).value.trim();
      password = React.findDOMNode(this.refs.password).value.trim();
    }
    user.set("username", username);
    user.set("password", password);
    //user.set("email", "email@example.com");
     
    // other fields can be set just like with Parse.Object
    //user.set("phone", "415-392-0202");
     
    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        alert("Success of signUp!")
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
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

  checkRecieve: function(data){
    data = JSON.parse(data.message);
    console.log(data);
    var player_action;
    switch(this.state.playerState) {
      case PlayerState.UNSTARTED:
      case PlayerState.ENDED:
      case PlayerState.PAUSED:
        player_action = PlayerAction.PAUSE;
        break;
      case PlayerState.PLAYING:
        player_action = PlayerAction.PLAY;
        break;
    }
    var player = this.state.player;
    if (player) {
      var time = this.state.player.currentTime();
      socket.emit('init', JSON.stringify(this.createMessage(false, rid, time, player_action, 0)));
    }
  },

  initRecieve: function(data){
    debugger;
    if (init) {
      return;
    }
    else {
      data = JSON.parse(data.message);
      console.log(data);
      this.applyActionToPlayer(data, this.state.player);
      
      init = true;
    }
  },

  applyActionToPlayer: function (data, player) {
    if (this.state.player !== null) {
      switch (data.playerAction) {
      case PlayerAction.PLAY:
        this.state.player.playVideo();
        if (data.playerTime != 0) {
          this.state.player.seekTo(data.playerTime);
        }
        this.setState({playerState: PlayerState.PLAYING});
        break;
      case PlayerAction.PAUSE:
        this.state.player.pauseVideo();
        if (data.playerTime != 0) {
          this.state.player.seekTo(data.playerTime);
        }
        this.setState({playerState: PlayerState.PAUSED});
        break;
      case PlayerAction.SEEK:
        this.state.player.seekTo(data.playerTime);
        this.setState({playerState: PlayerState.PLAYING});
        break;
      case PlayerAction.RELOAD:
        this.loadVideo(data.videoId);
        this.setState({playerState: PlayerState.PAUSED});
      }
    }
  },
});

module.exports = Youku;
