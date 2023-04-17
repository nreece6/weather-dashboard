var city = ""

var cityFormEl = document.querySelector('#city-form')
var searchCity = document.querySelector("#searchCity")
var searchButton = document.querySelector("#search-button")
var clearButton = document.querySelector("#clear-history")
var currentCity = document.querySelector("#current-city")
var currentTemperature = document.querySelector("#current-temp")
var currentHumidty= document.querySelector("#current-humidity")
var currentWSpeed=document.querySelector("#current-wind")
var historyContainer = document.querySelector("#search-history")
var savedCity = []

var APIKey = "7d3239e0803b7b1e6b36c67c4156c71b"

var citySearchHandler = function (event) {
    event.preventDefault()

    city = searchCity.value
    console.log(city)
    if (city) {
        getWeather(city)
        getForecast(city)
        searchCity.textContent = ''
    } else {
        alert('Please enter a valid city')
    }
}


// current weather
var getWeather = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            console.log(response) 
                response.json().then(function (data) {
                    console.log(data)
                    
                    var dt = new Date(data.dt*1000).toDateString()
                    var weathericon= data.weather[0].icon;
                    var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png"
                    var iconImgEl = document.createElement('img')
                    iconImgEl.src = iconurl

                    currentCity.textContent = data.name + " " + dt
                    console.log(currentCity)

                    currentTemperature.textContent = " " + ((data.main.temp-273.5)*1.8+32).toFixed(2) + "F"
                    currentHumidty.textContent = " " + data.main.humidity + "%"
                    currentWSpeed.textContent = " " + data.wind.speed + "MPH"

                    currentCity.append(iconImgEl)
                    })           
        } else {
            alert ('Error' + response.statusText)
        }
    })
}
// 5 day forecast
var getForecast = function (city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + APIKey

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
            console.log(response)
            response.json().then(function (data) {
                console.log(data)


                // credit to sahiljanbandhu for this for loop
                for (i = 0; i < 5; i++) {
                    var date = new Date((data.list[((i+1)*8)-1].dt)*1000).toDateString()
                    var iconcode= data.list[((i+1)*8)-1].weather[0].icon;
                    var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png"
                    var tempK= data.list[((i+1)*8)-1].main.temp
                    var tempF=(((tempK-273.5)*1.80)+32).toFixed(2)
                    var humidity= data.list[((i+1)*8)-1].main.humidity
                    var windSpeed = data.list[((i+1)*8)-1].wind.speed

                    $("#fDate"+i).html(" " + date)
                    $("#fImg"+i).html(" " +"<img src="+iconurl+">")
                    $("#fTemp"+i).html(" " + tempF+"&#8457")
                    $("#fHumidity"+i).html(" " + humidity+"%")
                    $("#fWind" + i).html(" " + windSpeed + " MPH")
                }
            })
        }
    })
}
//none of this is working :(

// should amend a list item to the search history ul element with the searched city as the text
function addToList(city){
    var listEl= $("<li>"+city.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",city.toUpperCase());
    historyContainer.append(listEl);
}

// if clicked on past searches, should run a weather and forecast search for the city
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        getForecast(city)
        getWeather(city)
    }
}

function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1]
        getWeather(city)
        getForecast(city)
    }
}

// should clear history once it is populated
function clearHistory(event){
    event.preventDefault();
    sCity=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}

cityFormEl.addEventListener('submit', citySearchHandler)
$("#search-button").on("click", citySearchHandler)
$(document).on("click",invokePastSearch)
$(window).on("load",loadlastCity)
$("#clear-history").on("click",clearHistory)