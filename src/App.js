import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [freeDay, setFreeDay] = useState(0);
  const [canClick, setCanClick] = useState(true);
  const [showGif, setShowGif] = useState(false);

  function getTodayLocal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // janvier = 0
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const storedDay = localStorage.getItem("freeday");
    const storedDate = localStorage.getItem("lastClick");

    if (storedDay !== null) {
      setFreeDay(Number(storedDay));
    }

    const today = getTodayLocal();

    if (storedDate === today) {
      setCanClick(false); // déjà cliqué aujourd'hui
    }

    // Reinitialiser si la dernière date est < hier
    if (storedDate && storedDate < today) {
      localStorage.removeItem("lastClick");
      localStorage.setItem("freeday", 0);
      setFreeDay(0);
      setCanClick(true);
    }

    // Vérifie chaque minute si on est passé à un nouveau jour
    const interval = setInterval(() => {
      const now = new Date();
      const nowDate = now.toISOString().split('T')[0];
      const last = localStorage.getItem("lastClick");

      if (last && last < nowDate) {
        // Reset
        localStorage.removeItem("lastClick");
        localStorage.setItem("freeday", 0);
        setFreeDay(0);
        setCanClick(true);
      }
    }, 60000); // toutes les 60 secondes

    return () => clearInterval(interval);
  }, []);

  function addOne() {
    if (!canClick) return;

    const newValue = freeDay + 1;
    const today = getTodayLocal();

    console.log(today)

    setFreeDay(newValue);
    setCanClick(false);
    setShowGif(true);

    localStorage.setItem("freeday", newValue);
    localStorage.setItem("lastClick", today);

    // Cache le gif après 5 secondes
    setTimeout(() => setShowGif(false), 5000);
  }

  return (
    <div className="App">
      <div className='center'>
        <h1>Free day</h1>
        <button onClick={addOne} disabled={!canClick}>
          {canClick ? "+" : "Congrats Champ!"}
        </button>
        <span>{freeDay}</span>

        {showGif && (
          <div>
            <img src="/lebron.gif" alt="celebration" style={{ width: '300px', marginTop: '20px' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
