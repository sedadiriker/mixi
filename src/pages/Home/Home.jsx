import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import SettingsComponent from "../../components/SettingsComponent";
import Chatbot from "../../components/Chatbot/Chatbot";

const Home = () => {
  const [selectedEngine, setSelectedEngine] = useState("google");
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gptResponse, setGptResponse] = useState(""); 

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=45d2ff09083bc5958";
    script.async = true;
    document.body.appendChild(script);

    const observer = new MutationObserver(() => {
      const searchResultsContainer = document.querySelector(".gsc-results-wrapper-nooverlay");
      if (searchResultsContainer) {
        const visible = searchResultsContainer.classList.contains("gsc-results-wrapper-visible");
        setIsVisible(visible);

        const search = document.getElementById("gsc-i-id1");
        setSearchTerm(search.value); 
        fetchGptResponse(search.value);
      }
    });

    const checkForSearchResultsContainer = setInterval(() => {
      const searchResultsContainer = document.querySelector(".gsc-results-wrapper-nooverlay");
      if (searchResultsContainer) {
        observer.observe(searchResultsContainer, { attributes: true, childList: true, subtree: true });
        clearInterval(checkForSearchResultsContainer);
      }
    }, 100);

    script.onload = () => {
      // console.log("Google CSE yüklendi");
    };

    return () => {
      document.body.removeChild(script);
      observer.disconnect();
      clearInterval(checkForSearchResultsContainer);
    };
  }, []);
const apikey = process.env.REACT_APP_openapikey
  const fetchGptResponse = async (term) => {
    if (term) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: term }
            ],
            max_tokens: 150
          })
        });
        const data = await response.json();
        setGptResponse(data.choices[0].message.content); // Yanıtı state'e set et
      } catch (error) {
        console.error("Hata:", error);
      }
    }
  };

  return (
    <div className="flex flex-col bg-white w-[100%] mx-auto h-[100vh]">
      <main className={`search-main flex-grow p-4 ${isVisible ? "mt-[-5rem]" : "mt-20"}`}>
        <div>
          <div className="w-full">
            <img
              className="m-auto mt-10 logo"
              src="images/logo.png"
              width={130}
              alt="Logo"
            />
          </div>
          <div className={`search-container relative`}>
            <div className="gcse-search"></div>
            <div className="search-arrow">Ara</div>
          </div>
          {/* <div>          <Chatbot /></div> */}
          {showSettings && (
            <SettingsComponent
              selectedEngine={selectedEngine}
              setSelectedEngine={setSelectedEngine}
              showSettings={showSettings}
            />
          )}
        </div>
        
        {/* GPT Yanıtı */}
        <div className="gpt-response">
          <h3>GPT Response:</h3>
          <p>{gptResponse}</p>
        </div>
      </main>
      <Footer hasSearchResults={isVisible} />
    </div>
  );
};

export default Home;
