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
  const headerLocation = document.querySelector('.location');
  const headerDate = document.querySelector('.header-date');
  const hourlyWeatherContainer = document.querySelector(
    '.hourly-weather-container'
  );

  const init = () => {
    searchInput.addEventListener('input', displaySearchOptions);
    searchInput.addEventListener('keyup', displayWeatherData);
    searchButton.addEventListener('click', displayWeatherData);
    searchOptionsDiv.addEventListener('click', displayWeatherData);
  };

  const displayTodaysWeather = async (locationData, id) => {
    const todaysWeather = await dataHandler.getTodaysWeatherData(
      locationData,
      id
    );

    while (hourlyWeatherContainer.firstChild) {
      hourlyWeatherContainer.removeChild(hourlyWeatherContainer.lastChild);
    }

    for (const hourlyData of todaysWeather) {
      const hourlyWeatherDiv = document.createElement('div');
      const timeParagraph = document.createElement('p');
      const weatherImgIcon = document.createElement('img');
      const temperatureParagraph = document.createElement('p');

      hourlyWeatherDiv.classList.add('hourly-weather');
      timeParagraph.classList.add('time');
      temperatureParagraph.classList.add('temperature');

      timeParagraph.innerText = hourlyData.time;
      weatherImgIcon.src = await dataHandler.getIconUrl(hourlyData.iconCode);
      temperatureParagraph.innerText = hourlyData.temp;

      hourlyWeatherContainer.appendChild(hourlyWeatherDiv);
      hourlyWeatherDiv.appendChild(timeParagraph);
      hourlyWeatherDiv.appendChild(weatherImgIcon);
      hourlyWeatherDiv.appendChild(temperatureParagraph);
    }
  };

  const displayWeatherData = async (e) => {
    if (e.type === 'keyup' && e.keyCode !== 13) return;
    const locationData = await dataHandler.getLocations(searchInput.value);
    const location = e.target.closest('.search-option');
    if (!location) return;
    const id = location.getAttribute('id');
    const currentWeather = await dataHandler.getCurrentWeather(
      locationData,
      id
    );
    displayTodaysWeather(locationData, id);
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
    headerDate.innerText = `${currentWeather.date.day} ${currentWeather.date.weekDay}, ${currentWeather.date.month}`;
    headerLocation.innerText = `${locationData[id].cityName}, ${locationData[id].country}`;
  };

  const displaySearchOptions = async (e) => {
    const inputText = e.target.value;
    const locationData = await dataHandler.getLocations(inputText);

    if (
      !(Symbol.iterator in Object(locationData)) ||
      locationData.length === 0 ||
      inputText === ''
    ) {
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
      searchOption.setAttribute('id', location.id);
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
