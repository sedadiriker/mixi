const apikey = process.env.REACT_APP_openapikey;
export const fetchGptResponse = async (term) => {
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
    //   setGptResponse(data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

export const fetchSearchResults = async (query, page) => {
    if (!query) {
      console.error("Arama terimi boş.");
      return;
    }
  
    const startIndex = (page - 1) * 10 + 1;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.REACT_APP_GOOGLE_API_KEY}&cx=${process.env.REACT_APP_GOOGLE_CX}&q=${query}&start=${startIndex}`
      );
      const data = await response.json();
  
      if (data.items) {
        console.log("Sonuçlar", data.items);
        // setSearchResults(data.items);
        // setCachedResults(data.items);
        // setCurrentPage(page);
        localStorage.setItem("searchResults", JSON.stringify(data.items));
      } else {
        console.error("Sonuç bulunamadı.");
      }
    } catch (error) {
      console.error("Arama sonuçları getirilirken hata oluştu:", error);
    }
  };
  

export  const fetchImageResults = async (query, page) => {
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
        // setImageResults(data.items);
        // setCurrentImagePage(page);
        localStorage.setItem("imageResults", JSON.stringify(data.items));
      } else {
        console.error("No image results found");
      }
    } catch (error) {
      console.error("Error fetching image results:", error);
    }
  };