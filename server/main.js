import { Meteor } from 'meteor/meteor';

import '../imports/getdata.js'

Meteor.startup(() => {
  // On startup we want to clear any old database entries and populate the Epic select dropdown

    Meteor.call('getList') // This clears the database and gets the data for the Epic select dropdown. 

});
