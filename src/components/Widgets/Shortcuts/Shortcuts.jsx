import React, { useState, useEffect } from "react";
import "./Shortcuts.css";
import Modal from "./Modal"; 

const Shortcuts = () => {
  const [shortcuts, setShortcuts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedShortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
    
    if (savedShortcuts.length === 0) {
      const defaultShortcuts = [
        { name: "Google", url: "https://google.com" },
        { name: "LinkedIn", url: "https://linkedin.com" },
        { name: "Facebook", url: "https://facebook.com" },
        { name: "Instagram", url: "https://instagram.com" },
      ];
      setShortcuts(defaultShortcuts);
      localStorage.setItem("shortcuts", JSON.stringify(defaultShortcuts));
    } else {
      setShortcuts(savedShortcuts);
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateToShortcut = (url) => {
    window.open(url, "_blank");
  };

  const handleShortcutsUpdate = (newShortcuts) => {
    setShortcuts(newShortcuts);
    localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
  };

  return (
    <div className="shortcuts-container h-[100%] relative">
      <div className="settings-icon-shortcuts" onClick={openModal}>
        <i className="fas fa-cog"></i>
      </div>
      <div className="flex gap-5 2xl:gap-10 w-[100%] flex-wrap justify-center h-[100%] items-center">
        {shortcuts.length === 0 ? (
          <div className="no-shortcuts-message text-gray-500 text-[10px]" style={{letterSpacing:"1px", lineHeight:"16px"}}>
            You haven't added any shortcuts yet!<br /> Click the settings icon to add a new shortcut.
          </div>
        ) : (
          shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item mb-5" onClick={() => navigateToShortcut(shortcut.url)}>
              <div className="shortcut-icon">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${shortcut.url}&sz=64`}
                  alt={shortcut.name}
                  className="2xl:w-[60px] w-[30px]"
                />
              </div>
              <div className="shortcut-name text-[10px] text-gray-500">{shortcut.name}</div>
            </div>
          ))
        )}
      </div>

      {/* Modal  */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        shortcuts={shortcuts}  
        setShortcuts={handleShortcutsUpdate} // Güncelleme fonksiyonunu geçir
      />
    </div>
  );
};

export default Shortcuts;
