import React, { useEffect, useRef, useState, useCallback } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Modal = ({ isOpen, onClose, onAddFavorite, favorites, setFavorites }) => {
  const [currentAsset, setCurrentAsset] = useState("bitcoin");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [chartDataModal, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ctxRef = useRef(null);
  const chartRef = useRef(null);

  console.log(currentAsset);
  const coins = [
    { id: "bitcoin", name: "Bitcoin (BTC)" },
    { id: "ethereum", name: "Ethereum (ETH)" },
    { id: "binancecoin", name: "Binance Coin (BNB)" },
    { id: "cardano", name: "Cardano (ADA)" },
    { id: "solana", name: "Solana (SOL)" },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const cachedData = JSON.parse(localStorage.getItem(currentAsset));
    const cacheTimestamp = localStorage.getItem(`${currentAsset}_timestamp`);

    if (cachedData && cacheTimestamp) {
      const currentTime = new Date().getTime();
      const cacheAge = currentTime - cacheTimestamp;

      if (cacheAge < 300000) {
        const { price, change, labels, data } = cachedData;
        setCurrentPrice(price);
        setPriceChange(change);
        setChartData({ labels, data });
        setLoading(false);
        return;
      }
    }

    try {
      const currentResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${currentAsset}&vs_currencies=usd&include_24hr_change=true`
      );
      const currentData = await currentResponse.json();
      const price = currentData[currentAsset].usd;
      const change = currentData[currentAsset].usd_24h_change;

      const historyResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${currentAsset}/market_chart?vs_currency=usd&days=30`
      );
      const historyData = await historyResponse.json();
      const prices = historyData.prices.map((price) => price[1]) || [];
      const dates =
        historyData.prices.map((price) =>
          new Date(price[0]).toLocaleDateString()
        ) || [];

      setCurrentPrice(price);
      setPriceChange(change);
      setChartData({ labels: dates, data: prices });

      localStorage.setItem(
        currentAsset,
        JSON.stringify({
          price,
          change,
          labels: dates,
          data: prices,
        })
      );
      localStorage.setItem(`${currentAsset}_timestamp`, new Date().getTime());
    } catch (error) {
      console.error("Data fetching error:", error);
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  }, [currentAsset]);

  const createChart = (labels, data) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctxRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Price",
            data: data,
            borderColor: "white",
            backgroundColor:"#171c23",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    ctxRef.current = document.getElementById("price-chart").getContext("2d");
    fetchData();

    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, [isOpen, fetchData]);

  useEffect(() => {
    if (chartDataModal.labels.length > 0 && ctxRef.current) {
      createChart(chartDataModal.labels, chartDataModal.data);
    }
  }, [chartDataModal]);

  const handleAssetChange = (e) => {
    setCurrentAsset(e.target.value);
    fetchData();
  };
  const handleRemoveFavorite = (asset) => {
    setFavorites((prev) => prev.filter((fav) => fav !== asset));
  };
  const handleAddFavorite = () => {
    onAddFavorite(currentAsset);
    fetchData();
  };

  const priceDisplayStyle = priceChange >= 0 ? "up" : "down";

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay-finance flex flex-col gap-2"
      onClick={onClose}
    >
      <div className="w-[120px] 2xl:w-[180px] absolute top-0 2xl:top-[-20px] left-0">
        <img className="w-full logo-modal" src="images/logo.png" alt="" />
      </div>

      <div
        className="modal-content-finance"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-button text-white" onClick={onClose}>
          &times;
        </span>
        <div id="widget-content">
          <h2
            className="uppercase 2xl:text-[18px] text-[#404751] py-5 2xl:py-6"
            style={{ letterSpacing: "2px" }}
          >
            Finance Settings
          </h2>
          <hr className=" opacity-25 my-1" />
          <div className="flex justify-between px-20 h-[50px] 2xl:h-[100px]">
            <div className="flex gap-2 items-center my-4">
              <select
                id="asset-selector"
                className="text-black p-2 rounded outline-none"
                value={currentAsset}
                onChange={handleAssetChange}
              >
                {coins?.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddFavorite}
                className="add-favorite-button uppercase text-[10px] bg-gray-800 p-3 rounded"
              >
                Add favorites
              </button>
            </div>
            <div className="h-full w-[20%] 2xl:w-[15%]">
              {/* {error && <div className="error">{error}</div>} */}
              <div id="coin-display" className="text-white h-full">
                {/* <div className="mt-2 flex items-center gap-3">
                  <div className="uppercase text-[14px] ">
                    {coins.find((coin) => coin.id === currentAsset)?.name}
                  </div>
                  <div className="flex items-center gap-2">
                 
                  <div
                    id="change-display"
                    className={`${priceDisplayStyle} ${
                      priceChange >= 0 ? "text-green-600" : "text-red-600"
                    } text-[12px]`}
                  >
                 
                    {priceChange > 0 ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </div>
                   <img
                      className="w-[7px] h-[10px]"
                      src={
                        priceChange > 0
                          ? "./images/elevator-arrow-up.gif"
                          : "./images/elevator-arrow-down.gif"
                      }
                      alt={priceChange > 0 ? "Price Up" : "Price Down"}
                    />
                  </div>
                  
                </div>
                <div id="price-display">$ {currentPrice.toFixed(2)}</div> */}
                <div className="h-full">
                  {/* <h2 className="uppercase">Favorites</h2> */}
                  <div className="favorites-list h-full mt-2">
                    <ul>
                      {favorites.map((fav) => (
                        <li
                          key={fav}
                          className="flex justify-between items-center"
                        >
                          <span className="text-[12px]">
                            {coins.find((coin) => coin.id === fav)?.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFavorite(fav)}
                            className="remove-favorite-button text-red-800"
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="chart-container" className="w-[90%] mx-auto">
            <canvas className="w-full h-[70vh] py-1" id="price-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
