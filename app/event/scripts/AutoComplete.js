var states = [
  "ALABAMA" ,
  "AL",
  "ALASKA",  
  "AK",
  "ARIZONA", 
  "AZ",
  "ARKANSAS",  
  "AR",
  "CALIFORNIA",  
  "CA",
  "COLORADO",  
  "CO",
  "CONNECTICUT", 
  "CT",
  "DELAWARE",  
  "DE",
  "FLORIDA", 
  "FL",
  "GEORGIA", 
  "GA",
  "HAWAII",  
  "HI",
  "IDAHO", 
  "ID",
  "ILLINOIS",  
  "IL",
  "INDIANA", 
  "IN",
  "IOWA",  
  "IA",
  "KANSAS",  
  "KS",
  "KENTUCKY",  
  "KY",
  "LOUISIANA", 
  "LA",
  "MAINE", 
  "ME",
  "MARYLAND",  
  "MD",
  "MASSACHUSETTS", 
  "MA",
  "MICHIGAN",  
  "MI",
  "MINNESOTA", 
  "MN",
  "MISSISSIPPI", 
  "MS",
  "MISSOURI",  
  "MO",
  "MONTANA", 
  "MT",
  "NEBRASKA",  
  "NE",
  "NEVADA",  
  "NV",
  "NEW HAMPSHIRE", 
  "NH",
  "NEW JERSEY",  
  "NJ",
  "NEW MEXICO",  
  "NM",
  "NEW YORK",  
  "NY",
  "NORTH CAROLINA",  
  "NC",
  "NORTH DAKOTA",  
  "ND",
  "OHIO",  
  "OH",
  "OKLAHOMA",  
  "OK",
  "OREGON",  
  "OR",
  "PENNSYLVANIA",  
  "PA",
  "RHODE ISLAND",  
  "RI",
  "SOUTH CAROLINA",  
  "SC",
  "SOUTH DAKOTA",  
  "SD",
  "TENNESSEE", 
  "TN",
  "TEXAS", 
  "TX",
  "UTAH",  
  "UT",
  "VERMONT", 
  "VT",
  "VIRGINIA",  
  "VA",
  "WASHINGTON",  
  "WA",
  "WEST VIRGINIA", 
  "WV",
  "WISCONSIN", 
  "WI",
  "WYOMING", 
  "WY"
];

//set the date input as current day, set starttime as right now, set endtime as hour from now
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

Date.prototype.toStartTimeInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(11,13) + ":00:00";
});

Date.prototype.toEndTimeInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset() + 60);
  return local.toJSON().slice(11,13) + ":00:00";
});

Date.prototype.toTimeInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(11,19);
});

