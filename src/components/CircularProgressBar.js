// src/components/CircularProgressBar.js
import React from 'react';

const CircularProgressBar = React.memo(({ percentage }) => {
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-20 h-20">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-green-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor" />
                <path
                    className="progress-ring__circle text-green-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    style={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: offset }}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-green-600">{Math.round(percentage)}%</div>
        </div>
    );
});

export default CircularProgressBar;