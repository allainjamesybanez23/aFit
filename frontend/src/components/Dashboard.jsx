import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ChevronRight, Play } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    // null = still loading
    const [exercises, setExercises] = useState(null);
    const [loadError, setLoadError] = useState(false);
    // Read from local storage to see if a workout is already in progress
    const [activeWorkoutId, setActiveWorkoutId] = useState(localStorage.getItem('activeWorkoutId'));
    const [isStarting, setIsStarting] = useState(false);
    const [startError, setStartError] = useState(false);
    const navigate = useNavigate();

    // Bumped by "Try again" to refetch
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await api.get('/exercises/');
                setExercises(response.data);
            } catch (error) {
                console.error("Failed to fetch exercises", error);
                setLoadError(true);
            }
        };
        fetchExercises();
    }, [reloadKey]);

    const retryExercises = () => {
        setLoadError(false);
        setExercises(null);
        setReloadKey(k => k + 1);
    };

    // --- SESSION MANAGEMENT LOGIC ---
    const startWorkout = async () => {
        setIsStarting(true);
        setStartError(false);
        try {
            // Send request to Django to generate a new Workout row (hardcoded user 1 for MVP)
            const response = await api.post('/workouts/', { user: 1 });
            const newWorkoutId = response.data.id;

            // Save the new ID to the browser and update state
            localStorage.setItem('activeWorkoutId', newWorkoutId);
            setActiveWorkoutId(newWorkoutId);
        } catch (error) {
            console.error("Failed to start workout", error);
            setStartError(true);
        } finally {
            setIsStarting(false);
        }
    };

    const endWorkout = () => {
        // Clear the session
        localStorage.removeItem('activeWorkoutId');
        setActiveWorkoutId(null);
    };

    return (
        <main className="screen">
            <header className="topbar">
                <div className="brand">
                    <Activity size={22} strokeWidth={2.25} />
                    aFit
                </div>
                {activeWorkoutId && (
                    <button onClick={endWorkout} className="btn btn-ghost">End workout</button>
                )}
            </header>

            {/* CONDITIONAL UI: If no active workout, force them to start one */}
            {!activeWorkoutId ? (
                <>
                    <section className="body" style={{ justifyContent: 'flex-end', paddingBottom: '8px' }}>
                        <h1 className="headline rise">Log every set in two taps.</h1>
                        <p className="lede rise" style={{ '--i': 1 }}>
                            Start a workout, pick a lift, and aFit fills in your last weight, reps and rest.
                        </p>
                    </section>
                    <div className="dock rise" style={{ '--i': 2 }}>
                        {startError && <p className="error" role="alert">Couldn't start a workout. Check that the API is running.</p>}
                        <button onClick={startWorkout} className="btn btn-primary" disabled={isStarting}>
                            <Play size={20} strokeWidth={2.25} fill="currentColor" />
                            {isStarting ? 'Starting…' : 'Start workout'}
                        </button>
                    </div>
                </>
            ) : (
                <section className="body">
                    <h1 className="section-title">Pick an exercise</h1>
                    <ExerciseList
                        exercises={exercises}
                        loadError={loadError}
                        onRetry={retryExercises}
                        onPick={(exercise) => navigate(`/workout/${exercise.id}`, { state: { name: exercise.name } })}
                    />
                </section>
            )}
        </main>
    );
};

const ExerciseList = ({ exercises, loadError, onRetry, onPick }) => {
    if (loadError) {
        return (
            <div className="notice" role="alert">
                <strong>Couldn't load exercises.</strong>
                Check that the API is running, then try again.
                <div style={{ marginTop: '16px' }}>
                    <button onClick={onRetry} className="btn btn-ghost">Try again</button>
                </div>
            </div>
        );
    }

    if (exercises === null) {
        return (
            <div style={{ display: 'grid', gap: '8px' }} aria-busy="true" aria-label="Loading exercises">
                {[0, 1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '68px' }} />)}
            </div>
        );
    }

    if (exercises.length === 0) {
        return (
            <p className="notice">
                <strong>No exercises yet.</strong>
                Add a few in the Django admin and they'll show up here.
            </p>
        );
    }

    return (
        <div className="list">
            {exercises.map((exercise, i) => (
                <button
                    key={exercise.id}
                    onClick={() => onPick(exercise)}
                    className="row rise"
                    style={{ '--i': Math.min(i, 8) }}
                >
                    <span className="row-text">
                        <span className="row-name">{exercise.name}</span>
                        {exercise.tags?.length > 0 && <span className="row-tags">{exercise.tags.join(', ')}</span>}
                    </span>
                    <ChevronRight size={20} />
                </button>
            ))}
        </div>
    );
};

export default Dashboard;
