import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Location extends Component {

  render() {
    return (
      <option >
        {this.props.location.locationName}
      </option>
    );
  }

}

Location.propTypes = {
  location: PropTypes.object.isRequired
};
