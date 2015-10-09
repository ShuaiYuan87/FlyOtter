/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var Progress = require('react-progressbar');
var React = require('react');
var StyleSheet = require('react-style');
var {TransitionMotion, spring, presets} = require('react-motion');

var {PropTypes} = React;

var ChatPane = React.createClass({
  render(): Object {
    return (
        <TransitionMotion
          defaultStyles={this.getDefaultValue()}
          styles={this.getEndValue()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}>
          {
            configs => <div style={styles.container}>
              {
              Object.keys(configs).map(key => {
                const config = configs[key];
                const {child, ...style} = config;
                return (
                  <div style={style}> {child}  </div>
                );
              })
            }
            </div>
          }
        </TransitionMotion>
    );
  },

  getEndValue(): Object {
    var lastNToKeep = 5;
    var childrenMap = {};
    var total = this.props.children.length;
    for (var i = Math.max(total - lastNToKeep, 0); i < total; i++){
      childrenMap[i] = {
        child: this.props.children[i],
        width: spring(300, presets.wobbly),
        opacity: spring(1, presets.wobbly),
      };
    }
    return childrenMap;
  },

    // actual animation-related logic
  getDefaultValue(): Object {
    return this.props.children.reduce((configs, child) => {
      var key = Object.keys(configs).length;
      configs[key] = {
        child: child,
        width: spring(0),
        opacity: spring(1),
      };
      return configs;
    }, {});
  },

  willEnter(key) {
    return {
      width: spring(0),
      opacity: spring(1),
      child: this.props.children[key],
    };
  },

  willLeave(date, styleThatJustLeft) {
    return {
      width: spring(0),
      opacity: spring(0),
      child: styleThatJustLeft.child,
    };
  },
});

var styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'flex-end',
  }
});

module.exports = ChatPane;
