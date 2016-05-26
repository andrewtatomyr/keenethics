import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Messages } from '../api/api.js';

export default class Message extends Component {

  render() {
    return (
      <li >
        <div>
          <strong>{this.props.message.username}</strong> <span className="date-time">{this.props.message.createdAt.toLocaleString()}</span>
        </div>
        <span className="text">
          {this.props.message.text}
        </span>
      </li>
    );
  }

}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};
