// get location data for city searched by user
function getLocationData(searchTerm) {
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=d6c7088748687d06d3775770026215e2";
    fetch(currentApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
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
                    renderWeatherData(cityName, current, daily);  
                });
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's One Call API Endpoint)")
        });
}

// render all the data from previous functions onto the page
function renderWeatherData(cityName, current, daily) {
    // current weather data info needed: city name, date, forecast icon, temp, humidity, wind speed, and uv index
    var currentDate = convertDate(current.dt);
    var currentForecast = capitalizeWords(current.weather[0].description);
    var currentForecastIcon = getIconUrl(current.weather[0].icon);
    var currentTemperature = current.temp + String.fromCharCode(176) + "F";
    var currentHumidity = current.humidity + "%";
    var currentWindSpeed = current.wind_speed + " MPH";
    var currentUvi = current.uvi;
    console.log(cityName, currentDate, currentForecast, currentForecastIcon, currentTemperature, currentHumidity, currentWindSpeed, currentUvi);

    // future weather data starts at daily[1]. info needed: date, forecast icon, temp, humidity
    for (let i = 1; i < 6; i++) {
        var futureDate = convertDate(daily[i].dt);
        var futureForecast = capitalizeWords(daily[i].weather[0].description);
        var futureForecastIcon = getIconUrl(daily[i].weather[0].icon);
        var futureTemp = daily[i].temp.day + String.fromCharCode(176) + "F";
        var futureHumidity = daily[i].humidity + "%";
        console.log(futureDate, futureForecast, futureForecastIcon, futureTemp, futureHumidity);
    }
}

function convertDate(timestamp) {
    return (new Date(timestamp * 1000)).toLocaleString().split(",")[0];
}

function getIconUrl(iconCode){
    return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

function capitalizeWords(string) {
    return string.replace(/\w\S*/g, function(text){
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
}

// when a city is searched, save in localStorage and add to search history

// when page is loaded, turn city names in local storage into clickable elements that load data into the dashboard

getLocationData("Miami");