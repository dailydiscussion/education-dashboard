// src/components/AvailableTestCard.js
import React from 'react';

const AvailableTestCard = React.memo(({ test, subject, isAdded, onAdd, handleToggleTestCompletion }) => {
    const localTempId = `${subject}-${test.title}`;

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        handleToggleTestCompletion(subject, test.title, !test.completed);
    };

    const cardClasses = `
        bg-white p-4 rounded-lg flex justify-between items-center transition-colors duration-300 shadow-sm
        ${test.completed ? 'bg-green-50 border border-green-200' : 'border border-gray-200'}
        ${isAdded ? 'opacity-50 pointer-events-none' : ''}
    `;

    return (
        <div id={`available-test-${localTempId}`} className={cardClasses}>
            <div className="flex items-center flex-grow">
                <button
                    onClick={handleCheckboxClick}
                    className={`w-6 h-6 rounded-full border-2 ${test.completed ? "bg-green-500 border-green-500" : "border-gray-300"} mr-3`}
                    aria-label={test.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                    {test.completed && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white m-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>
                <div>
                    <h4 className="font-semibold text-gray-800">{test.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{test.mcqs} MCQs - {subject}</p>
                </div>
            </div>
            <button
                className={`text-white px-3 py-1 rounded-full text-sm transition duration-200
                    ${isAdded ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() => onAdd(test, subject)}
                disabled={isAdded}
            >
                {isAdded ? 'Added' : 'Add'}
            </button>
        </div>
    );
});

export default AvailableTestCard;