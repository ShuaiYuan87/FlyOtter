
var app = require('http').createServer()
, io = require('socket.io').listen(app)
, url = require('url')

var msg = require('./node_modules/lib/msg.js');
var state = require('./node_modules/lib/player_state.js');
var action = require('./node_modules/lib/player_action.js');

var last_player_time; //in seconds
var last_server_time;
var latency = {};
var current_state = state.PAUSED;
var users = [];
app.listen(8989);

console.error('Start listening');

last_player_time = 0;

last_server_time = Date.now();

var owner_map = {};

function sendMessage(message, room, type, owner_only) {

    var msg_id = Math.floor(Math.random() * 10000);
    message.msgID = msg_id;

    var msg_str = JSON.stringify(message);

    if (message.playerAction == action.SEEK) {
        console.error("=====================");
    }
    console.error('sending message ' + msg_str + 'to ' + room);
    owner_only = typeof owner_only !== 'undefined' ? owner_only : false;
    if (owner_only) {
        owner_map[room].emit(type, {'message': msg_str});
        console.error('owner_only');
    }
    else {
        io.sockets.in(room).emit(type, {'message': msg_str});
    }
}
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('create', function (room) {
        if (!(room in owner_map)) {
            owner_map[room] = socket;
        }
        socket.join(room);
        socket.room = room;
        console.log('socket joining ' + room);
    });
    socket.on('check_state', function (room) {
        var message = {
                //reply_socket: socket,
        };
        sendMessage(message, room, 'check_state', true);
    });
    socket.on('postData', function (data) {
        console.error('received message ' + data);
        var data = JSON.parse(data);
        // Too much POST data, kill the connection!
        if (data.length > 1e6)
            request.connection.destroy();
        var msgType = data.msgType;
        // if the message is to request
        if (msgType == msg.MsgType.REQUEST) {
            data.msgType = msg.MsgType.ACTION;
            sendMessage(data, socket.room, 'notification');
        }
        // ack latency check
        else if (msgType == msg.MsgType.ACK) {
            latency[data.clientId] = (Date.now()-data.timestamp)/2;
        }        
    });
    socket.on('reload', function (data) {
        console.error('received reload message ' + data);
        var data = JSON.parse(data);
        // Too much POST data, kill the connection!
        if (data.length > 1e6)
            request.connection.destroy();
        sendMessage(data, socket.room, 'reload');
    });
    socket.on('init', function (data) {
        console.error('received init message ' + data);
        var data = JSON.parse(data);
        // Too much POST data, kill the connection!
        if (data.length > 1e6)
            request.connection.destroy();
        sendMessage(data, socket.room, 'init');
    });
    socket.on('disconnect', function(){
        console.log('socket leaving ' + socket.room);
        socket.leave(socket.room);
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });
    socket.on('login', function(nickname) {
        console.error('received nickname message ' + nickname);
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
});

/*setInterval(function checkLatency() {
    var message = {
        msgType: msg.MsgType.CHECK_LATENCY,
        timestamp: Date.now()
    };
 //   sendMessage(message);
}, 300000);*/

