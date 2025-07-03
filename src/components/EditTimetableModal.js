// src/components/EditTimetableModal.js
import React, { useState, useEffect } from 'react';

const EditTimetableModal = ({ isOpen, onClose, eventData, onUpdateEvent, showNotification }) => {
    // State to manage form inputs within the modal
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Effect to populate form fields when eventData changes (i.e., when a new event is selected for editing)
    useEffect(() => {
        if (eventData) {
            setSubject(eventData.subject || '');
            setTopic(eventData.topic || '');
            setDate(eventData.date || '');
            setTime(eventData.time || '');
        }
    }, [eventData]);

    // Handle the update action when the "Update Event" button is clicked
    const handleUpdateClick = async () => {
        if (!eventData || !eventData.id) {
            showNotification('No event selected for editing.', 'error');
            return;
        }
        if (!subject || !topic || !date || !time) {
            showNotification('All fields are required.', 'error');
            return;
        }
        // Call the onUpdateEvent prop, which will handle the actual Firestore update
        await onUpdateEvent(eventData.id, subject, topic, date, time);
        onClose(); // Close the modal after updating
    };

    if (!isOpen) {
        return null; // Don't render anything if the modal is not open
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Study Event</h3>
                <div className="mb-3">
                    <label htmlFor="edit-modal-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        id="edit-modal-subject"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="e.g., Anatomy"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="edit-modal-topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                    <input
                        type="text"
                        id="edit-modal-topic"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        placeholder="e.g., Cardiovascular System"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="edit-modal-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        id="edit-modal-date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="edit-modal-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        id="edit-modal-time"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleUpdateClick}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                >
                    Update Event
                </button>
                <button
                    onClick={onClose}
                    className="w-full mt-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default EditTimetableModal;