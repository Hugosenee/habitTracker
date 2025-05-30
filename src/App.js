import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [streak, setStreak] = useState(0);
  const [lastClickDate, setLastClickDate] = useState('');
  const [canClick, setCanClick] = useState(true);
  const [showGif, setShowGif] = useState(false);

  const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isYesterday = (dateStr) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const y = yesterday.getFullYear();
    const m = String(yesterday.getMonth() + 1).padStart(2, '0');
    const d = String(yesterday.getDate()).padStart(2, '0');
    return dateStr === `${y}-${m}-${d}`;
  };

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem('streak')) || 0;
    const savedDate = localStorage.getItem('lastClick') || '';

    const today = getTodayLocal();

    setCanClick(savedDate !== today);

    if (savedDate && !isYesterday(savedDate) && savedDate !== today) {
      localStorage.setItem('streak', '0');
      setStreak(0);
      setShowGif(false);
    } else {
      setStreak(savedStreak);
    }

    setLastClickDate(savedDate);

    const interval = setInterval(() => {
      const currentDate = getTodayLocal();
      if (lastClickDate && lastClickDate !== currentDate) {
        setCanClick(true);
      }

      const missedDay =
        lastClickDate &&
        new Date(currentDate) > new Date(lastClickDate) &&
        !isYesterday(lastClickDate) &&
        lastClickDate !== currentDate;

      if (missedDay) {
        localStorage.setItem('streak', '0');
        setStreak(0);
        setLastClickDate('');
        setCanClick(true);
        setShowGif(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastClickDate]);

  function handleClick() {
    if (!canClick) return;

    const today = getTodayLocal();
    const newStreak = isYesterday(lastClickDate) || !lastClickDate
      ? streak + 1
      : 1;

    setStreak(newStreak);
    setLastClickDate(today);
    setCanClick(false);

    localStorage.setItem('streak', newStreak.toString());
    localStorage.setItem('lastClick', today);

    setShowGif(true);
  }

  return (
    <div className="App">
      <div className="center">
        <h1>🔥 Streak: {streak}</h1>
        <button onClick={handleClick} disabled={!canClick}>
          {canClick ? "Mark as done" : "Congrat Champ!"}
        </button>

        {showGif && (
          <div>
            <img
              src="/lebron.gif"
              alt="celebration"
              style={{ width: '300px', marginTop: '20px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
