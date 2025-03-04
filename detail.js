const API_KEY = "fb20f470da204f46b2495101252802"; // Your WeatherAPI.com key
const BASE_URL = "https://api.weatherapi.com/v1";

// Get city from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get('city');

// DOM Elements
const locationHeader = document.getElementById("location-header");
const weatherIcon = document.getElementById("current-weather-icon");
const detailedWeatherInfo = document.getElementById("detailed-weather-info");

// Fetch weather data for the city passed via URL
async function fetchWeatherDetails(city) {
    try {
        const response = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${city}`
        );
        const data = await response.json();
        updateWeatherDetails(data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Update the details on the page
function updateWeatherDetails(data) {
    const { location, current } = data;
    const weatherIconCode = current.condition.code;
    const iconUrl = `//cdn.weatherapi.com/weather/64x64/day/${weatherIconCode}.png`;

    locationHeader.textContent = `Weather Details for ${location.name}, ${location.country}`;
    weatherIcon.src = iconUrl;

    detailedWeatherInfo.innerHTML = `
        <p><strong>Location:</strong> ${location.name}, ${location.country}</p>
        <p><strong>Temperature:</strong> ${current.temp_c}°C / ${current.temp_f}°F</p>
        <p><strong>Feels Like:</strong> ${current.feelslike_c}°C / ${current.feelslike_f}°F</p>
        <p><strong>Humidity:</strong> ${current.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${current.wind_kph} km/h / ${current.wind_mph} mph</p>
        <p><strong>Wind Direction:</strong> ${current.wind_dir}</p>
        <p><strong>Pressure:</strong> ${current.pressure_mb} mb / ${current.pressure_in} in</p>
        <p><strong>Visibility:</strong> ${current.vis_km} km / ${current.vis_miles} miles</p>
        <p><strong>UV Index:</strong> ${current.uv}</p>
        <p><strong>Cloud Coverage:</strong> ${current.cloud}%</p>
    `;
}

// Load the weather details when the page loads
window.onload = () => {
    if (city) {
        fetchWeatherDetails(city);
    } else {
        console.error("No city specified in URL");
    }
};
