function getWeatherData(searchTerm) {
    var currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&units=imperial&appid=d6c7088748687d06d3775770026215e2";
    fetch(currentApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    console.log("temperature: " + data.main.temp, String.fromCharCode(176) + "F, humidity: " + data.main.humidity + "%, wind speed: " + data.wind.speed + " MPH");
                    getUvIndex(data.coord.lat, data.coord.lon);
                });
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's Current Weather Data Endpoint)");
        });
}

function getUvIndex(lat, lon) {
    var uvApiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=d6c7088748687d06d3775770026215e2";
    fetch(uvApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    console.log("Date", data.date_iso, "UV Index", data.value);
                })
            } else {
                console.log("(Error: " + response.statusText + ")");
            }
        })
        .catch(function(error) {
            console.log("(Unable to connect to OpenWeatherMap's UVI Endpoint)")
        });
}

getWeatherData("atlanta");