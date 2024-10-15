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
        <h2 className="text-white text-center uppercase mb-2" style={{ letterSpacing: "1px" }}>
          Shortcuts
        </h2>
        <button className="cls-btn" onClick={onClose}>
          X
        </button>

        <div className="flex gap-2 w-100">
          <input
            className="p-2 flex-1 outline-none text-[12px] text-black"
            type="text"
            placeholder="Shortcuts Name"
            value={shortcutName}
            onChange={(e) => setShortcutName(e.target.value)}
          />
          <input
            className="p-1 flex-1 outline-none text-[12px] text-black"
            type="text"
            placeholder="URL"
            value={shortcutUrl}
            onChange={(e) => setShortcutUrl(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button className="bg-gray-700 p-1 px-2 rounded mt-2" onClick={handleSave}>
            {currentIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        {/* Kısayollar Listesi */}
        <div className="shortcuts-list mt-4">
          <h3 className="text-white py-2">Shortcuts List:</h3>
          {shortcuts.length > 0 ? ( // Eğer shortcuts dizisi boş değilse
            shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${shortcut.url}`}
                    alt={`${shortcut.name} favicon`}
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                      opacity: "0.6",
                    }}
                  />
                  <strong className="text-[12px] text-gray-500">
                    {shortcut.name}
                  </strong>{" "}
                  -{" "}
                  <span className="text-[12px] text-gray-400">
                    {shortcut.url}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-900" onClick={() => handleEdit(index)}>
                    <i className="fas fa-edit" aria-hidden="true"></i>{" "}
                    {/* Edit icon */}
                  </button>
                  <button className="text-red-900" onClick={() => handleDelete(index)}>
                    <i className="fas fa-trash" aria-hidden="true"></i>{" "}
                    {/* Delete icon */}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-[12px]">You haven't added any shortcuts yet!<br /> Click to add a new shortcut.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
