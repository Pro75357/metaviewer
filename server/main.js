import { Meteor } from 'meteor/meteor';
import { Endpoints } from '../imports/getdata'
import '../imports/getdata.js'

Meteor.startup(() => {

    // On startup, probably the Epic list is empty. We can run the "reset" code to get a new one. 
    // First, let's check if it is empty. Don't need to do it if we don't have to.

    if (Endpoints.find().count() > 0) {
        console.log('Endpoint data found- not requesting a refresh')
        return true // If we are able to find stuff here just stop. 
    } else { // If there are any issues, do a reset
        console.log('nothing found in Endpoints- requesting a data refresh from Epic')
        Meteor.call('reset') // This clears the database and gets the data for the Epic select dropdown. 
    }

});
