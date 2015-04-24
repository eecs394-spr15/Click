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

			var startTimeString = this.formatTime(startDate);
			var endTimeString = this.formatTime(endDate);

			

			return event;
		},
		formatDate: function(dateObj){
			var month = months[dateObj.getMonth()];
			var day = dateObj.getDate();
			var year = dateObj.getFullYear();

			return day + ' ' + month + ' ' + year;
		},
		formatTime: function(dateObj){
			var hour = dateObj.getHours();
			var minutes = dateObj.getMinutes();
			var ampm = hour < 12 ? 'AM' : 'PM';
			hour = hour % 12;
			hour = hour ? hour : 12;
			minutes = minutes < 10 ? '0'+minutes : minutes;

			return hour + ':' + minutes + ' ' + ampm;
		}
	};
}());