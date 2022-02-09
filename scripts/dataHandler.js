const dataHandler = (function () {
  // This is a free api key. For the purposes of this project it's
  // okay to have the key here.
  const apiKey = '964aac2bae2c7c12657e7dfa45ed246e';

  const getIconUrl = async (iconCode) => {
    const response = await fetch(
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    );
    const iconUrl = response.url;
    return iconUrl;
  };

  const getGeocodingData = async (cityName) => {
    try {
      const geocodingRespone = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`,
        { mode: 'cors' }
      );

      const geocodingData = await geocodingRespone.json();
      return geocodingData;
    } catch (error) {
      console.log(error);
    }
  };

  const getWeatherData = async (latitude, longitude, unit) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${unit}&exclude=minutely,alerts&appid=${apiKey}`,
        { mode: 'cors' }
      );

      const weatherData = await weatherResponse.json();
      return weatherData;
    } catch (error) {
      console.log(error);
    }
  };

  const getTodaysWeatherData = (weatherData) => {
    let todaysWeather = [];
    for (let [index, hourlyData] of weatherData.hourly.entries()) {
      if (index >= 0 && index <= 24) {
        const time = convertUtcDate(
          hourlyData.dt,
          weatherData.timezone,
          true
        ).replace(':00 ', '');
        const iconCode = hourlyData.weather[0].icon;
        const temp = Math.round(hourlyData.temp);
        todaysWeather.push({ time, iconCode, temp });
      }
    }
    return todaysWeather;
  };

  const getForecastWeather = (weatherData) => {
    const timezone = weatherData.timezone;
    let forecastWeather = [];
    for (const dailyWeather of weatherData.daily) {
      const { monthDay, weekdayAbbreviation } = formatForecastDate(
        dailyWeather.dt,
        timezone
      );
      const iconCode = dailyWeather.weather[0].icon;
      const minTemperature = Math.round(dailyWeather.temp.min);
      const maxTemperature = Math.round(dailyWeather.temp.max);
      const windSpeed = Math.round(dailyWeather.wind_speed);
      const humidity = dailyWeather.humidity;
      forecastWeather.push({
        monthDay,
        weekdayAbbreviation,
        iconCode,
        minTemperature,
        maxTemperature,
        windSpeed,
        humidity,
      });
    }
    return forecastWeather;
  };

  const formatForecastDate = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    const dateTime = date.toLocaleString('en-US', {
      timeZone: timezone,
    });
    const weekdayAbbreviation = date.toLocaleString('en-US', {
      timeZone: timezone,
      weekday: 'short',
    });
    const monthDay = dateTime
      .split(', ')[0]
      .replace(`/${date.getFullYear()}`, '');
    return { monthDay, weekdayAbbreviation };
  };

  const getCurrentWeather = (weatherData) => {
    const currentData = formatCurrentWeatherData(weatherData);
    return currentData;
  };

  const formatCurrentWeatherData = (data) => {
    const minTemp = Math.round(data.daily[0].temp.min);
    const maxTemp = Math.round(data.daily[0].temp.max);
    const windSpeed = Math.round(data.current.wind_speed);
    const currentTemp = Math.round(data.current.temp);
    const humidity = data.current.humidity;
    const sunrise = convertUtcDate(data.current.sunrise, data.timezone, false);
    const sunset = convertUtcDate(data.current.sunset, data.timezone, false);
    const weatherDescription = data.current.weather[0].description;
    const weatherIconName = data.current.weather[0].icon;
    const date = convertDate(data.current.dt);
    return {
      minTemp,
      maxTemp,
      windSpeed,
      currentTemp,
      humidity,
      sunrise,
      sunset,
      weatherDescription,
      weatherIconName,
      date,
    };
  };

  const convertDate = (date) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const weekDay = new Date(date * 1000).getDate().toString();
    const day = days[new Date(date * 1000).getDay()];
    const month = months[new Date(date * 1000).getMonth()];
    return { day, weekDay, month };
  };

  const convertUtcDate = (utcTime, timezone, isNumeric) => {
    const date = new Date(utcTime * 1000);
    const time = date.toLocaleTimeString('en-US', {
      hour: isNumeric ? 'numeric' : '2-digit',
      minute: isNumeric ? 'numeric' : '2-digit',
      timeZone: timezone,
    });
    if (isNumeric) return time;

    return time.split(' ')[0];
  };

  const getLocations = async (inputText) => {
    if (inputText === '') return;
    const geoCodingData = await getGeocodingData(inputText);
    const locationData = formatLocationData(geoCodingData);
    return locationData;
  };

  const formatLocationData = (data) => {
    if (!(Symbol.iterator in Object(data))) return;
    const locationsArray = [];
    for (let [index, cityData] of data.entries()) {
      const locationData = {
        id: index,
        cityName: cityData.name,
        longitude: cityData.lon,
        latitude: cityData.lat,
        state: cityData.state,
        country: cityData.country,
      };
      locationsArray.push(locationData);
    }

    return locationsArray;
  };

  return {
    getGeocodingData,
    getWeatherData,
    getCurrentWeather,
    getLocations,
    formatLocationData,
    getIconUrl,
    getTodaysWeatherData,
    getForecastWeather,
  };
})();

export default dataHandler;
