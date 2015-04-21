
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

Parse.Cloud.job('autodeleteEvents', function(request, status) {
	// Set up to modify event data
  Parse.Cloud.useMasterKey();
  // Counter for number of events
  var counter = 0;

  // Get current time
  var now = new Date();

  // Query for all events
  var Event = Parse.Object.extend('Events');
  var query = new Parse.Query(Event);
  query.each(function(e) {

      var endDateTime = e.get('EndDate');

      counter += 1;

      if (now.getTime() > endDateTime.getTime()){
      	var name = e.get('EventName');
      	var entry = 'Event ' + name + ' ended on ' + endDateTime + '. ';
      	e.destroy({
				  success: function(myObject) {
				    // The object was deleted from the Parse Cloud.
				    entry += 'It has been deleted from the Cloud.';
				    console.log(entry);
				  },
				  error: function(myObject, error) {
				    // The delete failed.
				    // error is a Parse.Error with an error code and message.
				  	entry += 'Error on deletion. '
				  	console.log(entry);
				  }
				});
      }

      /*var str = 'Event ' + counter + ' ends at ' + endDateTime + '. ';
      if (now.getTime() > endDateTime.getTime()){
      	str += 'Already ended!';
      }
      console.log(str);*/
      


  }).then(function() {
    // Set the job's success status
    status.success('Deletion completed successfully.');
  }, function(error) {
    // Set the job's error status
    status.error('Uh oh, something went wrong.');
  });
});
