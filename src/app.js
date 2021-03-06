//date and time for main and forecast

let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
let currentDay = days[now.getDay()];
let currentMonth = months[now.getMonth()];
let currentDate = now.getDate();
let currentHour = now.getHours();
let currentMinutes = now.getMinutes();
let currentYear = now.getFullYear();

let p = document.querySelector("p.date-time");
p.innerHTML = `Last updated:</br>${currentDay} - ${currentMonth} ${currentDate} ${currentYear} </br> ${currentHour}:${currentMinutes}`;

function timeConversion(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function forecastFormatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"]
  return weekDay[day];
}

// forecast weather 

function displayWeatherForecast(response) {
  let fetchedForecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<h2>
  Forecast for the next 6 days
  </h2>
  <hr>
  <div class ="row">`;
  fetchedForecast.forEach(function (forecastDay, index) {
    if (index < 6){
      forecastHTML = forecastHTML + `
  <div class="container day-block">
        <div class="row day-1 weather-card">
          <div class="col-3 weather-icon">
            <img src= "http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="weather icon" class="img2"> 
          </div>
          <div class="col-6 minmax weather-forecast-temperature" id="minmax-forecast">
            <span class="weather-forecast-mintemp" id="mintemp">${Math.round(forecastDay.temp.min)}??</span> | <span class="weather-forecast-maxtemp" id ="maxtemp">${Math.round(forecastDay.temp.max)}??</span>
          </div>
          <div class="col-3 weather-forecast-day">
            ${forecastFormatDate(forecastDay.dt)}
          </div>
        </div>
      </div>
  `;
  }
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML;
}

function fetchForecastApi(coordinates) {
  let apiKey = "dc61646fab1512ff70fdca30d4a70361";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  axios.get(apiUrl).then(displayWeatherForecast);
}

// main temperature and info

function showTemperature(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  let roundedTemperature = Math.round(response.data.main.temp);
  document.querySelector("#temperature").innerHTML = `${roundedTemperature}?? C`;
  let minimumTemperature = Math.round(response.data.main.temp_min);
  let maximumTemperature = Math.round(response.data.main.temp_max);
  let minMaxTemp = document.querySelector("#minmax");
  minMaxTemp.innerHTML = `min ${minimumTemperature}?? C - max ${maximumTemperature}?? C`;
  let windSpeed = Math.round(response.data.wind.speed);
  let weatherCondition = response.data.weather[0].description;
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = `Wind speed: ${windSpeed} km/h </br> ${weatherCondition}`;
  let sunriseTime = response.data.sys.sunrise * 1000;
  let sunsetTime = response.data.sys.sunset * 1000;
  let sunTime = document.querySelector("#sunrise-sunset");
  sunTime.innerHTML = `sunrise ${timeConversion(sunriseTime)} (UTC+2) </br> sunset ${timeConversion(sunsetTime)} (UTC+2)`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  celsiusTemperature = response.data.main.temp;
  minCelsiusTemperature = response.data.main.temp_min;
  maxCelsiusTemperature = response.data.main.temp_max;

  fetchForecastApi(response.data.coord);
  displayWeatherForecast(response);
}

function search(city) {
  let apiKey = "dc61646fab1512ff70fdca30d4a70361";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function handleLocation(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  search(city);
}

let form = document.querySelector("#city-form");
form.addEventListener("submit", handleLocation);


// adding Madrid as the primary city searched not to have an empty value

search("Madrid");
