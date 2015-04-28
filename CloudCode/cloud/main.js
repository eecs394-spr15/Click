
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
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
  var Event = Parse.Object.extend('Events');
  var query = new Parse.Query(Event);
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
