import { Template } from 'meteor/templating';
import { Endpoints } from '../imports/getdata'

import './main.html';

// create the mainResults variable which we will fill later

Template.buttons.events({
    'click .getList': function () {
        Meteor.call('getList')
    },
    'click .clearList': function() {
        Meteor.call('clearList')
    }
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
        event.preventDefault()
//        console.log(event.target.value)
        Meteor.call('getData',event.target.value)
  },
});

Template.results.helpers({

    resultCount() {
        return Endpoints.find({ type: 'result', error:false }).count()
    },
    result() {
        result = Endpoints.findOne({ type: 'result', error:false}).data
        console.dir(result.rest)
        return result
    },
    resultPresent() {
        count = Endpoints.find({ type: 'result', error: false }).count()
        if (count > 0) {
            console.log('results are present: '+ count)
            return true
        } else {
        return false
        }
    },
    error() {
        if (Endpoints.find({ type: 'result', error: true }).count() > 0) {
            console.log('errors in results:')
            console.dir(Endpoints.findOne({ type: 'result', error: true }).data)
            return Endpoints.find({ type: 'result', error: true }).fetch().data

        }
    }

})