import { useState, useEffect } from 'react';
import { Play, Minus, Plus, Timer } from 'lucide-react';

const RestTimer = ({ initialSeconds, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    // The Countdown Engine
    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete(); 
            return;
        }
        
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        
        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [timeLeft, onComplete]);

    // Zero-Typing Time Adjustments
    const adjustTime = (amount) => {
        setTimeLeft((prev) => Math.max(0, prev + amount));
    };

    // Format seconds into MM:SS for the UI
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ backgroundColor: '#181818', color: '#F4F4F4', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <Timer size={32} color="#E31B54" style={{ marginBottom: '10px' }} />
            <h2 style={{ color: '#E31B54', margin: '0 0 20px 0' }}>RECOVER</h2>
            
            <div style={{ fontSize: '72px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '30px' }}>
                {formatTime(timeLeft)}
            </div>

            <div style={rowStyle}>
                <button onClick={() => adjustTime(-15)} style={adjustBtnStyle}>-15s</button>
                <button onClick={() => adjustTime(15)} style={adjustBtnStyle}>+15s</button>
            </div>

            <button onClick={() => onComplete()} style={skipBtnStyle}>
                <Play size={20} style={{ marginRight: '8px' }} />
                SKIP & START NEXT SET
            </button>
        </div>
    );
};

// Inline styles
const rowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '10px' };
const adjustBtnStyle = { flex: 1, backgroundColor: '#333', border: 'none', color: '#F4F4F4', padding: '20px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', touchAction: 'manipulation' };
const skipBtnStyle = { width: '100%', backgroundColor: '#E31B54', color: '#F4F4F4', padding: '20px', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default RestTimer;