import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#181818', fontFamily: 'sans-serif' }}>
        <Routes>
          {/* Main Menu */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Dynamic Route for specific exercises */}
          <Route path="/workout/:exerciseId" element={<WorkoutLogger />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;