import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./Reminder.css";

const Reminder = () => {
  const [reminderInterval, setReminderInterval] = useState(60);
  const [exerciseDuration, setExerciseDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(reminderInterval * 60);
  const [weeklyData, setWeeklyData] = useState({
    done: Array(7).fill(0),
    skipped: Array(7).fill(0),
  });
  const [timer, setTimer] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [chart, setChart] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alarmSound, setAlarmSound] = useState("alarm1");

  const chartRef = useRef(null);

  const closeModal = () => {
    setShowSettings(false);
  };

  useEffect(() => {
    if (chart) {
      updateChart();
    }
  }, [weeklyData]);

  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }
    setTimeLeft(reminderInterval * 60);
  }, [reminderInterval]);

  useEffect(() => {
    if (showSettings && chartRef.current) {
      const timeout = setTimeout(() => {
        const ctx = chartRef.current.getContext("2d");
        if (ctx) {
          if (chart) {
            chart.destroy();
          }

          const newChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: getWeekLabels(),
              datasets: [
                {
                  label: "Exercises Performed                  ",
                  data: weeklyData.done,
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
                {
                  label: "Skipped Exercises                  ",
                  data: weeklyData.skipped,
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  stepSize: 1,
                  grid: {
                    color: "#ffffff50",
                  },
                },
                x: {
                  grid: {
                    color: "#ffffff50",
                  },
                },
              },
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Weekly Exercise Performance",
                },
              },
            },
          });

          setChart(newChart);

          return () => {
            newChart.destroy();
          };
        } else {
          console.error("Canvas element not found");
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [showSettings, weeklyData]);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setPopupVisible(true);
          playAlarmSound();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setIsRunning(false);
  };

  const updateChart = () => {
    if (chart) {
      const today = new Date().getDay();
      chart.data.labels = getWeekLabels();
      chart.data.datasets[0].data = [
        ...weeklyData.done.slice(today + 1),
        ...weeklyData.done.slice(0, today + 1),
      ];
      chart.data.datasets[1].data = [
        ...weeklyData.skipped.slice(today + 1),
        ...weeklyData.skipped.slice(0, today + 1),
      ];
      chart.update();
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("weeklyData");
    if (storedData) {
      setWeeklyData(JSON.parse(storedData));
    }
  }, []);

  const handleExerciseResponse = (done) => {
    const today = new Date().getDay();
    const updatedData = { ...weeklyData };

    if (done) {
      updatedData.done[today]++;
    } else {
      updatedData.skipped[today]++;
    }

    setWeeklyData(updatedData);
    localStorage.setItem("weeklyData", JSON.stringify(updatedData));

    setPopupVisible(false);

    stopAlarmSound();

    startTimer();
  };

  const stopAlarmSound = () => {
    const audio = new Audio(`/sounds/reminder/${alarmSound}.mp3`);
    audio.pause();
    audio.currentTime = 0;
  };

  const playAlarmSound = () => {
    const audio = new Audio(`/sounds/reminder/${alarmSound}.mp3`);
    audio.play();
  };

  const getWeekLabels = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();
    return days.slice(today + 1).concat(days.slice(0, today + 1));
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    if (showSettings) {
      updateChart();
    }
  }, [showSettings]);

  // const playPreviewSound = (soundName) => {
  //   const audio = new Audio(`/sounds/reminder/${soundName}.mp3`);
  //   audio.play();
  // };

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="reminder-widget relative h-[100%]">
      <div className="settings-icon-reminder" onClick={toggleSettings}>
        <i className="fas fa-cog"></i>
      </div>

      {showSettings && (
        <div className="modal flex flex-col w-full">
          <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
            <img className="w-full logo-modal" src="images/logo.png" alt="" />
          </div>
          <div className="w-full">
            <h2
              className="text-center uppercase 2xl:text-[18px] text-[#404751] py-10 2xl:py-6"
              style={{ letterSpacing: "2px" }}
            >
              Reminder settings
            </h2>
            <hr className=" opacity-25 my-1 w-[98%] mx-auto" />
          </div>
          <div className="modal-content mt-28">
            <span className="close" onClick={closeModal}>
              &times;
            </span>

            <div className=" bg-black rounded-lg shadow-lg p-6 h-[100%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="reminderInterval"
                    className="block mb-1 font-semibold"
                  >
                    Reminder Interval (minutes):
                  </label>
                  <input
                    type="number"
                    id="reminderInterval"
                    className="w-full p-1 border rounded-md text-black dark:border-gray-500 outline-none"
                    value={reminderInterval}
                    onChange={(e) =>
                      setReminderInterval(parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="exerciseDuration"
                    className="block mb-1 font-semibold"
                  >
                    Exercise Duration (minutes):
                  </label>
                  <input
                    type="number"
                    id="exerciseDuration"
                    className="w-full p-1 border rounded-md text-black dark:border-gray-500 outline-none"
                    value={exerciseDuration}
                    onChange={(e) =>
                      setExerciseDuration(parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="alarmSound"
                  className="block mb-2 font-semibold"
                >
                  Alarm Sound:
                </label>
                {/* <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="beep">Alarm1</label>
                    <button
                      className="play-sound-button"
                      onClick={() => playPreviewSound("alarm1")}
                    >
                      Dinle
                    </button>
                  </div>
                  <div>
                    <label htmlFor="bell">Alarm2</label>
                    <button
                      className="play-sound-button"
                      onClick={() => playPreviewSound("alarm2")}
                    >
                      Dinle
                    </button>
                  </div>
                  <div>
                    <label htmlFor="chime">Alarm3</label>
                    <button
                      className="play-sound-button"
                      onClick={() => playPreviewSound("alarm3")}
                    >
                      Dinle
                    </button>
                  </div>
                </div> */}

                <select
                  id="alarmSound"
                  className="w-full p-1 border rounded-md dark:border-gray-500 outline-none text-black"
                  onChange={(e) => setAlarmSound(e.target.value)}
                >
                  <option value="alarm1">alarm1</option>
                  <option value="alarm2">alarm2</option>
                  <option value="alarm3">alarm3</option>
                </select>
              </div>

              <button
                onClick={isRunning ? stopTimer : startTimer}
                className="mt-3 w-[25%] bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isRunning ? "Stop" : "Start"}
              </button>

              <div className="mt-1 h-auto">
                <canvas
                  className="w-full h-[90%]"
                  ref={chartRef}
                  id="weeklyChart"
                ></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showSettings && (
        <>
          <div
            className="flex flex-col items-center h-[100%]"
            style={{ width: "100%" }}
          >
            <svg className="w-full h-full" viewBox="0 0 30 30">
              <circle
                className="py-4"
                cx="15"
                cy="15"
                r="10"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="2"
              ></circle>
              <circle
                id="timerCircle"
                cx="15"
                cy="15"
                r={radius}
                fill="none"
                stroke="#271E2499"
                strokeWidth="2"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset:
                    circumference * (1 - timeLeft / (reminderInterval * 60)),
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
              <text
                id="timerText"
                x="15"
                y="15"
                textAnchor="middle"
                dy=".3em"
                fontSize="4"
                className="font-bold"
                fill="white"
              >
                {`${Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </text>
            </svg>

            <div className="flex space-x-4 mb-3">
              <button
                onClick={startTimer}
                disabled={isRunning}
                className={`py-1 px-2 rounded-lg font-bold text-[11px] text-black uppercase ${
                  isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 "
                }`}
              >
                Start
              </button>
              <button
                onClick={stopTimer}
                disabled={!isRunning}
                className={`py-1 px-3 rounded-lg font-bold text-[11px] text-black uppercase ${
                  isRunning ? "bg-red-900" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                stop
              </button>
            </div>
          </div>
        </>
      )}

      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-4 uppercase text-gray-800 dark:text-gray-200">
              Exercise Time!
            </h2>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleExerciseResponse(true)}
                className="bg-green-900 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              >
                I exercised
              </button>

              <button
                onClick={() => handleExerciseResponse(false)}
                className="bg-red-900 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              >
                I didn't exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;
