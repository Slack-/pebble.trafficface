// Manages the retreival of traffic information

// XHR request helper
var xhrRequest = function (url, type, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this.responseText);
    };
    xhr.open(type, url);
    xhr.send();
};

// Handles successfully getting the location
function locationSuccess(position) {
    
    // Construct URL
    var url = "???" +
        position.coords.latitude + "&lon=" + position.coords.longitude;

    // Send request to OpenWeatherMap
    xhrRequest(url, 'GET', 
        function(responseText) {
            // responseText contains a JSON object with weather info
            var json = JSON.parse(responseText);
      
            // Temperature in Kelvin requires adjustment
            var motorways = Math.round(json.main.temp - 273.15);
            console.log("Motorways are " + motorways);
      
            // Conditions
            var delays = json.weather[0].main;      
            console.log("Delays are " + delays);
            
            // Incidents
            var incidents = 
            
            // Assemble dictionary using our keys
            var dictionary = {
                "KEY_MOTORWAYS": motorways,
                "KEY_DELAYS": delays
            };
            
            // Send to Pebble
            Pebble.sendAppMessage(dictionary,
                function(e) {
                    console.log("Weather info sent to Pebble successfully.");
                },
                function(e) {
                    console.log("Error sending weather info to Pebble.");
                }
            );
        }      
    );
}

// Handles an error in getting the location
function locationError(error) {
    console.log("Error requesting location.");
}

// Gets the weather
function getTraffic() {
    navigator.geolocation.getCurrentPosition(
        locationSuccess,
        locationError,
        {timeout: 15000, maximumAge: 60000}
    );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready', 
    function(e) {
        console.log("PebbleKit JS ready.");
        
        // Get the initial weather
        getTraffic();
    }
);

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
    function(e) {
        console.log("AppMessage received.");
        getTraffic();
    }                     
);
