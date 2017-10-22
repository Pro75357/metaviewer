import { HTTP } from 'meteor/http'
import { Mongo } from 'meteor/mongo'

// Step 1

export const Endpoints = new Mongo.Collection('endpoints')
export const Results = new Mongo.Collection('results')

const epicEndpoints = 'https://open.epic.com/MyApps/EndpointsJson'


Meteor.methods({

    'getList': function () {
        // Let's get the list!
        //First clear any old lists. 
        Meteor.call('clearList') // define this below

        // Then try to get the list from an HTTP call.
        HTTP.call("GET", epicEndpoints,
            function (err, res) {
                if (err) {
                    // if error, tell us why
                    console.log(err)
                    return false
                } else {
                    // if it works, put the data results in the mongo collection called Endpoints.
                    Endpoints.insert({ dateEntered: new Date(), entries: res.data.Entries })
                    return true;
                }
            })
    },

    // this just dumps everything
    'clearList': function () {
        Endpoints.rawCollection().drop()
        Results.rawCollection().drop()
        //    console.log('list cleared')
        },

    'getData': function (url, name) {
        // This will instantly be displayed so first clear any old data
        Results.rawCollection().drop() // remove any prior results

        // Then get the new data using the URL from the list

        // Figure out whether to add a trailing slash - all of the epic URLs have / so is only helpful for the custom url
        if (url.substr(-1) != '/') url += '/';

        HTTP.call('GET', url+'metadata', { //Have to add /metadata to the base URL to retrieve metadata
                headers: { accept: 'application/json' } //so we get straight json objects in return. 
            }, function(err, res) {
                if (err) { // if results in an error, store the thing with an error: true flag
                    Results.insert({name: name, dateEntered: new Date(), data: err, error: true })
            } else {
                // store the response in the mongo collection. Use the type: 'result' so we can find it easily later and separate it from the endpoint list.
                Results.insert({name: name, url: url, dateEntered: new Date(), data: res.data, error: false })
                }
            }
        )
    }
})
