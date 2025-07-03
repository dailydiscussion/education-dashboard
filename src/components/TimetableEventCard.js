// src/components/TimetableEventCard.js
import React from 'react';

const TimetableEventCard = React.memo(({ events, isEditMode, onDelete, onCheck, onEdit, selectedCalendarDate, onSelectCalendarDate }) => {
    const sortedEvents = React.useMemo(() => {
        return [...events].sort((a, b) => {
            // Sort by time first
            const timeComparison = a.time.localeCompare(b.time);
            if (timeComparison !== 0) {
                return timeComparison;
            }
            // If times are the same, sort by checked status (completed last)
            return (a.checked === b.checked) ? 0 : a.checked ? 1 : -1;
        });
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

    /**
     * Determines the status of an event (Completed, Missed, or Pending).
     * @param {string} eventDate - The date of the event in 'YYYY-MM-DD' format.
     * @param {string} eventTime - The time of the event in 'HH:MM' format.
     * @param {boolean} isChecked - The checked status of the event.
     * @returns {{text: string, colorClass: string}} An object with status text and Tailwind CSS color class.
     */
    const getEventStatus = (eventDate, eventTime, isChecked) => {
        if (isChecked) {
            return { text: 'Completed', colorClass: 'text-green-600' };
        }

        const now = new Date();
        // Combine date and time to create a full Date object for comparison
        const eventDateTime = new Date(`${eventDate}T${eventTime}`);

        if (eventDateTime < now) {
            return { text: 'Missed', colorClass: 'text-red-600' };
        } else {
            return { text: 'Pending', colorClass: 'text-yellow-600' };
        }
    };

    return (
        <div className="w-full">
            {/* Navigation for changing days */}
            <div className="flex items-center justify-between px-0 py-6 text-gray-700 font-semibold text-lg">
                <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Previous day">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="flex-grow text-center text-lg sm:text-base">
                    {formatDateForDisplay(selectedCalendarDate)}
                </span>
                <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="Next day">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>

            {/* Display message if no events for the selected date */}
            {sortedEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No events scheduled for this date.</p>
            ) : (
                // Map through sorted events and display each as a card
                sortedEvents.map(item => {
                    // Get the status and its corresponding color for the current event
                    const status = getEventStatus(item.date, item.time, item.checked);
                    return (
                        <div
                            key={item.id}
                            className={`flex justify-between items-center p-4 mb-3 rounded-xl shadow-sm ${item.checked ? "bg-green-100" : "bg-white"}`}
                        >
                            <div>
                                <p className="text-sm text-gray-500">{item.time}</p>
                                <p className="text-lg font-semibold text-gray-800">{item.subject}</p>
                                <h4 className="text-base text-gray-600">{item.topic}</h4>
                                <p className={`text-sm font-semibold ${status.colorClass}`}>{status.text}</p>
                            </div>
                            <div className="flex items-center">
                                {/* Conditional rendering based on isEditMode */}
                                {isEditMode ? (
                                    <>
                                        {/* Edit button, visible only in edit mode */}
                                        <button
                                            onClick={() => onEdit(item.id)} // Call onEdit with item.id
                                            className="p-1.5 mr-4 rounded-full text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                            aria-label="Edit event"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        {/* Delete button, visible only in edit mode */}
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200 mr-2"
                                            aria-label="Delete event"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </>
                                ) : (
                                    // Check/uncheck button for marking completion, visible only NOT in edit mode
                                    <button
                                        onClick={() => onCheck(item.id)}
                                        className={`w-6 h-6 rounded-full border-2 ${item.checked ? "bg-green-500 border-green-500" : "border-gray-300"}`}
                                        aria-label={item.checked ? "Mark as incomplete" : "Mark as complete"}
                                    >
                                        {/* Checkmark icon if event is checked */}
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
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
});

export default TimetableEventCard;