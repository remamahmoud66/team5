
export function loadWeather() {
    const temperature = document.getElementById("temperature");
    const locationText = document.getElementById("weatherLocation");
    const description = document.getElementById("weatherDescription");
    const weatherIcon = document.getElementById("weatherIcon");

    if (!temperature || !locationText || !description || !weatherIcon) {
        console.error("Weather elements were not found.");
        return;
    }

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=31.95" +
        "&longitude=35.91" +
        "&current=temperature_2m,weather_code" +
        "&timezone=Asia%2FAmman";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Weather API request failed");
            }

            return response.json();
        })
        .then(data => {
            const weatherData = data.current;

            console.log("Current weather:", weatherData);

            // Display temperature
            temperature.textContent =
                weatherData.temperature_2m + "°C";

            // Display location
            locationText.textContent =
                "Amman · Live API data";

            // Display weather description
            description.textContent =
                getWeatherDescription(weatherData.weather_code);

            // Display weather emoji
            weatherIcon.textContent =
                getWeatherEmoji(weatherData.weather_code);
        })
        .catch(error => {
            console.error("Weather API ERROR:", error);

            temperature.textContent = "--°C";
            locationText.textContent = "Amman · Data unavailable";
            description.textContent = "Could not load weather data.";

            weatherIcon.textContent = "🌤️";
        });
}


// Convert weather code to description
function getWeatherDescription(code) {
    if (code === 0) return "Clear sky";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";

    return "Unknown weather";
}


// Convert weather code to emoji
function getWeatherEmoji(code) {
    if (code === 0) return "☀️";

    if (code >= 1 && code <= 3) return "🌤️";

    if (code >= 45 && code <= 48) return "🌫️";

    if (code >= 51 && code <= 57) return "🌦️";

    if (code >= 61 && code <= 67) return "🌧️";

    if (code >= 71 && code <= 77) return "❄️";

    if (code >= 80 && code <= 82) return "🌦️";

    if (code >= 95 && code <= 99) return "⛈️";

    return "🌤️";
}

