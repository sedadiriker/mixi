import React, { useState, useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, shortcuts, setShortcuts }) => {
  const [shortcutName, setShortcutName] = useState("");
  const [shortcutUrl, setShortcutUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    if (currentIndex !== null) {
      const shortcut = shortcuts[currentIndex];
      setShortcutName(shortcut.name);
      setShortcutUrl(shortcut.url);
    } else {
      setShortcutName("");
      setShortcutUrl("");
    }
  }, [currentIndex, shortcuts]);

  const handleSave = () => {
    if (shortcutName.trim() && shortcutUrl.trim()) {
      let formattedUrl = shortcutUrl;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `http://${formattedUrl}`;
      }

      const newShortcut = {
        name: shortcutName,
        url: formattedUrl,
      };

      if (currentIndex !== null) {
        // Düzenleme yapılmışsa
        const updatedShortcuts = shortcuts.map((shortcut, index) =>
          index === currentIndex ? newShortcut : shortcut
        );
        setShortcuts(updatedShortcuts);
      } else {
        setShortcuts([...shortcuts, newShortcut]);
      }

      setShortcutName("");
      setShortcutUrl("");
      setCurrentIndex(null);
    } else {
      alert("Please enter a name and a URL.");
    }
  };

  const handleEdit = (index) => {
    setCurrentIndex(index);
  };

  const handleDelete = (index) => {
    const updatedShortcuts = shortcuts.filter((_, i) => i !== index);
    setShortcuts(updatedShortcuts);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-shortcuts">
      <div className="modal-content-shortcuts">
        <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
          <img className="w-full logo-modal" src="images/logo.png" alt="" />
        </div>
        <span className="close-button text-white" onClick={onClose}>
          &times;
        </span>
        <h2
          className="text-center uppercase 2xl:text-[18px] text-[#404751] py-4 2xl:py-6"
          style={{ letterSpacing: "2px" }}
        >
          shortcuts settings
        </h2>
        <hr className=" opacity-25 my-1" />

        <div className="flex gap-10 px-5 py-20 mt-5 2xl:mt-20">
          <div className="flex flex-col gap-5 w-100 flex-1">
            <h3 className="text-center uppercase mb-2 text-white text-[13px] py-3 2xl:text-[16px] 2xl:mb-5">
              add shortcuts
            </h3>
            <input
              className="p-2 py-3 flex-1 outline-none text-[12px] text-black w-[60%] mx-auto bg-gray-400"
              type="text"
              placeholder="Shortcuts Name"
              value={shortcutName}
              onChange={(e) => setShortcutName(e.target.value)}
            />
            <input
              className="p-2 py-3 flex-1 outline-none text-[12px] text-black w-[60%] mx-auto bg-gray-400"
              type="text"
              placeholder="URL"
              value={shortcutUrl}
              onChange={(e) => setShortcutUrl(e.target.value)}
            />
            <div className="flex justify-center">
              <button
                className=" uppercase text-[10px] 2xl:text-[15px] bg-gray-800 p-3 rounded text-white mt-5"
                onClick={handleSave}
              >
                {currentIndex !== null ? "Update Shortcut" : "Add Shortcut"}
              </button>
            </div>
          </div>

          {/* Kısayollar Listesi */}
          <div className="mt-2 flex-1">
            <h3 className="text-white py-2 text-[13px]">Shortcuts List:</h3>
            <div className="shortcuts-list max-h-[300px]">
              {shortcuts.length > 0 ? (
                shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="shortcut-item flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${shortcut.url}`}
                        alt={`${shortcut.name} favicon`}
                        className="w-[20px] h-[20px] mr-3 "
                      />
                      <strong className="text-[16px] uppercase mr-5 text-gray-500 px-1 w-[200px] ">
                        {shortcut.name}
                      </strong>{" "}
                      {" "}
                      <span className="text-[15px] text-gray-500">
                        {shortcut.url}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                      >
                        <i className="fas fa-edit" aria-hidden="true"></i>{" "}
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                      >
                        <i className="fas fa-trash" aria-hidden="true"></i>{" "}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-[12px]">
                  You haven't added any shortcuts yet!
                  <br /> Click to add a new shortcut.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
