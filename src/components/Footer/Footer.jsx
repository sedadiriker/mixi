import React, { useEffect, useState } from "react";
import "./Footer.css";
import GmailEmails from "../WİDGETS/Gmail/GmailEmails";
import FinanceInfo from "../WİDGETS/Finance/FinanceInfo";
import Pomodoro from "../WİDGETS/Pomodoro/Pomodoro";
import Notes from "../WİDGETS/Notes/Notes";
import TodoList from "../WİDGETS/ToDo/TodoList";
import Reminder from "../WİDGETS/Reminder";
import Shortcuts from "../WİDGETS/Shortcuts/Shortcuts";
import AnalogClock from "../WİDGETS/Clock/AnalogClock";
import ImageSlider from "../WİDGETS/ImageSlider/ImageSlider";
import Quotes from "../WİDGETS/Quotes/Quotes";
import Weather from "../WİDGETS/Weather/Weather";
import Alarms from "../WİDGETS/Alarms/Alarms";
import News from "../WİDGETS/News/News";

const Footer = ({ hasSearchResults }) => {
  const [isCollapsed, setIsCollapsed] = useState(hasSearchResults > 0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(1); 

  const widgetGroups = [
    [
      { id: "advertisement", title: "SPONSORED", image: "./images/sponsored.png" },
      { id: "finance", title: "FINANCE", content: <FinanceInfo/> },
      { id: "pomodoro", title: "POMODORO", content: <Pomodoro/>},
      { id: "notes", title: "NOTES", content: <Notes/> },
      { id: "reminder", title: "REMINDER TO GET UP", content: <Reminder/> },
    ],
    [
      { id: "news", title: "NEWS", content:<News/> },
      { id: "todo", title: "TO DO LIST", content: <TodoList/> },
      { id: "shortcuts", title: "SHORTCUTS", content: <Shortcuts/> },
      { id: "alarms", title: "ALARM", content: <Alarms/> },
      { id: "analog-clock", title: "CLOCK", content: <AnalogClock/> },
    ],
    [
      { id: "advertisement-left", title: "SPONSORED", image: "./images/sponsored.png" },
      { id: "image-slider", title: "İMAGE SLIDER", content: <ImageSlider/> },
      { id: "quotes", title: "QUOTES", content: <Quotes/> },
      { id: "weather", title: "WEATHER", content: <Weather/> },
      { id: "gmail-emails", title: "GMAIL", content: <GmailEmails/>},
    ],
  ];

  const totalGroups = widgetGroups.length;

  const slide = (direction) => {
    setCurrentGroupIndex((prevIndex) => {
      let newIndex = prevIndex + direction;

      if (newIndex < 0) return 0; 
      if (newIndex >= totalGroups) return totalGroups - 1; 

      return newIndex; 
    });
  };
  useEffect(() => {
    setIsCollapsed(hasSearchResults);
  }, [hasSearchResults]);
  return (
    <footer className={`footer-widget-container w-[93%] ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div id="toggle-footer" className="toggle-footer" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "▲" : "▼"}
      </div>

      <div
        id="left-arrow"
        className="arrow-left"
        onClick={() => {
          if (currentGroupIndex > 0) slide(-1); 
        }}
      >
        &lt;
      </div>

      <div className="widget-slider">
        <div className="widget-container">
          {widgetGroups[currentGroupIndex].map(widget => (
            <div className="widget" key={widget.id}>
              <div className="widget-header">
                <p>{widget.title}</p>
              </div>
              <div className="widget-body">
                {widget.image ? (
                  <img src={widget.image} alt={widget.title.toLowerCase()} className="h-[130px] w-[100%] object-contain mt-1" />
                ) : widget.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="toggle-footer-2" >
        {isCollapsed ? "▼" : "▲"}
      </div>

      <div
        id="right-arrow"
        className="arrow-right"
        onClick={() => {
          if (currentGroupIndex < totalGroups - 1) slide(1); 
        }}
      >
        &gt;
      </div>
    </footer>
  );
};



export default Footer;
