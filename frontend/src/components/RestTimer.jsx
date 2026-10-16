import { useState, useEffect } from 'react';
import { SkipForward } from 'lucide-react';

const RING = 2 * Math.PI * 46; // circumference for r=46 in a 100x100 viewBox

const RestTimer = ({ initialSeconds, nextSet, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    // Grows when +15s pushes past it, so the ring stays honest
    const [total, setTotal] = useState(initialSeconds);

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
        const next = Math.max(0, timeLeft + amount);
        setTimeLeft(next);
        setTotal(t => Math.max(t, next));
    };

    // Format seconds into M:SS for the UI
    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = total > 0 ? timeLeft / total : 0;

    return (
        <main className="screen">
            <header className="topbar">
                <h1 className="topbar-title">Rest</h1>
                <span className="chip">Set {nextSet} next</span>
            </header>

            <section className="body" style={{ justifyContent: 'center' }}>
                <div className="ring rise" role="timer" aria-label={`${formatTime(timeLeft)} rest remaining`}>
                    <svg viewBox="0 0 100 100" aria-hidden="true">
                        <circle className="ring-track" cx="50" cy="50" r="46" fill="none" strokeWidth="5" />
                        <circle
                            className="ring-fill"
                            cx="50" cy="50" r="46" fill="none" strokeWidth="5" strokeLinecap="round"
                            strokeDasharray={RING}
                            strokeDashoffset={RING * (1 - progress)}
                        />
                    </svg>
                    <div className="ring-time">
                        {formatTime(timeLeft)}
                        <small>of {formatTime(total)}</small>
                    </div>
                </div>
            </section>

            <div className="dock">
                <div className="split">
                    <button onClick={() => adjustTime(-15)} className="btn btn-ghost">-15s</button>
                    <button onClick={() => adjustTime(15)} className="btn btn-ghost">+15s</button>
                </div>
                <button onClick={() => onComplete()} className="btn btn-primary">
                    <SkipForward size={20} strokeWidth={2.25} />
                    Skip rest
                </button>
            </div>
        </main>
    );
};

export default RestTimer;
