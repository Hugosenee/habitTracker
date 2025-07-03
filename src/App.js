import './index.css';
import Streak from './components/Streak';

function App() {

  return (
    <div className="App w-screen h-screen pt-10">
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Your Streaks Today</h2>
      <p className="text-sm text-gray-500 mt-1">
        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
      </p>
    </div>
      <Streak streakName="Sport"/>
      <Streak streakName="Read"/>
      <Streak streakName="Clean"/>
    </div>
  );
}

export default App;
