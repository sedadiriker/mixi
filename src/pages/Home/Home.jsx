import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import SettingsComponent from "../../components/SettingsComponent";
import Chatbot from "../../components/Chatbot/Chatbot";

const Home = () => {
  const [selectedEngine, setSelectedEngine] = useState("google-gpt4"); // Default to google-gpt4
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [selectedLanguage, setselectedLanguage] = useState("English");
  const settingsRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=45d2ff09083bc5958";
    script.async = true;
    document.body.appendChild(script);

    const observer = new MutationObserver(() => {
      const searchResultsContainer = document.querySelector(
        ".gsc-results-wrapper-nooverlay"
      );
      if (searchResultsContainer) {
        const visible = searchResultsContainer.classList.contains(
          "gsc-results-wrapper-visible"
        );
        setIsVisible(visible);

        const search = document.getElementById("gsc-i-id1");
        setSearchTerm(search.value);
        fetchGptResponse(search.value);
      }
    });

    const checkForSearchResultsContainer = setInterval(() => {
      const searchResultsContainer = document.querySelector(
        ".gsc-results-wrapper-nooverlay"
      );
      if (searchResultsContainer) {
        observer.observe(searchResultsContainer, {
          attributes: true,
          childList: true,
          subtree: true,
        });
        clearInterval(checkForSearchResultsContainer);
      }
    }, 100);

    script.onload = () => {
      // console.log("Google CSE loaded");
    };

    return () => {
      // document.body.removeChild(script);
      observer.disconnect();
      clearInterval(checkForSearchResultsContainer);
    };
  }, []);

  const apikey = process.env.REACT_APP_openapikey;
  const fetchGptResponse = async (term) => {
    if (term) {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apikey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: term }],
              max_tokens: 150,
            }),
          }
        );
        const data = await response.json();
        setGptResponse(data.choices[0].message.content);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchGptResponse("Merhaba");
  }, []);

  const updateArrowPosition = () => {
    const searchArrow = document.querySelector(".search-arrow");
    const form = document.querySelector(".gsc-search-box");

    if (searchArrow) {
        if (selectedEngine === "global-search") {
            if (form) {
                form.classList.add("hidden"); 
            }
            searchArrow.style.top = "12%";
        } else {
            if (form) {
                form.classList.remove("hidden");
            }
            if (showSettings) {
                searchArrow.style.top = "27.5%"; 
            } else {
                searchArrow.style.top = "48%"; 
            }
        }
        
    }
};

async function translateWithGPT(query) {
  const apiKey = `${apikey}`; 
  const url = 'https://api.openai.com/v1/chat/completions';

  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Bu ifadeyi: "${query}" ${selectedLanguage} diline çevirin. Lütfen yalnızca çevrilen metni döndürün, ek bir kelime veya karakter olmadan.`,
      },
    ],
    max_tokens: 100,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.choices && result.choices.length > 0) {
      const translatedText = result.choices[0].message.content.trim(); 
      console.log(`Çevrilen metin: ${translatedText}`);

      const searchUrl = `https://www.google.com/cse?cx=45d2ff09083bc5958&q=${encodeURIComponent(translatedText)}`;
      window.open(searchUrl, "_self"); 
    } else {
      console.error("Çeviri alınamadı:", result);
    }
  } catch (error) {
    console.error("API isteği sırasında hata:", error);
  }
}

  useEffect(() => {
    updateArrowPosition();
  }, [showSettings, selectedEngine]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedEngine === "global-search") {
      translateWithGPT(searchTerm);
    }
  };
  return (
    <div className="flex flex-col bg-white w-[100%] mx-auto h-[100vh]">
      <main
        className={`search-main flex-grow p-4 ${
          isVisible ? "mt-[-5rem]" : "mt-20"
        }`}
      >
        <div>
          <div className="w-full">
            <img
              className="m-auto mt-10 logo"
              src="images/logo.png"
              width={130}
              alt="Logo"
            />
          </div>
          {selectedEngine === "global-search" ? (
            <div
              className={`search-container`}
              onMouseEnter={() => {
                setShowSettings(true);
                updateArrowPosition(); // Ayar menüsü açıldığında oku günceller
              }}
              onMouseLeave={() => {
                setShowSettings(false);
                updateArrowPosition(); // Ayar menüsü kapandığında oku eski pozisyonuna getirir
              }}
            >
              <div className="gcse-search relative">
              </div>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className=" global-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              <div className="search-arrow"></div>

              {/* SettingsComponent will be shown here */}
              {showSettings && (
                <SettingsComponent
                  ref={settingsRef}
                  selectedEngine={selectedEngine}
                  setSelectedEngine={setSelectedEngine}
                  showSettings={showSettings}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setselectedLanguage}
                />
              )}
            </div>
          ) : (
            <div
              className={`search-container`}
              onMouseEnter={() => {
                setShowSettings(true);
                updateArrowPosition(); // Ayar menüsü açıldığında oku günceller
              }}
              onMouseLeave={() => {
                setShowSettings(false);
                updateArrowPosition(); // Ayar menüsü kapandığında oku eski pozisyonuna getirir
              }}
            >
              <div className="gcse-search">
                <div id="gsc-i-id1" className="relative"></div>
              </div>
              <div className="search-arrow"></div>

              {/* SettingsComponent will be shown here */}
              {showSettings && (
                <SettingsComponent
                  ref={settingsRef}
                  selectedEngine={selectedEngine}
                  setSelectedEngine={setSelectedEngine}
                  showSettings={showSettings}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setselectedLanguage}
                />
              )}
            </div>
          )}
        </div>

        {/* GPT Response - only show if selectedEngine is not global-search */}
        {selectedEngine !== "global-search" && (
          <div className="gpt-response">
            <h3>GPT Yanıtı:</h3>
            <p>{gptResponse}</p>
          </div>
        )}
      </main>
      <Footer hasSearchResults={isVisible} />
    </div>
  );
};

export default Home;
