import React, { useEffect, useRef, useState } from "react";
import "./News.css";

const News = () => {
  const apiKey = "731b9807fa2573adda1d402dd46390d2"; 
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [country, setCountry] = useState(() => localStorage.getItem("country") || "us");
  const [category, setCategory] = useState(() => localStorage.getItem("category") || "general");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [loading, setLoading] = useState(true);
  const newsRef = useRef(null);

  const countries = [
    { code: "au", name: "Australia" },
    { code: "br", name: "Brazil" },
    { code: "ca", name: "Canada" },
    { code: "cn", name: "China" },
    { code: "eg", name: "Egypt" },
    { code: "fr", name: "France" },
    { code: "de", name: "Germany" },
    { code: "gr", name: "Greece" },
    { code: "hk", name: "Hong Kong" },
    { code: "in", name: "India" },
    { code: "ie", name: "Ireland" },
    { code: "il", name: "Israel" },
    { code: "it", name: "Italy" },
    { code: "jp", name: "Japan" },
    { code: "nl", name: "Netherlands" },
    { code: "no", name: "Norway" },
    { code: "pk", name: "Pakistan" },
    { code: "pe", name: "Peru" },
    { code: "ph", name: "Philippines" },
    { code: "pt", name: "Portugal" },
    { code: "ro", name: "Romania" },
    { code: "ru", name: "Russia" },
    { code: "sg", name: "Singapore" },
    { code: "es", name: "Spain" },
    { code: "se", name: "Sweden" },
    { code: "ch", name: "Switzerland" },
    { code: "tw", name: "Taiwan" },
    { code: "ua", name: "Ukraine" },
    { code: "gb", name: "United Kingdom" },
    { code: "us", name: "United States" },
  ];

  const languages = [
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
    { code: "nl", name: "Dutch" },
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ml", name: "Malayalam" },
    { code: "mr", name: "Marathi" },
    { code: "no", name: "Norwegian" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "es", name: "Spanish" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "uk", name: "Ukrainian" },
  ];

  const categories = [
    { code: "general", name: "General" },
    { code: "business", name: "Business" },
    { code: "entertainment", name: "Entertainment" },
    { code: "health", name: "Health" },
    { code: "science", name: "Science" },
    { code: "sports", name: "Sports" },
    { code: "technology", name: "Technology" },
  ];

  const getNews = async () => {
    setLoading(true);
    
    const cacheKey = `${country}-${category}-${language}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    // Eğer önbellekten veri varsa, onu kullan
    if (cachedData) {
      setArticles(JSON.parse(cachedData));
      setLoading(false);
      return;
    }
  
    const url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&lang=${language}&apikey=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setArticles(data.articles);
      
      // Yeni veriyi localStorage'a kaydet
      localStorage.setItem(cacheKey, JSON.stringify(data.articles));
    } catch (error) {
      console.error("Haber alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getNews();
  }, [country, category, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const handleScroll = (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  };

  useEffect(() => {
    const currentNewsRef = newsRef.current;

    if (currentNewsRef) {
      currentNewsRef.addEventListener("wheel", handleScroll);
    }

    return () => {
      if (currentNewsRef) {
        currentNewsRef.removeEventListener("wheel", handleScroll);
      }
    };
  }, [articles.length]);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    localStorage.setItem("country", country);
    localStorage.setItem("category", category);
    localStorage.setItem("language", language);
    getNews();
  };

  return (
    <div className="news-slider h-full relative" ref={newsRef}>
      <div className="settings-icon-news" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>
      {loading ? (
        <div className="flex justify-center items-center text-gray-600 loading-message w-full h-full uppercase text-xs" style={{ letterSpacing: "2px" }}>Loading...</div>
      ) : articles.length > 0 ? (
        <div className="article h-full" style={{ cursor: "pointer" }}>
          <img
            onClick={() => window.open(articles[currentIndex].url, "_blank")}
            src={articles[currentIndex]?.image}
            alt={articles[currentIndex]?.title}
          />
          <h2 className="h-[40%] text-[10px] 2xl:text-[18px]" onClick={() => window.open(articles[currentIndex].url, "_blank")}>
            {articles[currentIndex].title}
          </h2>
        </div>
      ) : (
        <div className="no-articles-message">No articles available.</div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal text-black rounded">
          <div className="modal-content">
            <span className="close text-white" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <h2 className="uppercase text-center bg-black py-2 text-gray-500 w-full modal-title" style={{ letterSpacing: "1px" }}>
              News Settings
            </h2>
            <div className="flex flex-col p-2 w-4/5 m-auto">
              <label className="flex justify-between py-1">
                <div className="w-24 flex justify-between text-white">
                  <span>Country</span>
                  <span>:</span>
                </div>
                <select
                  className="w-1/2 text-start cursor-pointer"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex justify-between py-1">
                <div className="w-24 flex justify-between text-white">
                  <span>Category</span>
                  <span>:</span>
                </div>
                <select
                  className="w-1/2 text-start cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex justify-between py-1">
                <div className="w-24 flex justify-between text-white">
                  <span>Language</span>
                  <span>:</span>
                </div>
                <select
                  className="w-1/2 text-start cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex justify-center py-3">
              <button className="submit-button" onClick={handleSettingsSubmit}>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
