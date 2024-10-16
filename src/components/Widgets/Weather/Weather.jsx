import React, { useState, useEffect } from "react";
import { toastSuccessNotify, toastErrorNotify } from "../../../helper/ToastNotify"; 
import "./Weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log(weatherData); // `useEffect` içinde konsolda her güncellemede ne geldiğini görebilirsin
  }, [weatherData]);
    const apiKey = "44df26f596aedf257812c7a8beefd005";

  const fetchFavoriteCitiesWeather = async () => {
    const favorites = JSON.parse(localStorage.getItem("favorite_cities")) || [];

    if (favorites.length === 0) {
      await fetchWeatherForDefaultCity("New York");
      return;
    }

    const data = await Promise.all(
      favorites.map(async (city) => {
        const cachedData = JSON.parse(localStorage.getItem(`weather_${city}`));
        if (cachedData) {
          return cachedData;
        }

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          console.log(response)
          const weatherData = await response.json();

          if (weatherData.cod === 200) {
            localStorage.setItem(`weather_${city}`, JSON.stringify(weatherData));
            return weatherData;
          } else {
            console.error("Error fetching weather data:", weatherData);
            return null;
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
          return null;
        }
      })
    );

    setWeatherData(data.filter((item) => item && item.cod === 200));
  };

  const fetchWeatherForDefaultCity = async (city) => {
    const cachedData = JSON.parse(localStorage.getItem(`weather_${city}`));
    if (cachedData) {
      setWeatherData([cachedData]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        localStorage.setItem(`weather_${city}`, JSON.stringify(data));
        setWeatherData([data]);
      } else {
        console.error("Error fetching default city weather data:", data);
      }
    } catch (error) {
      console.error("Error fetching default city weather data:", error);
    }
  };

  useEffect(() => {
    fetchFavoriteCitiesWeather();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentCityIndex((prevIndex) => {
        if (weatherData.length === 0) return 0;
        return (prevIndex + 1) % weatherData.length;
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [weatherData]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addFavoriteCity = async (event, city) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        let favorites = JSON.parse(localStorage.getItem("favorite_cities")) || [];
        if (!favorites.includes(city)) {
          favorites.push(city);
          localStorage.setItem("favorite_cities", JSON.stringify(favorites));
          localStorage.setItem(`weather_${city}`, JSON.stringify(data));
          toastSuccessNotify(`${city} added to favorites!`);
          fetchFavoriteCitiesWeather();
        } else {
          toastErrorNotify(`${city} is already in favorites!`);
        }
      } else {
        toastErrorNotify("Invalid city name. Please try again.");
      }
    } catch (error) {
      console.error("Error adding city:", error);
      toastErrorNotify("An error occurred. Please try again.");
    }
  };

  const displayFavoriteCitiesInModal = () => {
    const favorites = JSON.parse(localStorage.getItem("favorite_cities")) || [];
    return favorites.map((city) => (
      <div className="favorite-item flex justify-between items-center w-[95%] m-auto py-2 border border-gray-800 px-3 mb-1" key={city}>
        <span>{city}</span>
        <button className="text-[10px]" onClick={() => {
          let favorites = JSON.parse(localStorage.getItem("favorite_cities")) || [];
          favorites = favorites.filter(favCity => favCity !== city);
          localStorage.setItem("favorite_cities", JSON.stringify(favorites));
          localStorage.removeItem(`weather_${city}`);
          toastSuccessNotify(`${city} removed from favorites!`);
          fetchFavoriteCitiesWeather();
        }}>🗑️</button>
      </div>
    ));
  };

  const handleWheel = (event) => {
    event.preventDefault(); 
    if (event.deltaY < 0) {
      setCurrentCityIndex((prevIndex) => (prevIndex - 1 + weatherData.length) % weatherData.length);
    } else if (event.deltaY > 0) {
      setCurrentCityIndex((prevIndex) => (prevIndex + 1) % weatherData.length);
    }
  };

  return (
    <div className="weather-container h-[100%]">
      <div className="settings-icon-weather" onClick={handleOpenModal}>
        <i className="fas fa-cog"></i>
      </div>

      {weatherData.length > 0 ? (
        <div id="current-weather" className="h-[100%]" onWheel={handleWheel}> 
          <div className="slider h-[100%]">
            <div className="slide h-[100%]" key={weatherData[currentCityIndex].id}>
              <h2 className="text-[12px] 2xl:text-[18px] text-center uppercase text-gray-400 mt-3">
                {weatherData[currentCityIndex].name}, {weatherData[currentCityIndex].sys.country}
              </h2>
              <hr className="opacity-10" />
              <div className="flex justify-center items-center gap-1">
                <div className="flex justify-center 2xl:w-[40%]">
                  <img
                    className="w-full"
                    src={`https://openweathermap.org/img/wn/${weatherData[currentCityIndex].weather[0].icon}@2x.png`}
                    alt="Weather icon"
                  />
                </div>
                <div className="flex flex-col justify-start items-start flex-1">
                  <div className="flex justify-between items-center w-full text-[12px] 2xl:text-[16px] text-gray-500 2xl:px-10 mt-2 2xl:mt-0">
                    <div className="flex justify-between ">
                      <span className="w-[90px] 2xl:w-[100px]">Temperature</span>
                      <span>:</span>
                    </div>
                    <span className="text-[15px] 2xl:text-[20px] text-gray-300">
                      {weatherData[currentCityIndex].main.temp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full text-[10px] 2xl:text-[16px] text-gray-500 2xl:px-10">
                    <div className="flex justify-between">
                      <span className="w-[90px] 2xl:w-[100px]">Condition</span>
                      <span>:</span>
                    </div>
                    <span className="text-[9px] 2xl:text-[12px] text-gray-300 whitespace-nowrap ps-1">
                      {weatherData[currentCityIndex].weather[0].description}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full text-[10px] 2xl:text-[16px] text-gray-500 2xl:px-10">
                    <div className="flex justify-between">
                      <span className="w-[90px] 2xl:w-[100px]">Humidity</span>
                      <span>:</span>
                    </div>
                    <span className="text-[13px] 2xl:text-[15px] text-gray-300">
                      {weatherData[currentCityIndex].main.humidity}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full text-[10px] 2xl:text-[16px] text-gray-500 2xl:px-10">
                    <div className="flex justify-between">
                      <span className="w-[90px] 2xl:w-[100px]">Wind</span>
                      <span>:</span>
                    </div>
                    <span className="text-[11px] 2xl:text-[12px] text-gray-300">
                      {weatherData[currentCityIndex].wind.speed} m/s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content relative mb-20">
                <h2 className="text-center uppercase text-gray-500" style={{ letterSpacing: "2px", wordSpacing: "2px" }}>Favorite Cities</h2>
                <button className="absolute top-3 right-3" onClick={handleCloseModal}>✖️</button>
                <div className="favorite-cities-list">{displayFavoriteCitiesInModal()}</div>
                <form className="flex justify-between mt-5 mb-3 px-2 py-1" onSubmit={(e) => addFavoriteCity(e, e.target.city.value)}>
                  <input type="text" name="city" placeholder="Enter city name" className="p-2 w-[75%] text-black rounded outline-none" />
                  <button type="submit" className="bg-gray-500 text-black rounded p-1">Add</button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Loading weather data...</div>
      )}
    </div>
  );
};

export default Weather;
