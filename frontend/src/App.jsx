import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Menu */}
        <Route path="/" element={<Dashboard />} />

        {/* Dynamic Route for specific exercises */}
        <Route path="/workout/:exerciseId" element={<WorkoutLogger />} />
      </Routes>
    </Router>
  );
}

export default App;
