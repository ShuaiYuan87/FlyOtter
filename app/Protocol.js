/* @flow */

'use strict';

class Protocol {
  // Message Type
  static CHECK_LATENCY: number;
  static REQUEST: number;
  static ACK: number;
  static ACTION: number;

  // Player Actions
  static PLAY: number;
  static PAUSE: number;
  static SEEK: number;
  static STOP: number;
  static RELOAD: number;
  static CHAT: number;

  // Operations
  static CREATE_ROOM: string;
  static LOAD_VIDEO: string;

  static createMessage(
    ack_msg_id,
    rid,
    time,
    action,
    vid
  ): Object {
    var message = {
      clientTime: Date.now() / 1000,
      clientId: rid,
      playerTime: time,
      playerAction: action,
      videoId: vid,
      ackMsgID: 0,
      msgType: 0,
    };
    if (ack_msg_id) {
      message.ackMsgID = ack_msg_id;
      message.msgType = Protocol.ACK;
    } else {
      message.msgType = Protocol.REQUEST;
    }
    return message;
  }
}

Object.assign(
  Protocol,
  {
    CHECK_LATENCY: 1,
    REQUEST: 2,
    ACK: 3,
    ACTION: 4,

    PLAY: 1,
    PAUSE: 2,
    SEEK: 3,
    STOP: 4,
    RELOAD: 5,
    CHAT: 6,

    CREATE_ROOM: 'create',
    LOAD_VIDEO: 'reload',
  }
);


module.exports = Protocol;
