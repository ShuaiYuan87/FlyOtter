/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Arbiter = require('arbiter-subpub');
var Chathead = require('./Chathead.react');
var ChatPane = require('./ChatPane.react');
var ControlPane = require('./ControlPane.react');
var Icon = require('./Icons/Icon.react');
var PlaybackControl = require('./PlaybackControl');
var React = require('react');
var RemotePlaybackControl = require('./RemotePlaybackControl');
var StyleSheet = require('react-style');
var PlayerState = require('./PlayerState.js');

var merge = require('merge');

var VIDEO_PLAYER_ID = 'keekwoon-player';
//var serverIP = '73.231.32.235';
var HOST = process.env.SYNC_HOST || 'localhost';
var PORT = process.env.SYNC_PORT || 8989;
var ROOM_ID = 1234;
var fb_id;

var VideoPlayer = React.createClass({
  propTypes: {
//    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  componentDidMount: function(): void {
    console.log(HOST);
    console.log(PORT);
    Arbiter.subscribe('video/load', (data) => {
      this._loadVideo(data.url);
    });

    Arbiter.subscribe('fb/logout', () => {
      FB.logout(function(response) {
        // Person is now logged out
      });
    });

    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1204292072921486',
        xfbml      : true,
        version    : 'v2.4'
      });

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    function statusChangeCallback(response) {
      console.log('statusChangeCallback');
      console.log(response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into this app.';
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
          'into Facebook.';
      }
    }

    function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }

    function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        
        fb_id = response.id;
        console.log('Successful login for: ' + fb_id);
      });
    }
  },

  getInitialState: function(): Object {
    var remote = new RemotePlaybackControl(
      HOST,
      PORT,
      ROOM_ID
    );

    remote.onLoadVideo = (videoURL, time, state) => {
      this.setState({
        videoURL: videoURL,
      });
      PlaybackControl.getControl().loadVideo(VIDEO_PLAYER_ID, videoURL, time, state);
      PlaybackControl.getControl().playerTick =
        (time) => this.setState({currentTime: time});
    };
    remote.onPlay = () => {
      PlaybackControl.getControl().toggle();
    };
    remote.onSeek = (time) => {
      PlaybackControl.getControl().seekTo(time);
    };
    remote.onReceiveMessage = (text) => {
      this._addMessage(text);
    };
    remote.getState = () => {
      return PlaybackControl.getControl().playerState;
    };
    remote.getCurrentTime = () => {
      return PlaybackControl.getControl().getCurrentTime();
    }

    return {
      videoURL: '',
      playerSec: 0,
      currentTime: 0,
      isControlPanelVisible: false,
      remotePlaybackControl: remote,
      text: '',
      chatheads: [],
    };
  },

  _addMessage(message: string): void {
    var chatheads = this.state.chatheads;
    chatheads.push(
      <Chathead text={message} fb_id={fb_id} />
    );
    this.setState({
      chatheads: chatheads,
    })
  },

  render: function(): Object {
    var control = PlaybackControl.getControl();
    var totalTime = control.getTotalTime
      ? control.getTotalTime()
      : 0;

    return (
      <div style={styles.screen}>
        <div style={merge(styles.videoContainer, {height: this.props.height})}>
          <div style={merge({}, styles.overlay, {margin: 'auto'})} id={VIDEO_PLAYER_ID}/>
          <div
            style={merge({}, styles.overlay, styles.canvas)}
            onClick={this._togglePlayerState}
          >
            <ChatPane>
              {this.state.chatheads}
            </ChatPane>
            <ControlPane
              currentTime={this.state.currentTime}
              totalTime={totalTime}
              handleProgressChange={this._handleProgressChange}
            />
          </div>
        </div>
        <input
          type="text"
          value={this.state.text}
          onChange={evt => this.setState({
            text: evt.target.value
        })}/>

        <Icon icon="my-icon"/>
        <button onClick={() => {
          this.state.remotePlaybackControl.sendChat(this.state.text, -356);
          this._addMessage(this.state.text);
        }}>
          add chat
        </button>
        <button onClick={this._playVideo}>Play</button>
        <button onClick={this._pauseVideo}>Pause</button>
        <input
          type="text"
          value={this.state.playerSec}
          onChange={evt => this.setState({
            playerSec: parseInt(evt.target.value)}
          )}
        />
        <button onClick={this._seekVideo}>Seek</button>
        <div> {this.state.currentTime} </div>
      </div>
    );
  },

  _handleProgressChange: function (percent: number): void {
    var playbackControl = PlaybackControl.getControl();
    if (playbackControl) {
      var time = percent * playbackControl.getTotalTime() / 100;
      playbackControl.seekTo(time);
      this.setState({
        currentTime: time,
      });
      this.state.remotePlaybackControl.seekTo(time);
    }
  },

  _togglePlayerState: function(): void {
    this.state.remotePlaybackControl.toggle();
    PlaybackControl.getControl().toggle();
  },

  _loadVideo: function(url: string): void {
    var playbackControl = PlaybackControl.getControl();
    this.state.remotePlaybackControl.loadVideo(url);
    playbackControl.loadVideo(VIDEO_PLAYER_ID, url, 0, PlayerState.UNSTARTED);
    playbackControl.playerTick = (time) => this.setState({currentTime: time});
  },

  _playVideo: function(evt: Object): void {
    this.state.remotePlaybackControl.play();
    PlaybackControl.getControl().play();
  },

  _pauseVideo: function(evt: Object): void {
    this.state.remotePlaybackControl.pause();
    PlaybackControl.getControl().pause();
  },

  _seekVideo: function(evt: Object): void {
    PlaybackControl.getControl().seekTo(this.state.playerSec);
  },
});

var styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  canvas: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    WebkitFlex: 1, /* Safari 6.1+ */
    msFlex: 1, /* IE 10 */
    flex: 1,
    justifyContent: 'flex-end',
  },
  videoContainer: {
    width: '100%',
    position: 'relative',
  },
  screen: {
    background: 'black',
    height: '100%',
  }
});

module.exports = VideoPlayer;
