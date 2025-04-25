//const API_KEY = "fb20f470da204f46b2495101252802"; // WeatherAPI.com API key
const API_KEY = "1dec1896e77e4da5b0c195326251603"; // WeatherAPI.com API key
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const currentWeatherIcon = document.getElementById("current-weather-icon");
const currentWeatherDetails = document.getElementById(
  "current-weather-details"
);
const forecastDays = document.getElementById("forecast-days");
const locationHeader = document.getElementById("location-header");

// Weather Icon Mapping
const weatherIcons = {
  1000: "sunny.png", // Clear
  1003: "PartlyCloudy.png", // Partly cloudy
  1006: "cloudy.png", // Cloudy
  1009: "cloudy.png", // Overcast
  1030: "cloudy.png", // Mist
  1063: "Rainy.png", // Patchy rain
  1066: "Rainy.png", // Patchy snow
  1069: "Rainy.png", // Patchy sleet
  1072: "Rainy.png", // Patchy freezing drizzle
  1087: "Rainy.png", // Thundery outbreaks
  1114: "Rainy.png", // Blowing snow
  1117: "Rainy.png", // Blizzard
  1135: "cloudy.png", // Fog
  1147: "cloudy.png", // Freezing fog
  1150: "Rainy.png", // Patchy light drizzle
  1153: "Rainy.png", // Light drizzle
  1168: "Rainy.png", // Freezing drizzle
  1171: "Rainy.png", // Heavy freezing drizzle
  1180: "Rainy.png", // Patchy light rain
  1183: "Rainy.png", // Light rain
  1186: "Rainy.png", // Moderate rain
  1189: "Rainy.png", // Heavy rain
  1192: "Rainy.png", // Light freezing rain
  1195: "Rainy.png", // Moderate or heavy freezing rain
  1198: "Rainy.png", // Light sleet
  1201: "Rainy.png", // Moderate or heavy sleet
  1204: "Rainy.png", // Light snow
  1207: "Rainy.png", // Moderate or heavy snow
  1210: "Rainy.png", // Patchy light snow
  1213: "Rainy.png", // Light snow
  1216: "Rainy.png", // Moderate snow
  1219: "Rainy.png", // Heavy snow
  1222: "Rainy.png", // Ice pellets
  1225: "Rainy.png", // Light ice pellets
  1237: "Rainy.png", // Moderate or heavy ice pellets
  1240: "Rainy.png", // Light rain shower
  1243: "Rainy.png", // Moderate or heavy rain shower
  1246: "Rainy.png", // Torrential rain shower
  1249: "Rainy.png", // Light sleet showers
  1252: "Rainy.png", // Moderate or heavy sleet showers
  1255: "Rainy.png", // Light snow showers
  1258: "Rainy.png", // Moderate or heavy snow showers
  1261: "Rainy.png", // Light showers of ice pellets
  1264: "Rainy.png", // Moderate or heavy showers of ice pellets
  1273: "Rainy.png", // Patchy light rain with thunder
  1276: "Rainy.png", // Moderate or heavy rain with thunder
  1279: "Rainy.png", // Patchy light snow with thunder
  1282: "Rainy.png", // Moderate or heavy snow with thunder
};

// Fetch Weather Data
async function fetchWeatherData(city) {
  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
    );
    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5`
    );
    const forecastData = await forecastResponse.json();

    // Update UI
    updateCurrentWeather(currentData);
    updateForecast(forecastData);

    // Update Location Header
    locationHeader.textContent = `Current Weather in ${currentData.location.name}, ${currentData.location.country}`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Update Current Weather
function updateCurrentWeather(data) {
  const { location, current } = data;
  const weatherIconCode = current.condition.code; // Get the weather condition code
  const weatherIcon = weatherIcons[weatherIconCode] || "sunny.png"; // Default to sunny.png if no match

  // Update the current weather icon
  currentWeatherIcon.src = `images/${weatherIcon}`;

  // Update the current weather details
  currentWeatherDetails.innerHTML = `
        <p><strong>Location:</strong> ${location.name}, ${location.country}</p>
        <p><strong>Temperature:</strong> ${current.temp_c}°C</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
        <p><strong>Condition:</strong> ${current.condition.text}</p>
        <button class="btn-primary" onclick="viewDetails('${location.name}')">View Details</button>
   `;
   
 }

// Update 5-Day Forecast
function updateForecast(data) {
  const forecastList = data.forecast.forecastday;
  forecastDays.innerHTML = forecastList
    .map((day) => {
      const date = new Date(day.date).toLocaleDateString();
      const weatherIconCode = day.day.condition.code;
      const weatherIcon = weatherIcons[weatherIconCode] || "sunny.png"; // Default to sunny.png if no match

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

// Event Listeners
searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

// Initial Load (Default City: Dhaka, Bangladesh)
fetchWeatherData("Dhaka");

