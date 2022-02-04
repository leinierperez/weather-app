import dataHandler from './dataHandler.js';

const domHandler = (function () {
  const searchInput = document.querySelector('.search-bar');
  const searchButton = document.querySelector('.search-btn');
  const searchOptionsDiv = document.querySelector('.search-options');
  const currentTemperature = document.querySelector('.current-temperature');
  const currentWeatherDescription = document.querySelector(
    '.current-weather-description'
  );
  const currentMaxTemperature = document.querySelector(
    '.current-high-temperature'
  );
  const currentWindSpeed = document.querySelector('.current-wind-speed');
  const currentSunriseTime = document.querySelector('.current-sunrise-time');
  const currentMinTemperature = document.querySelector(
    '.current-low-temperature'
  );
  const currentHumidity = document.querySelector(
    '.current-humidity-percentage'
  );
  const currentSunsetTime = document.querySelector('.current-sunset-time');
  const currentWeatherIcon = document.querySelector('#current-weather-icon');

  const init = () => {
    searchInput.addEventListener('input', displaySearchOptions);
    searchInput.addEventListener('keyup', displayWeatherData);
    searchButton.addEventListener('click', displayWeatherData);
    searchOptionsDiv.addEventListener('click', displayWeatherData);
  };

  const displayWeatherData = async (e) => {
    if (e.type === 'keyup' && e.keyCode !== 13) return;
    const location = e.target.closest('.search-option');
    if (!location) return;
    const latitude = location.getAttribute('latitude');
    const longitude = location.getAttribute('longitude');
    const currentWeather = await dataHandler.getCurrentWeather(
      latitude,
      longitude
    );
    const iconUrl = await dataHandler.getIconUrl(
      currentWeather.weatherIconName
    );

    currentTemperature.innerText = `${currentWeather.currentTemp}°`;
    currentWeatherDescription.innerText = currentWeather.weatherDescription;
    currentMaxTemperature.innerText = `${currentWeather.maxTemp}°`;
    currentWindSpeed.innerText = `${currentWeather.windSpeed}mph`;
    currentSunriseTime.innerText = currentWeather.sunrise;
    currentMinTemperature.innerText = `${currentWeather.minTemp}°`;
    currentHumidity.innerText = `${currentWeather.humidity}%`;
    currentSunsetTime.innerText = currentWeather.sunset;
    currentWeatherIcon.src = iconUrl;
    console.log(currentWeather);
  };

  const displaySearchOptions = async (e) => {
    const inputText = e.target.value;
    const locationData = await dataHandler.getLocations(inputText);
    if (inputText === '' || locationData.length === 0) {
      setSearchOptionsStyles('hidden');
      return;
    }
    setSearchOptionsStyles('shown');

    const searchOptions = document.querySelectorAll('.search-option') || [];
    for (let option of searchOptions) {
      option.remove();
    }

    for (let location of locationData) {
      let searchOption = document.createElement('p');
      searchOption.classList.add('search-option');
      searchOption.setAttribute('longitude', location.longitude);
      searchOption.setAttribute('latitude', location.latitude);
      searchOptionsDiv.appendChild(searchOption);

      searchOption.innerText = `${location.cityName}, ${
        location.state || location.country
      }`;
    }
  };

  const setSearchOptionsStyles = (visibility) => {
    if (visibility === 'shown') {
      searchOptionsDiv.style.display = 'flex';
      searchInput.style = 'border-bottom-left-radius: 0;';
      searchButton.style = 'border-bottom-right-radius: 0;';
    } else if (visibility === 'hidden') {
      searchOptionsDiv.style.display = 'none';
      searchInput.style = 'border-bottom-left-radius: 0.5em;';
      searchButton.style = 'border-bottom-right-radius: 0.5em;';
    }
    return;
  };

  return {
    init,
  };
})();

export default domHandler;
