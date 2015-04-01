var React = require('react');
var ReactScriptLoaderMixin = require('./ReactScriptLoader.js').ReactScriptLoaderMixin;
var io = require('socket.io-client');
var http = require('http');
var UNIVERSE = 100000;
var rid = Math.floor(Math.random() * UNIVERSE);
var PlayerState = require('lib/player_state');
var PlayerAction = require('lib/player_action');
var Progress = require('react-progressbar');
var msg = require('lib/msg');

var serverIP = '67.161.30.248';
//var serverIP = 'localhost';
var port = '8989';

var socket = io.connect('http://' + serverIP + ':' + port);
// tutorial1.js
var Youku = React.createClass({
    mixins: [ReactScriptLoaderMixin],
    getInitialState: function() {
	socket.on('notification', this.messageRecieve);

	return {
	    scriptLoading: true,
	    scriptLoadError: false,
	    player: null,
	    'playerState': PlayerState.UNSTARTED,
	    progress: 0
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
	    vid: 'XODk5MTIyNjE2',
	    events:{
		onPlayStart: function(){ document.getElementById("title").style.color = "red";playVideo();},
		onPlayerReady: function(){   document.getElementById("title").style.color = "red";playVideo();}
	    }
	});

	this.setState({
	    player: player
	});

	this.interval = setInterval(this.tick, 1000);
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
	    this.postData(message);
	}

    },

    _handleProgressChange: function(percent) {
	var player = this.state.player;
	if (player) {
	    var time = percent * player.totalTime() / 100;
	    player.seekTo(time);
	    message = this.createMessage(false, rid, time, PlayerAction.SEEK); 
	    this.postData(message);
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
	    input =  <button onClick={this.pauseVideo}> Pause </button>;
	    
	}
	return <div>
	    {input}
            <Progress onProgressChange={this._handleProgressChange} completed={this.state.progress} />
            <div id="youkuplayer" style={{'width': '480px', 'height': '400px'}}> </div>
            <span>{message}</span>
	    </div>;
    },

    postData:function(data) {
        // Build the post string from an object
        var post_data = JSON.stringify(data);

        // An object of options to indicate where to post to
        var post_options = {
            host: serverIP,
            port: port,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            }
        };

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            //res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    },

    createMessage: function (ack_msg_id, rid, time, action) {
        var message = {
            clientTime: Date.now() / 1000,
            clientId: rid,
            playerTime: time,
            playerAction: action,
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
            this.postData(createMessage(true, rid));
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
            }
        }
    },
});

module.exports = Youku;
