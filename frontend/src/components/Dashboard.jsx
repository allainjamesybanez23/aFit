import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Play, Square } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const [exercises, setExercises] = useState([]);
    // Read from local storage to see if a workout is already in progress
    const [activeWorkoutId, setActiveWorkoutId] = useState(localStorage.getItem('activeWorkoutId'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await api.get('/exercises/');
                setExercises(response.data);
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            }
        };
        fetchExercises();
    }, []);

    // --- SESSION MANAGEMENT LOGIC ---
    const startWorkout = async () => {
        try {
            // Send request to Django to generate a new Workout row (hardcoded user 1 for MVP)
            const response = await api.post('/workouts/', { user: 1 });
            const newWorkoutId = response.data.id;
            
            // Save the new ID to the browser and update state
            localStorage.setItem('activeWorkoutId', newWorkoutId);
            setActiveWorkoutId(newWorkoutId);
        } catch (error) {
            console.error("Failed to start workout", error);
        }
    };

    const endWorkout = () => {
        // Clear the session
        localStorage.removeItem('activeWorkoutId');
        setActiveWorkoutId(null);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#E31B54', textAlign: 'center', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={32} style={{ marginRight: '10px' }} />
                aFit
            </h1>

            {/* CONDITIONAL UI: If no active workout, force them to start one */}
            {!activeWorkoutId ? (
                <button onClick={startWorkout} style={startBtnStyle}>
                    <Play size={24} style={{ marginRight: '10px' }} />
                    START NEW WORKOUT
                </button>
            ) : (
                <>
                    {/* Active Workout UI: Show the library and an End button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '20px', color: '#F4F4F4', margin: 0 }}>Select Exercise</h2>
                        <button onClick={endWorkout} style={endBtnStyle}>
                            <Square size={16} style={{ marginRight: '5px' }} /> END
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {exercises.length === 0 ? (
                            <p style={{ color: '#888', textAlign: 'center' }}>No exercises found. Add some in the Django Admin!</p>
                        ) : (
                            exercises.map(exercise => (
                                <button 
                                    key={exercise.id}
                                    onClick={() => navigate(`/workout/${exercise.id}`, { state: { name: exercise.name } })}
                                    style={cardStyle}
                                >
                                    {exercise.name}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// Inline Styles
const startBtnStyle = { width: '100%', backgroundColor: '#E31B54', color: '#F4F4F4', padding: '25px', border: 'none', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' };
const endBtnStyle = { backgroundColor: '#333', color: '#F4F4F4', padding: '10px 15px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' };
const cardStyle = { backgroundColor: '#333', color: '#F4F4F4', padding: '20px', borderRadius: '12px', border: 'none', textAlign: 'left', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', touchAction: 'manipulation' };

export default Dashboard;