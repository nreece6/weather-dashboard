var city = ""

var searchCity = $("#searchCity")
var searchButton = $("#search-button")
var clearButton = $("#clear-history")
var currentCity = $("#current-city")
var currentTemperature = $("#current-temperature")
var currentHumidty= $("#current-humidity")
var currentWSpeed=$("#current-wind-")
var savedCity = []


function find(c){
    for (var i=0; i<savedCity.length; i++){
        if(c.toUpperCase()===savedCity[i]){
            return -1;
        }
    }
    return 1;
}


var APIKey = "7d3239e0803b7b1e6b36c67c4156c71b"