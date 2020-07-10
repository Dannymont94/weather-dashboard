var citySearchFormEl = document.querySelector("#city-search-form");
var citySearchInputEl = document.querySelector("#city-search-input");
var searchHistoryListEl = document.querySelector("#city-search-history");
var forecastContainerEl = document.querySelector(".forecast-container");
var scrollDivEl = document.querySelector("#scroll-to-div");
var cityAndDateEl = document.querySelector("#city-and-date");
var currentForecastIconEl = document.querySelector("#current-forecast-icon");
var currentTempEl = document.querySelector("#current-temp");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUviPEl = document.querySelector("#current-uvi-p");
var currentUviSpanEl = document.querySelector("#current-uvi-span");
var futureForecastContainerEl = document.querySelector("#future-forecast-container");
var futureForecastTitleEl = document.querySelector("#future-forecast-title");

function formSubmitHandler(event) {
    event.preventDefault();
    var searchTerm = citySearchInputEl.value.trim();
    citySearchFormEl.reset();
    getLocationData(searchTerm);
}

function searchHistoryClickHandler(event) {
    getLocationData(event.target.textContent);
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
    forecastContainerEl.setAttribute("style", "display:flex");
    // current weather data info needed: city name, date, forecast icon, temp, humidity, wind speed, and uv index
    var currentDate = convertDate(current.dt);
    var currentForecast = current.weather[0].description;
    var currentForecastIcon = getIconUrl(current.weather[0].icon);
    var currentTemp = current.temp + String.fromCharCode(176) + "F";
    var currentHumidity = current.humidity + "%";
    var currentWindSpeed = current.wind_speed + " MPH";
    var currentUvi = current.uvi;

    cityAndDateEl.textContent = cityName + " (" + currentDate + ")";
    currentForecastIconEl.setAttribute("src", currentForecastIcon);
    currentForecastIconEl.setAttribute("alt", `Forecast is ${currentForecast}`)
    currentTempEl.textContent = "Temperature: " + currentTemp;
    currentHumidityEl.textContent = "Humidity: " + currentHumidity;
    currentWindSpeedEl.textContent = "Wind Speed: " + currentWindSpeed;
    currentUviPEl.textContent = "UV Index:";
    currentUviSpanEl.textContent = currentUvi;
    renderUviColor(currentUvi);

    // future weather data starts at daily[1]. dashboard only loads 5 days of info. info needed: date, forecast icon, temp, humidity
    futureForecastContainerEl.innerHTML = "";
    futureForecastTitleEl.textContent = "5-Day Forecast:";
    for (let i = 1; i < 6; i++) {
        var futureForecastDivEl = document.createElement("div");
        futureForecastDivEl.classList.add("future-forecast");

        var futureDate = convertDate(daily[i].dt);
        var futureForecast = daily[i].weather[0].description;
        var futureForecastIcon = getIconUrl(daily[i].weather[0].icon);
        var futureTemp = daily[i].temp.day + String.fromCharCode(176) + "F";
        var futureHumidity = daily[i].humidity + "%";

        var futureDateEl = document.createElement("h3");
        futureDateEl.textContent = futureDate;
        futureForecastDivEl.appendChild(futureDateEl);

        var futureForecastIconEl = document.createElement("img");
        futureForecastIconEl.setAttribute("src", futureForecastIcon);
        futureForecastIconEl.setAttribute("alt", `Forecast is ${futureForecast}`);
        futureForecastDivEl.appendChild(futureForecastIconEl);

        var futureTempEl = document.createElement("p");
        futureTempEl.textContent = "Temp: " + futureTemp;
        futureForecastDivEl.appendChild(futureTempEl);

        var futureHumidityEl = document.createElement("p");
        futureHumidityEl.textContent = "Humidity: " + futureHumidity;
        futureForecastDivEl.appendChild(futureHumidityEl);

        futureForecastContainerEl.appendChild(futureForecastDivEl);
    }
    scrollDivEl.scrollIntoView();

}

function renderUviColor(uvIndex) {
    if (uvIndex <= 2) {
        // set green background if low uv index
        currentUviSpanEl.setAttribute("style", "background:rgb(95, 194, 71)");
    } else if (uvIndex < 4.5) {
        // set yellow background if moderate uv index
        currentUviSpanEl.setAttribute("style", "background:rgb(247,228,1)");
    } else if (uvIndex < 8) {
        // set orange background if high uv index
        currentUviSpanEl.setAttribute("style", "background:rgb(249,89,1)");
        // set red background if extreme uv index
    } else {
        currentUviSpanEl.setAttribute("style", "background:rgb(217,0,17)");
    } 
}

function convertDate(timestamp) {
    return (new Date(timestamp * 1000)).toLocaleString().split(",")[0];
}

function getIconUrl(iconCode){
    return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

// when a city is searched, save in localStorage and add to search history. search history filters out duplicates and holds up to 10 city names.
function saveSearchHistory(cityName) {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.push(cityName);
    searchHistory = searchHistory.filter(function(value, index, array) {
        return array.indexOf(value) === index
    });
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(1, 11);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

// when page is loaded or new city is added to searchHistory, turn searchHistory from localStorage into clickable <li> elements that load weather data into the dashboard
function loadSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryListEl.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
        var searchHistoryListItemEl = document.createElement("li");
        searchHistoryListItemEl.textContent = searchHistory[i];

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

loadSearchHistory();
citySearchFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryListEl.addEventListener("click", searchHistoryClickHandler);