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
require('main.css');
// var serverIP = '73.231.32.235';
// var serverIP = 'localhost';
var serverIP = 'lit-headland-2085.herokuapp.com';
var port = '80';

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

  _initialEmoji: function() {
    var emojiContainer = document.getElementById('emojiWrapper'),
        docFragment = document.createDocumentFragment();
    for (var i = 69; i > 0; i--) {
        var emojiItem = document.createElement('img');
        emojiItem.src = '../content/emoji/' + i + '.gif';
        emojiItem.title = i;
        docFragment.appendChild(emojiItem);
    };
    emojiContainer.appendChild(docFragment);
  },
  _displayNewMsg: function(user, msg, color) {
      var container = document.getElementById('historyMsg'),
          msgToDisplay = document.createElement('p'),
          date = new Date().toTimeString().substr(0, 8),
          //determine whether the msg contains emoji
          msg = this._showEmoji(msg);
      msgToDisplay.style.color = color || '#000';
      msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
      container.appendChild(msgToDisplay);
      container.scrollTop = container.scrollHeight;
  },
  _displayImage: function(user, imgData, color) {
      var container = document.getElementById('historyMsg'),
          msgToDisplay = document.createElement('p'),
          date = new Date().toTimeString().substr(0, 8);
      msgToDisplay.style.color = color || '#000';
      msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
      container.appendChild(msgToDisplay);
      container.scrollTop = container.scrollHeight;
  },
  _showEmoji: function(msg) {
      var match, result = msg,
          reg = /\[emoji:\d+\]/g,
          emojiIndex,
          totalEmojiNum = document.getElementById('emojiWrapper').children.length;
      while (match = reg.exec(msg)) {
          emojiIndex = match[0].slice(7, -1);
          if (emojiIndex > totalEmojiNum) {
              result = result.replace(match[0], '[X]');
          } else {
              result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
          };
      };
      return result;
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
    var that = this;
    var { router } = this.context;
    roomID = router.getCurrentQuery().roomID;
    if (typeof roomID === 'undefined')
    {
      init = true;
      roomID = defaultRoomID;
    }
    socket.emit('create', 'room' + roomID.toString());
    socket.on('notification', this.messageRecieve);
    socket.on('check_state', this.checkRecieve);
    socket.on('init', this.initRecieve);
    socket.on('reload', this.reloadRecieve);
    socket.on('connect', function() {
        document.getElementById('info').textContent = 'get yourself a nickname :)';
        document.getElementById('nickWrapper').style.display = 'block';
        document.getElementById('nicknameInput').focus();
    });
    socket.on('nickExisted', function() {
        document.getElementById('info').textContent = '!nickname is taken, choose another pls';
    });
    socket.on('loginSuccess', function() {
        document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
        document.getElementById('loginWrapper').style.display = 'none';
        document.getElementById('messageInput').focus();
    });
    socket.on('error', function(err) {
        if (document.getElementById('loginWrapper').style.display == 'none') {
            document.getElementById('status').textContent = '!fail to connect :(';
        } else {
            document.getElementById('info').textContent = '!fail to connect :(';
        }
    });
    socket.on('system', function(nickName, userCount, type) {
        var msg = nickName + (type == 'login' ? ' joined' : ' left');
        that._displayNewMsg('system ', msg, 'red');
        document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
    });
    socket.on('newMsg', function(user, msg, color) {
        that._displayNewMsg(user, msg, color);
    });
    socket.on('newImg', function(user, img, color) {
        that._displayImage(user, img, color);
    });
    this.context.router.transitionTo('/', {}, {roomID: roomID});
    document.getElementById('loginBtn').addEventListener('click', function() {
        var nickName = document.getElementById('nicknameInput').value;
        if (nickName.trim().length != 0) {
            socket.emit('login', nickName);
        } else {
            document.getElementById('nicknameInput').focus();
        };
    }, false);
    document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
        if (e.keyCode == 13) {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                socket.emit('login', nickName);
            };
        };
    }, false);
    document.getElementById('sendBtn').addEventListener('click', function() {
        var messageInput = document.getElementById('messageInput'),
            msg = messageInput.value,
            color = document.getElementById('colorStyle').value;
        messageInput.value = '';
        messageInput.focus();
        if (msg.trim().length != 0) {
            socket.emit('postMsg', msg, color);
            that._displayNewMsg('me', msg, color);
            return;
        };
    }, false);
    document.getElementById('messageInput').addEventListener('keyup', function(e) {
        var messageInput = document.getElementById('messageInput'),
            msg = messageInput.value,
            color = document.getElementById('colorStyle').value;
        if (e.keyCode == 13 && msg.trim().length != 0) {
            messageInput.value = '';
            socket.emit('postMsg', msg, color);
            that._displayNewMsg('me', msg, color);
        };
    }, false);
    document.getElementById('clearBtn').addEventListener('click', function() {
        document.getElementById('historyMsg').innerHTML = '';
    }, false);
    document.getElementById('sendImage').addEventListener('change', function() {
        if (this.files.length != 0) {
            var file = this.files[0],
                reader = new FileReader(),
                color = document.getElementById('colorStyle').value;
            if (!reader) {
                that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                this.value = '';
                return;
            };
            reader.onload = function(e) {
                this.value = '';
                socket.emit('img', e.target.result, color);
                that._displayImage('me', e.target.result, color);
            };
            reader.readAsDataURL(file);
        };
    }, false);
    that._initialEmoji();
    document.getElementById('emoji').addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        emojiwrapper.style.display = 'block';
        e.stopPropagation();
    }, false);
    document.body.addEventListener('click', function(e) {
        var emojiwrapper = document.getElementById('emojiWrapper');
        if (e.target != emojiwrapper) {
            emojiwrapper.style.display = 'none';
        };
    });
    document.getElementById('emojiWrapper').addEventListener('click', function(e) {
        var target = e.target;
        if (target.nodeName.toLowerCase() == 'img') {
            var messageInput = document.getElementById('messageInput');
            messageInput.focus();
            messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
        };
    }, false);
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
    this.setState({scriptLoading: false, scriptLoaded:true});
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
                                if (!init) {
                                  this.state.player.pauseVideo();
                                }
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
        <div className="wrapper">
            <div className="banner">
                <h1>HiChat :)</h1>
                <span id="status"></span>
            </div>
            <div id="historyMsg">
            </div>
            <div className="controls" >
                <div className="items">
                    <input id="colorStyle" type="color" placeHolder='#000' title="font color" />
                    <input id="emoji" type="button" value="emoji" title="emoji" />
                    <label for="sendImage" className="imageLable">
                        <input type="button" value="image"  />
                        <input id="sendImage" type="file" value="image"/>
                    </label>
                    <input id="clearBtn" type="button" value="clear" title="clear screen" />
                </div>
                <textarea id="messageInput" placeHolder="enter to send"></textarea>
                <input id="sendBtn" type="button" value="SEND" />
                <div id="emojiWrapper">
                </div>
            </div>
        </div>
        <div id="loginWrapper">
            <p id="info">connecting to server...</p>
            <div id="nickWrapper">
                <input type="text" placeHolder="nickname" id="nicknameInput" />
                <input type="button" value="OK" id="loginBtn" />
            </div>
        </div>
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
    socket.emit('reload', JSON.stringify(message));
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

  reloadRecieve: function(data){
    data = JSON.parse(data.message);
    console.log(data);
    if (parseInt(data.clientId) === rid) {
      return;
    }
    this.loadVideo(data.videoId);
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
