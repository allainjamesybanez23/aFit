import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                // Fetching the hybrid exercise library from Django
                const response = await api.get('/exercises/');
                setExercises(response.data);
            } catch (error) {
                console.error("Failed to fetch exercises", error);
            }
        };
        fetchExercises();
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#E31B54', textAlign: 'center', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={32} style={{ marginRight: '10px' }} />
                aFit
            </h1>
            
            <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#F4F4F4' }}>Exercise Library</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {exercises.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center' }}>No exercises found. Add some in the Django Admin!</p>
                ) : (
                    exercises.map(exercise => (
                        <button 
                            key={exercise.id}
                            // Navigate to the dynamic URL and pass the name via state
                            onClick={() => navigate(`/workout/${exercise.id}`, { state: { name: exercise.name } })}
                            style={cardStyle}
                        >
                            {exercise.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

const cardStyle = { backgroundColor: '#333', color: '#F4F4F4', padding: '20px', borderRadius: '12px', border: 'none', textAlign: 'left', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', touchAction: 'manipulation' };

export default Dashboard;