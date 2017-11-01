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

        try {
            res = HTTP.call('GET', url, {
                headers: { accept: 'application/json, application/json+fhir' } //add Header accept so we get straight json objects in return. 
            })
            if (res.data) { // if the data element is populated, just use that
               return { data: res, error: false, url: url, name: name }
            } else {
                try { // first, try to parse content as JSON
                    var data = { data: JSON.parse(res.content) } // to keep the data.data thing consistent
                    var result = { data: data, error: false, url: url, name: name }
                    return result
                } catch (e) { // if it gives an error, just return the data. 
                    //console.log('json parse failed for content')
                    return { data: res, error: false, url: url, name: name }
                }
                
            } // If there is an error in the HTTP call, also just return the data, but we will set the error flag to true. 
        } catch (e) {
          //  console.log(e)
            return { data: e, error: true, url: url, name: name }
        }
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
