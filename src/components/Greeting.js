// src/components/Greeting.js
import React, { useState, useEffect } from 'react';

const Greeting = React.memo(({ userName }) => {
    const [greetingText, setGreetingText] = useState('');
    const [greetingEmoji, setGreetingEmoji] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            let text = '';
            let emoji = '';

            if (hour >= 5 && hour < 12) {
                text = 'Good morning';
                emoji = '☀️';
            } else if (hour >= 12 && hour < 17) {
                text = 'Good afternoon';
                emoji = '👋';
            } else if (hour >= 17 && hour < 22) {
                text = 'Good evening';
                emoji = '🌙';
            } else {
                text = 'Time to sleep';
                emoji = '😴';
            }
            setGreetingText(text);
            setGreetingEmoji(emoji);
        };

        updateGreeting();
        const intervalId = setInterval(updateGreeting, 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <p className="text-sm font-light text-gray-500 flex items-center">
                {greetingText}<span className="ml-1 text-base">{greetingEmoji}</span>
            </p>
        </div>
    );
});

export default Greeting;