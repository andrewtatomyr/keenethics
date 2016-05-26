import { Meteor } from 'meteor/meteor';

import   '../imports/api/api.js';

Meteor.startup(() => {

  Accounts.onCreateUser((options, user) => {


    user.name = user.emails[0].address;
    user.name = user.name.substring(0,user.name.indexOf("@"));
    user.location = 0;
    return user;
  });

});
