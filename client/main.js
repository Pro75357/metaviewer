import { Template } from 'meteor/templating'
import { Endpoints } from '../imports/getdata'
//import { Results } from '../imports/getdata'
  import {Session} from 'meteor/session'

  import './main.html'

// create the mainResults variable which we will fill later

// first declare a variable that will help us with loading/etc.

Session.set('resultExpected', false)
// Now create a new object variable to store our results. Keep it empty for now.
Session.set('results', 'no')

Template.buttons.events({
    'click .reset': function () {
        Meteor.call('reset')
        Session.set('resultExpected', false)
        Session.set('results', 'no')
        alert('Full reset requested')
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
        Session.set('results', 'no') // First, change the session variable to remove the old results screen and allow the loading thing to come back. 
        Session.set('resultExpected', true)
        var keys = JSON.parse(event.target.value) // this is a sad workaround
        // console.dir(keys)
        Meteor.call('getData', keys.uri, keys.name, function (err, res) {
            if (err) {
                console.log(err)
            } else {
                Session.set('results', res)
            }
        })
    },
});

Template.results.helpers({

    resultExpected() {
        return Session.get('resultExpected')
    },
    anythingPresent() {
        if (Session.get('results') == 'no'){
            return false
        } else {
            return true
        }
    },
    resultPresent() {
        if (!Session.get('results').error) {
            return true
        }
    },
    resultName() {
        return Session.get('results').name
    },
    resultUrl() {
        return Session.get('results').url
    },
    result() {
        return Session.get('results').data.data
    },
    raw() {
        return Session.get('results').data
    },
    errorPresent() {
        return Session.get('results').error
    },
    resultString() {
        return JSON.stringify(Session.get('results').data, null, 2)
    }
})

Template.errorShow.helpers({
    htmlError() { // simply checks if there is HTML response content we can display. 
        if (!Session.get('results').data.response.content) {
            return false
        } else {
            return true
        }
    },
    errorData() {
        if (Session.get('results').error == true) {
            errors = Session.get('results').data
            return errors
        }
    },
    errorString() { // if there is no html/content we will just display what we get as a string
        return JSON.stringify(Session.get('results').data, null, 2)
    }
})

Template.customEndpoint.events({
    'submit form': function(event) {
        event.preventDefault();
        Session.set('results', 'no') // First, change the session variable to remove the old results screen and allow the loading thing to come back. 
        Session.set('resultExpected', true)
        //console.log('submit clicked')
       // console.log(event.target.customEndpoint.value)
        var uri = event.target.customEndpoint.value
        if (uri == "") { //if they left the field blank (tried to use the placeholder) - go ahead and use the placeholder url instead
            uri = 'https://open-ic.epic.com/argonaut/api/FHIR/Argonaut'
        }
        var name = 'Custom Endpoint'
        Session.set('resultExpected', true)
        Meteor.call('getData', uri, name, function (err, res) {
            if (err) {
                console.log(err)
            } else {
                Session.set('results', res)
            }
        })
    }
})