import React, { useState, useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css'; // Quill CSS
import Quill from 'quill';

const ModalNotes = ({ isOpen, onClose, notes, setNotes }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (isOpen && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        }
      });

      // Cleanup function
      return () => {
        if (quillInstance.current) {
          quillInstance.current = null; // Reset the Quill instance
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    // Load the selected note into Quill when currentNoteIndex changes
    if (quillInstance.current) {
      if (currentNoteIndex !== -1) {
        quillInstance.current.root.innerHTML = notes[currentNoteIndex].body;
      } else {
        quillInstance.current.root.innerHTML = '';
      }
    }
  }, [currentNoteIndex, notes]);

  const toggleSize = () => {
    setIsMinimized((prev) => !prev);
  };

  const createTitle = (body) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = body;
    const text = tempElement.textContent || tempElement.innerText;
    const words = text.trim().split(/\s+/);
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
  };

  const normalizeHtml = (html) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Replace <p> tags with their inner text
    const paragraphs = tempElement.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (p.innerHTML.trim()) {
        // Replace <p> with its text content
        const textNode = document.createTextNode(p.innerText);
        tempElement.replaceChild(textNode, p);
      } else {
        // Remove empty <p> tags
        p.remove();
      }
    });

    return tempElement.innerHTML.trim();
  };

  const saveNote = () => {
    const body = normalizeHtml(quillInstance.current.root.innerHTML);
    if (body) {
      const title = createTitle(body);
      setNotes((prev) => {
        const updatedNotes = [...prev];
        if (currentNoteIndex === -1) {
          updatedNotes.push({ title, body });
        } else {
          updatedNotes[currentNoteIndex] = { title, body };
        }
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        return updatedNotes;
      });
      setCurrentNoteIndex(-1);
      quillInstance.current.root.innerHTML = ''; // Clear editor after save
    }
  };

  const deleteNote = () => {
    if (currentNoteIndex !== -1) {
      setNotes((prev) => {
        const updatedNotes = [...prev];
        updatedNotes.splice(currentNoteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        return updatedNotes;
      });
      setCurrentNoteIndex(-1);
      quillInstance.current.root.innerHTML = ''; // Clear editor after delete
    }
  };

  const newNote = () => {
    setCurrentNoteIndex(-1);
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = '';
    }
  };

  const selectNote = (index) => {
    setCurrentNoteIndex(index);
  };

  const renderNoteList = () => {
    const filteredNotes = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filteredNotes.map((note, index) => (
      <div key={index} className={`note-item ${index === currentNoteIndex ? 'active' : ''}`} onClick={() => selectNote(index)}>
        {note.title}
      </div>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-notes">
      <div className={`modal-content-notes flex justify-center ${isMinimized ? 'minimized' : ''}`}>
      <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
          <img className="w-full logo-modal" src="images/logo.png" alt="" />
        </div>
        
        <div id="note-widget" className={isMinimized ? 'minimized' : ''}>
          <div id="widget-header">
            <div id="widget-title">Take Notes</div>
            <div className="flex gap-3">
              <button id="resize-button" onClick={toggleSize}>
                {isMinimized ? <i className="fas fa-expand-alt"></i> : <i className="fas fa-compress-alt"></i>}
              </button>
              <button className="close text-[20px]" onClick={onClose}>&times;</button>
            </div>
          </div>
          <div id="note-content-wrapper">
            <div id="note-sidebar">
              <input
                type="text"
                id="search-box"
                className="text-[12px] outline-none text-black"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div id="note-list">
                {renderNoteList()}
              </div>
            </div>
            <div id="note-content">
              <div ref={quillRef} id="note-body"></div>
              <div className="flex gap-2 mt-1 justify-end">
                <button id="new-note" onClick={newNote}>New Note</button>
                <button id="save-note" onClick={saveNote}>Save</button>
                <button id="delete-note" onClick={deleteNote}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNotes;
