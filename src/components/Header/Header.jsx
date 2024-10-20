import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Clock from "../Clock/Clock";
import Weather from "../Weather/Weather";
import ClockDate from "../Clock-Date/ClockDate";
import "./Header.css";
import { useUser } from "../../context/UserContext";
import {
  faUser,
  faCog,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Header = ({showLogo,onLogoClick}) => {
  const [selectedWidget, setSelectedWidget] = useState("clock");
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { username, setUsername } = useUser();

  const handleMouseEnter = () => {
    setShowSettingsButton(true);
  };

  const handleMouseLeave = () => {
    setShowSettingsButton(false);
  };

  const handleWidgetSelection = (widget) => {
    setSelectedWidget(widget);
    setShowPopup(false);
  };

  const closeModal = () => {
    setShowPopup(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  
    const toggleMenu = document.getElementById("toggleMenu");
    toggleMenu.classList.toggle("hamburger-toggle");
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    // window.location.href = '/login';
  };


  return (
    <header className="header w-[93%] mx-auto flex justify-between items-center border-b border-gray-300 rounded-bl-[35px] rounded-br-[35px] bg-black text-white px-[20px] pt-[30px] pb-[10px] pr-5 fixed">
      <div
        className="time-weather-date relative ps-[30px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {selectedWidget === "clock" && <Clock />}
        {selectedWidget === "weather" && <Weather />}
        {selectedWidget === "date" && <ClockDate />}

        {showSettingsButton && (
          <button
            className="settings-button absolute top-0 left-[-5px] bg-white p-2 flex justify-center items-center rounded-full"
            onClick={() => setShowPopup(true)}
          >
            <FontAwesomeIcon icon={faCog} className="text-black text-[10px]" />
          </button>
        )}
      </div>

      <div className="w-[100px] h-[50px] 2xl:w-[200px] 2xl:h-[100px]"  style={{marginRight:"16.5rem",cursor:"pointer"}}
>
      {showLogo && (
        <img
        onClick={onLogoClick} 
          className="logo"
          src="images/logo.png"
          alt="Logo"
          style={{width:"100%", height:"100%", objectFit:"cover"}}
        />
      )}
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="modal-content bg-black w-full max-w-3xl p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal absolute top-4 right-4 text-white"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h4 className="text-white uppercase mb-4 text-center modal-title py-2">
              Select Widget
            </h4>
            <div className="flex gap-4 justify-center">
              <div
                className="cursor-pointer flex-1 widget-select"
                onClick={() => handleWidgetSelection("clock")}
              >
                <div className="p-4">
                  <Clock />
                </div>
              </div>
              <div
                className="cursor-pointer flex-1 widget-select"
                onClick={() => handleWidgetSelection("weather")}
              >
                <div className="p-4">
                  <Weather />
                </div>
              </div>
              <div
                className="cursor-pointer flex-1 widget-select"
                onClick={() => handleWidgetSelection("date")}
              >
                <div className="p-4">
                  <ClockDate />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="close-button text-black bg-gray-300 p-2 rounded"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {username ? (
        <div className="flex gap-5 items-center relative">
          <span
            className="text-gray-400 uppercase text-[12px]"
            style={{ letterSpacing: "1px" }}
          >
            {username}
          </span>
          <div
            id="toggleMenu"
            className="grid place-content-center w-10 h-10 p-4 mx-auto"
            onClick={toggleDropdown}
          >
            <div className="w-6 h-1 bg-gray-400 rounded-full transition-all duration-150 before:content-[''] before:absolute before:w-6 before:h-1 before:bg-gray-400 before:rounded-full before:-translate-y-2 before:transition-all before:duration-150 after:content-[''] after:absolute after:w-6 after:h-1 after:bg-gray-400 after:rounded-full after:translate-y-2 after:transition-all after:duration-150 cursor-pointer"></div>
          </div>
          {/* Dropdown Menü */}
          {showDropdown && (
            <div className="absolute right-0 top-11 bg-black text-gray-500 shadow-lg rounded mt-2">
              <a
                href="#"
                className="block px-6 py-2 hover:bg-gray-600 hover:text-black"
              >
                Contact
              </a>
              <a
                href="#"
                className="block px-6 py-2 hover:bg-gray-600 hover:text-black"
              >
                Help
              </a>
              <a
                onClick={handleLogout} // Logout fonksiyonunu buraya bağlayın
                className="block px-6 py-2 hover:bg-gray-600 hover:text-black cursor-pointer"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      ) : (
        <a href="/login" className="profile flex flex-col gap-1">
          <FontAwesomeIcon
            className="text-primary_color cursor-pointer"
            icon={faUser}
          />
          <span className="sign text-primary_color uppercase text-[10px] cursor-pointer">
            Login
          </span>
        </a>
      )}

      <div id="bottom-arrow" className="arrow"></div>
    </header>
  );
};

export default Header;
