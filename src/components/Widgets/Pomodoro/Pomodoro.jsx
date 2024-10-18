import { useState, useEffect } from 'react';
import useSound from 'use-sound'
import Settings from './settings'
import Button from './button'
import Header from './header'
import Controls from './controls'
import TimerDisplay from './timerdisplay'
import "./pomodoro.css"

const Pomodoro = () => {
  const [ settingsVisible, setSettingsVisible ] = useState(false)
  const [ timerMode, setTimerMode ] = useState('pomo')   
  const [ pomoLength, setPomoLength ] = useState(25)
  const [ shortLength, setShortLength ] = useState(3)
  const [ longLength, setLongLength ] = useState(15)
  const [ fontPref, setFontPref ] = useState('kumbh')        
  const [ accentColor, setAccentColor ] = useState('default') 
  const [ secondsLeft, setSecondsLeft] = useState(pomoLength * 60)
  const [ isActive, setIsActive ] = useState(false)
  const [ buttonText, setButtonText ] = useState('START')

  const [ volume, setVolume ] = useState(1)
  const [play] = useSound('/sounds/timesUp.mp3', { volume: volume });


  useEffect(() => {
    if(isActive) {
      const interval = setInterval(() => {
        setSecondsLeft(secondsLeft => secondsLeft - 1)
      }, 1000)
    
      if(secondsLeft === 0) {
        clearInterval(interval)
        setIsActive(false)
        setButtonText('')
        play()
      }

      return () => clearInterval(interval)
    }
    
  }, [isActive, secondsLeft, play]);


  const toggleSettingsVisibility = (event) => {
    setSettingsVisible(!settingsVisible)
  }

  const formatTimeLeft = (seconds) => {
    return(`${Math.floor(seconds / 60)}:${
            (seconds % 60 > 9)
              ? seconds % 60
              : '0' + seconds % 60
          }`)
  }

  const calcPercentage = () => {
    if(timerMode === 'pomo') {
      return((secondsLeft / (pomoLength * 60)) * 100)
    }
    if(timerMode === 'short') {
      return((secondsLeft / (shortLength * 60)) * 100)
    }
    if(timerMode === 'long') {
      return((secondsLeft / (longLength * 60)) * 100)
    }
    
  }

  return (
    <div className="pomodoro-app relative mt-3 gap-1 2xl:gap-3">
      <Controls
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        setSecondsLeft={setSecondsLeft}
        pomoLength={pomoLength}
        shortLength={shortLength}
        longLength={longLength}
        setIsActive={setIsActive}
        buttonText={buttonText}
        setButtonText={setButtonText}
        volume={volume}
        />
      <TimerDisplay
        timerMode={timerMode}
        percentage={calcPercentage()}
        timeLeft={formatTimeLeft(secondsLeft)}
        isActive={isActive}
        setIsActive={setIsActive}
        buttonText={buttonText}
        setButtonText={setButtonText}
        volume={volume}
        setVolume={setVolume}
        />
      <Button type="settings" toggleVisibility={toggleSettingsVisibility} />
      <Settings visible={settingsVisible}
                toggleSettingsVisibility={toggleSettingsVisibility} 
                pomoLength={pomoLength}
                setPomoLength={setPomoLength}
                shortLength={shortLength}
                setShortLength={setShortLength}
                longLength={longLength}
                setLongLength={setLongLength}
                fontPref={fontPref}
                setFontPref={setFontPref}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                closeSettings={toggleSettingsVisibility}
                setSecondsLeft={setSecondsLeft}
                timerMode={timerMode}
                />
    </div>
  );
}


export default Pomodoro
