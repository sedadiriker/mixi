import React, { useEffect, useState } from 'react';
import moment from 'moment';
import './Clock.css'; // CSS dosyasını burada ekleyin

const Clock = () => {
  const [timeData, setTimeData] = useState({
    day: '',
    hours: '',
    minutes: '',
    seconds: ''
  });

  useEffect(() => {
    const updateTime = () => {
      setTimeData({
        day: moment().format("dd"),
        hours: moment().format("k"),
        minutes: moment().format("mm"),
        seconds: moment().format("ss")
      });
      requestAnimationFrame(updateTime);
    };

    requestAnimationFrame(updateTime);
  }, []);

  return (
    <div className="clock-container">
      <div className="clock-col">
        <p className="clock-day clock-timer">{timeData.day}</p>
        <p className="clock-label">Day</p>
      </div>
      <div className="clock-col">
        <p className="clock-hours clock-timer">{timeData.hours}</p>
        <p className="clock-label">Hours</p>
      </div>
      <div className="clock-col">
        <p className="clock-minutes clock-timer">{timeData.minutes}</p>
        <p className="clock-label">Minutes</p>
      </div>
      <div className="clock-col">
        <p className="clock-seconds clock-timer">{timeData.seconds}</p>
        <p className="clock-label">Seconds</p>
      </div>
    </div>
  );
};

export default Clock;
