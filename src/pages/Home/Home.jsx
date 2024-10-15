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
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImagePage, setCurrentImagePage] = useState(1);
  const settingsRef = useRef(null);
  const searchRef = useRef(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(cachedResults.length / itemsPerPage);

  // console.log(isVisible, "visible");
  console.log(cachedResults,"cache");

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > 10) return;
  
    if (selectedEngine === "global-search") {
      const translated = await translateWithGPT(searchTerm);
      if (translated) {
        await fetchSearchResults(translated, newPage);
      } else {
        console.error("Çeviri başarısız, arama yapılmadı.");
      }
    } else {
      await fetchSearchResults(searchTerm, newPage);
    }
  };
  
  const handleImagePageChange = async (newPage) => {
    if (newPage < 1 || newPage > 10) return;
  
    const translated = await translateWithGPT(searchTerm);
    if (translated) {
      fetchImageResults(translated, newPage);
    } else {
      console.error("Çeviri başarısız, resim arama yapılmadı.");
    }
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
  
    // Google Custom Search API'de her sayfa 10 sonuç içerir.
    const startIndex = (page - 1) * 10 + 1;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_CX}&q=${query}&start=${startIndex}`
      );
      const data = await response.json();
  
      if (data.items) {
        console.log("Sonuçlar", data.items);
        setSearchResults(data.items);
        setCachedResults(data.items);
        setCurrentPage(page);
        localStorage.setItem("searchResults", JSON.stringify(data.items));
      } else {
        console.error("Sonuç bulunamadı.");
      }
    } catch (error) {
      console.error("Arama sonuçları getirilirken hata oluştu:", error);
    }
  };
  

  const fetchImageResults = async (query, page) => {
    if (!query) {
      console.error("Görsel arama terimi boş.");
      return;
    }
    
    const start = (page - 1) * 10 + 1;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_CX}&q=${query}&searchType=image&start=${start}`
      );
      const data = await response.json();
      if (data.items) {
        setImageResults(data.items);
        setCurrentImagePage(page); // Şu anki sayfayı güncelle
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
    
    // İlk sayfa için page numarasını 1 olarak ayarla
    const initialPage = 1;
  
    if (selectedEngine === "global-search") {
      const translated = await translateWithGPT(searchTerm);
      if (translated) {
        // İlk sayfa sonuçları için page = 1 gönderiyoruz
        await fetchSearchResults(translated, initialPage);
        await fetchImageResults(translated, initialPage);
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
      // Ekran boyutunu al
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      if (selectedEngine === "global-search") {
        if (form) {
          form.classList.add("hidden");
        }
        // Ekran boyutuna göre konum ayarları
        if (width < 768) { // Mobil cihazlar için
          searchArrow.style.top = "10%"; 
          searchArrow.style.right = "5%"; 
        } else if (width >= 768 && width < 1500) { // Tablet boyutları için
          searchArrow.style.top = "12%"; 
          searchArrow.style.right = "5%"; 
        } else { // Masaüstü boyutları için
          searchArrow.style.top = "8%"; 
          searchArrow.style.right = "4%"; 
        }
      } else {
        if (form) {
          form.classList.remove("hidden");
        }
        // "global-search" değilse ayarlar
        if (showSettings) {
          // "global-search" durumunda ek ayar
          if (width < 768) { // Mobil cihazlar için
            searchArrow.style.top = "35%"; 
            searchArrow.style.right = "20%"; 
          } else if (width >= 768 && width < 1500) { 
            searchArrow.style.top = "40%"; 
            searchArrow.style.right = "28%";
          } else { // Masaüstü boyutları için
            searchArrow.style.top = "40.5%"; 
            searchArrow.style.right = "27%"; 
          }
        } else {
          // Ekran boyutuna göre ayar
          if (width < 768) { // Mobil cihazlar için
            searchArrow.style.top = "35%"; 
            searchArrow.style.right = "20%"; 
          } else if (width >= 768 && width < 1500) { 
            searchArrow.style.top = "40%"; 
            searchArrow.style.right = "28%";
          } else { // Masaüstü boyutları için
            searchArrow.style.top = "40.5%"; 
            searchArrow.style.right = "27%"; 
          }
        }
      }
    }
  };
  
  // Ekran boyutu değiştiğinde konumu güncelle
  window.addEventListener('resize', updateArrowPosition);
  
  

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
            className={`m-auto logo w-[10vw] ${
              isVisible ? "hidden" : "visible"
            }`}
            src="images/logo.png"
            alt="Logo"
          />
          {selectedEngine === "global-search" ? (
            <div
              style={{ zIndex: "423432535" }}
              className={`search-container mx-auto ${
                isVisible ? "fixed left-[25%] mt-[-14rem] 2xl:mt-[-20rem] " : "relative"
              }`}
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
                  className={` global-input absolute top-5 ${
                    isVisible ? "fixed top-28  left-0" : ""
                  } left-0 z-20 mt-[-3px] ${
                    isVisible ? "py-2 px-2" : "py-2 px-2"
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
                      <ul className="web-results">
                        {cachedResults.map((result) => (
                          <li key={result.link} className="group">
                            <a
                              className="href-link text-[13px] 2xl:text-[17px]"
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              dangerouslySetInnerHTML={{
                                __html: result.htmlTitle,
                              }}
                            ></a>
                            <p className="result-link py-1">
                              {result.displayLink}{" "}
                              <span className="text-[10px] 2xl:text-[12px]">{"›"}</span>
                            </p>
                            <p
                              className="text-[13px] 2xl:text-[15px]"
                              dangerouslySetInnerHTML={{
                                __html: result.htmlSnippet,
                              }}
                            ></p>
                          </li>
                        ))}
                      </ul>
                      <div
                        id="pagination"
                        className="text-[12px] 2xl:text-[16px] flex gap-2 text-[#666666] mt-3"
                      >
                        {[...Array(10)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`page-button ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
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
                      <ul className="flex flex-wrap gap-2 image-results">
                        {imageResults.map((imgResult) => (
                          <li key={imgResult.link} className="relative group">
                            <a
                              href={imgResult.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={imgResult.link}
                                alt={imgResult.title}
                                className="h-[180px] w-auto"
                              />
                              <span className="absolute left-0 -bottom-[-1rem] bg-[rgba(0,0,0,0.7)] text-xs px-2 py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 w-[95%]">
                                <p
                                  className="image-text uppercase"
                                  dangerouslySetInnerHTML={{
                                    __html: imgResult.htmlTitle,
                                  }}
                                ></p>
                                <p className="image-text2">
                                  {imgResult.displayLink}
                                </p>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>

                      <div
                        id="image-pagination"
                        className="text-[12px] flex gap-2 text-[#666666] mt-3"
                      >
                        {[...Array(10)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handleImagePageChange(index + 1)}
                            className={`page-button ${
                              currentImagePage === index + 1 ? "active" : ""
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`search-container mx-auto ${
                isVisible ? "mt-[-9rem]" : ""
              }`}
              onMouseEnter={() => {
                // console.log("çalıştı");
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
