import React, { useState, useEffect } from 'react';
import './Quotes.css'; 
import { toastWarnNotify, toastSuccessNotify } from '../../../helper/ToastNotify'; 

const Quotes = () => {
  const [quotes, setQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem('quotes');
    return savedQuotes ? JSON.parse(savedQuotes) : [
      "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
    ];
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isScrolling) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes, isScrolling]);

  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  const goToNextQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  };

  const goToPreviousQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
  };

  const openModal = (index) => {
    if (index !== undefined) {
      setNewQuote(quotes[index]);
      setEditIndex(index);
    } else {
      setNewQuote('');
      setEditIndex(null);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedQuotes = [...quotes];
      updatedQuotes[editIndex] = newQuote;
      setQuotes(updatedQuotes);
      toastSuccessNotify("Quote updated successfully!");
    } else {
      setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
      toastSuccessNotify("Quote added successfully!");
    }
    closeModal();
  };

  const handleDelete = (index) => {
    setQuotes((prevQuotes) => prevQuotes.filter((_, i) => i !== index));
    if (currentIndex === index) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
    }
    toastWarnNotify("Quote deleted successfully!");
  };

  return (
    <div className="quotes-widget relative" style={{ textAlign: 'center', padding: '10px' }}>
      <div className="settings-icon-quotes" onClick={() => openModal()}>
        <i className="fas fa-cog"></i>
      </div>
      <div
        className="quote-display"
        onWheel={(e) => {
          e.preventDefault();
          setIsScrolling(true);
          if (e.deltaY > 0) {
            goToNextQuote();
          } else {
            goToPreviousQuote();
          }
        }}
      >
        <p className="text-gray-400 h-[120px]" style={{ fontStyle: 'italic', fontSize: '10px', letterSpacing: '1px' }}>
          {quotes[currentIndex]}
        </p>
      </div>
  
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            
            <h2 className="text-center uppercase mb-1 my-3 mb-5" style={{ letterSpacing: "2px" }}>{editIndex !== null ? 'Edit Quote' : 'Add New Quote'}</h2>
            <div className="flex flex-col items-center gap-3">
              <textarea
                className="text-black fixed-textarea rounded text-[11px]"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                rows="1"
                cols="28"
                placeholder='Add new quote'
              />
              <button className="my-2 bg-gray-600 p-2 rounded" onClick={handleSave}>
                {editIndex !== null ? 'Update Quote' : 'Add Quote'}
              </button>
            </div>
  
            <div className="quotes-list">
              {quotes.map((quote, index) => (
                <div key={index} className="quote-item">
                  <span className="italic text-[10px]">{quote}</span>
                  <div>
                    <button onClick={() => openModal(index)} style={{ marginLeft: '10px', fontSize: "12px" }}>
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px', fontSize: "12px" }}>
                      🗑️
                    </button>
                  </div>
                  <hr className="opacity-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;
