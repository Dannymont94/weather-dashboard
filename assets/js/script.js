var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchInputEl = document.querySelector("#city-search-input");
var searchHistoryListEl = document.querySelector("#city-search-history");
var cityAndDateEl = document.querySelector("#city-and-date");
var currentForecastEl = document.querySelector("#current-forecast");
var currentForecastIconEl = document.querySelector("#current-forecast-icon");
var currentTempEl = document.querySelector("#current-temp");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUviEl = document.querySelector("#current-uvi");
var futureForecastContainerEl = document.querySelector("#future-forecast-container");

function formSubmitHandler(event) {
    event.preventDefault();
    var searchTerm = citySearchInputEl.value.trim();
    citySearchFormEl.reset();
    getLocationData(searchTerm);
}

// get location data for city searched by user
function getLocationData(searchTerm) {
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=d6c7088748687d06d3775770026215e2";
    fetch(currentApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    saveSearchHistory(data.name);
                    getWeatherData(data.name, data.coord.lat, data.coord.lon);
                });
            } else {
                cityAndDateEl.textContent = "(Error: " + response.statusText + ")";
            }
        })
        .catch(function(error) {
            cityAndDateEl.textContent = "(Unable to connect to OpenWeatherMap)";
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
                cityAndDateEl.textContent = "(Error: " + response.statusText + ")";
            }
        })
        .catch(function(error) {
            cityAndDateEl.textContent = "(Unable to connect to OpenWeatherMap)";
        });
}

// render all the data from previous functions onto the page
function renderWeatherData(cityName, current, daily) {
    // current weather data info needed: city name, date, forecast icon, temp, humidity, wind speed, and uv index
    var currentDate = convertDate(current.dt);
    var currentForecast = capitalizeWords(current.weather[0].description);
    var currentForecastIcon = getIconUrl(current.weather[0].icon);
    var currentTemp = current.temp + String.fromCharCode(176) + "F";
    var currentHumidity = current.humidity + "%";
    var currentWindSpeed = current.wind_speed + " MPH";
    var currentUvi = current.uvi;

    cityAndDateEl.textContent = cityName + " (" + currentDate + ")";
    currentForecastEl.textContent = "Forecast: " + currentForecast;
    currentForecastIconEl.setAttribute("src", currentForecastIcon);
    currentTempEl.textContent = "Temperature: " + currentTemp;
    currentHumidityEl.textContent = "Humidity: " + currentHumidity;
    currentWindSpeedEl.textContent = "Wind Speed: " + currentWindSpeed;
    currentUviEl.textContent = "UV Index: " + currentUvi;

    // future weather data starts at daily[1] and only need 5 days of info. info needed: date, forecast icon, temp, humidity
    for (let i = 1; i < 6; i++) {
        var futureForecastDivEl = document.createElement("div");
        futureForecastDivEl.classList.add("future-forecast");

        var futureDate = convertDate(daily[i].dt);
        var futureForecastIcon = getIconUrl(daily[i].weather[0].icon);
        var futureTemp = daily[i].temp.day + String.fromCharCode(176) + "F";
        var futureHumidity = daily[i].humidity + "%";

        var futureDateEl = document.createElement("h3");
        futureDateEl.textContent = futureDate;
        futureForecastDivEl.appendChild(futureDateEl);

        var futureForecastIconEl = document.createElement("img");
        futureForecastIconEl.setAttribute("src", futureForecastIcon);
        futureForecastDivEl.appendChild(futureForecastIconEl);

        var futureTempEl = document.createElement("p");
        futureTempEl.textContent = "Temp: " + futureTemp;
        futureForecastDivEl.appendChild(futureTempEl);

        var futureHumidityEl = document.createElement("p");
        futureHumidityEl.textContent = "Humidity: " + futureHumidity;
        futureForecastDivEl.appendChild(futureHumidityEl);

        futureForecastContainerEl.appendChild(futureForecastDivEl);
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

// when a city is searched, save in localStorage and add to search history. search history holds up to 10 city names.
function saveSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.push(cityName);
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(1, 11);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// when page is loaded, turn city names in local storage into clickable elements that load data into the dashboard




citySearchFormEl.addEventListener("submit", formSubmitHandler);