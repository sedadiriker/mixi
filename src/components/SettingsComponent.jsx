import React from 'react';
import CustomSelect from './CustomSelect';

const SettingsComponent = ({ selectedEngine, setSelectedEngine, settingsRef,showSettings }) => {
  return (
    <>
    <div className={`settings ${showSettings ? "visible" : "hidden"}`} ref={settingsRef}>
        <div className="mb-4 mt-10 w-[80%] m-auto">
          <div className="grid grid-cols-3  gap-x-[1rem]">
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="google-pro"
                  checked={selectedEngine === "google-pro"}
                  onChange={() => setSelectedEngine("google-pro")}
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Google Pro
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="global-search"
                  checked={selectedEngine === "global-search"}
                  onChange={() => setSelectedEngine("global-search")}
                  className="appearance-none h-4 w-4 border bg-gray-200 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Global Search
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="google-gpt4"
                  checked={selectedEngine === "google-gpt4"}
                  onChange={() => setSelectedEngine("google-gpt4")}
                  className="appearance-none h-4 w-4 border bg-gray-200 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Google + GPT-4
                </span>
              </label>
            </div>
            {/*<div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yandex-pro"
                  checked={selectedEngine === "yandex-pro"}
                  onChange={() => setSelectedEngine("yandex-pro")}
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Yandex Pro
                </span>
              </label>
            </div> */}
            {/* 
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="google-gemini"
                  checked={selectedEngine === "google-gemini"}
                  onChange={() => setSelectedEngine("google-gemini")}
                  className="appearance-none h-4 w-4 border bg-gray-200 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Google + Gemini
                </span>
              </label>
            </div> */}
            {/* <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="quara-reddit"
                  checked={selectedEngine === "quara-reddit"}
                  onChange={() => setSelectedEngine("quara-reddit")}
                  className="appearance-none h-4 w-4 border rounded-full checked:bg-teal-600 checked:border-transparent focus:outline-none bg-[#E5FFC8]"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Quara + Reddit
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="mixidoctor"
                  checked={selectedEngine === "mixidoctor"}
                  onChange={() => setSelectedEngine("mixidoctor")}
                  className="appearance-none h-4 w-4 border rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none bg-[#A9F7FA]"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  MixiDoctor
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="miximind-mega"
                  checked={selectedEngine === "miximind-mega"}
                  onChange={() => setSelectedEngine("miximind-mega")}
                  className="appearance-none h-4 w-4 border rounded-full checked:bg-violet-900 checked:border-transparent focus:outline-none bg-[#D4C1FF]"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  MixiMind Mega
                </span>
              </label>
            </div> */}
                        {/* <div>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="bing-pro"
                  checked={selectedEngine === "bing-pro"}
                  onChange={() => setSelectedEngine("bing-pro")}
                  className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                />
                <span className="ml-2 text-[12px] text-gray-500" style={{ letterSpacing: "1px" }}>
                  Bing Pro
                </span>
              </label>
            </div> */}
          </div>
        </div>
        <hr className="w-[50%] m-auto" />
      </div>

      {selectedEngine === "global-search" && (
        <div>
          <CustomSelect />
        </div>
      )}
    </>
  );
};

export default SettingsComponent;
