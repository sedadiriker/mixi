import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const CoinInfo = ({
  favorite,
  price,
  priceChange,
  chartData,
  visibleParagraphs,
}) => {
  const [legendFontSize, setLegendFontSize] = useState(9);
  const [tickFontSize, setTickFontSize] = useState(8);

  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1500) {
        setLegendFontSize(13);
        setTickFontSize(10);
      } else {
        setLegendFontSize(9);
        setTickFontSize(8);
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, []);
  const displayFavorite = favorite
    ? favorite.charAt(0).toUpperCase() + favorite.slice(1)
    : "Yükleniyor...";

  // console.log(chartData)

  return (
    <div className=" h-[100%] w-full">
      <div className="flex justify-between items-center w-full h-[10%] 2xl:justify-center 2xl:gap-10">
      <p
          className={`text-[13px] 2xl:text-[16px] ${
            visibleParagraphs[1] ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        >
          $ {price?.toFixed(2) || "Yükleniyor..."}
        </p>
        <p
          className={`text-white uppercase text-[12px] 2xl:text-[16px] ${
            visibleParagraphs[0] ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        >
          {displayFavorite}
        </p>
       
        <p
          className={`flex justify-center items-center gap-1 ${
            visibleParagraphs[2] ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        >
          <img
            className="w-[7px] h-[10px]"
            src={
              priceChange > 0
                ? "./images/elevator-arrow-up.gif"
                : "./images/elevator-arrow-down.gif"
            }
            alt={priceChange > 0 ? "Price Up" : "Price Down"}
          />
          <span
            className={`text-[12px] 2xl:text-[16px] ${
              priceChange > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {priceChange !== undefined
              ? (priceChange > 0 ? "+" : "") + priceChange.toFixed(2) + "%"
              : "Yükleniyor..."}
          </span>
        </p>
      </div>
      <div className="w-full h-[90%]">
        {chartData && chartData.labels && chartData.datasets ? (
          <Line
            className="h-full w-full"
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "gray",
                    font: {
                      size: legendFontSize,
                    },
                    boxWidth: 15,
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    maxTicksLimit: 7,
                    color: "gray",
                    font: {
                      size: tickFontSize,
                    },
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.2)",
                  },
                },
                y: {
                  ticks: {
                    color: "gray",
                    font: {
                      size: tickFontSize,
                    },
                  },
                  grid: {
                    color: "rgba(255, 255, 255, 0.2)",
                  },
                },
              },
            }}
          />
        ) : (
          <p>Yükleniyor...</p>
        )}
      </div>
    </div>
  );
};

export default CoinInfo;
