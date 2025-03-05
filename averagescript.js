const API_KEY = "fb20f470da204f46b2495101252802"; // WeatherAPI.com API key
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const monthBtn = document.getElementById("month-btn");
const yearBtn = document.getElementById("year-btn");

// Chart.js configuration
const ctx = document.getElementById("lineChart").getContext("2d");
let chart;

// Function to fetch weather data from WeatherAPI.com
const fetchWeatherData = async (location, days) => {
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=${days}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

// Function to process monthly data
const processMonthlyData = (forecastData) => {
  const monthlyTemperatures = forecastData.forecast.forecastday.map((day) => day.day.avgtemp_c);
  const labels = forecastData.forecast.forecastday.map((day) => day.date);
  return { temperatures: monthlyTemperatures, labels };
};

// Function to process yearly data (mock data for demonstration)
const processYearlyData = () => {
  const yearlyTemperatures = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]; // Example yearly data
  const labels = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"];
  return { temperatures: yearlyTemperatures, labels };
};

// Function to create the line chart
const createLineChart = (data, labels) => {
  if (chart) {
    chart.destroy(); // Destroy existing chart
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: data,
          borderColor: "#007BFF",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          fill: true,
          tension: 0.4, // Smooth line
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 40, // Adjust based on your data
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

// Function to update the chart
const updateChart = async (view) => {
  const location = "Everett"; // Replace with your desired location
  if (view === "month") {
    const weatherData = await fetchWeatherData(location, 30); // Fetch 30 days of data
    if (weatherData) {
      const { temperatures, labels } = processMonthlyData(weatherData);
      createLineChart(temperatures, labels);
    }
  } else {
    const { temperatures, labels } = processYearlyData(); // Use mock yearly data
    createLineChart(temperatures, labels);
  }
};

// Event listeners for toggle buttons
monthBtn.addEventListener("click", () => {
  monthBtn.classList.add("active");
  yearBtn.classList.remove("active");
  updateChart("month");
});

yearBtn.addEventListener("click", () => {
  yearBtn.classList.add("active");
  monthBtn.classList.remove("active");
  updateChart("year");
});

// Initialize with monthly data
updateChart("month");