var formEl = document.querySelector('#form')
var textinputEl = document.querySelector('#cityinput')
var appID = "a5e8b6f890ce08796c7125320b836ba0"
var historyList = JSON.parse(localStorage.getItem("history")) || []
var searchHistoryEl = document.querySelector('#search-history')
var resultsEl = document.querySelector('#results')

formEl.addEventListener("submit", function (event) {
    if (!textinputEl.value) {
        return
    }
    event.preventDefault()

    var usercity = textinputEl.value.trim()
    getCoordinates(usercity);
    textinputEl.value = ""
})


function getCoordinates(usercity) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${usercity}&limt=1&appid=${appID}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat
            var lon = data[0].lon
            var name = data[0].name
            getWeather(lat, lon)
            saveLocalStorage(usercity)
        });
}

function getWeather(lat, lon) {
    console.log(lat, lon, appID)
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${appID}`)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            document.getElementById('temp').innerHTML = 'Temp: ' + data.list[0].main.temp + "&#176F"
            document.getElementById('wind').innerHTML = 'Wind: ' + data.list[0].wind.speed + ' mph'
            document.getElementById('humidity').innerHTML = 'Humidity: ' + data.list[0].main.humidity + '%'
            document.getElementById('weather').innerHTML = 'Weather: ' + data.list[0].weather[0].description
            var weatherImg = document.getElementById('weatherImg')
            weatherImg.setAttribute('alt', data.list[0].weather[0].description)
            weatherImg.setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png")
            const forecastEl = document.querySelectorAll('.forecast')
            for (let index = 0; index < forecastEl.length; index++) {
                forecastEl[index].innerHTML = ''
                const forecastIndex = index * 8 + 4;
                const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEl[index].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                forecastEl[index].append(forecastWeatherEl);
                // Forecast Temp
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + data.list[forecastIndex].main.temp + " &#176F";
                forecastEl[index].append(forecastTempEl);
                // Forecast Wind
                const forecastWindEl = document.createElement("p");
                forecastWindEl.innerHTML = "Wind: " + data.list[forecastIndex].wind.speed + " MPH";
                forecastEl[index].append(forecastWindEl);
                // Forecast Humidity
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                forecastEl[index].append(forecastHumidityEl);
            }
        }).catch((error) => {
            console.log(error);
        });
}


function saveLocalStorage(name) {
    if (historyList.indexOf(name) !== -1) {
        return
    }
    historyList.push(name)
    localStorage.setItem('history', JSON.stringify(historyList))
    renderSearchHistory()
}

function getSearchHistory() {
    let searchHistory = localstorage.getItem('history')
    if (searchHistory) {
        historyList = JSON.parse(searchHistory)
    }
    renderSearchHistory()
}

function renderSearchHistory() {
    searchHistoryEl.innerHTML = ""
    for (var i = 0; i < historyList.length; i++) {
        var btn = document.createElement('button')
        btn.setAttribute('type', 'button')
        btn.setAttribute("data-search", historyList[i])
        btn.classList.add('btn-history')
        btn.textContent = historyList[i]
        searchHistoryEl.append(btn)
    }
}

function handleSearchHistory(e) {
    if (!e.target.matches('.btn-history')) {
        return;
    }
    var btn = e.target
    var search = btn.getAttribute('data-search')
    getCoordinates(search)
}

renderSearchHistory()

searchHistoryEl.addEventListener('click', handleSearchHistory)