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
  const dailyWeatherContainer = document.querySelector(
    '.daily-weather-container'
  );

  const spinner = document.querySelector('.spinner');

  const init = () => {
    searchInput.addEventListener('input', displaySearchOptions);
    searchInput.addEventListener('keyup', displayWeatherData);
    searchButton.addEventListener('click', displayWeatherData);
    searchOptionsDiv.addEventListener('click', displayWeatherData);
    handleTodaysWeatherScroll();
  };

  const displayTodaysWeather = async (weatherData) => {
    const todaysWeather = dataHandler.getTodaysWeatherData(weatherData);

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

  const displayCurrentWeather = async (weatherData, locationData, id) => {
    const currentWeather = dataHandler.getCurrentWeather(weatherData);
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

  const displayWeatherForecast = async (weatherData) => {
    const weatherForecast = dataHandler.getForecastWeather(weatherData);
    while (dailyWeatherContainer.firstChild) {
      dailyWeatherContainer.removeChild(dailyWeatherContainer.lastChild);
    }

    for (const dailyWeatherData of weatherForecast) {
      const dailyWeatherDiv = document.createElement('div');
      const dateContainerDiv = document.createElement('div');
      const weekDayP = document.createElement('p');
      const dateP = document.createElement('p');
      const iconImg = document.createElement('img');
      const lowTempDiv = document.createElement('div');
      const lowTempP = document.createElement('p');
      const lowP = document.createElement('p');
      const highTempDiv = document.createElement('div');
      const highTempP = document.createElement('p');
      const highP = document.createElement('p');
      const windSpeedDiv = document.createElement('div');
      const windSpeedP = document.createElement('p');
      const windP = document.createElement('p');
      const humidityDiv = document.createElement('div');
      const humidityPercentageP = document.createElement('p');
      const humidityP = document.createElement('p');

      weekDayP.innerText = dailyWeatherData.weekdayAbbreviation;
      dateP.innerText = dailyWeatherData.monthDay;
      iconImg.src = await dataHandler.getIconUrl(dailyWeatherData.iconCode);
      lowTempP.innerText = `${dailyWeatherData.minTemperature}°`;
      lowP.innerText = 'Low';
      highTempP.innerText = `${dailyWeatherData.maxTemperature}°`;
      highP.innerText = 'High';
      windSpeedP.innerText = `${dailyWeatherData.windSpeed}mph`;
      windP.innerText = 'Wind';
      humidityPercentageP.innerText = `${dailyWeatherData.humidity}%`;
      humidityP.innerText = 'Humidity';

      dailyWeatherDiv.classList.add('daily-weather');
      dateContainerDiv.classList.add('date-container');
      weekDayP.classList.add('week-day', 'top-details');
      dateP.classList.add('date');
      lowTempDiv.classList.add('low-temp-container');
      lowTempP.classList.add('low-temperature', 'top-details');
      lowP.classList.add('bottom-details');
      highTempDiv.classList.add('high-temp-container');
      highTempP.classList.add('high-temperature', 'top-details');
      highP.classList.add('bottom-details');
      windSpeedDiv.classList.add('wind-speed-container');
      windSpeedP.classList.add('wind-speed', 'top-details');
      windP.classList.add('bottom-details');
      humidityDiv.classList.add('humidity-percentage-container');
      humidityPercentageP.classList.add('humidity-percentage', 'top-details');
      humidityP.classList.add('bottom-details');

      dailyWeatherContainer.appendChild(dailyWeatherDiv);
      dailyWeatherDiv.appendChild(dateContainerDiv);
      dateContainerDiv.appendChild(weekDayP);
      dateContainerDiv.appendChild(dateP);
      dailyWeatherDiv.appendChild(iconImg);
      dailyWeatherDiv.appendChild(lowTempDiv);
      lowTempDiv.appendChild(lowTempP);
      lowTempDiv.appendChild(lowP);
      dailyWeatherDiv.appendChild(highTempDiv);
      highTempDiv.appendChild(highTempP);
      highTempDiv.appendChild(highP);
      dailyWeatherDiv.appendChild(windSpeedDiv);
      windSpeedDiv.appendChild(windSpeedP);
      windSpeedDiv.appendChild(windP);
      dailyWeatherDiv.appendChild(humidityDiv);
      humidityDiv.appendChild(humidityPercentageP);
      humidityDiv.appendChild(humidityP);
    }
  };

  const displayWeatherData = async (e) => {
    if (e.type === 'keyup' && e.keyCode !== 13) return;
    spinner.style.visibility = 'visible';
    const locationData = await dataHandler.getLocations(searchInput.value);
    const location = e.target.closest('.search-option');
    if (!location) return;
    const id = location.getAttribute('id');
    const weatherData = await dataHandler.getWeatherData(
      locationData[id].latitude,
      locationData[id].longitude
    );
    displayCurrentWeather(weatherData, locationData, id);
    displayTodaysWeather(weatherData);
    displayWeatherForecast(weatherData);
    spinner.style.visibility = 'hidden';
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

  const handleTodaysWeatherScroll = () => {
    let isDown = false;
    let scrollSpeedMultiplier = 3;
    hourlyWeatherContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      e.preventDefault();
      cancelMomentumTracking();
    });
    hourlyWeatherContainer.addEventListener('mouseleave', () => {
      isDown = false;
    });
    hourlyWeatherContainer.addEventListener('mouseup', () => {
      isDown = false;
      beginMomentumTracking();
    });
    hourlyWeatherContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      let prevScrollLeft = hourlyWeatherContainer.scrollLeft;
      hourlyWeatherContainer.scrollLeft -= e.movementX * scrollSpeedMultiplier;
      velX = hourlyWeatherContainer.scrollLeft - prevScrollLeft;
    });
    let velX = 0;
    let momentumID;
    hourlyWeatherContainer.addEventListener('wheel', (e) => {
      cancelMomentumTracking();
    });
    function beginMomentumTracking() {
      cancelMomentumTracking();
      momentumID = requestAnimationFrame(momentumLoop);
    }
    function cancelMomentumTracking() {
      cancelAnimationFrame(momentumID);
    }
    function momentumLoop() {
      hourlyWeatherContainer.scrollLeft += velX;
      velX *= 0.95;
      if (Math.abs(velX) > 0.5) {
        momentumID = requestAnimationFrame(momentumLoop);
      }
    }
  };

  return {
    init,
  };
})();

export default domHandler;
