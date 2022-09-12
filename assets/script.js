var formEl = document.querySelector('#form')
var textinputEl = document.querySelector('#cityinput')
var appID = "a5e8b6f890ce08796c7125320b836ba0"
var historyList = JSON.parse(localStorage.getItem("history")) || []

formEl.addEventListener("submit", function(event) {
    event.preventDefault()

    var usercity = textinputEl.value
    getCoordinates(usercity);
})


function getCoordinates(usercity){
fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${usercity}&limt=1&appid=${appID}`)
    .then(function (response) {
    return response.json();
})
    .then(function (data) {
    console.log(data);
    var lat = data[0].lat
    var lon = data[0].lon
    var name = data[0].name
    getWeather(lat,lon)
    saveLocalStorage(name)
});
}

function getWeather(lat,lon){
    console.log(lat,lon,appID)
    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${appID}`)
    .then(function (response) {
        return response.json();
    })
        .then(function (data) {
        console.log(data);
        })
    }

function saveLocalStorage(name){
    historyList.push(name)
    localStorage.setItem('history', JSON.stringify(historyList))
}
    localStorage.getItem(historyList)