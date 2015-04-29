// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

Parse.Cloud.job('updatePlanItPurple', function(request, status){
  var newEvents = [];

  function processJson() {
    return Parse.Cloud.httpRequest({
      url: 'http://planitpurple.northwestern.edu/feed/json/1029'}).then(function(httpResponse) {
        var events = JSON.parse(httpResponse.text);


        // get time right now
        var now = new Date(2015,3,16);

        var count = 0;

        // get events in our Parse database
        var query = new Parse.Query(Parse.Object.extend('Events'));
        
        for(i = 0; i < events.length; i++){
          
          // don't add events without location
          if (events[i].centerpoint === null) continue;

          var latlong = events[i].centerpoint.split(',');

          // get modify dates and times
          var createdDate = events[i].create_date.split('-').map(Number);
          var createdDateTime = new Date(createdDate[0], createdDate[1], createdDate[2]);

          if (createdDateTime.toDateString() == now.toDateString()){
            count++;
            var Event = Parse.Object.extend('Events');
            var newEvent = new Event();
            newEvent.set('planitpurpleId', events[i].id);
            newEvent.set('EventName', events[i].title);
            newEvent.set('Comments', events[i].description);
            newEvent.set('EventType', events[i].category_name || '');
            newEvent.set('PosterName', events[i].contact_name || '');
            newEvent.set('Contact', events[i].contact_email || '');
            newEvent.set('Street', events[i].facility_address_1);
            newEvent.set('Room', events[i].address_2 || '');
            newEvent.set('City', events[i].facility_city);
            newEvent.set('State', events[i].facility_state);
            newEvent.set('Lat', Number(latlong[0]));
            newEvent.set('Long', Number(latlong[1]));
            newEvent.set('StartDate', new Date(events[i].eventdate_ical_format));
            newEvent.set('EndDate', new Date(events[i].eventend_ical_format));
            newEvent.set('Vote', Number(0));            
            newEvents.push(newEvent);
          }
        }
      }).then(function () {
        var promise = Parse.Promise.as();
        var oldEvents = [];
        promise = promise.then(function () {
          var duplicates = [];
          var visited = [];
          for (i = 0; i < newEvents.length; i++) { visited[i] = false; }
          // remove any duplicates from this new events list
          for (i = 0; i < newEvents.length; i++)
          {
            for (var j = i + 1; j < newEvents.length; j++)
            {
              if ((newEvents[i].get("EventName") == newEvents[j].get("EventName")) &&
                (newEvents[i].get("StartDate").getDate() == newEvents[j].get("StartDate").getDate()))
              {
                if (visited[j] === false)
                {
                  duplicates.push(newEvents[j]);
                  visited[j] = true;
                }
              }
            }
          }
          for (i = 0 ; i < duplicates.length; i++)
          {
            var index = newEvents.indexOf(duplicates[i]);
            newEvents.splice(index, 1);

          }
          console.log("Number of new events after removing duplicates " + newEvents.length);

          var query = new Parse.Query(Parse.Object.extend('Events'));
          //query.notEqualTo("planitpurpleId", ''); doesn't work for some reason...

          return query.each(function(result) {
            for (var i = 0; i < newEvents.length; i++)
            {
              // get old events that have already been added
              if (result.get("planitpurpleId") == newEvents[i].get("planitpurpleId") &&
                result.get("planitpurpleId"))
              {
                oldEvents.push(newEvents[i]);
                console.log(result.get("planitpurpleId"));
                result.set('planitpurpleId', newEvents[i].get("planitpurpleId"));
                result.set('EventName', newEvents[i].get("EventName"));
                result.set('Comments', newEvents[i].get("Comments"));
                result.set('EventType', newEvents[i].get("EventType"));
                result.set('PosterName', newEvents[i].get("PosterName"));
                result.set('Contact', newEvents[i].get("Contact"));
                result.set('Street', newEvents[i].get("Street"));
                result.set('Room', newEvents[i].get("Room"));
                result.set('City', newEvents[i].get("City"));
                result.set('State', newEvents[i].get("State"));
                result.set('Lat', newEvents[i].get("Lat"));
                result.set('Long', newEvents[i].get("Long"));
                result.set('StartDate', newEvents[i].get("StartDate"));
                result.set('EndDate', newEvents[i].get("EndDate"));
                // update old events;
                result.save();              
              }
            }
          }).then(function () {
            // remove old events from new events list
            for (var i = 0; i < oldEvents.length; i++)
            {
              var index = newEvents.indexOf(oldEvents[i]);
              newEvents.splice(index, 1);
            }
            console.log("Number of new events after removing old " + newEvents.length);
            console.log("Number of old events " + newEvents.length);

            return Parse.Object.saveAll(newEvents).then(function () {
              status.success("Finished adding planitpurple events");    //this line stops the cloud code job before the asynchronous calls can finish
            });
          });
        });
    });
  }
  var promise = Parse.Promise.as();
  promise = promise.then(function () {
    processJson();
  });
});

Parse.Cloud.afterDelete('Events', function(request){
  var query = new Parse.Query(Parse.Object.extend('GuestList'));
  query.equalTo('eventId', request.object.id);
  query.find({
    success: function(guestLists){
      Parse.Object.destroyAll(guestLists, {
        success: function() {
          // The object was deleted from the Parse Cloud.
          console.log('GuestList deleted');
        },
        error: function(error) {
          // The delete failed.
          // error is a Parse.Error with an error code and message.
          console.error('Error deleting guestLists ' + error.code + ': ' + error.message);
        }
      });
    },
    error: function(error){
      console.error('Error finding guestLists ' + error.code + ': ' + error.message);
    }
  });

  query = new Parse.Query(Parse.Object.extend('Vote'));
  query.equalTo('eventId', request.object.id);
  query.find({
    success: function(votes){
      Parse.Object.destroyAll(votes, {
        success: function() {
          // The object was deleted from the Parse Cloud.
          console.log('Vote deleted');
        },
        error: function(error) {
          // The delete failed.
          // error is a Parse.Error with an error code and message.
          console.error('Error deleting vote ' + error.code + ': ' + error.message);
        }
      });
    },
    error: function(error){
      console.error('Error finding votes ' + error.code + ': ' + error.message);
    }
  });
});

Parse.Cloud.job('autodeleteEvents', function(request, status) {
  // Set up to modify event data
  Parse.Cloud.useMasterKey();

  // Get current time
  var now = new Date();

  // Query for all events
  var query = new Parse.Query(Parse.Object.extend('Events'));
  query.each(function(event) {

    var endDateTime = event.get('EndDate');

    if (now.getTime() > endDateTime.getTime()){
      var name = event.get('EventName');
      var entry = 'Event ' + name + ' ended on ' + endDateTime + '. ';
      console.log(entry);

      //*
      event.destroy({
        success: function() {
          // The object was deleted from the Parse Cloud.
          console.log('Event deleted');
        },
        error: function(error) {
          // The delete failed.
          // error is a Parse.Error with an error code and message.
          console.error('Error deleteing event ' + error.code + ': ' + error.message);
        }
      });
      //*/
    }

  }).then(function() {
    // Set the job's success status
    status.success('Deletion completed successfully.');
  }, function(error) {
    // Set the job's error status
    status.error('Uh oh, something went wrong.');
  });
});
