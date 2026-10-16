import { useState, useEffect } from 'react';
import api from '../api';
import RestTimer from './RestTimer';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Minus, ArrowLeft } from 'lucide-react';

const WorkoutLogger = () => {
    const { exerciseId } = useParams(); // Grabs the ID from the URL (e.g., /workout/1)
    const location = useLocation();
    const navigate = useNavigate();

    // Grabs the name passed from the Dashboard, with a fallback
    const exerciseName = location.state?.name || "Custom Exercise";
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [restTimer, setRestTimer] = useState(90);

    // Pacing flow state
    const [isLoading, setIsLoading] = useState(true);
    const [isResting, setIsResting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [currentSetOrder, setCurrentSetOrder] = useState(1);

    useEffect(() => {
        const fetchLastPerformance = async () => {
            try {
                const response = await api.get(`/exercises/${exerciseId}/last_performance/`);
                setWeight(parseFloat(response.data.weight) || 0);
                setReps(parseInt(response.data.reps) || 0);
                setRestTimer(parseInt(response.data.rest_timer_used) || 90);
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
        setIsSaving(true);
        setSaveError(false);
        try {
            await api.post('/sets/', {
                exercise: exerciseId,
                weight: weight,
                reps: reps,
                rest_timer_used: restTimer,
                // Automatically pull the active session ID!
                workout: localStorage.getItem('activeWorkoutId'),
                set_order: currentSetOrder
            });

            setCurrentSetOrder(prev => prev + 1);
            setIsResting(true);
        } catch (error) {
            console.error("Failed to log set", error);
            setSaveError(true);
        } finally {
            setIsSaving(false);
        }
    };

    // View Routing: If resting, show the timer component
    if (isResting) {
        return (
            <RestTimer
                initialSeconds={restTimer}
                nextSet={currentSetOrder}
                onComplete={() => setIsResting(false)}
            />
        );
    }

    return (
        <main className="screen">
            <header className="topbar">
                <button onClick={() => navigate('/')} className="btn btn-icon" aria-label="Back to exercises">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="topbar-title">{exerciseName}</h1>
                <span className="chip">Set {currentSetOrder}</span>
            </header>

            <section className="body" style={{ gap: '12px' }}>
                {isLoading ? (
                    <>
                        <div className="skeleton" style={{ height: '148px' }} aria-label="Loading last session" />
                        <div className="skeleton" style={{ height: '148px' }} />
                    </>
                ) : (
                    <>
                        <Stepper label="Weight, lbs" value={weight} step={2.5} onAdjust={adjustWeight} i={0} />
                        <Stepper label="Reps" value={reps} step={1} onAdjust={adjustReps} i={1} />
                    </>
                )}
            </section>

            <div className="dock">
                {saveError && <p className="error" role="alert">Couldn't save that set. Check your connection and try again.</p>}
                <button onClick={logSet} className="btn btn-primary" disabled={isLoading || isSaving}>
                    {isSaving ? 'Saving…' : 'Log set'}
                    <span className="meta">Rest {restTimer}s</span>
                </button>
            </div>
        </main>
    );
};

const Stepper = ({ label, value, step, onAdjust, i }) => (
    <div className="stepper rise" style={{ '--i': i }}>
        <div className="stepper-label">{label}</div>
        <div className="stepper-row">
            <button onClick={() => onAdjust(-step)} className="btn btn-step" aria-label={`Decrease ${label}`}>
                <Minus size={24} />
            </button>
            {/* key remounts the number so it pops on every change */}
            <span key={value} className="stepper-value pop" aria-live="polite">{value}</span>
            <button onClick={() => onAdjust(step)} className="btn btn-step" aria-label={`Increase ${label}`}>
                <Plus size={24} />
            </button>
        </div>
    </div>
);

export default WorkoutLogger;
