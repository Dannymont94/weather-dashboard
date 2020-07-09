// get location data for city searched by user
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

function getWeatherData(cityName, lat, lon) {
    var weatherDataApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=d6c7088748687d06d3775770026215e2";
        fetch(weatherDataApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function({current, daily}) {
                    console.log(current);
                    // get dates
                    var currentDate = getFormattedDate(current.dt);
                    // current weather data info needed: city name, date, forecast icon, temp, humidity, wind speed, and uv index
                    console.log(
                        "CURRENT" + "\n" + 
                        "City Name: " + cityName + "\n" + 
                        "Today's Date: " + currentDate + "\n" + 
                        "Forecast: " + current.weather[0].main + "\n" + 
                        "Forecast Icon: " + current.weather[0].icon + "\n" +
                        "Temperature: " + current.temp + String.fromCharCode(176) + "F" + "\n" + 
                        "Humidity: " + current.humidity + "%" + "\n" + 
                        "Wind Speed: " + current.wind_speed + " MPH" + "\n" + 
                        "UV Index: " + current.uvi
                        );
                    
                    console.log(daily);
                    // future weather data starts at daily[1]. info needed: date, forecast icon, temp, humidity
                    console.log(
                        "FUTURE" + "\n" + 
                        "Tomorrow's Date: " + getFormattedDate(daily[1].dt) + "\n" + 
                        "Forecast: " + "" + "\n" + 
                        "Forecast Icon: " + "" + "\n" + 
                        "Temperature: " + "" + "\n" + 
                        "Humidity: " + "" + "\n"
                    );
                });
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's One Call API Endpoint)")
        });
}

function getFormattedDate(timestamp) {
    return (new Date(timestamp * 1000)).toLocaleString().split(",")[0];
}

// render all the data from previous functions onto the page

// when a city is searched, save in localStorage and add to search history

// when page is loaded, turn city names in local storage into clickable elements that load data into the dashboard

getLocationData("Atlanta");