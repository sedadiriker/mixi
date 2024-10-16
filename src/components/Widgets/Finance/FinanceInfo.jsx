import React, { useState, useEffect } from "react";
import "./Finance.css";
import Modal from "./Modal";
import CoinInfo from "../../CoinInfo";

const FinanceInfo = () => {
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [prices, setPrices] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Price Coin",
        data: [10, 20, 15, 25, 30, 40],
        borderColor: "gray",
        backgroundColor: "gray",
        fill: true, 
        tension: 1, 
        borderWidth:1
      },
    ],
  });
  const [visibleParagraphs, setVisibleParagraphs] = useState([true, false, false]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % favorites.length);
      setVisibleParagraphs([true, false, false]);
      animateParagraphs();
    }, 4000);

    return () => clearInterval(interval);
  }, [favorites.length]);

  const animateParagraphs = () => {
    const timeouts = [];

    timeouts.push(
      setTimeout(() => setVisibleParagraphs([true, false, false]), 0)
    );

    timeouts.push(
      setTimeout(() => setVisibleParagraphs([true, true, false]), 500)
    );

    timeouts.push(
      setTimeout(() => setVisibleParagraphs([true, true, true]), 1000)
    );

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  };

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteCoins")) || [];

    if (storedFavorites.length === 0) {
      setFavorites(["bitcoin", "ethereum"]); 
    } else {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteCoins", JSON.stringify(favorites));
  }, [favorites]);

  const fetchFavoritePrices = async () => {
    if (favorites.length === 0) return;

    try {
      const ids = favorites.join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();
      setPrices(data);
      fetchHistoricalData(favorites[currentIndex]);
    } catch (error) {
      console.error("Favori fiyatları alınırken hata:", error);
    }
  };

  const fetchHistoricalData = async (coin) => {
    try {
      const historyResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`
      );
      const historyData = await historyResponse.json();

      if (!historyData.prices || historyData.prices.length === 0) return;

      const prices = historyData.prices.map((price) => price[1]);
      const dates = historyData.prices.map((price) =>
        new Date(price[0]).toLocaleDateString()
      );

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            fill: false,
            backgroundColor: "gray",
            borderColor: "gray",
            tension: 0.1,
            borderWidth:1
            
          },
        ],
      });
    } catch (error) {
      console.error("Tarihsel veriler alınırken hata:", error);
    }
  };

  useEffect(() => {
    fetchFavoritePrices();
  }, [favorites]);

  useEffect(() => {
    fetchHistoricalData(favorites[currentIndex]);
  }, [currentIndex]);

  const priceChange = prices[favorites[currentIndex]]?.usd_24h_change || 0;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % favorites.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + favorites.length) % favorites.length);
  };

  return (
    <div className="finance-info relative h-[100%] w-[100%] flex flex-col justify-center items-center">
      <div className="settings-icon-finance" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>

      {/* Only show the current favorite coin */}
      <CoinInfo
        favorite={favorites[currentIndex]}
        price={prices[favorites[currentIndex]]?.usd}
        priceChange={priceChange}
        chartData={chartData} // Display chart data
        visibleParagraphs={visibleParagraphs}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddFavorite={(asset) => {
          if (!favorites.includes(asset)) {
            setFavorites([...favorites, asset]);
          }
        }}
      />
    </div>
  );
};

export default FinanceInfo;
