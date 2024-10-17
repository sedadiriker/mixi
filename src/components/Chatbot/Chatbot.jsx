import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const OPENAI_API_KEY = process.env.REACT_APP_openapikey;
const ELEVENLABS_API_KEY = process.env.REACT_APP_elevenlab;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

let conversationHistory = [];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [settings, setSettings] = useState(false);
  const [userName, setUserName] = useState("");


const handleClickConfirm = () => {
  setSettings(false)
  
}
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "tr-TR";

      rec.onstart = () => {
        console.log("Microphone is active");
      };

      rec.onend = () => {
        console.log("Microphone is inactive");
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      setRecognition(rec);
    } else {
      console.log("Web Speech API is not supported in this browser.");
    }
  }, []);

  const handleClickSettings = () => {
    setSettings(!settings);
  };
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);
  const handleSend = async (textToSend) => {
    const message = textToSend || inputValue;
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);

      const response = await getBotResponse(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, sender: "bot" },
      ]);

      setInputValue("");
      await synthesizeSpeech(response);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleMicrophone = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        console.log("Stopping recognition");
        setIsListening(false);
      } else {
        // Bot sesi çalıyorsa durdur
        if (audioElement) {
          audioElement.pause(); // Botun sesini durdur
          audioElement.currentTime = 0; // Sesin başa sarılmasını sağlar
        }
        recognition.start();
        console.log("Starting recognition");
        setIsListening(true);
      }
    }
  };

  const synthesizeSpeech = async (text) => {
    try {
      // Eğer önceden çalan bir ses varsa durdur
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0; // Sesin başa sarılmasını sağlar
      }

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        {
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudioElement = new Audio(audioUrl);
      newAudioElement.play();
      setAudioElement(newAudioElement);
    } catch (error) {
      console.error("Error in speech synthesis:", error);
    }
  };

  const getBotResponse = async (userInput) => {
    const systemMessage = document.getElementById("system-message").value;
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemMessage },
            ...conversationHistory,
            { role: "user", content: userInput },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  };

  const handleCloseChatbot = () => {
    setIsOpen(false);
    setMessages([]);

    // Stop the audio if it's currently playing
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reset audio to the beginning
    }
  };

  useEffect(() => {
    if (isOpen) {
      if(userName){
        handleSend(`Merhaba ben ${userName}`)
      }else{
        handleSend('Merhaba')
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`chatbot right-[60px] 2xl:right-[100px] top-[60%] 2xl:top-[58%] ${
        isOpen ? "open top-[26%] 2xl:top-[33%]" : "closed"
      }`}
    >
      <span
        onClick={handleClickSettings}
        className={`absolute top-0 right-5 cursor-pointer ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <i class="fa-solid fa-gear"></i>
      </span>
      {isOpen ? (
        <div className="chatbot-container relative">
          <div className="chatbot-content relative">
            <div className="chatbot-header"></div>
            <div className="chatbot-messages absolute">
              {settings ? (
                <div className="text-white">
                <div className="flex flex-col items-start gap-1">
                  <label htmlFor="system-message" className="text-[11px] text-center text-[#5EC1FF]">System Message :</label>
                  <textarea
                    className="text-white bg-black border-gray-600 border border-1 outline-none text-[11px] resize-none rounded px-2 py-1 w-full"
                    id="system-message"
                    rows="2"
                    defaultValue="You are a helpful assistant."
                  />
                </div>
                <div className="flex flex-col item-start gap-1 mt-4">
                <label htmlFor="user-name" className="text-[11px] text-[#5EC1FF]">Your Name :</label>
                  <input
                    type="text"
                    className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                    id="user-name"
                    placeholder="Enter your name"
                    onChange={(e)=> setUserName(e.target.value)}
                  />
                </div>

              </div>
              
              ) : (
                <div>
                  {messages.map(
                    (msg, index) =>
                     
                        <div
                          key={index}
                          className={`${
                            msg.sender === "user"
                              ? "user-message"
                              : "bot-message"
                          } text-white`}
                        >
                          <div>{msg.text}</div>
                        </div>
                      
                  )}
                </div>
              )}
            </div>
            <button
              className="border-none cursor-pointer absolute bottom-1 right-[47%] z-[5346456456]"
              onClick={toggleMicrophone}
            >
              <i
                className="fa-solid fa-microphone"
                style={{
                  color: isListening ? "red" : "white",
                  fontSize: "16px",
                }}
              ></i>
            </button>
          </div>
          <div className="chatbot-input relative mt-2 rounded w-[200px]">
            {
              settings ? (<div className="flex justify-center">
                <button onClick={handleClickConfirm} ><i style={{color:"#68CBFF", fontSize:"1.5rem"}} class="fa-solid fa-check"></i></button>
              </div>) : (
                <div>
            <input
              className="p-2 w-full pr-10 text-[12px] rounded-full"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <button
              className="absolute right-2 top-2 bg-transparent border-none cursor-pointer"
              onClick={handleSend}
            >
              <i class="fa-solid fa-play" style={{ color: "#00C0FF" }}></i>
            </button>
            </div>
              )
            }
          </div>
          <div
            className="chatbot-circle-open w-[100px] h-[100px]"
            onClick={handleCloseChatbot}
          >
            <img
              src="images/chatbot.png"
              alt="Bot"
              className="chatbot-icon-open w-[100%] h-[100%] object-cover rounded-full cursor-pointer border-[5px] border-black"
              width={50}
            />
          </div>
        </div>
      ) : (
        <div
          className="chatbot-circle w-[60px] h-[60px] 2xl:w-[100px] 2xl:h-[100px]"
          onClick={() => setIsOpen(true)}
        >
          <img
            src="images/chatbot.png"
            alt="Bot"
            className="chatbot-icon w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
