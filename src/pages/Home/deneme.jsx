import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import SettingsComponent from "../../components/SettingsComponent";
import Chatbot from "../../components/Chatbot/Chatbot";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showWidgetBar, setShowWidgetBar] = useState(true);
  const [selectedEngine, setSelectedEngine] = useState("google");
  const [showSettings, setShowSettings] = useState(false);
  const [hasSearchResults, setHasSearchResults] = useState(false);

  console.log(showWidgetBar, "widget");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=45d2ff09083bc5958";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      console.log("Lütfen bir terim girin.");
      return;
    }

    setShowWidgetBar(false);
    console.log(showWidgetBar, "handle");
    console.log("burası çalıştı"); // Bu konsol ifadesini görmelisiniz
  };

  return (
    <div className="flex flex-col bg-white w-[100%] mx-auto h-[100vh]">
      <main className="flex-grow p-4 mt-20">
        <div>
          <div className="w-full">
            <img
              className="m-auto mt-10"
              src="images/logo.png"
              width={130}
              alt="Logo"
            />
          </div>
          <div classname="flex">
            <div classname="search-container relative">
              <div id="___gcse_0">
                <div classname="gsc-control-cse gsc-control-cse-tr">
                  <div classname="gsc-control-wrapper-cse" dir="ltr">
                    <form
                      classname="gsc-search-box gsc-search-box-tools"
                      accept-charset="utf-8"
                    >
                      <table
                        cellspacing="0"
                        cellpadding="0"
                        role="presentation"
                        classname="gsc-search-box"
                      >
                        <tbody>
                          <tr>
                            <td classname="gsc-input">
                              <div classname="gsc-input-box" id="gsc-iw-id1">
                                <table
                                  cellspacing="0"
                                  cellpadding="0"
                                  role="presentation"
                                  id="gs_id51"
                                  classname="gstl_51 gsc-input"
                                  style={{width:"100%", padding:" 0px"}}
                                >
                                  <tbody>
                                    <tr>
                                      <td id="gs_tti51" classname="gsib_a">
                                        <input
                                          autocomplete="off"
                                          type="text"
                                          size="10"
                                          classname="gsc-input"
                                          name="search"
                                          title="ara"
                                          aria-label="ara"
                                          id="gsc-i-id1"
                                          dir="ltr"
                                          spellcheck="false"
                                          style={{width: "100%", padding: "0px", border: "none", margin:" -0.0625em 0px 0px", height: "1.25em", outline: "none"}}
                                        />
                                      </td>
                                      <td classname="gsib_b">
                                        <div
                                          classname="gsst_b"
                                          id="gs_st51"
                                          dir="ltr"
                                        >
                                          <a
                                            classname="gsst_a"
                                            href="javascript:void(0)"
                                            title="Arama kutusunu temizle"
                                            role="button"
                                            style={{display:"none"}}
                                          >
                                            <span
                                              classname="gscb_a"
                                              id="gs_cb51"
                                              aria-hidden="true"
                                            >
                                              ×
                                            </span>
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                            <td classname="gsc-search-button">
                              <button classname="gsc-search-button gsc-search-button-v2">
                                <svg width="13" height="13" viewBox="0 0 13 13">
                                  <title>ara</title>
                                  <path d="m4.8495 7.8226c0.82666 0 1.5262-0.29146 2.0985-0.87438 0.57232-0.58292 0.86378-1.2877 0.87438-2.1144 0.010599-0.82666-0.28086-1.5262-0.87438-2.0985-0.59352-0.57232-1.293-0.86378-2.0985-0.87438-0.8055-0.010599-1.5103 0.28086-2.1144 0.87438-0.60414 0.59352-0.8956 1.293-0.87438 2.0985 0.021197 0.8055 0.31266 1.5103 0.87438 2.1144 0.56172 0.60414 1.2665 0.8956 2.1144 0.87438zm4.4695 0.2115 3.681 3.6819-1.259 1.284-3.6817-3.7 0.0019784-0.69479-0.090043-0.098846c-0.87973 0.76087-1.92 1.1413-3.1207 1.1413-1.3553 0-2.5025-0.46363-3.4417-1.3909s-1.4088-2.0686-1.4088-3.4239c0-1.3553 0.4696-2.4966 1.4088-3.4239 0.9392-0.92727 2.0864-1.3969 3.4417-1.4088 1.3553-0.011889 2.4906 0.45771 3.406 1.4088 0.9154 0.95107 1.379 2.0924 1.3909 3.4239 0 1.2126-0.38043 2.2588-1.1413 3.1385l0.098834 0.090049z"></path>
                                </svg>
                              </button>
                            </td>
                            <td classname="gsc-clear-button">
                              <div
                                classname="gsc-clear-button"
                                title="sonuçları temizle"
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                    <div classname="gsc-results-wrapper-nooverlay">
                      <div classname="gsc-positioningWrapper">
                        <div classname="gsc-tabsAreaInvisible">
                          <div
                            aria-label="refinement"
                            role="tab"
                            classname="gsc-tabHeader gsc-inline-block gsc-tabhActive"
                          >
                            Web
                          </div>
                          <span classname="gs-spacer"> </span>
                          <div
                            tabindex="0"
                            aria-label="refinement"
                            role="tab"
                            classname="gsc-tabHeader gsc-tabhInactive gsc-inline-block"
                          >
                            Görsel
                          </div>
                          <span classname="gs-spacer"> </span>
                        </div>
                      </div>
                      <div classname="gsc-positioningWrapper">
                        <div classname="gsc-refinementsAreaInvisible"></div>
                      </div>
                      <div classname="gsc-above-wrapper-area-invisible">
                        <div classname="gsc-above-wrapper-area-backfill-container"></div>
                        <table
                          cellspacing="0"
                          cellpadding="0"
                          role="presentation"
                          classname="gsc-above-wrapper-area-container"
                        >
                          <tbody>
                            <tr>
                              <td classname="gsc-result-info-container">
                                <div classname="gsc-result-info-invisible"></div>
                              </td>
                              <td classname="gsc-orderby-container">
                                <div classname="gsc-orderby-invisible">
                                  <div classname="gsc-orderby-label gsc-inline-block">
                                    Sıralama ölçütü:
                                  </div>
                                  <div classname="gsc-option-menu-container gsc-inline-block">
                                    <div classname="gsc-selected-option-container gsc-inline-block">
                                      <div classname="gsc-selected-option">
                                        Relevance
                                      </div>
                                      <div classname="gsc-option-selector"></div>
                                    </div>
                                    <div classname="gsc-option-menu-invisible">
                                      <div classname="gsc-option-menu-item gsc-option-menu-item-highlighted">
                                        <div classname="gsc-option">
                                          Relevance
                                        </div>
                                      </div>
                                      <div classname="gsc-option-menu-item">
                                        <div classname="gsc-option">Date</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div classname="gsc-adBlockInvisible"></div>
                      <div classname="gsc-wrapper">
                        <div classname="gsc-adBlockInvisible"></div>
                        <div classname="gsc-resultsbox-invisible">
                          <div classname="gsc-resultsRoot gsc-tabData gsc-tabdActive">
                            <div>
                              <div classname="gsc-expansionArea"></div>
                            </div>
                          </div>
                          <div classname="gsc-resultsRoot gsc-tabData gsc-tabdInactive">
                            <div>
                              <div classname="gsc-expansionArea"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div classname="search-arrow"></div>
            </div>
            <div classname="chatbot closed">
              <div classname="chatbot-circle">
                <img
                  src="images/chatbot.png"
                  alt="Bot"
                  classname="chatbot-icon"
                />
              </div>
            </div>
          </div>
          <div>
            {showSettings && (searchTerm || showWidgetBar) && (
              <SettingsComponent
                selectedEngine={selectedEngine}
                setSelectedEngine={setSelectedEngine}
                showSettings={showSettings}
              />
            )}
          </div>
        </div>
      </main>
      {showWidgetBar && <div className="widget-bar">Widget Barı</div>}{" "}
      {/* Widget barını koşullu olarak göster */}
      <Footer hasSearchResults={hasSearchResults} />
    </div>
  );
};

export default Home;
