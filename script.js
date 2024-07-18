document.addEventListener('DOMContentLoaded', () => {
    fetchCountries();
  });
  
  async function fetchCountries() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const countries = await response.json();
      displayCountries(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }
  
  function displayCountries(countries) {
    const container = document.getElementById('countries-container');
    countries.forEach(country => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col-sm-6 col-md-4 col-lg-4 col-xl-4';
  
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card h-100';
  
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
  
      const cardHeader = document.createElement('div');
      cardHeader.className = 'card-header';
      cardHeader.innerHTML = `<h5>${country.name.common}</h5>`;
  
      const cardText = document.createElement('div');
      cardText.className = 'card-text';
  
      const nativeName = country.name.nativeName ? Object.values(country.name.nativeName)[0]?.common || 'N/A' : 'N/A';
  
      cardText.innerHTML = `
        <img src="${country.flags.svg}" class="card-img-top mb-3" alt="Flag of ${country.name.common}">
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Native Name:</strong> ${nativeName}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Country Code:</strong> ${country.cca3}</p>
      `;
  
      const weatherButton = document.createElement('button');
      weatherButton.className = 'btn btn-primary';
      weatherButton.textContent = 'Click for Weather';
      weatherButton.onclick = () => fetchWeather(country.latlng[0], country.latlng[1], weatherButton);
  
      const weatherInfo = document.createElement('div');
      weatherInfo.className = 'weather-info mt-3';
  
      cardBody.appendChild(cardText);
      cardBody.appendChild(weatherButton);
      cardBody.appendChild(weatherInfo);
  
      cardDiv.appendChild(cardHeader);
      cardDiv.appendChild(cardBody);
  
      colDiv.appendChild(cardDiv);
      container.appendChild(colDiv);
    });
  }
  
  async function fetchWeather(lat, lon, button) {
    if (lat === undefined || lon === undefined) {
      alert('No coordinates found for this country.');
      return;
    }
  
    const apiKey = '92487cdacfe825ec47397587475ad02c'; // Replace with your actual API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
    try {
      console.log(`Fetching weather data from: ${weatherUrl}`);
      const response = await fetch(weatherUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const weatherData = await response.json();
      displayWeather(weatherData, button);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
  
  
  function displayWeather(weatherData, button) {
    const cardBody = button.parentElement;
    const weatherInfo = cardBody.querySelector('.weather-info');
  
    if (!weatherData.main || !weatherData.weather) {
      weatherInfo.innerHTML = '<p>Unable to fetch weather data.</p>';
      return;
    }
  
    weatherInfo.innerHTML = `
      <p><strong>Temperature:</strong> ${(weatherData.main.temp - 273.15).toFixed(2)} °C</p>
      <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
    `;
  }
  