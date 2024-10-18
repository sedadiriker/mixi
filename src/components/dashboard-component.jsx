import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AirQualityDashboard = () => {
  const airQualityData = [
    { name: 'AQI', value: 3, maxValue: 500, score: 9.4, description: 'Genel hava kalitesi göstergesi' },
    { name: 'CO', value: 907.90, maxValue: 15000, score: 8.5, description: 'Karbon monoksit seviyesi (μg/m³)' },
    { name: 'NO', value: 4.14, maxValue: 1000, score: 9.6, description: 'Azot monoksit seviyesi (μg/m³)' },
    { name: 'NO2', value: 13.20, maxValue: 200, score: 8.7, description: 'Azot dioksit seviyesi (μg/m³)' },
    { name: 'O3', value: 21.28, maxValue: 180, score: 7.8, description: 'Ozon seviyesi (μg/m³)' },
    { name: 'SO2', value: 3.49, maxValue: 350, score: 9.0, description: 'Kükürt dioksit seviyesi (μg/m³)' },
    { name: 'PM2.5', value: 25.62, maxValue: 75, score: 6.5, description: 'İnce partikül madde seviyesi (μg/m³)' },
    { name: 'PM10', value: 35.26, maxValue: 150, score: 7.2, description: 'Kaba partikül madde seviyesi (μg/m³)' }
  ];

  const getColor = (score) => {
    const hue = score * 16; // 0 (kırmızı) to 160 (turkuaz yeşil)
    return `hsl(${hue}, 100%, 50%)`;
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { category: 'İyi', color: '#00e400' };
    if (aqi <= 100) return { category: 'Orta', color: '#ffff00' };
    if (aqi <= 150) return { category: 'Hassas gruplar için sağlıksız', color: '#ff7e00' };
    if (aqi <= 200) return { category: 'Sağlıksız', color: '#ff0000' };
    if (aqi <= 300) return { category: 'Çok sağlıksız', color: '#8f3f97' };
    return { category: 'Tehlikeli', color: '#7e0023' };
  };

  const getMaskRecommendation = (aqi) => {
    if (aqi <= 50) return { recommendation: 'Gerekli değil', color: '#00e400' };
    if (aqi <= 100) return { recommendation: 'Hassas gruplar için önerilir', color: '#ffff00' };
    if (aqi <= 150) return { recommendation: 'Dış mekanlarda önerilir', color: '#ff7e00' };
    if (aqi <= 200) return { recommendation: 'Gerekli', color: '#ff0000' };
    if (aqi <= 300) return { recommendation: 'Kesinlikle gerekli', color: '#8f3f97' };
    return { recommendation: 'Dışarı çıkmayın', color: '#7e0023' };
  };

  const aqi = airQualityData[0].value;
  const aqiCategory = getAQICategory(aqi);
  const maskRecommendation = getMaskRecommendation(aqi);

  const renderPieChart = (data, valueKey, centerText) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {data.map((item, index) => (
          <Pie
            key={item.name}
            data={[{ value: item[valueKey] }, { value: valueKey === 'score' ? 10 - item[valueKey] : item.maxValue - item[valueKey] }]}
            cx="50%"
            cy="50%"
            innerRadius={25 + index * 15}
            outerRadius={40 + index * 15}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={valueKey === 'score' ? getColor(item[valueKey]) : `hsl(${200 - (item[valueKey] / item.maxValue) * 200}, 100%, 50%)`} />
            <Cell fill="transparent" />
          </Pie>
        ))}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16">
          {centerText}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLegend = (data, valueKey) => (
    <ul className="list-none p-0 text-xs">
      {data.map((item, index) => (
        <li key={`item-${index}`} className="mb-1">
          <span className="inline-block w-2 h-2 mr-1" style={{ backgroundColor: valueKey === 'score' ? getColor(item[valueKey]) : `hsl(${200 - (item[valueKey] / item.maxValue) * 200}, 100%, 50%)` }}></span>
          <span>{item.name}: {valueKey === 'score' ? `${item[valueKey].toFixed(1)}/10` : item[valueKey].toFixed(2)}</span>
          <span className="block ml-3 text-gray-500">{item.description}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Hava Kalitesi Gösterge Paneli</h2>
      <div className="flex flex-wrap justify-center">
        <div className="w-full md:w-1/2 p-2">
          <h3 className="text-lg font-semibold text-center mb-2">Hava Kalitesi Puanları</h3>
          {renderPieChart(airQualityData, 'score', 'Puanlar')}
          <div className="mt-2">
            {renderLegend(airQualityData, 'score')}
          </div>
        </div>
        <div className="w-full md:w-1/2 p-2">
          <h3 className="text-lg font-semibold text-center mb-2">Gerçek Hava Kalitesi Değerleri</h3>
          {renderPieChart(airQualityData, 'value', 'Değerler')}
          <div className="mt-2">
            {renderLegend(airQualityData, 'value')}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-xl font-bold">Genel Hava Kalitesi (AQI): {aqi}</p>
        <p className="text-md mt-2" style={{ color: aqiCategory.color }}>
          {aqiCategory.category}
        </p>
        <p className="text-md mt-2" style={{ color: maskRecommendation.color }}>
          Maske: <span className="font-semibold">{maskRecommendation.recommendation}</span>
        </p>
        <p className="text-sm mt-2">
          AQI değeri 0-500 arasındadır. Düşük değerler daha iyi hava kalitesini gösterir.
        </p>
      </div>
    </div>
  );
};

export default AirQualityDashboard;
