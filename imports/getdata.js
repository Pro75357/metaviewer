import { HTTP } from 'meteor/http'
import { Mongo } from 'meteor/mongo'

// Step 1

export const Endpoints = new Mongo.Collection('endpoints')

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

    // this just dumps the Endpoints collection
    'clearList': function () {
            Endpoints.rawCollection().drop()
        //    console.log('list cleared')
        },

    'getData': function (url, name) {
        // This will instantly be displayed so first clear any old data
        Endpoints.remove({ type: 'result' }) // just remove anything with the type: result.

        // Then get the new data using the URL from the list
        HTTP.call('GET', url+'/metadata', { //Have to add /metadata to the main URL
                headers: { accept: 'application/json' }
            }, function(err, res) {

                if (err) {
                    Endpoints.insert({ type: 'result', name: name, dateEntered: new Date(), data: err, error: true })
            } else {
                // store the response in the mongo collection. Use the type: 'result' so we can find it easily later and separate it from the endpoint list.
                Endpoints.insert({ type: 'result', name: name, url: url, dateEntered: new Date(), data: res.data, error: false })
                }
            }
        )
    }
})
