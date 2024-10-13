import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import SettingsComponent from "../../components/SettingsComponent";
import Chatbot from "../../components/Chatbot/Chatbot";

const Home = () => {
  const [selectedEngine, setSelectedEngine] = useState("google-gpt4");
  const [showSettings, setShowSettings] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [selectedLanguage, setselectedLanguage] = useState("English");
  const [searchResults, setSearchResults] = useState([]);
  const [imageResults, setImageResults] = useState([]);
  const [activeTab, setActiveTab] = useState("web");
  const [currentPage, setCurrentPage] = useState(1)
  const settingsRef = useRef(null);
  const searchRef = useRef(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(cachedResults.length / itemsPerPage);

  console.log(isVisible, "visible");
  console.log(imageResults);


  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > 10) return; 
    fetchSearchResults(searchTerm, newPage); 
  };
  
  
  
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
        const isCurrentlyVisible = searchResultsContainer.classList.contains(
          "gsc-results-wrapper-visible"
        );

        if (isCurrentlyVisible !== isVisible) {
          setIsVisible(isCurrentlyVisible);
        }

        const search = document.getElementById("gsc-i-id1");
        if (search) {
          const searchTerm = search.value;
          if (searchTerm !== searchTerm) {
            setSearchTerm(searchTerm);
            fetchGptResponse(searchTerm);
          }
        }
      }
    });

    // Observer'ı uygun öğe üzerinde başlatmayı unutmayın
    observer.observe(document, { childList: true, subtree: true });

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

  const fetchSearchResults = async (query, page) => {
    if (!query) {
      console.error("Arama terimi boş.");
      return;
    }
  
    const start = (page - 1) * 10 + 1;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_CX}&q=${query}&start=${start}`
      );
      const data = await response.json();
  
      if (data.items) {
        setSearchResults(data.items);
        setCachedResults(data.items);
        setCurrentPage(page);
        localStorage.setItem("searchResults", JSON.stringify(data.items));
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  
  const fetchImageResults = async (query) => {
    if (!query) {
      console.error("Görsel arama terimi boş.");
      return;
    }
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_CX}&q=${query}&searchType=image`
      );
      const data = await response.json();
      if (data.items) {
        console.log(data.items);
        setImageResults(data.items);
        localStorage.setItem("imageResults", JSON.stringify(data.items));
      } else {
        console.error("No image results found");
      }
    } catch (error) {
      console.error("Error fetching image results:", error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setShowSettings(false);
    setIsVisible(true);
    if (selectedEngine === "global-search") {
      const translated = await translateWithGPT(searchTerm);
      if (translated) {
        await fetchSearchResults(translated);
        await fetchImageResults(translated);
        setIsVisible(true);
      } else {
        console.error("Çeviri başarısız, arama yapılmadı.");
      }
    }
    console.log("çalıştı-handle");
  };

  const updateArrowPosition = () => {
    const searchArrow = document.querySelector(".search-arrow");
    const form = document.querySelector(".gsc-search-box");

    if (searchArrow) {
      if (selectedEngine === "global-search") {
        if (form) {
          form.classList.add("hidden");
        }
        searchArrow.style.top = "14%";
      } else {
        if (form) {
          form.classList.remove("hidden");
        }
        if (showSettings) {
          searchArrow.style.top = "27.5%";
        } else {
          searchArrow.style.top = "18%";
        }
      }
    }
  };

  const translateWithGPT = async (query) => {
    const apiKey = `${apikey}`;
    const url = "https://api.openai.com/v1/chat/completions";

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
        const text = result.choices[0].message.content.trim();
        console.log(`Çevrilen metin: ${text}`);
        // setTranslatedText(text); // Çeviriyi state'e kaydet
        return text; // Çevirilen metni döndür
      } else {
        console.error("Çeviri alınamadı:", result);
        return null; // Hata durumunda null döndür
      }
    } catch (error) {
      console.error("API isteği sırasında hata:", error);
      return null; // Hata durumunda null döndür
    }
  };

  useEffect(() => {
    updateArrowPosition();
  }, [showSettings, selectedEngine]);

  const handleLogoClick = () => {
    const searchInput = document.getElementById("gsc-i-id1");
    if (searchInput) {
      searchInput.value = "";
    }

    const searchResultsContainer = document.querySelector(
      ".gsc-results-wrapper-nooverlay"
    );
    if (
      searchResultsContainer &&
      searchResultsContainer.classList.contains("gsc-results-wrapper-visible")
    ) {
      searchResultsContainer.classList.remove("gsc-results-wrapper-visible");
    }

    setGptResponse("");
    setIsVisible(false);
  };

  useEffect(() => {
    const storedTerm = localStorage.getItem("searchTerm");
    if (storedTerm) {
      setSearchTerm(storedTerm);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      setCachedResults(JSON.parse(storedResults));
    }

    const storedImages = localStorage.getItem("imageResults");
    if (storedImages) {
      setImageResults(JSON.parse(storedImages));
    }
  }, []);

  return (
    <div className="flex flex-col bg-white w-[100%] mx-auto  home">
      <Header showLogo={isVisible} onLogoClick={handleLogoClick} />
      <main
        className={`search-main flex-grow p-4 flex flex-col justify-center`}
      >
          <div className="w-full py-20">
            <img
              className="m-auto logo w-[10vw]"
              src="images/logo.png"
              alt="Logo"
            />
          {selectedEngine === "global-search" ? (
            <div
              style={{ zIndex: "423432535" }}
              className={`search-container ${isVisible ? "fixed left-[25%]": "relative"}`}
              onMouseEnter={() => {
                setShowSettings(true);
                updateArrowPosition();
              }}
              onMouseLeave={() => {
                setShowSettings(false);
                updateArrowPosition();
              }}
            >
              <div className="gcse-search relative"></div>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className={` global-input absolute top-5 ${isVisible ? "fixed top-28 left-0" : ""} left-0 z-20 mt-[-3px] ${
                    isVisible ? "py-1 px-2" : "py-1 px-2"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit"></button>
              </form>
              <div onClick={handleSearchSubmit} className="search-arrow"></div>

              {/* SettingsComponent will be shown here */}
              {showSettings && !isVisible && (
                <SettingsComponent
                  ref={settingsRef}
                  selectedEngine={selectedEngine}
                  setSelectedEngine={setSelectedEngine}
                  showSettings={showSettings}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setselectedLanguage}
                />
              )}
              {selectedEngine === "global-search" && isVisible && (
                <div className="search-results mx-auto">
                  <div className="tabs flex gap-3 text-[#666666] text-[13px]">
                    <button
                      className={`tab-button ${
                        activeTab === "web" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("web")}
                    >
                      Web
                    </button>
                    <button
                      className={`tab-button ${
                        activeTab === "images" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("images")}
                    >
                      Görsel
                    </button>
                  </div>
                  <hr />

                  {activeTab === "web" && (
                    <>
                      <ul>
                        {cachedResults.map((result) => (
                          <li key={result.link}>
                            <a
                              className="href-link"
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              dangerouslySetInnerHTML={{
                                __html: result.htmlTitle,
                              }}
                            ></a>
                            <p className="result-link py-1">
                              {result.displayLink}{" "}
                              <span className="text-[10px]">{"›"}</span>
                            </p>
                            <p
                              className="text-[13px]"
                              dangerouslySetInnerHTML={{
                                __html: result.htmlSnippet,
                              }}
                            ></p>
                          </li>
                        ))}
                      </ul>
                      <div id="pagination" className="text-[12px] flex gap-2 text-[#666666] mt-3">
  {[...Array(10)].map((_, index) => (
    <button 
      key={index + 1} 
      onClick={() => handlePageChange(index + 1)} 
      className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
    >
      {index + 1}
    </button>
  ))}
</div>


                      <div id="results"></div>
                    </>
                  )}

                  {activeTab === "images" && (
                    <>
                      <ul>
                        {imageResults.map((imgResult) => (
                          <li key={imgResult.link}>
                            <a
                              href={imgResult.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={imgResult.link}
                                alt={imgResult.title}
                                style={{ width: "120px", height: "auto" }}
                              />
                              {imgResult.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`search-container`}
              onMouseEnter={() => {
                console.log("çalıştı");
                setShowSettings(true);
                updateArrowPosition();
              }}
              onMouseLeave={() => {
                setShowSettings(false);
                updateArrowPosition();
              }}
            >
              <div className="gcse-search">
                <div id="gsc-i-id1" className="relative"></div>
              </div>
              <div className="search-arrow"></div>

              {/* SettingsComponent will be shown here */}
              {showSettings && !isVisible && (
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
            <h3 className="py-4">GPT Answer</h3>
            <p className="text-justify">{gptResponse}</p>
          </div>
        )}
      </main>
      <Footer hasSearchResults={isVisible} />
    </div>
  );
};

export default Home;
