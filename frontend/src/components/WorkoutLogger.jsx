import { useState, useEffect } from 'react';
import { Plus, Minus, Timer, Dumbbell, Save } from 'lucide-react';
import api from '../api';

const WorkoutLogger = ({ exerciseId, exerciseName }) => {
    // 1. Initialize State
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [restTimer, setRestTimer] = useState(90);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Automated Progression Tracking (Fetch Baseline)
    useEffect(() => {
        const fetchLastPerformance = async () => {
            try {
                // Hitting the custom @action endpoint we built in Django
                const response = await api.get(`/exercises/${exerciseId}/last_performance/`);
                
                // Pre-populate the UI so the user doesn't have to type anything
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

    // 3. Zero-Typing Handlers
    const adjustWeight = (amount) => setWeight(prev => Math.max(0, prev + amount));
    const adjustReps = (amount) => setReps(prev => Math.max(0, prev + amount));

    const logSet = async () => {
        // Send the completed set back to Django
        try {
            await api.post('/sets/', {
                exercise: exerciseId,
                weight: weight,
                reps: reps,
                rest_timer_used: restTimer,
                // Hardcoding workout ID and set order for MVP testing
                workout: 1, 
                set_order: 1 
            });
            alert("Set Logged!");
            // Here is where you would normally trigger the intelligent rest timer
        } catch (error) {
            console.error("Failed to log set", error);
        }
    };

    if (isLoading) return <div className="text-white">Loading historical data...</div>;

    // 4. The Aggressively Mobile-First UI
    return (
        <div style={{ backgroundColor: '#181818', color: '#F4F4F4', padding: '20px', borderRadius: '12px' }}>
            <h2 style={{ color: '#E31B54', textAlign: 'center', marginBottom: '20px' }}>{exerciseName}</h2>
            
            {/* Weight Row */}
            <div style={rowStyle}>
                <Dumbbell size={24} color="#E31B54" />
                <button onClick={() => adjustWeight(-2.5)} style={btnStyle}><Minus size={20} /></button>
                <span style={numberStyle}>{weight} lbs</span>
                <button onClick={() => adjustWeight(2.5)} style={btnStyle}><Plus size={20} /></button>
            </div>

            {/* Reps Row */}
            <div style={rowStyle}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#E31B54' }}>REPS</span>
                <button onClick={() => adjustReps(-1)} style={btnStyle}><Minus size={20} /></button>
                <span style={numberStyle}>{reps}</span>
                <button onClick={() => adjustReps(1)} style={btnStyle}><Plus size={20} /></button>
            </div>

            {/* Submit Button */}
            <button onClick={logSet} style={submitBtnStyle}>
                <Save size={20} style={{ marginRight: '8px' }} />
                LOG SET & START TIMER ({restTimer}s)
            </button>
        </div>
    );
};

// Quick inline styles for layout before you implement full CSS/Tailwind
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '10px 0' };
const btnStyle = { backgroundColor: '#333', border: 'none', color: '#F4F4F4', padding: '15px', borderRadius: '8px', touchAction: 'manipulation' };
const numberStyle = { fontSize: '28px', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' };
const submitBtnStyle = { width: '100%', backgroundColor: '#E31B54', color: '#F4F4F4', padding: '20px', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' };

export default WorkoutLogger;