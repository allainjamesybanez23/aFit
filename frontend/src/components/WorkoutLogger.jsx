import { useState, useEffect } from 'react';
import { Plus, Minus, Dumbbell, Save } from 'lucide-react';
import api from '../api';
import RestTimer from './RestTimer'; // Import the new timer

const WorkoutLogger = ({ exerciseId, exerciseName }) => {
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [restTimer, setRestTimer] = useState(90);
    
    // New State Variables for the Pacing Flow
    const [isLoading, setIsLoading] = useState(true);
    const [isResting, setIsResting] = useState(false);
    const [currentSetOrder, setCurrentSetOrder] = useState(1);

    useEffect(() => {
        const fetchLastPerformance = async () => {
            try {
                const response = await api.get(`/exercises/${exerciseId}/last_performance/`);
                setWeight(parseFloat(response.data.weight));
                setReps(parseInt(response.data.reps));
                setRestTimer(parseInt(response.data.rest_timer_used));
            } catch (error) {
                console.error("Error fetching performance data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLastPerformance();
    }, [exerciseId]);

    const adjustWeight = (amount) => setWeight(prev => Math.max(0, prev + amount));
    const adjustReps = (amount) => setReps(prev => Math.max(0, prev + amount));

    const logSet = async () => {
        try {
            await api.post('/sets/', {
                exercise: exerciseId,
                weight: weight,
                reps: reps,
                rest_timer_used: restTimer,
                workout: 1, 
                set_order: currentSetOrder 
            });
            
            // Advance the set order and flip the screen to the Rest Timer
            setCurrentSetOrder(prev => prev + 1);
            setIsResting(true);
            
        } catch (error) {
            console.error("Failed to log set", error);
        }
    };

    if (isLoading) return <div style={{ color: '#F4F4F4' }}>Loading historical data...</div>;

    // View Routing: If resting, show the timer component
    if (isResting) {
        return (
            <RestTimer 
                initialSeconds={restTimer} 
                onComplete={() => setIsResting(false)} 
            />
        );
    }

    // Default View: The Logger Component
    return (
        <div style={{ backgroundColor: '#181818', color: '#F4F4F4', padding: '20px', borderRadius: '12px' }}>
            <h2 style={{ color: '#E31B54', textAlign: 'center', marginBottom: '5px' }}>{exerciseName}</h2>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px', marginTop: 0 }}>Set {currentSetOrder}</p>
            
            <div style={rowStyle}>
                <Dumbbell size={24} color="#E31B54" />
                <button onClick={() => adjustWeight(-2.5)} style={btnStyle}><Minus size={20} /></button>
                <span style={numberStyle}>{weight} lbs</span>
                <button onClick={() => adjustWeight(2.5)} style={btnStyle}><Plus size={20} /></button>
            </div>

            <div style={rowStyle}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#E31B54' }}>REPS</span>
                <button onClick={() => adjustReps(-1)} style={btnStyle}><Minus size={20} /></button>
                <span style={numberStyle}>{reps}</span>
                <button onClick={() => adjustReps(1)} style={btnStyle}><Plus size={20} /></button>
            </div>

            <button onClick={logSet} style={submitBtnStyle}>
                <Save size={20} style={{ marginRight: '8px' }} />
                LOG SET & REST ({restTimer}s)
            </button>
        </div>
    );
};

const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '10px 0' };
const btnStyle = { backgroundColor: '#333', border: 'none', color: '#F4F4F4', padding: '15px', borderRadius: '8px', touchAction: 'manipulation' };
const numberStyle = { fontSize: '28px', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' };
const submitBtnStyle = { width: '100%', backgroundColor: '#E31B54', color: '#F4F4F4', padding: '20px', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' };

export default WorkoutLogger;