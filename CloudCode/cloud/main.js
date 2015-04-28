// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

Parse.Cloud.job('updatePlanItPurple', function(request, status){
  Parse.Cloud.httpRequest({
    url: 'http://planitpurple.northwestern.edu/feed/json/1029',
    success: function(httpResponse){
      // parse json feed from planitpurple
      var events = JSON.parse(httpResponse.text);

      // get time right now
      var now = new Date(2015,3,16);

      var count = 0;

      // get events in our Parse database
      var query = new Parse.Query(Parse.Object.extend('Events'));

      for(var i = 0; i < events.length; i++){
        
        // don't add events without location
        if (events[i].centerpoint == null) continue;

        var latlong = events[i].centerpoint.split(',');

        // get modify dates and times
        var createdDate = events[i].create_date.split('-').map(Number);
        var createdDateTime = new Date(createdDate[0], createdDate[1], createdDate[2]);

        if (createdDateTime.toDateString() == now.toDateString()){
          count++;
          var Event = Parse.Object.extend('Events');
          var newEvent = new Event();
          newEvent.save({
            planitpurpleId: events[i].id, 
            EventName: events[i].title,
            Comments: events[i].description,
            EventType: events[i].category_name || '',
            PosterName: events[i].contact_name || '',
            Contact: events[i].contact_email || '',
            Street: events[i].facility_address_1,
            City: events[i].facility_city,
            State: events[i].facility_state,
            Lat: Number(latlong[0]),
            Long: Number(latlong[1]),
            StartDate: new Date(events[i].eventdate_ical_format),
            EndDate: new Date(events[i].eventend_ical_format),
            Vote: Number(0),
            Room: ''
            }, {
            success: function() {
              console.log('Event created successfully.');
            },
            error: function(error) {
              console.log('Cannot create event ' + error.code + ': ' + error.message);
            }
          });
        }
        if (events[i].modify_date){
          var modified = events[i].modify_date.split(' ');
          var modifiedDate = modified[0].split('-').map(Number),
              modifiedTime = modified[1].split(':').map(Number);

          var modifiedDateTime = new Date(modifiedDate[0], modifiedDate[1], modifiedDate[2], 
                                    modifiedTime[0], modifiedTime[1], modifiedTime[2]);


          if (modifiedDateTime.toDateString() == now.toDateString()){
            query.equalTo('planitpurpleId', events[i].id);
            query.find({
              success: function(event){
                event[0].set('EventName', events[i].title);
                event[0].set('Comments', events[i].description);
                event[0].set('EventType', events[i].category_name || '');
                event[0].set('PosterName', events[i].contact_name || '');
                event[0].set('Contact', events[i].contact_email || '');
                event[0].set('Street', events[i].facility_address_1);
                event[0].set('City', events[i].facility_city);
                event[0].set('State', events[i].facility_state);
                event[0].set('Lat', Number(latlong[0]));
                event[0].set('Long', Number(latlong[1]));
                event[0].set('StartDate', new Date(events[i].eventdate_ical_format));
                event[0].set('EndDate', new Date(events[i].eventend_ical_format));
              },
              error: function(error){
                console.error('Cannot find event ' + error.code + ': ' + error.message);
              }
            });
          }
        }
      }
      console.log(count + ' events created.');
      status.success('Feed request successful.');
    },
    error: function(httpResponse){
      status.error('Cannot get feed.');
    }
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
