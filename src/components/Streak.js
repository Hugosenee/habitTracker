import React from 'react'
import '../App.css';
import { useState, useEffect } from 'react';

function Streak(props) {
    const [streak, setStreak] = useState(0);
    const [modiftyStreak, setModifyStreak] = useState(0);
    const [lastClickDate, setLastClickDate] = useState('');
    const [canClick, setCanClick] = useState(true);
    const [showInput, setShowInput] = useState(false)

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
        console.log(props.streakName)
    const savedStreak = parseInt(localStorage.getItem(props.streakName)) || 0;
    const savedDate = localStorage.getItem(props.streakName + 'LastClick') || '';

    const today = getTodayLocal();

    setCanClick(savedDate !== today);

    if (savedDate && !isYesterday(savedDate) && savedDate !== today) {
        localStorage.setItem(props.streakName, '0');
        setStreak(0);
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
        localStorage.setItem(props.streakName, '0');
        setStreak(0);
        setLastClickDate('');
        setCanClick(true);
        }
    }, 60000);

    return () => clearInterval(interval);
    }, [lastClickDate, props.streakName]);

    function handleClick() {
    if (!canClick) return;

    const today = getTodayLocal();
    const newStreak = isYesterday(lastClickDate) || !lastClickDate
        ? streak + 1
        : 1;

    setStreak(newStreak);
    setLastClickDate(today);
    setCanClick(false);

    localStorage.setItem(props.streakName, newStreak.toString());
    localStorage.setItem(props.streakName + 'LastClick', today);
    }

    function toggleInput() {
    setShowInput(prev => !prev);
    }
    

    function handleStreakNumber(e) {
    setModifyStreak(e.target.value)
    }

    function handleNewStreak(e) {
    e.preventDefault()

    const today = getTodayLocal();
    setStreak(modiftyStreak)

    console.log(today, streak)

    localStorage.setItem(props.streakName, modiftyStreak.toString());
    localStorage.setItem(props.streakName + 'LastClick', today);

    setShowInput(false)

    }
    
return (
<div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto my-6">
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <h1 className="text-xl font-semibold text-gray-900">{props.streakName}</h1>
        </div>
        <span className="text-md font-medium text-gray-600">{streak} days</span>
    </div>

    {/* Progress Bar */}
    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
        style={{ width: `${(streak / 30) * 100}%` }} // 30 is the max streak
        ></div>
    </div>

    {/* Action Button + Edit */}
    <div className="flex items-center justify-between">
        <button
        className={`flex-1 mr-2 px-4 py-2 text-sm font-medium rounded-xl shadow-md transition-transform 
            ${canClick
            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:scale-105'
            : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white cursor-not-allowed'
            }`}
        onClick={handleClick}
        disabled={!canClick}
        >
        {canClick ? "Mark as done" : "🎉 Congrat Champ!"}
        </button>

        <span
        className="text-xl cursor-pointer hover:scale-110 transition-transform"
        onClick={toggleInput}
        >✏️</span>
    </div>

    {/* Modify Input */}
    {showInput && (
        <form
        method="POST"
        onSubmit={handleNewStreak}
        className="flex justify-start items-center gap-2 mt-4"
        >
        <input
            onChange={handleStreakNumber}
            type="number"
            placeholder="Enter days"
            className="border border-gray-300 rounded-lg px-3 py-1 w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg px-3 py-1 text-sm hover:bg-green-600 transition"
        >
            ✅
        </button>
        </form>
    )}


</div>


    )
}

export default Streak