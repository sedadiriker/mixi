import React from 'react'
import useSound from 'use-sound'

const Controls = ({ timerMode,
                    setTimerMode,
                    setSecondsLeft,
                    pomoLength,
                    shortLength,
                    longLength,
                    setIsActive,
                    setButtonText,
                    volume
                  }) => {

  const [playSfx] = useSound('/sounds/slide.mp3', { volume: volume });

  const handleModeChange = (event) => {
    setTimerMode(event.target.id)
    setIsActive(false)
    setButtonText('START')
    switch(event.target.id) {
      case 'short':
        setSecondsLeft(shortLength * 60)
        break
      case 'long':
        setSecondsLeft(longLength * 60)
        break
      default:
        setSecondsLeft(pomoLength * 60)
    }
  }

  return(
    <form className="controls w-full 2xl:w-[90%]">
      <input  type="radio" 
              id="pomo" 
              name="mode" 
              checked={timerMode === 'pomo'}
              onClick={playSfx} 
              onChange={handleModeChange} />
<label htmlFor="pomo" className="px-2 controls__button sm:py-1 md:py-2 lg:py:3 sm:text-[5px] md:text-[7px] lg:text-[9px] 2xl:text-[15px]">pomodoro</label>

      <input  type="radio" 
              id="short" 
              name="mode" 
              checked={timerMode === 'short'}
              onClick={playSfx} 
              onChange={handleModeChange} />
      <label htmlFor="short"  className="px-2 controls__button sm:py-1 md:py-2 lg:py:3 sm:text-[5px] md:text-[7px] lg:text-[9px] 2xl:text-[15px]">short break</label>
      
      <input  type="radio" 
              id="long" 
              name="mode" 
              checked={timerMode === 'long'}
              onClick={playSfx} 
              onChange={handleModeChange} />
      <label htmlFor="long"  className="px-2 controls__button sm:py-1 md:py-2 lg:py:3 sm:text-[5px] md:text-[7px] lg:text-[9px] 2xl:text-[15px]">long break</label>
    </form>
  )
}

export default Controls