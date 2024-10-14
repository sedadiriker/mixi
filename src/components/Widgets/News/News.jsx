import React, { useEffect, useRef, useState } from "react";
import "./News.css";

const News = () => {
  const apiKey =   "3d2c4d7bd714e98cbcfc04fafcdac495"  ;
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [country, setCountry] = useState("us");
  const [category, setCategory] = useState("general");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState({}); 
  const newsRef = useRef(null);
  // const countries = [
  //   { code: "au", name: "Australia" },
  //   { code: "br", name: "Brazil" },
  //   { code: "ca", name: "Canada" },
  //   { code: "cn", name: "China" },
  //   { code: "eg", name: "Egypt" },
  //   { code: "fr", name: "France" },
  //   { code: "de", name: "Germany" },
  //   { code: "gr", name: "Greece" },
  //   { code: "hk", name: "Hong Kong" },
  //   { code: "in", name: "India" },
  //   { code: "ie", name: "Ireland" },
  //   { code: "il", name: "Israel" },
  //   { code: "it", name: "Italy" },
  //   { code: "jp", name: "Japan" },
  //   { code: "nl", name: "Netherlands" },
  //   { code: "no", name: "Norway" },
  //   { code: "pk", name: "Pakistan" },
  //   { code: "pe", name: "Peru" },
  //   { code: "ph", name: "Philippines" },
  //   { code: "pt", name: "Portugal" },
  //   { code: "ro", name: "Romania" },
  //   { code: "ru", name: "Russia" },
  //   { code: "sg", name: "Singapore" },
  //   { code: "es", name: "Spain" },
  //   { code: "se", name: "Sweden" },
  //   { code: "ch", name: "Switzerland" },
  //   { code: "tw", name: "Taiwan" },
  //   { code: "ua", name: "Ukraine" },
  //   { code: "gb", name: "United Kingdom" },
  //   { code: "us", name: "United States" },
  // ];
  const countries = [
    { code: "tr", name: "Turkey" },
    { code: "us", name: "USA" },
    { code: "gb", name: "United Kingdom" },
    { code: "de", name: "Germany" },
    { code: "fr", name: "France" },
  ]
  // const languages = [
  //   { code: "ar", name: "Arabic" },
  //   { code: "zh", name: "Chinese" },
  //   { code: "nl", name: "Dutch" },
  //   { code: "en", name: "English" },
  //   { code: "fr", name: "French" },
  //   { code: "de", name: "German" },
  //   { code: "el", name: "Greek" },
  //   { code: "he", name: "Hebrew" },
  //   { code: "hi", name: "Hindi" },
  //   { code: "it", name: "Italian" },
  //   { code: "ja", name: "Japanese" },
  //   { code: "ml", name: "Malayalam" },
  //   { code: "mr", name: "Marathi" },
  //   { code: "no", name: "Norwegian" },
  //   { code: "pt", name: "Portuguese" },
  //   { code: "ro", name: "Romanian" },
  //   { code: "ru", name: "Russian" },
  //   { code: "es", name: "Spanish" },
  //   { code: "sv", name: "Swedish" },
  //   { code: "ta", name: "Tamil" },
  //   { code: "te", name: "Telugu" },
  //   { code: "uk", name: "Ukrainian" },
  // ];

  const languages = [
    { code: "tr", name: "Turkish" },
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "fr", name: "French" },
  ]
  const categories = [
    { code: "general", name: "General" },
    { code: "business", name: "Business" },
    { code: "entertainment", name: "Entertainment" },
    { code: "health", name: "Health" },
    { code: "science", name: "Science" },
    { code: "sports", name: "Sports" },
    { code: "technology", name: "Technology" },
    { code: "world", name: "World" },
    { code: "nation", name: "National" },
  ];


  const getNews = async () => {
    setLoading(true);

    const cacheKey = `${country}-${category}-${language}`;
    if (cache[cacheKey]) {
        setArticles(cache[cacheKey]);
        setLoading(false);
        return;
    }

    const url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&lang=${language}&max=10&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data.articles);
        setCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: data.articles,
        }));
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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles?.length);
    }, 10000);

    return () => clearInterval(interval);
}, [articles?.length]);

  const handleScroll = (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles?.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + articles?.length) % articles?.length
    );
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
  }, [articles?.length]);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setModalOpen(false);
    getNews();
  };

  return (
    <div className="news-slider h-[100%] mt-1 relative" ref={newsRef}>
      <div className="settings-icon-news" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>
      {loading ? ( // Conditionally render loading message
        <div className="flex justify-center items-center text-gray-600 loading-message w-[100%] h-[120px] uppercase text-[12px]" style={{letterSpacing:"2px"}}>Loading...</div>
      ) : articles?.length > 0 ? (
        <div className="article" style={{ cursor: "pointer" }}>
          <img
            onClick={() => window.open(articles[currentIndex].url, "_blank")}
            src={articles[currentIndex]?.image}
            alt={articles[currentIndex]?.title}
          />
          <h2 onClick={() => window.open(articles[currentIndex].url, "_blank")}>
            {articles[currentIndex].title}
          </h2>
        </div>
      ) : (
        <div className="no-articles-message">No articles available.</div> // Handle no articles case
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal text-black rounded">
          <div className="modal-content">
            <span className="close text-white" onClick={() => setModalOpen(false)}>
              &times;
            </span>
            <h2
              className="uppercase text-center bg-black py-2 text-gray-500 w-[100%] modal-title"
              style={{ letterSpacing: "1px" }}
            >
              News Settings
            </h2>
            <div className="flex flex-col p-[10px] w-[80%] m-auto">
              <label className="flex justify-between py-1">
                <div className="w-[100px] flex justify-between text-white">
                  <span>Country</span>
                  <span>:</span>
                </div>
                <select
                  className="w-[50%] text-start cursor-pointer"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countries.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex justify-between my-2">
                <div className="w-[100px] flex justify-between text-white">
                  <span> Dil</span>
                  <span>:</span>
                </div>
                <select
                  className="w-[50%] text-start cursor-pointer"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex justify-between my-2 ">
                <div className="w-[100px] flex justify-between text-white">
                  <span>Kategori</span>
                  <span>:</span>
                </div>
                <select
                  className="w-[50%] text-start cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn-blue py-2 mt-4 bg-gray-700 w-[50%] m-auto text-white rounded"
                onClick={handleSettingsSubmit}
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
