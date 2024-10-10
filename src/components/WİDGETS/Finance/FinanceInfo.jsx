import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Chart.js bileşeni
import './Finance.css'; 
import Modal from './Modal'; 

const FinanceInfo = () => {
  const [favorites, setFavorites] = useState([]); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const [prices, setPrices] = useState({}); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [chartData, setChartData] = useState({}); // Grafik verileri

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCoins')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCoins', JSON.stringify(favorites));
  }, [favorites]);

  const handleAddFavorite = (asset) => {
    if (!favorites.includes(asset)) {
      setFavorites([...favorites, asset]);
    }
  };

  const fetchFavoritePrices = async () => {
    if (favorites.length === 0) return; 

    try {
      const ids = favorites.join(','); 
      const cachedPrices = localStorage.getItem('cachedPrices');
      const cachedData = cachedPrices ? JSON.parse(cachedPrices) : {};

      // Eğer önbellekte veriler varsa kullan
      if (cachedData[ids]) {
        setPrices(cachedData[ids]);
      } else {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
        const data = await response.json();
        setPrices(data);
        cachedData[ids] = data; // Veriyi önbelleğe al
        localStorage.setItem('cachedPrices', JSON.stringify(cachedData)); // Güncellenmiş önbelleği kaydet
      }
      
      // Tarihsel veri çekme (30 gün)
      const historyResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${favorites[currentIndex]}/market_chart?vs_currency=usd&days=30`);
      const historyData = await historyResponse.json();
      const prices = historyData.prices.map(price => price[1]);
      const dates = historyData.prices.map(price => new Date(price[0]).toLocaleDateString());

      setChartData({ labels: dates, data: prices });
      
    } catch (error) {
      console.error('Favori fiyatları alınırken hata:', error);
    }
  };

  useEffect(() => {
    fetchFavoritePrices(); // Favori fiyatlarını yalnızca favorites değiştiğinde al
  }, [favorites]);

  useEffect(() => {
    if (favorites.length === 0) return; 
    const fetchHistoricalData = async () => {
      try {
        const historyResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${favorites[currentIndex]}/market_chart?vs_currency=usd&days=30`);
        const historyData = await historyResponse.json();
        const prices = historyData.prices.map(price => price[1]);
        const dates = historyData.prices.map(price => new Date(price[0]).toLocaleDateString());
  
        setChartData({ labels: dates, data: prices });
      } catch (error) {
        console.error('Tarihsel veriler alınırken hata:', error);
      }
    };
  
    fetchHistoricalData(); 
  }, [currentIndex]);

  return (
    <div className="finance-info relative">
      <div className="settings-icon-finance" onClick={() => setModalOpen(true)}>
        <i className="fas fa-cog"></i>
      </div>

      {favorites.length > 0 ? (
        <div className="favorite-coin">
          <h2 className="text-gray-300 text-[12px]" style={{ letterSpacing: "1px" }}>
            {favorites[currentIndex]?.charAt(0).toUpperCase() + favorites[currentIndex]?.slice(1) || 'Yükleniyor...'} (USD)
          </h2>
          <div className="coin-info flex flex-col">
            <span className="text-[10px]">
              ${prices[favorites[currentIndex]]?.usd?.toFixed(2) || 'Yükleniyor...'}
            </span>
            <span className="text-[10px]">
              {prices[favorites[currentIndex]]?.usd_24h_change !== undefined ? 
                (prices[favorites[currentIndex]].usd_24h_change > 0 ? '+' : '') + prices[favorites[currentIndex]].usd_24h_change.toFixed(2) + '%' 
                : 'Yükleniyor...'}
            </span>
          </div>
        </div>
      ) : (
        <div className="no-favorites-message h-[122px] flex items-center justify-center">
          <h2 className="text-gray-500 text-[11px]">You have no favorite coins yet.<br/> Please add some!</h2>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddFavorite={handleAddFavorite}/>
    </div>
  );
};

export default FinanceInfo;
