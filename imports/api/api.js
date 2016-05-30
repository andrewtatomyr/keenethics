import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection("messages");

if (Meteor.isServer) {

  Meteor.publish("messages", (location) => {
    return Messages.find({location});
  });

  Meteor.publish("userParams", function () {
    console.log("_id: ",this.userId);
    return Meteor.users.find({_id: this.userId}, {fields: {name: 1}});
  });

}

FlowRouter.route('/messages/:location', {
  name: 'messages',
  action: function(params) {
    console.log("[LOCATION is]:", params.location);


  }
});

Meteor.methods({

  "user.updateProfile"(name, email) {
    Meteor.users.update({_id: this.userId}, {
      $set: {
        name,
        "emails.0.address": email
      }
    });
  },

  "messages.insert"(text, location) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.insert({
      text,
      createdAt: new Date(),
      author: this.userId,
      username: Meteor.users.findOne(this.userId).name,
      location,
    });
  },

});
