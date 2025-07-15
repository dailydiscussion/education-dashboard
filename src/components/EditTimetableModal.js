// src/components/EditTimetableModal.js
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EditTimetableModal = ({
  isOpen,
  onClose,
  eventData,
  onUpdate,
  showNotification,
  onAddSimilar,
}) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [createFutureEvent, setCreateFutureEvent] = useState(false);
  const [futureDate, setFutureDate] = useState('');

  useEffect(() => {
    if (eventData) {
      setSubject(eventData.subject || '');
      setTopic(eventData.topic || '');
      setDate(eventData.date || '');
      setTime(eventData.time || '');
    }
  }, [eventData]);

  const handleUpdateClick = async () => {
    if (!eventData) {
      showNotification('No event selected for editing.', 'error');
      return;
    }

    if (!subject || !topic || !date || !time) {
      showNotification('All fields are required.', 'error');
      return;
    }

    if (createFutureEvent && !futureDate) {
      showNotification('Please select a future date.', 'error');
      return;
    }

    onClose(); // Optimistic UI

    setTimeout(async () => {
      try {
        if (createFutureEvent) {
          await onAddSimilar({
            ...eventData,
            subject,
            topic,
            date: futureDate,
            time,
            checked: false,
          });
          showNotification('New event created for future date.', 'success');
        } else {
          if (eventData.id) {
            await onUpdate(eventData.id, subject, topic, date, time);
          }
        }
      } catch (error) {
        console.error('Error updating event:', error);
        showNotification('Failed to update event. Please try again.', 'error');
      }
    }, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Study Event</h3>

            <div className="mb-3">
              <label
                htmlFor="edit-modal-subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
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
              <label
                htmlFor="edit-modal-topic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Topic
              </label>
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
              <label
                htmlFor="edit-modal-date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="edit-modal-date"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="edit-modal-time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time
              </label>
              <input
                type="time"
                id="edit-modal-time"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="mb-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Repeat Event</span>

                {/* Custom Horizontal Toggle Button */}
                <button
                  type="button"
                  onClick={() => setCreateFutureEvent(!createFutureEvent)}
                  className={`relative w-12 h-6 rounded-full focus:outline-none transition-colors duration-300 ${
                    createFutureEvent ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-300 ${
                      createFutureEvent ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {createFutureEvent && (
                <div className="mt-4">
                  <label
                    htmlFor="future-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Future Date
                  </label>
                  <input
                    type="date"
                    id="future-date"
                    min={date}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={futureDate}
                    onChange={(e) => setFutureDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateClick}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {createFutureEvent ? 'Create Future Event' : 'Update Event'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditTimetableModal;