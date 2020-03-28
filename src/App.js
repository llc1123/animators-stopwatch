import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState({
    time: 0,
    offset: new Date()
  })
  const [fps, setFps] = useState(24)
  const [timer, setTimer] = useState(null)

  const start = useCallback(() => {
    if (timer) {
      setTimer(null)
    } else {
      setTime(t => ({
        ...t,
        offset: new Date()
      }))
      setTimer(setInterval(() => updateTime(), 0))
    }
  }, [timer])

  const reset = useCallback(() => {
    if (timer) {
      setTimer(null)
    }
    setTime({time: 0, offset: new Date()})
  }, [timer])

  useEffect(() => {
    const onkeyup = ev => {
      switch (ev.keyCode) {
        case 32:
          start()
          break
        case 67:
          reset()
          break
        default:
          return
      }
    }

    window.addEventListener('keyup', onkeyup)

    return () => {
      if (timer) {
        clearInterval(timer)
      }
      window.removeEventListener('keyup', onkeyup)
    }
  }, [reset, start, timer])

  const updateTime = () => {
    const now = new Date()
    setTime(t => ({
      time: t.time + (now - t.offset),
      offset: now
    }))
  }

  const getMinute = () => {
    return Math.floor(time.time / (1000*60)).toString().padStart(2, '0')
  }

  const getSecond = () => {
    return (Math.floor(time.time / 1000) % 60).toString().padStart(2, '0')
  }

  const getMilli = () => {
    return Math.floor(time.time % 1000 / 10).toString().padStart(2, '0')
  }

  const getFrame = () => {
    return Math.floor(time.time % 1000 / (1000 / fps)).toString().padStart(2, '0')
  }

  const getFrames = () => {
    return Math.floor(time.time / (1000 / fps)).toString().padStart(8, '0')
  }

  return (
    <div className="App">
      <div className="content" >
        <div className="upper">
          <div className="left">
            <div className="time">
              {getMinute()}:{getSecond()}.{getMilli()}
            </div>
            
            <div className="frame">
              {getMinute()}:{getSecond()}+{getFrame()}
            </div>

            <div className="frames">
              {getFrames()}
            </div>
          </div>
          <div className="right">
            <div className="text">FPS:</div>
            <input type="number" className="fps" value={fps} onChange={event => setFps(event.target.value)}/>
          </div>


        </div>
        
        <div className="divider" />

        <div className="buttons">
          <div className="button start" onClick={() => start()}>{timer ? 'Stop (Space)' : 'Start (Space)'}</div>
          <div className="button reset" onClick={() => reset()}>Reset (C)</div>
        </div>

      </div>
    </div>
  );
}

export default App;
