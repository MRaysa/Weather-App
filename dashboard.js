const API_KEY = "fb20f470da204f46b2495101252802"; //  WeatherAPI.com API key connect
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const currentWeatherIcon = document.getElementById("current-weather-icon");
const currentWeatherDetails = document.getElementById("current-weather-details");
const forecastDays = document.getElementById("forecast-days");
const locationHeader = document.getElementById("location-header"); 



// Weather Icon Mapping
const weatherIcons = {
  "1000": "sunny.png", 
  "1003": "PartlyCloudy.png", 
  "1006": "cloudy.png",
  "1009": "cloudy.png", 
  "1030": "cloudy.png", 
  "1063": "Rainy.png", 
  "1066": "Rainy.png", 
  "1069": "Rainy.png", 
  "1072": "Rainy.png", 
  "1087": "Rainy.png", 
  "1114": "Rainy.png", 
  "1117": "Rainy.png", 
  "1135": "cloudy.png", 
  "1147": "cloudy.png", 
  "1150": "Rainy.png", 
  "1153": "Rainy.png", 
  "1168": "Rainy.png", 
  "1171": "Rainy.png", 
  "1180": "Rainy.png", 
  "1183": "Rainy.png", 
  "1186": "Rainy.png", 
  "1189": "Rainy.png", 
  "1192": "Rainy.png", 
  "1195": "Rainy.png", 
  "1198": "Rainy.png", 
  "1201": "Rainy.png", 
  "1204": "Rainy.png", 
  "1207": "Rainy.png", 
  "1210": "Rainy.png", 
  "1213": "Rainy.png", 
  "1216": "Rainy.png", 
  "1219": "Rainy.png", 
  "1222": "Rainy.png", 
  "1225": "Rainy.png", 
  "1237": "Rainy.png", 
  "1240": "Rainy.png", 
  "1243": "Rainy.png", 
  "1246": "Rainy.png", 
  "1249": "Rainy.png", 
  "1252": "Rainy.png", 
  "1255": "Rainy.png", 
  "1258": "Rainy.png", 
  "1261": "Rainy.png", 
  "1264": "Rainy.png", 
  "1273": "Rainy.png", 
  "1276": "Rainy.png", 
  "1279": "Rainy.png", 
  "1282": "Rainy.png", 
};

// Fetch Weather Data
async function fetchWeatherData(city) {
  try {
   
    const currentResponse = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
    );
    const currentData = await currentResponse.json();

    
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`
    );
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);

    locationHeader.textContent = `Current Weather in ${currentData.location.name}, ${currentData.location.country}`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Update Current Weather
function updateCurrentWeather(data) {
  const { location, current } = data;
  const weatherIconCode = current.condition.code; 
  const weatherIcon = weatherIcons[weatherIconCode] || "sunny.png"; 

  currentWeatherIcon.src = `images/${weatherIcon}`;


  currentWeatherDetails.innerHTML = `
    <p><strong>Location:</strong> ${location.name}, ${location.country}</p>
    <p><strong>Temperature:</strong> ${current.temp_c}°C</p>
    <p><strong>Humidity:</strong> ${current.humidity}%</p>
    <p><strong>Condition:</strong> ${current.condition.text}</p>
    <button class="btn-primary" onclick="viewDetails('${location.name}')">View Details</button>
  `;
  
}
function viewDetails(city) {
  // Navigate to the detail page with the city name as a query parameter
  window.location.href = `details.html?city=${encodeURIComponent(city)}`;
}

// Update 5-Day Forecast
function updateForecast(data) {
  const forecastList = data.forecast.forecastday;
  forecastDays.innerHTML = forecastList
    .map((day) => {
      const date = new Date(day.date).toLocaleDateString();
      const weatherIconCode = day.day.condition.code;
      const weatherIcon = weatherIcons[weatherIconCode] || "sunny.png"; 

      return `
        <div class="forecast-day">
          <div class="weather-icon">
            <img src="images/${weatherIcon}" alt="${day.day.condition.text}">
          </div>
          <p><strong>${date}</strong></p>
          <p>${day.day.avgtemp_c}°C</p>
          <p>${day.day.condition.text}</p>
        </div>
      `;
    })
    .join("");
}


searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

// Initial Load (Default City: Dhaka, Bangladesh)
fetchWeatherData("Dhaka");

// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});