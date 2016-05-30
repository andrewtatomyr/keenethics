import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Messages collection
import { Messages } from '../api/api.js';

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
    };
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
    FlowRouter.go("/messages/" + this.refs.locationInput.selectedIndex);
  }

  // Updating the <select> element
  componentDidUpdate() {
    let location = FlowRouter.getParam('location');
    ReactDOM.findDOMNode(this.refs.locationInput).selectedIndex = location;
  }

  // Inserting new message
  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    let location = parseInt(FlowRouter.getParam('location'));

    Meteor.call('messages.insert', text,  location);
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  renderMessages() {
    return this.props.messages.map((message) => (
      <Message key={message._id} message={message} />
    ));
  }

  render() {

    let location = FlowRouter.getParam('location');

    return (
      <div className="container">
        <header>
          <h1>Messaging</h1>

          <div className="profile-wrapper">
            { this.props.currentUser ?
              <span className="toggle-profile" onClick={this.toggleProfile.bind(this)}>
                &#9998;
              </span> : ""
            }
          </div>

          <div className="profile-wrapper">
            <AccountsUIWrapper />
          </div>

          <div className="location-wrapper">
            <select ref="locationInput" onChange={this.updateLocation.bind(this)}>
              {this.renderLocations()}
            </select>
          </div>

          { this.state.showProfile ?
            <form className="profile" onSubmit={this.updateProfile.bind(this)} >
              Your name:
              <input type="text" ref="nameInput" placeholder="Name" defaultValue={this.props.currentUser.name} />
              E-mail:
              <input type="email" ref="emailInput" placeholder="E-mail" defaultValue={this.props.currentUser.emails[0].address} />
              <input type="submit" value="Save changes" />
            </form> : ""
          }

          { this.props.currentUser && location ?
            <form className="new-message" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type new message here..."
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

  let location = parseInt(FlowRouter.getParam('location'));

  let messagesHandle = Meteor.subscribe('messages', location);
  Meteor.subscribe('userParams');

  return {
    messages: Messages.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
