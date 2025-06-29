// src/components/TimetableEventCard.js
import React from 'react';

const TimetableEventCard = React.memo(({ events, isEditMode, onDelete, onCheck, selectedCalendarDate, onSelectCalendarDate }) => {
    const sortedEvents = React.useMemo(() => {
        return [...events].sort((a, b) => a.time.localeCompare(b.time));
    }, [events]);

    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handlePrevDay = () => {
        const newDate = new Date(selectedCalendarDate);
        newDate.setDate(newDate.getDate() - 1);
        onSelectCalendarDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedCalendarDate);
        newDate.setDate(newDate.getDate() + 1);
        onSelectCalendarDate(newDate);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between px-0 py-6 text-gray-700 font-semibold text-lg">
                <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Previous day">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12 15.75 4.5" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold text-gray-700">
                    {formatDateForDisplay(selectedCalendarDate)}
                </h2>
                <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Next day">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12 8.25 19.5" />
                    </svg>
                </button>
            </div>
            {sortedEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No events for this day.</div>
            ) : (
                sortedEvents.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 my-2 rounded-lg shadow ${item.checked ? 'bg-green-100' : 'bg-white'}`}
                    >
                        <div>
                            <p className={`font-semibold text-lg ${item.checked ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                                {item.topic} for {item.subject}
                            </p>
                            <p className={`text-sm ${item.checked ? 'text-green-700' : 'text-gray-600'}`}>
                                {item.time}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {isEditMode && (
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                                    aria-label="Delete event"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            )}
                            <button
                                onClick={() => onCheck(item.id)}
                                className={`w-6 h-6 rounded-full border-2 ${item.checked ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                                aria-label={item.checked ? "Mark as incomplete" : "Mark as complete"}
                            >
                                {item.checked && (
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
                        </div>
                    </div>
                ))
            )}
        </div>
    );
});

export default TimetableEventCard;