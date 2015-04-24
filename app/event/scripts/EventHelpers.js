var EventHelper = (function(){
	var months = [
		'Jan', 
		'Feb', 
		'March', 
		'Apr',
		'May',
		'June',
		'July',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec'];

	return {
		formatEvent: function(event){
			//var hour = dateObj;
			//document.getElementById('test').innerHTML('test');

			// format date and time to human readable string
			var startDate = new Date(event.StartDate.iso);
			var startDateString = this.formatDate(startDate);

			var endDate = new Date(event.EndDate.iso);
			var endDateString = this.formatDate(endDate);



			return event;
		},
		formatDate: function(dateObj){
			var month = months[dateObj.getMonth()];
			var day = dateObj.getDate().toString();
			var year = dateObj.getFullYear().toString();

			return day + ' ' + month + ' ' + year;
		},
		formatTime: function(dateObj){
			
		}
	};
}());