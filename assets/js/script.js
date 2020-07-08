// get weather data including city name, forecast icon, temperature, humidity, and wind speed
function getLocationData(searchTerm) {
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=d6c7088748687d06d3775770026215e2";
    fetch(currentApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    console.log(data.name, data.coord.lat, data.coord.lon);
                    getWeatherData(data.name, data.coord.lat, data.coord.lon);
                });
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's Current Weather Data Endpoint)");
        });
}

// get date and UV Index data and change element's color depending on value
function getWeatherData(city, lat, lon) {
    var weatherDataApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=d6c7088748687d06d3775770026215e2";
        fetch(weatherDataApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function({current, daily}) {
                    console.log(current);
                    // current weather data
                    console.log(
                        "CURRENT" + "\n" + 
                        "City Name: " + city  + "\n" + 
                        "Forecast: " + current.weather[0].main + "\n" + 
                        "Forecast Icon: " + current.weather[0].icon + "\n" +
                        "Temperature: " + current.temp + String.fromCharCode(176) + "F" + "\n" + 
                        "Humidity: " + current.humidity + "%" + "\n" + 
                        "Wind Speed: " + current.wind_speed + " MPH"
                    );
                    // future weather data
                    console.log("FUTURE")
                });
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's One Call Endpoint)")
        });
}

// render all the data from previous functions onto the page

// when a city is searched, save in localStorage and add to search history

// when page is loaded, turn city names in local storage into clickable elements that load data into the dashboard

getLocationData("Atlanta");