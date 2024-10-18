import React, { useEffect, useRef } from "react";
import "./Clock.css";

const AnalogClock = () => {
  const hourRef = useRef(null);
  const minutesRef = useRef(null);
  const secondsRef = useRef(null);
  const textHourRef = useRef(null);
  const textMinutesRef = useRef(null);
  const textAmPmRef = useRef(null);
  const dateDayRef = useRef(null);
  const dateMonthRef = useRef(null);
  const dateYearRef = useRef(null);
  const themeButtonRef = useRef(null);

  useEffect(() => {
    const hour = hourRef.current;
    const minutes = minutesRef.current;
    const seconds = secondsRef.current;

    const clock = () => {
      const date = new Date();
      const hh = date.getHours() * 30;
      const mm = date.getMinutes() * 6;
      const ss = date.getSeconds() * 6;

      hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      minutes.style.transform = `rotateZ(${mm}deg)`;
      seconds.style.transform = `rotateZ(${ss}deg)`;
    };

    const clockText = () => {
      const date = new Date();
      let hh = date.getHours();
      let ampm;
      let mm = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (hh >= 12) {
        hh = hh - 12;
        ampm = "PM";
      } else {
        ampm = "AM";
      }

      if (hh === 0) hh = 12;
      if (hh < 10) hh = `0${hh}`;
      textHourRef.current.innerHTML = `${hh}:`;
      if (mm < 10) mm = `0${mm}`;
      textMinutesRef.current.innerHTML = mm;
      textAmPmRef.current.innerHTML = ampm;

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      dateDayRef.current.innerHTML = day;
      dateMonthRef.current.innerHTML = `${months[month]},`;
      dateYearRef.current.innerHTML = year;
    };

    const updateClock = () => {
      clock();
      clockText();
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    const themeButton = themeButtonRef.current;
    const darkTheme = "dark-theme";
    const iconTheme = "fas fa-sun";

    const getCurrentTheme = () =>
      document.body.classList.contains(darkTheme) ? "dark" : "light";
    const getCurrentIcon = () =>
      themeButton.classList.contains("fa-sun") ? "fas fa-moon" : "fas fa-sun";

    const selectedTheme = localStorage.getItem("selected-theme");
    const selectedIcon = localStorage.getItem("selected-icon");

    if (selectedTheme) {
      document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
      );

      if (selectedIcon === "fa-moon") {
        themeButton.classList.add("fas", "fa-moon");
      } else {
        themeButton.classList.add("fas", "fa-sun");
      }
    } else {
      themeButton.classList.add("fas", "fa-sun");
    }

    const toggleTheme = () => {
      const currentTheme = getCurrentTheme();
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.body.classList.toggle(darkTheme);

      if (newTheme === "dark") {
        themeButton.classList.remove("fa-moon");
        themeButton.classList.add("fa-sun");
      } else {
        themeButton.classList.remove("fa-sun");
        themeButton.classList.add("fa-moon");
      }

      localStorage.setItem("selected-theme", newTheme);
      localStorage.setItem("selected-icon", getCurrentIcon());
    };

    themeButton.addEventListener("click", toggleTheme);

    return () => {
      clearInterval(interval);
      themeButton.removeEventListener("click", toggleTheme);
    };
  }, []);

  return (
    <div className=" h-[100%] flex flex-col justify-center gap-3 2xl:gap-6">
      <section className="clock clock-container mx-auto w-[70px] h-[70px] 2xl:w-[120px] 2xl:h-[120px] relative flex flex-col gap-3">
        <div className="clock__container grid">
          <div className="clock__content grid">
            <div className="clock__circle w-[70px] h-[70px] 2xl:w-[120px] 2xl:h-[120px]">
              <span className="clock__twelve"></span>
              <span className="clock__three"></span>
              <span className="clock__six"></span>
              <span className="clock__nine"></span>

              <div className="clock__rounder"></div>
              <div className="clock__hour" ref={hourRef}></div>
              <div className="clock__minutes" ref={minutesRef}></div>
              <div className="clock__seconds" ref={secondsRef}></div>
            </div>
          </div>

          {/* Koyu/açık tema düğmesi */}
          <div className="clock__theme" ref={themeButtonRef}>
            <i id="theme-button"></i>
          </div>
        </div>
      </section>
      
      <div className=" text-gray-500">
        <div className="clock__text">
          <div className="clock__text-hour text-[15px] 2xl:text-[20px]" ref={textHourRef}></div>
          <div className="clock__text-minutes text-[15px] 2xl:text-[20px]" ref={textMinutesRef}></div>
          <div className="clock__text-ampm text-gray-400 text-[8px] 2xl:text-[10px]" ref={textAmPmRef}></div>
        </div>

        <div className="clock__date text-[12px] 2xl:text-[15px]" style={{letterSpacing:"1px"}}>
          <span id="date-day" ref={dateDayRef}></span>
          <span id="date-month" ref={dateMonthRef}></span>
          <span id="date-year" ref={dateYearRef}></span>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
