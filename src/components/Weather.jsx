import React, { useState, useRef, useEffect } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState("C"); // Celsius by default

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (!city) {
      alert("Please enter a city.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_API}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch weather data.");
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      const temperatureC = data.main.temp - 273.15;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperatureC: Math.floor(temperatureC),
        location: data.name,
        icon: icon
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeatherData(null);
    }
  };

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === "C" ? "F" : "C"));
  };

  const getDisplayTemperature = () => {
    if (!weatherData) return '';
    const { temperatureC } = weatherData;
    return unit === "C"
      ? `${temperatureC}°C`
      : `${Math.round(temperatureC * 9 / 5 + 32)}°F`;
  };

  useEffect(() => {
    search("Vancouver");
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' />
        <img
          src={search_icon}
          alt="search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="weather icon" className='weather-icon' />
          <p className='temp'>{getDisplayTemperature()}</p>
          <button onClick={toggleUnit} className='toggle-btn'>
            Show in °{unit === "C" ? "F" : "C"}
          </button>
          <p className='city'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind icon" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
