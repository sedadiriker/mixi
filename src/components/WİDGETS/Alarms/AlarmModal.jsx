import React from 'react';

const AlarmModal = ({ activeAlarm, modalOpen, setModalOpen, newAlarm, setNewAlarm, alarms, handleAddOrUpdateAlarm, toggleAlarm, handleEditAlarm, handleDeleteAlarm, stopAlarm,snoozeAlarm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {activeAlarm && (
          <>
            <div className="flex justify-center">
              <img 
                src="./images/alarm.gif" 
                width={50} 
                height={50} 
                alt="" 
                className="shadow-xl" 
              />
            </div>
            <div className="my-3">
              <h2 className="text-center uppercase text-black" style={{ letterSpacing: "2px" }}>
                Alarm: {activeAlarm.name}
              </h2>
              <p className="text-black text-center">{activeAlarm.info}</p>
            </div>
            <div className="flex justify-center mt-2 ">
              <button onClick={stopAlarm}>Close Alarm</button>
                            <button onClick={() => snoozeAlarm(activeAlarm.id)}>Snooze Alarm</button>

            </div>
          </>
        )}

        {!activeAlarm && (
          <>
            <h2 className="text-center uppercase mb-2" style={{ letterSpacing: "2px" }}>
              {newAlarm.id ? 'Edit Alarm' : 'Add New Alarm'}
            </h2>
            <hr className="opacity-20" />
            
            <input
              type="text"
              placeholder="Alarm Name"
              value={newAlarm.name}
              onChange={(e) => setNewAlarm({ ...newAlarm, name: e.target.value })}
            />
            <input
              type="time"
              value={newAlarm.time}
              onChange={(e) => setNewAlarm({ ...newAlarm, time: e.target.value })}
            />
            <input
              type="text"
              placeholder="Additional Info"
              value={newAlarm.info}
              onChange={(e) => setNewAlarm({ ...newAlarm, info: e.target.value })}
            />

            <h3 className="text-center mt-3 text-gray-400">Existing Alarms</h3>
            <div className="existing-alarms">
              {alarms.map(alarm => (
                <div key={alarm.id} className={`alarm ${!alarm.isActive ? 'off' : ''}`} style={{ background: "black" }}>
                  <div className="alarm-details">
                    <div className="alarm-name">{alarm.name}</div>
                    <div className="alarm-time">
                      <span className="alarm-timing">{alarm.time}</span> AM
                    </div>
                    <div className="alarm-info">{alarm.info}</div>
                  </div>
                  <div className="alarm-toggle">
                    <label className="switch">
                      <input type="checkbox" checked={alarm.isActive} onChange={() => toggleAlarm(alarm.id)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="alarm-actions">
                    <button onClick={() => handleEditAlarm(alarm)} className="icon-button">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={(e) => handleDeleteAlarm(alarm.id,e)} className="icon-button">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2">
    <button onClick={handleAddOrUpdateAlarm}>
        {newAlarm.id ? 'Update Alarm' : 'Add Alarm'}
    </button>
    <button onClick={() => setModalOpen(false)}>Close</button>
</div>

          </>
        )}
      </div>
    </div>
  );
}

export default AlarmModal;
