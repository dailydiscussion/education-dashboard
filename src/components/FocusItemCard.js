// src/components/FocusItemCard.js
import React from 'react';

const FocusItemCard = React.memo(({ item, onRemove, onMoveUp, onMoveDown, isFirst, isLast, allowReorder, handleToggleTestCompletion }) => {
    const handleCardClick = () => {
        if (item.link && item.link.startsWith('http')) {
            window.open(item.link, '_blank');
        } else if (item.link) {
            console.warn(`Invalid link for ${item.title}: ${item.link}. Must start with http:// or https://`);
        }
    };
    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        handleToggleTestCompletion(item.subject, item.title, !item.completed);
    };

    const cardClasses = `
        relative flex-shrink-0 w-full p-4 rounded-xl border transition-all duration-300 ease-in-out
        ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
        cursor-pointer hover:shadow-md shadow-sm
    `;
    return (
        <div id={`focus-item-${item.id}`} className={cardClasses} onClick={handleCardClick}>
            <div className="flex items-start flex-grow pr-16">
                <button
                    onClick={handleCheckboxClick}
                    className={`w-6 h-6 rounded-full border-2 ${item.completed ? "bg-green-500 border-green-500" : "border-gray-300"} mr-3 flex-shrink-0 mt-0.5`}
                    aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                    {item.completed && (
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
                <div className="flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                        <path d={item.iconPath || "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"}></path>
                    </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 leading-tight">{item.title}</h3>
                    <div className="flex items-center mt-1 text-sm">
                        <span className="text-gray-500">({item.mcqs} MCQs)</span>
                    </div>
                </div>
            </div>
            {allowReorder && (
                <div className="absolute top-2 right-2 flex flex-col items-center space-y-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        disabled={isFirst}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Move up"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        disabled={isLast}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Move down"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                </div>
            )}
            {!allowReorder && (
                <button className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }} aria-label="Remove from focus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            )}
        </div>
    );
});

export default FocusItemCard;