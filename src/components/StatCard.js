// src/components/StatCard.js
import React from 'react';

const StatCard = React.memo(({ category, value, icon }) => {
    return (
        <div className="bg-[#FEFBF2] p-4 rounded-xl flex flex-col items-start justify-center text-left shadow-sm">
            {React.cloneElement(icon, { className: `mb-2 text-gray-600 ${icon.props.className || ''}` })}
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-sm text-gray-600 mt-1">{category}</p>
        </div>
    );
});

export default StatCard;