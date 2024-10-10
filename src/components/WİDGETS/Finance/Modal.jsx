import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Modal = ({ isOpen, onClose, onAddFavorite }) => {
  const [currentAsset, setCurrentAsset] = useState('bitcoin');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ctxRef = useRef(null);
  const chartRef = useRef(null); 

  // Predefined list of coins
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum (ETH)' },
    { id: 'binancecoin', name: 'Binance Coin (BNB)' },
    { id: 'cardano', name: 'Cardano (ADA)' },
    { id: 'solana', name: 'Solana (SOL)' }
  ];

  // Cache for storing data
  const [cache, setCache] = useState({});

  // Fetch current price and historical data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check cache
    if (cache[currentAsset]) {
      const { price, change, labels, data } = cache[currentAsset];
      setCurrentPrice(price);
      setPriceChange(change);
      setChartData({ labels, data });
      setLoading(false);
      return; 
    }

    try {
      const currentResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${currentAsset}&vs_currencies=usd&include_24hr_change=true`);
      const currentData = await currentResponse.json();
      const price = currentData[currentAsset].usd;
      const change = currentData[currentAsset].usd_24h_change;

      const historyResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${currentAsset}/market_chart?vs_currency=usd&days=30`);
      const historyData = await historyResponse.json();
      const prices = historyData.prices.map(price => price[1]);
      const dates = historyData.prices.map(price => new Date(price[0]).toLocaleDateString());

      setCurrentPrice(price);
      setPriceChange(change);
      setChartData({ labels: dates, data: prices });

      // Save to cache
      setCache(prevCache => ({
        ...prevCache,
        [currentAsset]: {
          price,
          change,
          labels: dates,
          data: prices,
        },
      }));
    } catch (error) {
      console.error('Data fetching error:', error);
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  }, [currentAsset, cache]);

  // Create chart
  const createChart = (labels, data) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctxRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: data,
          borderColor: 'white',
          tension: 0.1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
          y: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
    });
  };

  // Modal open actions
  useEffect(() => {
    if (!isOpen) return;

    ctxRef.current = document.getElementById('price-chart').getContext('2d');
    fetchData();

    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, [isOpen, fetchData]);

  // Chart data update
  useEffect(() => {
    if (chartData.labels.length > 0 && ctxRef.current) {
      createChart(chartData.labels, chartData.data);
    }
  }, [chartData]);

  const handleAssetChange = (e) => {
    setCurrentAsset(e.target.value);
    fetchData(); // Fetch data immediately after changing asset
  };

  const handleAddFavorite = () => {
    onAddFavorite(currentAsset);
  };

  const priceDisplayStyle = priceChange >= 0 ? 'up' : 'down';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-finance" onClick={onClose}>
      <div className="modal-content-finance" onClick={(e) => e.stopPropagation()}>
        <span className="close-button text-white" onClick={onClose}>&times;</span>
        <div id="widget-content">
          <div className="flex flex-col gap-4">
            {/* Dropdown menu */}
            <select 
              id="asset-selector" 
              className="text-black p-2 rounded outline-none" 
              value={currentAsset}
              onChange={handleAssetChange}
            >
              {coins.map(coin => (
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
          {loading && <div className="loading h-[120px] flex justify-center items-center">Loading...</div>}
          {error && <div className="error">{error}</div>}
          <div id="price-display">${currentPrice.toFixed(2)}</div>
          <div id="change-display" className={priceDisplayStyle}>
            {priceChange > 0 ? '+' : ''}
            {priceChange.toFixed(2)}%
          </div>
          <div id="chart-container">
            <canvas id="price-chart" style={{ height: '200px' }}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
