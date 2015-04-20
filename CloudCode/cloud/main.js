
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
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

      var year = e.get('Year'),
      		month = e.get('Month'),
      		endDateTime = e.get('EndDate');

      var dateTime = new Date(endDateTime.toUTCString());

      
      counter += 1;

      console.log('Event ' + counter + ' ends at ' + dateTime);
      //console.log('toString: ' + toString);
      //console.log('toISOString: ' + toISOString);
      //console.log('toUTCString: ' + toUTCString);
      //console.log('Time now: ' + now);
  }).then(function() {
    // Set the job's success status
    status.success("Deletion completed successfully.");
  }, function(error) {
    // Set the job's error status
    status.error("Uh oh, something went wrong.");
  });
});
