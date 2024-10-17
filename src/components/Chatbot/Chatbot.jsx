import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_API_KEY'; 
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Chat window open/close state
  const [recognition, setRecognition] = useState(null); // Speech recognition instance

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'tr-TR';

      rec.onstart = () => {
        console.log("Microphone is active");
      };

      rec.onend = () => {
        console.log("Microphone is inactive");
        handleSend(); // Send the message instead of sendMessage()
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(rec);
    } else {
      console.log('Web Speech API is not supported in this browser.');
    }
  }, []);

  const handleSend = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      const response = await getBotResponse(inputValue);
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
      setInputValue("");
      await synthesizeSpeech(response); // Synthesize speech for bot response
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleMicrophone = () => {
    if (recognition) {
      if (recognition.onstart) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  const synthesizeSpeech = async (text) => {
    try {
      const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }, {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    }
  };

  const getBotResponse = async (userInput) => {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', // Adjust model as necessary
        messages: [{ role: 'user', content: userInput }],
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  };

  return (
    <div className={`chatbot right-[60px] 2xl:right-[100px] top-[60%] 2xl:top-[58%] ${isOpen ? "open top-[25%] 2xl:top-[30%]" : "closed"}`}>
      {isOpen ? (
        <div className="chatbot-container relative">
          <div className="chatbot-content relative">
            <div className="chatbot-header"></div>
            <div className="chatbot-messages absolute">
              {messages.map((msg, index) => (
                <div key={index} className={`${msg.sender === "user" ? "user-message" : "bot-message"} text-white`}>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chatbot-input relative mt-2 rounded w-[200px]">
            <input
              className="p-2 rounded w-full pr-10 text-[12px]" 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress} 
              placeholder="Write a message..."
            />
            <button
              className="absolute right-2 top-2 bg-transparent border-none cursor-pointer"
              onClick={handleSend}
            >
              <i className="fas fa-search w-5 h-5"></i> {/* Font Awesome search icon */}
            </button>
            <button
              className="absolute right-12 top-2 bg-transparent border-none cursor-pointer"
              onClick={toggleMicrophone}
            >
              🎤 {/* Microphone icon */}
            </button>
          </div>
          <div className="chatbot-circle-open w-[100px] h-[100px]" onClick={() => setIsOpen(false)}>
            <img
              src="images/chatbot.png"
              alt="Bot"
              className="chatbot-icon-open w-[100%] h-[100%] object-cover rounded-full cursor-pointer border-[5px] border-black"
              width={50}
            />
          </div>
        </div>
      ) : (
        <div className="chatbot-circle w-[60px] h-[60px] 2xl:w-[100px] 2xl:h-[100px]" onClick={() => setIsOpen(true)}>
          <img src="images/chatbot.png" alt="Bot" className="chatbot-icon" />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
