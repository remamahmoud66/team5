export function loadWeather() {

    const temperature =
        document.getElementById("temperature");

    const locationText =
        document.getElementById("weatherLocation");

    const description =
        document.getElementById("weatherDescription");

    const weatherIcon =
        document.getElementById("weatherIcon");

    const hourlyForecast =
        document.getElementById("hourlyForecast");


    if (
        !temperature ||
        !locationText ||
        !description ||
        !weatherIcon
    ) {
        console.error("Weather elements were not found.");
        return;
    }


    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=31.95" +
        "&longitude=35.91" +
        "&current=temperature_2m,weather_code" +
        "&hourly=temperature_2m,weather_code" +
        "&forecast_hours=12" +
        "&timezone=Asia%2FAmman";


    fetch(url)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Weather API request failed"
                );
            }

            return response.json();

        })

        .then(data => {

            const weatherData =
                data.current;

            console.log(
                "Current weather:",
                weatherData
            );


            temperature.textContent =
                weatherData.temperature_2m + "°C";


            locationText.textContent =
                "Amman · Live API data";


            description.textContent =
                getWeatherDescription(
                    weatherData.weather_code
                );


            weatherIcon.textContent =
                getWeatherEmoji(
                    weatherData.weather_code
                );


            if (hourlyForecast) {

                renderHourlyForecast(
                    data.hourly,
                    hourlyForecast
                );

            }

        })

        .catch(error => {

            console.error(
                "Weather API ERROR:",
                error
            );


            temperature.textContent =
                "--°C";


            locationText.textContent =
                "Amman · Data unavailable";


            description.textContent =
                "Could not load weather data.";


            weatherIcon.textContent =
                "🌤️";


            if (hourlyForecast) {

                hourlyForecast.innerHTML = `
                    <div class="weather-error">
                        Hourly forecast unavailable.
                    </div>
                `;

            }

        });
}


function renderHourlyForecast(
    hourlyData,
    container
) {

    const currentHour =
        new Date().getHours();


    const startIndex =
        hourlyData.time.findIndex(time => {

            const date =
                new Date(time);

            return date.getHours() >= currentHour;

        });


    const safeStartIndex =
        startIndex >= 0
            ? startIndex
            : 0;


    const hoursToShow =
        6;


    let forecastHTML = "";


    for (
        let i = safeStartIndex;
        i < safeStartIndex + hoursToShow;
        i++
    ) {

        if (!hourlyData.time[i]) {
            break;
        }


        const date =
            new Date(hourlyData.time[i]);


        const hour =
            date.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    hour12: true
                }
            );


        const temperature =
            Math.round(
                hourlyData.temperature_2m[i]
            );


        const weatherCode =
            hourlyData.weather_code[i];


        forecastHTML += `

            <div class="forecast-item">

                <span class="forecast-time">
                    ${hour}
                </span>


                <span class="forecast-icon">
                    ${getWeatherEmoji(weatherCode)}
                </span>


                <strong class="forecast-temperature">
                    ${temperature}°
                </strong>


                <span class="forecast-description">
                    ${getWeatherDescription(weatherCode)}
                </span>

            </div>

        `;

    }


    container.innerHTML =
        forecastHTML;
}


function getWeatherDescription(code) {

    if (code === 0)
        return "Clear sky";

    if (code >= 1 && code <= 3)
        return "Partly cloudy";

    if (code >= 45 && code <= 48)
        return "Foggy";

    if (code >= 51 && code <= 57)
        return "Drizzle";

    if (code >= 61 && code <= 67)
        return "Rain";

    if (code >= 71 && code <= 77)
        return "Snow";

    if (code >= 80 && code <= 82)
        return "Rain showers";

    if (code >= 95 && code <= 99)
        return "Thunderstorm";

    return "Unknown weather";
}


function getWeatherEmoji(code) {

    if (code === 0)
        return "☀️";

    if (code >= 1 && code <= 3)
        return "🌤️";

    if (code >= 45 && code <= 48)
        return "🌫️";

    if (code >= 51 && code <= 57)
        return "🌦️";

    if (code >= 61 && code <= 67)
        return "🌧️";

    if (code >= 71 && code <= 77)
        return "❄️";

    if (code >= 80 && code <= 82)
        return "🌦️";

    if (code >= 95 && code <= 99)
        return "⛈️";

    return "🌤️";
}