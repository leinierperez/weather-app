import domHandler from './domHandler.js';

domHandler.init();

window.onload = function () {
  document.querySelector('.spinner').style.visibility = 'visible';
  const inputCheckedValue = document.querySelector('.toggle-input').checked;
  domHandler.displayWeatherData(
    'miami',
    inputCheckedValue ? 'imperial' : 'metric'
  );
  document.querySelector('.spinner').style.visibility = 'hidden';
};
