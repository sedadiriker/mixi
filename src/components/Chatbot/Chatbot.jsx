import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Chatbot.css";

const OPENAI_API_KEY = process.env.REACT_APP_openapikey;
const ELEVENLABS_API_KEY = process.env.REACT_APP_elevenlab;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

let conversationHistory = [];

const Chatbot = ({isVisible}) => {

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [settings, setSettings] = useState(false);
  const [userName, setUserName] = useState("");
  const [systemMessage, setSystemMessage] = useState(
    "You are a helpful assistant."
  );
  const [botName, setBotName] = useState("");
  const [botPersonality, setBotPersonality] = useState("");
  const [botMemories, setBotMemories] = useState("");
  const [botMood, setBotMood] = useState("");
  const [botImage, setBotImage] = useState(
    localStorage.getItem("botImage") || "images/character/chatbot.png"
  );
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    const savedCharacter = localStorage.getItem("selectedCharacter");
    if (savedCharacter) {
      try {
        return JSON.parse(savedCharacter);
      } catch (error) {
        console.error("Error parsing selectedCharacter from localStorage:", error);
      }
    }
    return characters[0]; // Varsayılan değer
  });
  
  const [characterSettings, setCharacterSettings] = useState(false);


  const changeCharacter = () => {
    const currentIndex = characters.findIndex(
      (character) => character.id === selectedCharacter.id
    );
    const nextIndex = (currentIndex + 1) % characters.length;
    const newCharacter = characters[nextIndex];

    setSelectedCharacter(newCharacter);
    localStorage.setItem("selectedCharacter", JSON.stringify(newCharacter));
    setBotImage(newCharacter.image);
  };

  const characters = [
    { id: 1, name: "Alice", image: "images/character/chatbot.png" },
    { id: 2, name: "Peter", image: "images/character/chatbot2.jpg" },
    { id: 3, name: "Suzan", image: "images/character/chatbot3.jpg" },
  ];

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character.name);
    setBotImage(character.image);
    localStorage.setItem("selectedCharacter", JSON.stringify(character));
    localStorage.setItem("botImage", character.image);
    setCharacterSettings(true);
  };
  useEffect(() => {
    const savedCharacter = JSON.parse(
      localStorage.getItem("selectedCharacter")
    );
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter.name);
      setBotImage(savedCharacter.image);
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setBotImage(imageUrl);
        localStorage.setItem("botImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setBotImage("images/chatbot.png");
    localStorage.removeItem("botImage");
  };

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
    conversationHistory.push({ role: "user", content: message });

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
        if (audioElement) {
          audioElement.pause(); 
          audioElement.currentTime = 0;
        }
        recognition.start();
        console.log("Starting recognition");
        setIsListening(true);
      }
    }
  };

  const synthesizeSpeech = async (text) => {
    try {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
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
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: `${systemMessage},${botMood}` },
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

    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (userName) {
        handleSend(`Merhaba ben ${userName}`);
      } else {
        handleSend("Merhaba");
      }
    }
  }, [isOpen]);


  // console.log(isVisible,"ch")
  return (
    <div
      className={`${isVisible ? "top-[83%]" : "top-[60%]"} chatbot right-[60px] 2xl:right-[100px]  2xl:top-[58%] ${
        isOpen ? "open top-[200px] 2xl:top-[25%]" : ""
      } ${settings ? "2xl:top-[23%]" : ""}`}
    >
      <span
        className={`absolute top-[100px] right-5 cursor-pointer ${!isOpen ? "hidden" : ""}`}
        onClick={changeCharacter}
      >
        <i
          style={{ fontSize: "20px", opacity: "0.3" }}
          class="fa-solid fa-play"
        ></i>
      </span>
      <span
        onClick={handleClickSettings}
        className={`absolute top-0 right-5 cursor-pointer  ${
          !isOpen ? "hidden" : ""
        } ${settings ? "text-white text-[10px] top-1 " : ""}`}
      >
        <i className="fa-solid fa-gear settings-icon-bot"></i>
      </span>
      {isOpen ? (
        <div>
          {settings ? (
            <div className="text-white bg-black p-3 py-5 max-h-[40vh] overflow-y-scroll rounded-xl">
              {characterSettings ? (
                <div className=" relative">
                  <span
                    onClick={() => setCharacterSettings(false)}
                    className="absolute top-[-1.8rem] right-6 cursor-pointer"
                  >
                    {" "}
                    <i
                      style={{ color: "white" }}
                      class="fa-solid fa-left-long"
                    ></i>
                  </span>
                  {/* Bot Image */}
                  <div>
                    {botImage && (
                      <div className="mt-2 flex flex-col items-center">
                        <img
                          src={botImage}
                          alt="Bot"
                          className="chatbot-icon w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <button
                          className="mt-2 text-[11px] text-[#FF5E5E] border-none bg-transparent cursor-pointer"
                          onClick={handleImageRemove}
                        >
                          Delete Image
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <label
                      htmlFor="bot-image"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Bot Image:
                    </label>
                    <input
                      type="file"
                      className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                      id="bot-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {/* Bot Voice */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="bot-voice"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Bot Voice:
                    </label>
                    <select
                      className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                      id="bot-voice"
                    >
                      <option value="default">Default Voice</option>
                      <option value="female-1">Female Voice 1</option>
                      <option value="male-1">Male Voice 1</option>
                      <option value="robotic">Robotic Voice</option>
                    </select>
                  </div>

                  {/* Bot Name */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="bot-name"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Bot Name:
                    </label>
                    <input
                      type="text"
                      className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                      id="bot-name"
                      placeholder="Enter bot's name"
                      onChange={(e) => setBotName(e.target.value)}
                    />
                  </div>

                  {/* Bot Personality Traits */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="bot-personality"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Bot Personality Traits:
                    </label>
                    <textarea
                      className="text-white bg-black border-gray-600 border border-1 outline-none text-[11px] resize-none rounded px-2 py-1 w-full"
                      id="bot-personality"
                      rows="2"
                      placeholder="Enter personality traits (e.g., friendly, curious, humorous)"
                      onChange={(e) => setBotPersonality(e.target.value)}
                    />
                  </div>

                  {/* Bot Memories */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="bot-memories"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Bot Memories:
                    </label>
                    <textarea
                      className="text-white bg-black border-gray-600 border border-1 outline-none text-[11px] resize-none rounded px-2 py-1 w-full"
                      id="bot-memories"
                      rows="2"
                      placeholder="Enter memories the bot should remember"
                      onChange={(e) => setBotMemories(e.target.value)}
                    />
                  </div>

                  {/* Current Mood */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="bot-mood"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Current Mood:
                    </label>
                    <select
                      className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                      id="bot-mood"
                      onChange={(e) => setBotMood(e.target.value)}
                    >
                      <option value="friendly">Friendly</option>
                      <option value="funny">Funny</option>
                      <option value="curious">Curious</option>
                      <option value="sarcastic">Sarcastic</option>
                      <option value="cheerful">Cheerful</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* System Message */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="system-message"
                      className="text-[11px] text-center text-[#5EC1FF]"
                    >
                      System Message:
                    </label>
                    <textarea
                      className="text-white bg-black border-gray-600 border border-1 outline-none text-[11px] resize-none rounded px-2 py-1 w-full"
                      id="system-message"
                      rows="2"
                      value={systemMessage}
                      onChange={(e) => setSystemMessage(e.target.value)}
                    />
                  </div>

                  {/* Your Name */}
                  <div className="flex flex-col items-start gap-1 mt-4">
                    <label
                      htmlFor="user-name"
                      className="text-[11px] text-[#5EC1FF]"
                    >
                      Your Name:
                    </label>
                    <input
                      type="text"
                      className="text-white bg-black border border-1 border-gray-600 rounded w-full px-2 py-1 outline-none text-[11px]"
                      id="user-name"
                      placeholder="Enter your name"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-4">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className="cursor-pointer flex flex-col items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-lg group"
                      onClick={() => handleCharacterSelect(character)}
                    >
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-[60px] h-[60px] rounded-full object-cover transition-shadow duration-200 group-hover:shadow-2xl"
                        style={{ boxShadow: "0 2.5px 2px #60C4FF" }}
                      />
                      <p className="text-[12px] mt-2 transition-colors duration-200 group-hover:text-[#60C4FF]">
                        {character.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="chatbot-container relative">
              <div className="chatbot-content relative">
                <div className="chatbot-header"></div>
                <div className="chatbot-messages absolute mt-2">
                  <div>
                    {messages.map((msg, index) => {
                      if (index === 0) return null;

                      return (
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
                      );
                    })}
                  </div>
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
                    onClick={() => handleSend()}
                  >
                    <i
                      class="fa-solid fa-play"
                      style={{ color: "#00C0FF" }}
                    ></i>
                  </button>
                </div>
              </div>
              <div
                className="chatbot-circle-open relative w-[100px] h-[100px] bg-black"
                onClick={handleCloseChatbot}
                
              >
                <img
                  src={botImage}
                  alt="Bot"
                  className="chatbot-icon-open w-[100%] h-[100%] object-cover rounded-full cursor-pointer border-[5px] border-black chatbot-image"
                  width={50}
                />
                <p className="text-[#5EC1FF] text-[10px] absolute bottom-[-11px] right-9 z-50">
                  {selectedCharacter.name}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="chatbot-circle w-[60px] h-[60px] 2xl:w-[100px] 2xl:h-[100px] bg-black"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={botImage}
            alt="Bot"

            className="chatbot-icon w-[50px] h-[50px] rounded-full object-cover 2xl:w-[90px] 2xl:h-[90px]"
                      />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
