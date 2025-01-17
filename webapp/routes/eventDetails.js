var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var request = require("request");
const path = require('path');
var config = require("../config");
// var user={};
var executed = false;
var eventStartDate = "";

router.get('/', function(req, res) {
  if (!executed) {
      executed = true;
      var startDate = new Date();
      var dd = startDate.getDate();
      var mm = startDate.getMonth() + 1;
      var yyyy = startDate.getFullYear();

      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      startDate = dd + '/' + mm + '/' + yyyy;
      eventStartDate = startDate;

      var url1 = config.rest_base_url + "/RegisterServlet";
      console.log("Register User Operation");
      var options = {
        method : 'POST',
        url : url1,
        body : {},
        json : true
      };
      request.post(options, function(err, response, b){
        if (!err) {
          var url2 = config.rest_base_url + "/UpdateEventStartDateServlet";
          console.log("UpdateStartDateEvent Operation");
          var options1 = {
            method : 'POST',
            url : url2,
            body: {"startDate" : eventStartDate},
            json : true
          };
          request.post(options1, function(err1, response1, body1){
            if (!err1) {
              var url3 = config.rest_base_url + "/QueryEventServlet";
              console.log("QueryEvent Operation");
              var options2 = {
                method : 'POST',
                url : url3,
                body: {},
                json : true
              };
              request.post(options2, function(err2, response2, body){
                console.log(body);
                var eventName = body['event_name'];
                var orgDetails = body['org_details'];
                var eventDetails = body['event_details'];
                var eventDate = body['event_start_date'];
                var raisedAmount = body['donated'];
                var amount = body['amount'];
                var goalReachedPrecentage = (raisedAmount/amount)*100
                var eventDuration = body['event_duration'];
                res.render( 'eventDetails', {eventName: eventName, orgDetails: orgDetails, eventDetails: eventDetails, raisedAmount: raisedAmount, amount: amount, goalReachedPrecentage: goalReachedPrecentage, eventDuration: eventDuration, eventDate:eventDate});
              });
            }
          });
        }
      });
    } else {
      var url1 = config.rest_base_url + "/RegisterServlet";
      console.log("Register User Operation");
      var options = {
            method : 'POST',
            url : url1,
            body : {},
            json : true
          };
      request.post(options, function(err, response1, body1){
        if (!err) {
          var url = config.rest_base_url + "/QueryEventServlet";
          console.log("QueryEvent Operation");
          var options1 = {
            method : 'POST',
            url : url,
            body: {},
            json : true
          };
          request.post(options1, function(error, response, body){
            console.log(body);
            var eventName = body['event_name'];
            var orgDetails = body['org_details'];
            var eventDetails = body['event_details'];
            var eventDate = body['event_start_date'];
            var raisedAmount = body['donated'];
            var amount = body['amount'];
            var goalReachedPrecentage = (raisedAmount/amount)*100
            var eventDuration = body['event_duration'];
            res.render( 'eventDetails', {eventName: eventName, orgDetails: orgDetails, eventDetails: eventDetails, raisedAmount: raisedAmount, amount: amount, goalReachedPrecentage: goalReachedPrecentage, eventDuration: eventDuration, eventDate:eventDate});
          });
        }
       // res.render( 'eventDetails', {raisedAmount: 0, quantity: 10000, goalReachedPrecentage: 0, eventDuration: 20, date:"13-07-2019"});
      });
    }
});

module.exports = router;
