import React, { useState, useEffect } from 'react';
import "./Notes.css";
import Modal from './ModalNotes';

const NotesSlider = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    // console.log("Loaded Notes:", savedNotes);
    if (savedNotes.length === 0) {
      const initialNotes = [
        { title: "Stay focused on your goals", body: "Stay focused on your goals, and small steps will lead to big achievements." },
        { title: "Learning something", body: "Learning something new every day keeps the mind sharp and curious. " },
        { title: "skill—practice daily", body: "Consistency is the key to mastering any skill—practice daily." },
        { title: "Take breaks when needed", body: "Take breaks when needed; rest fuels productivity and creativity." },
        { title: "A positive mindset ", body: "A positive mindset can turn challenges into opportunities for growth." }
      ];
    setNotes(initialNotes); 
    localStorage.setItem('notes', JSON.stringify(initialNotes)); 
  } else {
    console.log("Loaded Notes:", savedNotes);
    setNotes(savedNotes); 
  }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  };

  const truncateNote = (note) => {
    const maxLength = 50;
    if (note.length > maxLength) {
      return note.substring(0, maxLength) + '...';
    }
    return note;
  };

  return (
    <div className="notes-slider relative  flex flex-col">
      <div className="settings-icon-notes" onClick={handleModalOpen}>
        <i className="fas fa-cog"></i>
      </div>
      {notes.length > 0 ? (
        <div className="note-content h-[122px] overflow-y-auto flex flex-col text-gray-500 text-[12px]">
          {notes.slice().reverse().map((note, index) => ( 
            <>
            <div key={index} className="note-item flex items-center">
              <span className="bullet-point mr-2 py-1">•</span>
              <p>{truncateNote(note.body || "Note could not be loaded.")}</p>
            </div>
            <hr className=" w-[100%] opacity-10" />
            </>

          ))}
        </div>
      ) : (
        <div className="note-content text-center text-[11px] text-gray-500 h-[122px] flex items-center  justify-center">
          <p>No notes available. <br/>Click the settings icon to add your notes!</p>
        </div>
      )}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        notes={notes}
        setNotes={setNotes}
      />
    </div>
  );
};

export default NotesSlider;
