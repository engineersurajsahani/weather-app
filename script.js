const apiKey = 'fe5a20994e22eb76267d6ff271215965';

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        console.log('Fetched weather data:', data); // Debugging log to verify if the data is coming in correctly

        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const cityElement = document.querySelector(".city");
const temperature = document.querySelector(".temp");
const windSpeed = document.querySelector(".wind-speed");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility-distance");
const descriptionText = document.querySelector('.description-text');
const date = document.querySelector(".date");
const descriptionIcon = document.querySelector('.description i');

function updateWeatherUI(data) {
    // Ensure we have valid data
    if (!data || !data.main || !data.weather || !data.wind) {
        console.error('Invalid data structure:', data);
        return;
    }

    // Update UI with weather data
    cityElement.textContent = data.name || 'City not found';
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`; // Visibility converted to kilometers
    descriptionText.textContent = data.weather[0].description || 'No description available';

    const currentDate = new Date();
    date.textContent = currentDate.toDateString();

    // Get the corresponding weather icon
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.classList = "";
    descriptionIcon.classList.add("material-icons");
    descriptionIcon.textContent = weatherIconName;
}

const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");

// Event listener for form submission
formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = inputElement.value.trim();
    if (city !== "") {
        fetchWeatherData(city);
        inputElement.value = ""; // Clear input field after search
    }
});

// Fetch weather data for a default city on load
fetchWeatherData('Pune');

// Function to get the appropriate weather icon
function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };
    return iconMap[weatherCondition] || "help"; // Default to 'help' icon if condition not found
}
