//date and time

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

let p = document.querySelector("p.date-time");
p.innerHTML = `${currentDay} - ${currentMonth} ${currentDate} </br> ${currentHour}:${currentMinutes}`;

// show temperature according to city search

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

function displayWeatherForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<h2>
  Forecast for the next 6 days
  </h2>
  <hr>
  <div class ="row">`;
  let days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  days.forEach(function (forecastDay) {
    forecastHTML = forecastHTML + `
  <div class="container day-block">
        <div class="row day-1 weather-card">
          <div class="col-3 weather-icon">
            <img src="media/weather-icon1.png" alt="cloudy weather icon" class="img2"> 
          </div>
          <div class="col-6 minmax weather-forecast-temperature">
            <span class="weather-forecast-mintemp">10º</span> - <span class="weather-forecast-maxtemp">18º</span>
          </div>
          <div class="col-3 weather-forecast-day">
            ${forecastDay}
          </div>
        </div>
      </div>
  `;
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML;
}

function fetchForecast(coordinates) {
  let apiKey = "dc61646fab1512ff70fdca30d4a70361";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  axios.get(apiUrl).then(displayWeatherForecast);

}

function showTemperature(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  let roundedTemperature = Math.round(response.data.main.temp);
  document.querySelector("#temperature").innerHTML = `${roundedTemperature}º C`;
  let minimumTemperature = Math.round(response.data.main.temp_min);
  let maximumTemperature = Math.round(response.data.main.temp_max);
  let minMaxTemp = document.querySelector("#minmax");
  minMaxTemp.innerHTML = `min ${minimumTemperature}º C - max ${maximumTemperature}º C`;
  let sunriseTime = response.data.sys.sunrise * 1000;
  let sunsetTime = response.data.sys.sunset * 1000;
  let sunTime = document.querySelector("#sunrise-sunset");
  sunTime.innerHTML = `sunrise ${timeConversion(sunriseTime)} </br> sunset ${timeConversion(sunsetTime)}`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  celsiusTemperature = response.data.main.temp;
  minCelsiusTemperature = response.data.main.temp_min;
  maxCelsiusTemperature = response.data.main.temp_max;
  
  //let latLocation = response.data.coord.lat;
  //let longLocation = response.data.coord.lon;
  fetchForecast(response.data.coord);
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

function convertF(event) {
  event.preventDefault();
  let farTemp = (celsiusTemperature * 1.8) + 32;
  let roundedTemperature = document.querySelector("#temperature");
  roundedTemperature.innerHTML = Math.round(farTemp) + "º F";
  let minFarTemp = (minCelsiusTemperature *1.8) + 32;
  let maxFarTemp = (maxCelsiusTemperature * 1.8) + 32;
  let minMaxTemp = document.querySelector("#minmax");
  minMaxTemp.innerHTML = `min ${Math.round(minFarTemp)}º F - max ${Math.round(maxFarTemp)}º F`
}

function convertC(event) {
  event.preventDefault();
  let celTemp = ( - 32) * (5 / 9);
  let roundedTemperature = document.querySelector("#temperature");
  roundedTemperature.innerHTML = Math.round(celsiusTemperature) + "º C";
  let minMaxTemp = document.querySelector("#minmax");
  minMaxTemp.innerHTML = `min ${Math.round(minCelsiusTemperature)}º C - max ${Math.round(maxCelsiusTemperature)}º C`
}

let fahrenheit = document.querySelector("#temp-link-F");
fahrenheit.addEventListener("click", convertF);

let celsius = document.querySelector("#temp-link-C");
celsius.addEventListener("click", convertC);

let celsiusTemperature = null;
let minCelsiusTemperature = null;
let maxCelsiusTemperature = null;

search("Madrid");
