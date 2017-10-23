import { HTTP } from 'meteor/http'
import { Mongo } from 'meteor/mongo'
import { Session } from 'meteor/session'

// Step 1

export const Endpoints = new Mongo.Collection('endpoints')
//export const Results = new Mongo.Collection('results')

const epicEndpoints = 'https://open.epic.com/MyApps/EndpointsJson'


Meteor.methods({
    'getData': function (url, name) {
        // Fetches and returns metadata from the supplied Endpoint URL. 

        // First, figure out whether to add a trailing slash - all of the epic URLs have / so is only helpful for the custom url
        if (url.substr(-1) != '/') { // if is not a slash, add one
            url += '/'
        }
        url = url + 'metadata'//Have to add /metadata to the base URL to retrieve metadata

        HTTP.call('GET', url, {
                headers: { accept: 'application/json' } //add Header accept so we get straight json objects in return. 
            }, function(err, res) {
                if (err) { // if results in an error, return this data with an error: true flag so we can deal with it on the client side
                    var result = { data: err, error: true, url: url, name: name }
                    Session.set('results', result)
                    //Results.insert({name: name, dateEntered: new Date(), data: err, error: true })
            } else {
                // Results.insert({name: name, url: url, dateEntered: new Date(), data: res.data, error: false })
                    var result = { data: res, error: false, url: url, name: name }
                    Session.set('results', result)
                    //{ data: res.data, error: false, url: url, name: name} // If things work well, give back this data object. We will also flag no errors here. 
                }
            }
        )
        //finally, set the session variable to the result object so it can be used by the client.

    },

    'reset': function () {
        // Resets everything, particularly helpful with the Epic list. 
        // Will be run at server start if the Endpoints collection is empty or non-existant
        // First clear any old lists. 
        Endpoints.rawCollection().drop()

        // Then try to get the list from an HTTP call.
        HTTP.call("GET", epicEndpoints,
            function (err, res) {
                if (err) {
                    // if error, tell us why
                    console.log(err)
                    alert("cannot get Epic Endpoint list: " + err)
                    return false
                } else {
                    // if it works, put the data results in the mongo collection called Endpoints.
                    Endpoints.insert({ dateEntered: new Date(), entries: res.data.Entries })
                    return true;
                }
            })
    },

})
