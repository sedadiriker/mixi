import React, { useState, useEffect } from 'react';
import { toastWarnNotify, toastSuccessNotify } from '../../../helper/ToastNotify'; 
import './Alarms.css';
import AlarmModal from './AlarmModal'; 

const Alarms = () => {
  const getInitialAlarms = () => {
    const storedAlarms = localStorage.getItem('alarms');
    console.log(storedAlarms, "stored");
    if (!storedAlarms) {
      const defaultAlarms = [
        { id: 1, name: 'Alarm 1', time: '04:00', info: 'Daily | Alarm in 18 hours', isActive: true },
        { id: 2, name: 'Alarm 2', time: '05:30', info: 'Daily', isActive: true },
        { id: 3, name: 'Alarm 3', time: '06:00', info: 'Daily', isActive: true },
        { id: 4, name: 'Alarm 4', time: '07:00', info: 'Weekly', isActive: true },
        { id: 5, name: 'Alarm 5', time: '08:00', info: 'Monthly', isActive: true },
      ];
      localStorage.setItem('alarms', JSON.stringify(defaultAlarms));
      return defaultAlarms;
    }
    return JSON.parse(storedAlarms);
  };
  
  const [alarms, setAlarms] = useState(getInitialAlarms);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [audio, setAudio] = useState(null);
  const [newAlarm, setNewAlarm] = useState({  name: '', time: '', info: '', isActive: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAlarms();
    }, 60000); 
  
    return () => clearInterval(interval);
  }, [alarms]);
  
  

  const checkAlarms = () => {
    const now = new Date();
    alarms.forEach(alarm => {
      if (alarm.isActive) {
        const [hours, minutes] = alarm.time.split(':');
        const alarmTime = new Date();
        alarmTime.setHours(hours);
        alarmTime.setMinutes(minutes);
        alarmTime.setSeconds(0);
  
        if (now.getHours() === alarmTime.getHours() && now.getMinutes() === alarmTime.getMinutes()) {
          playAlarmSound();
          setTimeout(() => {
            setActiveAlarm(alarm);
            setModalOpen(true);
          }, 0);
        }
      }
    });
  };
  
  

  const snoozeAlarm = (id) => {
    const snoozeTime = 5; // 5 dakika
    const updatedAlarms = alarms.map((alarm) => {
      if (alarm.id === id) {
        const [hours, minutes] = alarm.time.split(':');
        let newDate = new Date();
        newDate.setHours(hours);
        newDate.setMinutes(parseInt(minutes) + snoozeTime); // 5 dakika ekle
  
        const newHours = newDate.getHours().toString().padStart(2, '0');
        const newMinutes = newDate.getMinutes().toString().padStart(2, '0');
        
        return { ...alarm, time: `${newHours}:${newMinutes}` };
      }
      return alarm;
    });
    
    setAlarms(updatedAlarms); // Durum güncellemesini burada yapın
    stopAlarm(); // Mevcut alarm sesini durdur
    setModalOpen(false); // Modalı kapat
    toastSuccessNotify('Alarm snoozed for 5 minutes');
  };
  

const playAlarmSound = () => {
  const audioInstance = new Audio('/sounds/timesUp.mp3');
  audioInstance.loop = true;
  audioInstance.play();
  setAudio(audioInstance);
  console.log("Alarm sound played"); 
};


  const stopAlarm = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      
      setTimeout(() => {
        setActiveAlarm(null);
        setModalOpen(false); 
      }, 0);
    }
  };
  

  const toggleAlarm = (id) => {
    setAlarms(prevAlarms =>
      prevAlarms.map(alarm =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9); 
  };
  
  const handleAddOrUpdateAlarm = () => {
    if (newAlarm.id) {
      setAlarms(prevAlarms =>
        prevAlarms.map(alarm =>
          alarm.id === newAlarm.id ? { ...newAlarm } : alarm
        )
      );
      toastSuccessNotify('Alarm updated successfully!');
    } else {
      // Yeni alarm ekleme
      const newId = generateUniqueId(); // Eşsiz ID oluştur
      const alarmToAdd = { id: newId, ...newAlarm }; // ID'yi burada ata
  
      // Alarmları güncelle
      setAlarms(prevAlarms => [
        ...prevAlarms,
        alarmToAdd,
      ]);
      toastSuccessNotify('New alarm added successfully!');
    }
  
    setModalOpen(false);
    setNewAlarm({  name: '', time: '', info: '', isActive: true });
  };

  const handleEditAlarm = (alarm) => {
    setNewAlarm({ ...alarm }); 
    setModalOpen(true);
  };

  const handleDeleteAlarm = (id, event) => {
    event.stopPropagation(); 
    const confirmDelete = window.confirm('Are you sure you want to delete this alarm?');
    
    console.log('Delete confirmation:', confirmDelete);
    
    if (confirmDelete) {
      console.log('Deleting alarm with ID:', id);
  
      setAlarms(prevAlarms => {
        const updatedAlarms = prevAlarms.filter(alarm => alarm.id !== id);
        toastWarnNotify('Alarm deleted successfully!');
        return updatedAlarms; 
      });
    }
  };
  
  return (
   <div className="alarm-container relative h-[100%]">
     <div className="alarm-list h-[100%] ">
      <div className="settings-icon-alarm" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>
     
      {alarms.map(alarm => (
        <div key={alarm.id} className={`alarm ${!alarm.isActive ? 'off' : ''}`}>
          <div className="alarm-details">
            <div className="alarm-name text-[8px] 2xl:text-[12px]">{alarm.name}</div>
            <div className="alarm-time text-[14px] 2xl:text-[17px]" style={{ position: 'relative' }}>
              {alarm.time}
              <span className="text-[8px] 2xl:text-[10px]" style={{ position: 'absolute', top: 0,}}>AM</span>
            </div>
            <div className="alarm-info text-[8px] 2xl:text-[10px]">{alarm.info}</div>
          </div>
          <div className="alarm-toggle">
            <label className="switch w-[20px] h-[9px] 2xl:w-[25px] 2xl:h-[12px]">
              <input type="checkbox" checked={alarm.isActive} onChange={() => toggleAlarm(alarm.id)} />
              <span className="slider round before:w-[10px] before:h-[10px] 2xl:before:w-[13px] 2xl:before:h-[13px]"></span>
            </label>
          </div>
          <div className="alarm-actions">
            <button onClick={() => handleEditAlarm(alarm)} className="icon-button">
              <i className="fas fa-edit"></i>
            </button>
            <button onClick={(e) => handleDeleteAlarm(alarm.id, e)} className="icon-button">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      ))}

      {modalOpen && (
        <AlarmModal 
          activeAlarm={activeAlarm}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newAlarm={newAlarm}
          setNewAlarm={setNewAlarm}
          alarms={alarms}
          handleAddOrUpdateAlarm={handleAddOrUpdateAlarm}
          toggleAlarm={toggleAlarm}
          handleEditAlarm={handleEditAlarm}
          handleDeleteAlarm={handleDeleteAlarm}
          stopAlarm={stopAlarm}
          snoozeAlarm={snoozeAlarm}
        />
      )}
    </div>
   </div>
  );
};

export default Alarms;
