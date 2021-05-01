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

//convert temperature ºC - ºF
function convertC(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = "30º C";
}

function convertF(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = "86º F";
}
let fahrenheit = document.querySelector("#temp-link-F");
fahrenheit.addEventListener("click", convertF);

let celsius = document.querySelector("#temp-link-C");
celsius.addEventListener("click", convertC);

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

function showTemperature(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  let roundedTemperature = Math.round(response.data.main.temp);
  document.querySelector("#temperature").innerHTML = `${roundedTemperature}º C`;
  let minimumTemperature = Math.round(response.data.main.temp_min);
  let maximumTemperature = Math.round(response.data.main.temp_max);
  let minMaxTemp = document.querySelector("#minmax");
  minMaxTemp.innerHTML = `min ${minimumTemperature}º - max ${maximumTemperature}º`;
  //let sunriseTime = response.data.sys.sunrise * 1000;
  //let sunsetTime = response.data.sys.sunset * 1000;
  //let sunTime = document.querySelector("#sunrise-sunset");
  //sunTime.innerHTML = `sunrise ${timeConversion(sunriseTime)} - sunset ${timeConversion(sunsetTime)}`;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
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

search("Madrid");
