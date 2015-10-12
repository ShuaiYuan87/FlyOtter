/**
 * @flow
 * @jsx React.DOM
 */

'use strict';

var React = require('react');
var StyleSheet = require('react-style');

var merge = require('merge');

var Input = React.createClass({
  propTypes: {
    label: React.PropTypes.node.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    valueLink: React.PropTypes.object.isRequired,
  },

  getInitialState(): Object {
    return {
      focus: false,
    }
  },

  render(): ?Object {
    var {style} = this.props;
    var inputStyle = merge(
      styles.input,
      this.state.focus ? styles.inputFocus : {}
    );
    return (
      <div style={merge(styles.container, style)}>
        <label style={styles.label}> {this.props.label} </label>
        <input
          style={inputStyle}
          placeholder={this.props.placeholder}
          onChange={
            (evt) => this.props.valueLink.requestChange(evt.target.value)
          }
          onFocus={() => this.setState({focus: true})}
          onBlur={() => this.setState({focus: false})}
        />
      </div>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    display: 'table',
  },
  label: {
    width: 70,
    border: "1px solid #ccc",
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#eee",
    padding: "6px 12px",
    fontSize: "14px",
    color: "#555",
    textAlign: 'center',
    borderRight: 0,
    display: 'table-cell',
  },

  input: {
    display: 'table-cell',
    width: '100%',
    padding: '6px 12px',
    fontSize: '14px',
    color: '#555',
    backgroundColor: '#fff',
    borderRadius: '4px',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    border: '1px solid #ccc',
    outline: 0,
  },

  inputFocus: {
    border: '1px solid #66afe9',
    boxShadow: 'rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset, rgba(102, 175, 233, 0.6) 0px 0px 8px 0px'
  }
});

module.exports = Input;
