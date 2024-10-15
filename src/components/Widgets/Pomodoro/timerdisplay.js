import React from 'react'
import MuteToggle from './mutetoggle'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import useSound from 'use-sound'

const TimerDisplay = ({ timerMode,
                        percentage,
                        timeLeft,
                        isActive,
                        setIsActive,
                        buttonText,
                        setButtonText,
                        volume,
                        setVolume
                      }) => {

  const [play] = useSound('/sounds/startTimer.mp3', {
                                      interrupt: true,
                                      volume: volume,
                                    })
  const [pause] = useSound('/sounds/pauseTimer.mp3', {
                                      interupt: true,
                                      volume: volume,
                                    })

  const handleClick = (event) => {
    if (event.target.id === 'muteButton') {
      return null
    }
    
    if (timeLeft === '0:00') {
      return null
    }

    if (isActive) {
      pause()
    }
    else {
      play()
    }
    setIsActive(!isActive)
    setButtonText( buttonText === 'START'
                    || buttonText === 'RESUME'
                      ? 'PAUSE'
                      : 'RESUME'
                  )
  }

  let timesUpMsg = timerMode === 'pomo'
                  ? 'time for a break'
                  : 'back to work!'

  let timeText = timeLeft === '0:00'
                  ? timesUpMsg
                  : timeLeft

  let textSize = timeLeft === '0:00'
                  ? '12px'
                  : '28px'

  return(
    <div className="timer w-[80px] h-[80px] 2xl:w-[120px] 2xl:h-[120px]" onClick={handleClick}>
      <div className="timer__display">
        <CircularProgressbarWithChildren
          value={percentage}
          text={timeText}
          strokeWidth={3}
          styles={buildStyles({
            pathTransitionDuration: 0.5,
            pathColor: 'var(--accent-color)',
            textColor: 'var(--text)',
            textSize: textSize,
            fontFamily: 'var(--font-current)',
            trailColor: 'none',

          })}>
          
          <MuteToggle volume = {volume}
                      setVolume = {setVolume} />
          <button className="display__start-pause text-[8px] 2xl:text-[15px]" onClick={handleClick}>{buttonText}</button>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  )
}

export default TimerDisplay