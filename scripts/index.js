import domHandler from './domHandler.js';

domHandler.init();

window.onload = function () {
  document.querySelector('.spinner').style.visibility = 'visible';
  domHandler.displayWeatherData('miami');
  document.querySelector('.spinner').style.visibility = 'hidden';
};
