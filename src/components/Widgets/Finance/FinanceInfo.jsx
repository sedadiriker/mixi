import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "./Finance.css";
import Modal from "./Modal";

const FinanceInfo = () => {
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [prices, setPrices] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Price",
        data: prices,
        fill: false,
        borderColor: "white",
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  });
  const [chartVisible, setChartVisible] = useState(false);
  const [legendFontSize, setLegendFontSize] = useState(14); 


  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1500) {
        setLegendFontSize(18);
      } else {
        setLegendFontSize(14);
      }
    };

    updateFontSize(); 
    window.addEventListener("resize", updateFontSize); 

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);
  const handleToggle = () => {
    setChartVisible(!chartVisible);
  };

  useEffect(() => {
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteCoins")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favoriteCoins", JSON.stringify(favorites));
  }, [favorites]);

  const handleAddFavorite = (asset) => {
    if (!favorites.includes(asset)) {
      setFavorites([...favorites, asset]);
    }
  };

  const fetchFavoritePrices = async () => {
    if (favorites.length === 0) return;

    try {
      const ids = favorites.join(",");
      const cachedPrices = localStorage.getItem("cachedPrices");
      const cachedData = cachedPrices ? JSON.parse(cachedPrices) : {};

      if (cachedData[ids]) {
        setPrices(cachedData[ids]);
      } else {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        setPrices(data);
        cachedData[ids] = data;
        localStorage.setItem("cachedPrices", JSON.stringify(cachedData));
      }

      // Historical data
      const historyResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${favorites[currentIndex]}/market_chart?vs_currency=usd&days=30`
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
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Favori fiyatları alınırken hata:", error);
    }
  };

  useEffect(() => {
    fetchFavoritePrices();
  }, [favorites]);

  useEffect(() => {
    if (favorites.length === 0) return;
    const fetchHistoricalData = async () => {
      try {
        const historyResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${favorites[currentIndex]}/market_chart?vs_currency=usd&days=30`
        );
        const historyData = await historyResponse.json();
        const prices = historyData.prices.map((price) => price[1]) || [];
        const dates =
          historyData.prices.map((price) =>
            new Date(price[0]).toLocaleDateString()
          ) || [];

        setChartData({
          labels: dates,
          datasets: [
            {
              label: "Price (USD)",
              data: prices,
              fill: false,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Tarihsel veriler alınırken hata:", error);
      }
    };

    fetchHistoricalData();
  }, [currentIndex]);

  const priceChange = prices[favorites[currentIndex]]?.usd_24h_change || 0;

  const priceDisplayStyle = priceChange >= 0 ? "up" : "down";

  return (
    <div className="finance-info relative  h-[100%] w-[100%] flex flex-col justify-center items-center">
      <div className="settings-icon-finance" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>

      {favorites.length > 0 ? (
        <div className="favorite-coin h-[100%] w-[100%]">
          {!chartVisible ? (
            <div className="h-[100%] cursor-pointer  flex flex-col justify-center" onClick={handleToggle}>
              <h2
                className="text-gray-600 text-[18px] mb-2"
                style={{ letterSpacing: "1px" }}
              >
                {favorites[currentIndex]?.charAt(0).toUpperCase() +
                  favorites[currentIndex]?.slice(1) || "Yükleniyor..."}{" "}
                (USD)
              </h2>
              <div className="coin-info flex flex-col gap-1">
                <span>
                  ${" "}
                  <span className="text-[16px]">
                    {prices[favorites[currentIndex]]?.usd?.toFixed(2) ||
                      "Yükleniyor..."}
                  </span>
                </span>
                <span className={priceDisplayStyle}>
                  {prices[favorites[currentIndex]]?.usd_24h_change !== undefined
                    ? (prices[favorites[currentIndex]].usd_24h_change > 0
                        ? "+"
                        : "") +
                      prices[favorites[currentIndex]].usd_24h_change.toFixed(
                        2
                      ) +
                      "%"
                    : "Yükleniyor..."}
                </span>
              </div>
            </div>
          ) : (
            <div className="mini-chart h-[100%] w-[100%] cursor-pointer">
              {" "}
              <Line
              onClick={handleToggle}
                className="h-[100%] w-[100%]"
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "gray",
                        font:{
                          size:legendFontSize
                        },
                        boxWidth:20
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxTicksLimit: 7,
                        color: "gray",
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                    },
                    y: {
                      ticks: {
                        color: "gray",
                      },
                      grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="no-favorites-message h-[122px] flex items-center justify-center">
          <h2 className="text-gray-500 text-[11px]">
            You have no favorite coins yet.
            <br /> Please add some!
          </h2>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddFavorite={handleAddFavorite}
      />
    </div>
  );
};

export default FinanceInfo;
