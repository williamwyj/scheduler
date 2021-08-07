import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);
  
  const transition = (initialMode, replace = false) => {
    setMode(initialMode)
    let replaceHistory = [];
    
    if (history.length > 1 && replace){
      replaceHistory = history.slice(1);
    }
    setHistory(replace ? [initialMode, ...replaceHistory] : [initialMode, ...history])
  }

  const back = () => {
    setMode(history.length <= 1 ? initialMode : history[1]);
    setHistory(history.slice(1));
  }
  
  return { mode, transition, back }

}

