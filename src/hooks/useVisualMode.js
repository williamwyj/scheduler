import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  const transition = (initialMode, replace = false) => {
    setMode(initialMode)
    
    setHistory(prev => replace ? [initialMode, ...prev.slice(1)] : [initialMode, ...prev])
  }

  const back = () => {
    setMode(history.length <= 1 ? initialMode : history[1]);
    setHistory(history.slice(1));
  }
  
  return { mode, transition, back }

}

