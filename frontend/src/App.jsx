import WorkoutLogger from './components/WorkoutLogger';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Passing a dummy exercise ID and Name for testing */}
          <WorkoutLogger exerciseId={1} exerciseName="Barbell Bench Press" />
      </div>
    </div>
  );
}

export default App;