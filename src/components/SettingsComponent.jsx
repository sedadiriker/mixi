import React, { forwardRef } from "react";
import CustomSelect from "./CustomSelect";
import CustomFlux from "./CustomFlux";

const SettingsComponent = forwardRef(
  (
    {
      selectedEngine,
      setSelectedEngine,
      showSettings,
      selectedLanguage,
      setSelectedLanguage,
      generateImage,
      width,
      setWidth,
      height,
      setHeight,
    },
    ref
  ) => {
    const handleLanguageChange = (newLanguage) => {
      setSelectedLanguage(newLanguage);
      console.log("Seçilen dil değiştirildi:", newLanguage);
    };

    return (
      <div>
        <div
          className={`settings ${showSettings ? "visible" : "hidden"}`}
          ref={ref}
        >
          <div
            className={`mb-4 ${
              selectedEngine == "global-search" ? "mt-12" : ""
            } ${selectedEngine === "mixi-flux" ? "mt-12" : ""} ${
              selectedEngine === "mixi-doctor" ? "mt-12" : ""
            } w-[85%] m-auto`}
          >
            <div className="grid grid-cols-3  gap-x-[1rem] gap-y-2">
              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="google"
                    checked={selectedEngine === "google"}
                    onChange={() => setSelectedEngine("google")}
                    className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                  />
                  <span
                    className="ml-2 text-[12px] text-gray-500"
                    style={{ letterSpacing: "1px" }}
                  >
                    Google
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
                  <span
                    className="ml-2 text-[12px] text-gray-500"
                    style={{ letterSpacing: "1px" }}
                  >
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
                  <span
                    className="ml-2 text-[12px] text-gray-500"
                    style={{ letterSpacing: "1px" }}
                  >
                    Google + GPT-4
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mixi-flux"
                    checked={selectedEngine === "mixi-flux"}
                    onChange={() => setSelectedEngine("mixi-flux")}
                    className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                  />
                  <span
                    className="ml-2 text-[12px] text-gray-500"
                    style={{ letterSpacing: "1px" }}
                  >
                    MixiFlux Image Gen
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mixi-doctor"
                    checked={selectedEngine === "mixi-doctor"}
                    onChange={() => setSelectedEngine("mixi-doctor")}
                    className="appearance-none h-4 w-4 border bg-gray-200 rounded-full checked:bg-gray-600 checked:border-transparent focus:outline-none"
                  />
                  <span
                    className="ml-2 text-[12px] text-gray-500"
                    style={{ letterSpacing: "1px" }}
                  >
                    Mixi Doctor
                  </span>
                </label>
              </div>
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
        </div>

        {selectedEngine === "global-search" && (
          <div>
            <CustomSelect
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        )}
        {/* {selectedEngine === "mixi-flux" && (
          <div>
            <CustomFlux
              generateImage={generateImage}
              width={width}
              setWidth = {setWidth}
              height={height}
              setHeight={setHeight}
            />
          </div>
        )} */}
      </div>
    );
  }
);

export default SettingsComponent;
