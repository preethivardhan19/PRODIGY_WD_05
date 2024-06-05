document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '2a6f823b40b8c4017e65bbef346ace6d'; 
    const weatherInfo = document.getElementById('weather-info');
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location-input');

    const getWeatherByLocation = (location) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayWeather(data))
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherInfo.innerHTML = `<p class="weather-data">Error: ${error.message}</p>`;
            });
    };

    const displayWeather = (data) => {
        if (data.cod !== 200) {
            weatherInfo.innerHTML = `<p class="weather-data">Error: ${data.message}</p>`;
            return;
        }

        const { name, main, weather, wind } = data;
        weatherInfo.innerHTML = `
            <p class="weather-data"><strong>Location:</strong> <span>${name}</span></p>
            <p class="weather-data"><strong>Temperature:</strong> <span>${main.temp}°C</span></p>
            <p class="weather-data"><strong>Weather:</strong> <span>${weather[0].description}</span></p>
            <p class="weather-data"><strong>Humidity:</strong> <span>${main.humidity}%</span></p>
            <p class="weather-data"><strong>Wind Speed:</strong> <span>${wind.speed} m/s</span></p>
        `;
    };

    searchBtn.addEventListener('click', () => {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherByLocation(location);
        } else {
            weatherInfo.innerHTML = `<p class="weather-data">Please enter a location.</p>`;
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => displayWeather(data))
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    weatherInfo.innerHTML = `<p class="weather-data">Error: ${error.message}</p>`;
                });
        }, error => {
            console.error('Error getting location:', error);
            weatherInfo.innerHTML = `<p class="weather-data">Error: Unable to retrieve your location.</p>`;
        });
    } else {
        weatherInfo.innerHTML = `<p class="weather-data">Geolocation is not supported by this browser.</p>`;
    }
});
