const dataHandler = (function () {
  let iconsUrl = 'http://openweathermap.org/img/wn/10d@2x.png';
  // This is a free api key. For the purposes of this project it's
  // okay to have the key here.
  const apiKey = '964aac2bae2c7c12657e7dfa45ed246e';

  const getGeocodingData = async (cityName) => {
    try {
      const geocodingRespone = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=5&appid=${apiKey}`,
        { mode: 'cors' }
      );

      const geocodingData = await geocodingRespone.json();
      return geocodingData;
    } catch (error) {
      console.log(error);
    }
  };

  const getWeatherData = async (latitude, longitude) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${apiKey}`,
        { mode: 'cors' }
      );

      const weatherData = await weatherResponse.json();
      return weatherData;
    } catch (error) {
      console.log(error);
    }
  };

  const getLocations = async (inputText) => {
    const geoCodingData = await getGeocodingData(inputText);
    const locationData = formatLocationData(geoCodingData);
    return locationData;
  };

  const formatLocationData = (data) => {
    const locationsArray = [];
    for (let cityData of data) {
      const locationData = {
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
    getLocations,
    formatLocationData,
  };
})();

export default dataHandler;
