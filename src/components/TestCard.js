// src/components/TestCard.js
import React from 'react';

const TestCard = React.memo(({ test, subject, isEditMode, onDelete, handleToggleTestCompletion }) => {
    const handleCardClick = () => {
        if (!isEditMode && test.link && test.link.startsWith('http')) {
            window.open(test.link, '_blank');
        } else if (test.link) {
            console.warn(`Invalid link for ${test.title}: ${test.link}. Must start with http:// or https://`);
        }
    };

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        handleToggleTestCompletion(subject, test.title, !test.completed);
    };

    const cardClasses = `
        relative bg-white p-4 rounded-lg flex justify-between items-center transition-colors duration-300 shadow-sm
        ${test.completed ? 'bg-green-50 border border-green-200' : 'border border-gray-200'}
        ${test.link && !isEditMode ? 'cursor-pointer hover:shadow-md' : ''}
    `;

    return (
        <div
            id={`trophy-test-item-${subject}-${test.title}`}
            className={cardClasses}
            onClick={handleCardClick}
        >
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
                    <p className="text-sm text-gray-500 mt-1">{test.mcqs} MCQs</p>
                    <p className="text-xs text-gray-400 mt-1">Completed on {test.date}</p>
                </div>
            </div>
            {isEditMode && (
                <button
                    className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200"
                    onClick={(e) => { e.stopPropagation(); onDelete(subject, test.title); }}
                    aria-label="Delete test"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            )}
            {!isEditMode && (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
            )}
        </div>
    );
});

export default TestCard;