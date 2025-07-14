const apiKey = 'b2ea19503fe55a3fcc4f089d8dcc9f15'; // replace with your actual API key
const city = 'Gulu';
const countryCode = 'UG'; // Uganda

const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${apiKey}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&units=metric&appid=${apiKey}`;

async function fetchWeather() {
  try {
    const response = await fetch(weatherURL);
    const data = await response.json();

    const tempSpan = document.getElementById('current-temp');
    const descSpan = document.getElementById('weather-desc');

    if (tempSpan) tempSpan.textContent = `${Math.round(data.main.temp)}°C`;
    if (descSpan) descSpan.textContent = data.weather[0].description;

  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

async function fetchForecast() {
  try {
    const response = await fetch(forecastURL);
    const data = await response.json();

    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    const filtered = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    filtered.slice(0, 3).forEach(day => {
      const date = new Date(day.dt_txt);
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;

      const div = document.createElement('div');
      div.className = 'forecast-day';
      div.innerHTML = `<strong>${date.toDateString().slice(0, 10)}</strong>: ${temp}°C — ${desc}`;
      forecastDiv.appendChild(div);
    });

  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  fetchForecast();
});
