/**
 * @flow
 */

'use strict';

var Parse = require('parse').Parse;
var localStorage = require('localStorage');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var appID = "a1SGzTZWPn1t9lwXnDG4FTUcpoTUDyyp7ZInhtxZ";
var javascriptKey = "uV0nfzaCO18SwcHPct0kOqBeNxAqADInGW0VfS93";

class ParseFactory {
  static getObjectByType(type: string): Object {
    Parse.initialize(appID, javascriptKey);
    Parse.User.enableUnsafeCurrentUser();
    return new Parse[type];
  }

  static getParse(): Object {
    Parse.initialize(appID, javascriptKey);
    Parse.User.enableUnsafeCurrentUser();
    return Parse;
  }
}

module.exports = ParseFactory;
