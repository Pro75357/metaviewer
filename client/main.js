import { Template } from 'meteor/templating';
import { Endpoints } from '../imports/getdata'
import { Results } from '../imports/getdata'

import './main.html';

// create the mainResults variable which we will fill later

// first declare a variable that will help us with loading/etc.

Session.set('resultExpected', false)

Template.buttons.events({
    'click .getList': function () {
        Meteor.call('getList')
        Session.set('resultExpected', false)
        alert('Things are reset')
    },
})


Template.dropdown.helpers({
    endpointList() {
        list = Endpoints.findOne({}).entries
      //console.dir(list)
      return list
  },
});

Template.dropdown.events({
    'change .dropdownList'(event, instance) {
        var keys = JSON.parse(event.target.value)
       // console.dir(keys)
        Session.set('resultExpected', true)
        Meteor.call('getData', keys.uri, keys.name)
  },
});

Template.results.helpers({

    resultExpected() {
        return Session.get('resultExpected')
    },
    anythingPresent() {
        if (Results.find({}).count() > 0) {
            return true
        }
    },
    resultCount() {
        return Results.find({error:false }).count()
    },
    resultName() {
        return Results.findOne({error: false }).name
    },
    resultUrl() {
        return Results.findOne({error: false }).url
    },
    result() {
        result = Results.findOne({error: false}).data
       // console.dir(result.rest)
        return result
    },
    resultPresent() {
        count = Results.find({error: false }).count()
        if (count > 0) {
           // console.log('results are present: '+ count)
            return true
        } else {
        return false
        }
    },
    errorPresent() {
        if (Results.find({error: true }).count() > 0) {
            return true;
        }
    },
})

Template.errorShow.helpers({
    errorData() {
        if (Results.find({error: true }).count() > 0) {
            //    console.log('errors in results:')
            //  console.dir(Endpoints.findOne({ type: 'result', error: true }).data)
            errors = Results.findOne({ error: true }).data
            console.dir(errors)
            return errors
        }
    },

})

Template.customEndpoint.events({
    'submit form': function(event) {
        event.preventDefault();
        //console.log('submit clicked')
       // console.log(event.target.customEndpoint.value)
        var uri = event.target.customEndpoint.value + '/'
        var name = 'Custom Endpoint'
        Session.set('resultExpected', true)
        Meteor.call('getData', uri, name)   
    }
})