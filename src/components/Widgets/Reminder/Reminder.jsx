import React, { useState, useEffect } from "react";
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
    const ctx = document.getElementById("weeklyChart");
    if (ctx) {
      const newChart = new Chart(ctx.getContext("2d"), {
        type: "bar",
        data: {
          labels: getWeekLabels(),
          datasets: [
            {
              label: "Yapılan Egzersizler",
              data: weeklyData.done,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: "Atlanan Egzersizler",
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
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Haftalık Egzersiz Performansı",
            },
          },
        },
      });

      setChart(newChart);

      return () => {
        newChart.destroy(); // Component unmount edildiğinde chart'ı temizle
      };
    }
  }, []);

  const startTimer = () => {
    if (isRunning) return; // Eğer zaten çalışıyorsa, tekrar başlatma
    setIsRunning(true);
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setPopupVisible(true);
          playAlarmSound();
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

  const handleExerciseResponse = (done) => {
    setPopupVisible(false);
    const today = new Date().getDay();
    const updatedData = { ...weeklyData };
    if (done) {
      updatedData.done[today]++;
    } else {
      updatedData.skipped[today]++;
    }
    setWeeklyData(updatedData);
    startTimer();
  };

  const playAlarmSound = () => {
    const sound = document.getElementById("alarmSound").value;
    const audio = new Audio(`https://example.com/sounds/${sound}.mp3`);
    audio.play();
  };

  const getWeekLabels = () => {
    const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
    const today = new Date().getDay();
    return days.slice(today + 1).concat(days.slice(0, today + 1));
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings); // Ayar sayfasını göster ya da gizle
  };

  return (
    <div className="reminder-widget relative">
      <div className="settings-icon-reminder" onClick={toggleSettings}>
        <i className="fas fa-cog"></i>
      </div>

      {/* Ayar Modalı */}
      {showSettings && (
        <div className="modal">
          <div className="modal-content mt-20">
            <span className="close" onClick={closeModal}>
              &times;
            </span>

            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="reminderInterval"
                    className="block mb-2 font-semibold"
                  >
                    Hatırlatma Aralığı (dakika):
                  </label>
                  <input
                    type="number"
                    id="reminderInterval"
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-500"
                    value={reminderInterval}
                    onChange={(e) =>
                      setReminderInterval(parseInt(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="exerciseDuration"
                    className="block mb-2 font-semibold"
                  >
                    Egzersiz Süresi (dakika):
                  </label>
                  <input
                    type="number"
                    id="exerciseDuration"
                    className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-500"
                    value={exerciseDuration}
                    onChange={(e) =>
                      setExerciseDuration(parseInt(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="alarmSound"
                  className="block mb-2 font-semibold"
                >
                  Alarm Sesi:
                </label>
                <select
                  id="alarmSound"
                  className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-600 dark:border-gray-500"
                >
                  <option value="beep">Bip</option>
                  <option value="bell">Zil</option>
                  <option value="chime">Çan</option>
                </select>
              </div>

              <button
                onClick={startTimer}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isRunning ? "Durdur" : "Başlat"}
              </button>

              {/* Chart inside the modal */}
              <div className="mt-6">
                <canvas id="weeklyChart" width="400" height="200"></canvas>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showSettings && (
        <>
          <div className="mb-8 flex justify-center items-center py-2" style={{ width: "100%", height: "130px" }}>
    <svg className="w-full h-full" viewBox="0 0 30 30">
        <circle className="py-4" cx="15" cy="15" r="10" fill="none" stroke="#e0e0e0" strokeWidth="2"></circle>
        <circle 
            id="timerCircle" 
            cx="15" 
            cy="15" 
            r="10" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="2" 
            style={{ 
                strokeDasharray: `${50.3 * (1 - (timeLeft / (reminderInterval * 60)))}`, 
                transform: 'rotate(-90deg)', 
                transformOrigin: '50% 50%' 
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
            fill="white">
            {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </text>
    </svg>
</div>



          {popupVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
                <p className="mb-6 text-xl font-bold text-center">
                  Egzersiz zamanı!
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleExerciseResponse(true)}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                  >
                    Yapıldı
                  </button>
                  <button
                    onClick={() => handleExerciseResponse(false)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                  >
                    Atlandı
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reminder;
