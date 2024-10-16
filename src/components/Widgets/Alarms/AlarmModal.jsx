import React from "react";

const AlarmModal = ({
  activeAlarm,
  modalOpen,
  setModalOpen,
  newAlarm,
  setNewAlarm,
  alarms,
  handleAddOrUpdateAlarm,
  toggleAlarm,
  handleEditAlarm,
  handleDeleteAlarm,
  stopAlarm,
  snoozeAlarm,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
          <img className="w-full logo-modal" src="images/logo.png" alt="" />
        </div>
        <span
          className="close-button text-white"
          onClick={() => setModalOpen(false)}
        >
          &times;
        </span>
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
              <h2
                className="text-center uppercase text-black"
                style={{ letterSpacing: "2px" }}
              >
                Alarm: {activeAlarm.name}
              </h2>
              <p className="text-black text-center">{activeAlarm.info}</p>
            </div>
            <div className="flex justify-center mt-2 ">
              <button onClick={stopAlarm}>Close Alarm</button>
              <button onClick={() => snoozeAlarm(activeAlarm.id)}>
                Snooze Alarm
              </button>
            </div>
          </>
        )}

        {!activeAlarm && (
          <>
            <h2
              className="text-center uppercase 2xl:text-[18px] text-[#404751] py-4 2xl:py-6"
              style={{ letterSpacing: "2px" }}
            >
              alarm settings
            </h2>
            <hr className=" opacity-25 my-1" />

            <div className="flex gap-10 px-5 py-20 mt-5 2xl:mt-20">
              <div className="flex-1">
                <h3
                  className="text-center uppercase mb-2 text-white text-[13px] py-3 2xl:text-[16px] 2xl:mb-5"
                  style={{ letterSpacing: "2px" }}
                >
                  {newAlarm.id ? "Edit Alarm" : "Add New Alarm"}
                </h3>

                <div className="flex flex-col 2xl:gap-3">
                  <div className="flex justify-center">
                    <input
                      className="w-[60%] mx-auto bg-gray-400 text-black 2xl:py-4 p-2"
                      type="text"
                      placeholder="Alarm Name"
                      value={newAlarm.name}
                      onChange={(e) =>
                        setNewAlarm({ ...newAlarm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      className="w-[60%] mx-auto bg-gray-400 2xl:py-4 p-2"
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) =>
                        setNewAlarm({ ...newAlarm, time: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      className="w-[60%] mx-auto bg-gray-400 2xl:py-4 p-2"
                      type="text"
                      placeholder="Additional Info"
                      value={newAlarm.info}
                      onChange={(e) =>
                        setNewAlarm({ ...newAlarm, info: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-5">
                  <button
                    className=" uppercase text-[10px] 2xl:text-[15px] bg-gray-800 p-3 rounded"
                    onClick={handleAddOrUpdateAlarm}
                  >
                    {newAlarm.id ? "Update Alarm" : "Add Alarm"}
                  </button>
                  {/* <button onClick={() => setModalOpen(false)}>Close</button> */}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-center uppercase mb-2 text-white text-[13px] py-3 2xl:text-[16px]">
                  Existing Alarms
                </h3>
                <div className="existing-alarms py-1 max-h-[300px] 2xl:max-h-[400px] 2xl:w-[90%] mx-auto">
                  {alarms.map((alarm) => (
                    <div
                      key={alarm.id}
                      className={`alarm ${!alarm.isActive ? "off" : ""}`}
                    >
                      <div className="alarm-details px-5">
                        <div className="alarm-name">{alarm.name}</div>
                        <div className="alarm-time">
                          <span className="alarm-timing">{alarm.time}</span> AM
                        </div>
                        <div className="alarm-info">{alarm.info}</div>
                      </div>
                      <div className="alarm-toggle px-5">
                        <label className="switch w-[20px] h-[9px] 2xl:w-[30px] 2xl:h-[12px]">
                          <input
                            type="checkbox"
                            checked={alarm.isActive}
                            onChange={() => toggleAlarm(alarm.id)}
                          />
                          <span className="slider round before:w-[10px] before:h-[10px] 2xl:before:w-[13px] 2xl:before:h-[13px]"></span>
                        </label>
                      </div>
                      <div className="alarm-actions">
                        <button
                          onClick={() => handleEditAlarm(alarm)}
                          className="icon-button"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={(e) => handleDeleteAlarm(alarm.id, e)}
                          className="icon-button"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
