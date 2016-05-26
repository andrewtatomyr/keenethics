import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Messages publication
import { /*UserParams,*/ Messages } from '../api/api.js';

// Message template
import Message from './Message.jsx';

// Location template
import Location from './Location.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// Main component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProfile: false,
      currentLocation: 0,
    };
  }


  // Inserting new message
  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('messages.insert', text, this.props.currentUser.location);
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  toggleProfile() {
    this.setState({showProfile: !this.state.showProfile});
  }

  updateProfile(event) {
    event.preventDefault();

    const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.emailInput).value;
    Meteor.call("user.updateProfile", name, email);
    this.toggleProfile();
  }

  // Predefined location list
  getLocations() {
    return [
      {_id: 0, locationName: "Select location"},
      {_id: 1, locationName: "Location 'A'"},
      {_id: 2, locationName: "Location 'B'"},
      {_id: 3, locationName: "Location 'C'"},
    ]
  }

  renderLocations() {
    return this.getLocations().map((location) => (
      <Location key={location._id} location={location} />
    ));
  }

  updateLocation() {
    Meteor.call("user.updateLocation", this.refs.locationInput.selectedIndex);
  }

  // Updating <select> element
  componentDidUpdate() {
    ReactDOM.findDOMNode(this.refs.locationInput).selectedIndex = this.props.currentUser ? this.props.currentUser.location : 0; // this.refs.locationInput.selectedIndex; // ?
  }

  renderMessages() {
    let filteredMessages = this.props.messages.filter((message) => message.location === this.props.currentUser.location);

    return filteredMessages.map((message) => (
      <Message key={message._id} message={message} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Messaging</h1>

          <label className="hide-completed">
            <select ref="locationInput" defaultValue="0" onChange={this.updateLocation.bind(this)}>
              {this.renderLocations()}
            </select>
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <a href="#" className="toggle-profile" onClick={this.toggleProfile.bind(this)}>
              profile
            </a> : ""
          }

          { this.state.showProfile ?
            <form className="profile" onSubmit={this.updateProfile.bind(this)} >
              Your name:
              <input type="text" ref="nameInput" placeholder="Name" defaultValue={this.props.currentUser.name} />
              E-mail:
              <input type="email" ref="emailInput" placeholder="E-mail" defaultValue={this.props.currentUser.emails[0].address} />
              <input type="submit" value="Save changes" />
            </form> : ""
          }

          { this.props.currentUser && this.props.currentUser.location ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ""
          }
        </header>

        <ul>
          {this.renderMessages()}
        </ul>

      </div>
    );
  }

}


App.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('messages');
  Meteor.subscribe('userParams');

  return {
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);