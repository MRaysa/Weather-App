const CONFIG = {
    apiKey: '04994a992d9d9276534eb3a83ce9cf99', // REPLACE THIS
    gridSpacing: 2, // Degrees between data points
    maxRequests: 60, // API rate limit
    requestDelay: 1100 // Delay between batches (ms)
};

// Initialize the map with a clear base layer
const map = L.map('map').setView([20, 0], 2);

// Add tile layer with proper attribution
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// AQI color scale
const aqiColorScale = (aqi) => {
    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#8f3f97'; // Very Unhealthy
    return '#000000'; // Hazardous
};

// Create legend
function createLegend() {
    const legendItems = [
        { color: "#00e400", label: "Good (0-50)" },
        { color: "#ffff00", label: "Moderate (51-100)" },
        { color: "#ff7e00", label: "Unhealthy for Sensitive Groups (101-150)" },
        { color: "#ff0000", label: "Unhealthy (151-200)" },
        { color: "#8f3f97", label: "Very Unhealthy (201-300)" },
        { color: "#000000", label: "Hazardous (301-500)" }
    ];

    const legend = document.getElementById('legend-items');
    legend.innerHTML = '';
    
    legendItems.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<span class="legend-color" style="background-color:${item.color}"></span>${item.label}`;
        legend.appendChild(div);
    });
}

// Convert OpenWeatherMap AQI to standard AQI
function convertToStandardAQI(owmAqi) {
    const scale = {
        1: 25,   // Good
        2: 75,   // Fair
        3: 125,  // Moderate
        4: 175,  // Poor
        5: 250   // Very Poor
    };
    return scale[owmAqi] || 0;
}

// Generate grid points for global coverage
function generateGridPoints(spacing) {
    const grid = [];
    for (let lat = -85; lat <= 85; lat += spacing) {
        for (let lon = -180; lon <= 180; lon += spacing) {
            grid.push([lat, lon]);
        }
    }
    return grid;
}

// Fetch AQI data with rate limiting
async function fetchAQIData() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const gridPoints = generateGridPoints(CONFIG.gridSpacing);
        const aqiData = [];
        let requestCount = 0;

        for (const [lat, lon] of gridPoints) {
            requestCount++;
            loading.textContent = `Loading data... (${requestCount}/${gridPoints.length})`;

            // Rate limiting
            if (requestCount % CONFIG.maxRequests === 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.requestDelay));
            }

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${CONFIG.apiKey}`
                );
                const data = await response.json();
                
                if (data.list && data.list[0]) {
                    const aqi = convertToStandardAQI(data.list[0].main.aqi);
                    aqiData.push({
                        lat,
                        lon,
                        aqi,
                        timestamp: new Date(data.list[0].dt * 1000)
                    });
                }
            } catch (error) {
                console.error(`Failed to fetch ${lat},${lon}:`, error);
            }
        }

        visualizeData(aqiData);
        createLegend();
        
    } catch (error) {
        console.error("Error fetching AQI data:", error);
        loading.textContent = `Error: ${error.message}`;
    } finally {
        loading.style.display = 'none';
    }
}

// Visualize data on the map
function visualizeData(aqiData) {
    // Clear existing layers
    map.eachLayer(layer => {
        if (layer instanceof L.HeatLayer || layer._aqiMarker) {
            map.removeLayer(layer);
        }
    });

    // Create heatmap data
    const heatData = aqiData.map(point => [point.lat, point.lon, point.aqi / 5]); // Normalize to 0-1 scale
    
    // Add heatmap layer
    L.heatLayer(heatData, {
        radius: 15,
        blur: 20,
        maxZoom: 10,
        gradient: {
            0.1: '#00e400',  // Good
            0.3: '#ffff00',  // Moderate
            0.5: '#ff7e00',  // Unhealthy for Sensitive Groups
            0.7: '#ff0000',  // Unhealthy
            0.9: '#8f3f97',  // Very Unhealthy
            1.0: '#000000'   // Hazardous
        }
    }).addTo(map);

    // Add clickable markers for detailed info
    aqiData.forEach(point => {
        const marker = L.circleMarker([point.lat, point.lon], {
            radius: 5,
            color: aqiColorScale(point.aqi),
            fillColor: aqiColorScale(point.aqi),
            fillOpacity: 0.7,
            weight: 1
        }).addTo(map);
        
        marker._aqiMarker = true;
        
        marker.bindPopup(`
            <strong>Location:</strong> ${point.lat.toFixed(2)}, ${point.lon.toFixed(2)}<br>
            <strong>AQI:</strong> ${point.aqi} (${getAqiDescription(point.aqi)})<br>
            <strong>Last update:</strong> ${point.timestamp.toLocaleString()}
        `);
    });
}

// Get AQI description
function getAqiDescription(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    createLegend();
    fetchAQIData();
    
    // Add refresh button functionality
    const legend = document.getElementById('legend');
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Data';
    refreshBtn.style.marginTop = '10px';
    refreshBtn.onclick = fetchAQIData;
    legend.appendChild(refreshBtn);
});