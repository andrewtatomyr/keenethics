import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection("messages");

if (Meteor.isServer) {

  Meteor.publish("messages", () => {
    return Messages.find({});
  });

  Meteor.publish("userParams", function () {
    console.log("_id: ",this.userId);
    return Meteor.users.find({_id: this.userId}, {fields: {name: 1, location: 1}});
  });

}

Meteor.methods({

  "user.updateProfile"(name, email) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        name,
        "emails.0.address": email
      }
    });
  },

  
  "user.updateLocation"(location) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        location
      }
    });
  },


  "messages.insert"(text, location) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    //let location = .user

    Messages.insert({
      text,
      createdAt: new Date(),
      author: this.userId,
      username: Meteor.users.findOne(this.userId).name,
      location,
    });
  },

});
