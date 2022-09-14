var formEl = document.querySelector('#form')
var textinputEl = document.querySelector('#cityinput')
var appID = "a5e8b6f890ce08796c7125320b836ba0"
var historyList = JSON.parse(localStorage.getItem("history")) || []
var searchHistoryEl = document.querySelector('#search-history')
var resultsEl = document.querySelector('#results')

formEl.addEventListener("submit", function(event) {
    if (!textinputEl.value){
        return
    }
    event.preventDefault()

    var usercity = textinputEl.value.trim()
    getCoordinates(usercity);
    textinputEl.value = ""
})


function getCoordinates(usercity){
fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${usercity}&limt=1&appid=${appID}`)
    .then(function (response) {
    return response.json();
})
    .then(function (data) {
    console.log(data);
    var lat = data[0].lat
    var lon = data[0].lon
    var name = data[0].name
    getWeather(lat,lon)
    saveLocalStorage(usercity)
});
}

function getWeather(lat,lon){
    console.log(lat,lon,appID)
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${appID}`)
    .then(function (response) {
        return response.json();
    })
    .then((data)=>{
    console.log(data);
    document.getElementById('temp').textContent = results.object.list.main.temp
    document.getElementById('wind').textContent = results.object.list.wind
    document.getElementById('humidity').textContent = results.object.list.main.humidity
    document.getElementById('weather').textContent = results.object.list.weather
}).catch((error)=>{
    console.log(error);
});
}


function saveLocalStorage(name){
    if (historyList.indexOf(name) !== -1){
        return
    }
    historyList.push(name)
    localStorage.setItem('history', JSON.stringify(historyList))
    renderSearchHistory()
}
    
function getSearchHistory(){
    let searchHistory = localstorage.getItem('history')
    if (searchHistory) {
        historyList = JSON.parse(searchHistory)
    }
    renderSearchHistory()
}

function renderSearchHistory(){
    searchHistoryEl.innerHTML = ""
    for (var i = 0; i < historyList.length; i++){
        var btn = document.createElement('button')
        btn.setAttribute('type', 'button')
        btn.setAttribute("data-search", historyList[i])
        btn.classList.add('btn-history')
        btn.textContent = historyList[i]
        searchHistoryEl.append(btn)
    }
}

function handleSearchHistory(e){
    if (!e.target.matches('.btn-history')){
        return;
    }
    var btn = e.target
    var search = btn.getAttribute('data-search')
    getCoordinates(search)
}

renderSearchHistory()

searchHistoryEl.addEventListener('click', handleSearchHistory)