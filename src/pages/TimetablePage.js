// src/pages/TimetablePage.js
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimetableEventCard from '../components/TimetableEventCard';
import { useHandlers } from '../context/HandlerContext';
import EditTimetableModal from '../components/EditTimetableModal';
import AddModal from '../components/AddModal';
import { useAdmin } from '../context/AdminContext';
import { FaCheck, FaPen, FaPlus } from 'react-icons/fa';

/**
 * Helper function to get a 'YYYY-MM-DD' formatted string from a Date object,
 * based on the user's local time zone. This prevents UTC conversion issues.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Custom areEqual function for React.memo
function areEqual(prevProps, nextProps) {
  if (
    prevProps.timetableEntries.length !== nextProps.timetableEntries.length ||
    prevProps.selectedDisplayDate !== nextProps.selectedDisplayDate
  ) {
    return false;
  }
  // Compare each event by id and checked (add more fields if needed)
  for (let i = 0; i < prevProps.timetableEntries.length; i++) {
    const prevEvent = prevProps.timetableEntries[i];
    const nextEvent = nextProps.timetableEntries[i];
    if (
      prevEvent.id !== nextEvent.id ||
      prevEvent.checked !== nextEvent.checked ||
      prevEvent.subject !== nextEvent.subject ||
      prevEvent.topic !== nextEvent.topic ||
      prevEvent.date !== nextEvent.date ||
      prevEvent.time !== nextEvent.time
    ) {
      return false;
    }
  }
  return true;
}

// Memoize TimetablePage to prevent unnecessary re-renders
const TimetablePage = React.memo(({ timetableEntries, showNotification, userId: _userId }) => {
  const handlers = useHandlers();
  const [timetableEditMode, setTimetableEditMode] = useState(false);
  const { isAdmin } = useAdmin();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalFromState] = useState(false);
  const [currentEventToEdit, setCurrentEventToEdit] = useState(null);

  const [selectedDisplayDate, setSelectedDisplayDate] = useState(getLocalDateString(new Date()));
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to control modal state consistently
  const setIsEditModalOpen = useCallback((isOpen) => {
    setIsEditModalFromState(isOpen);
    if (!isOpen) {
      setCurrentEventToEdit(null);
    }
  }, []);

  // Memoized handlers for toggles and modals
  const handleToggleEditMode = useCallback(() => {
    setTimetableEditMode((prev) => !prev);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, [setIsEditModalOpen]);

  const handleSaveEvent = (data) => {
    handlers.addTimetableEntry(data.subject, data.topic, data.date, data.time);
  };

  const handleEditEvent = useCallback(
    (eventId) => {
      const eventToEdit = timetableEntries.find((event) => event.id === eventId);
      if (eventToEdit) {
        setCurrentEventToEdit(eventToEdit);
        setIsEditModalOpen(true);
      }
    },
    [timetableEntries, setIsEditModalOpen]
  );

  const handleDeleteTimetableEntry = useCallback(
    (id) => {
      handlers.deleteTimetableEntry(id);
    },
    [handlers]
  );

  const handleCheckTimetableEntry = useCallback(
    (id) => {
      handlers.checkTimetableEntry(id);
    },
    [handlers]
  );

  const handleUpdateEvent = useCallback(
    async (eventId, subject, topic, date, time) => {
      await handlers.updateTimetableEntry(eventId, subject, topic, date, time);
      setIsEditModalOpen(false);
    },
    [handlers, setIsEditModalOpen]
  );

  const handleAddSimilarEvent = useCallback(
    (eventData) => {
      handlers.addTimetableEntry(
        eventData.subject,
        eventData.topic,
        eventData.date,
        eventData.time
      );
    },
    [handlers]
  );

  const memoizedSelectedDateObject = useMemo(() => {
    const date = new Date(selectedDisplayDate);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  }, [selectedDisplayDate]);

  // Chronologically sort all entries by date, then by time
  const sortedTimetableEntries = useMemo(() => {
    return [...timetableEntries].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [timetableEntries]);

  // Filtered and sorted entries based on search
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedTimetableEntries.filter((entry) => getLocalDateString(new Date(entry.date)) === selectedDisplayDate);
    }
    const q = searchQuery.toLowerCase();
    return sortedTimetableEntries.filter(
      (entry) =>
        entry.subject.toLowerCase().includes(q) ||
        entry.topic.toLowerCase().includes(q) ||
        entry.time.toLowerCase().includes(q)
    );
  }, [sortedTimetableEntries, searchQuery, selectedDisplayDate]);

  // Utility: calculate event end time
  const getEventEndTime = (event) => {
    if (event.endTime) {
      return new Date(`${event.date}T${event.endTime}`);
    }
    const [hour] = event.time.split(':').map(Number);
    return new Date(new Date(`${event.date}T${event.time}`).setHours(hour + 1));
  };

  // Calculate status for each event
  const filteredEntriesWithStatus = useMemo(() => {
    const now = new Date();
    return filteredEntries.map((event) => {
      if (event.checked) return { ...event, status: 'Completed' };
      
      const idxInFull = sortedTimetableEntries.findIndex((e) => e.id === event.id);
      const nextEvent = idxInFull !== -1 ? sortedTimetableEntries[idxInFull + 1] : undefined;
      const eventStart = new Date(`${event.date}T${event.time}`);
      const eventEnd = getEventEndTime(event);
      const nextStart = nextEvent ? new Date(`${nextEvent.date}T${nextEvent.time}`) : null;
      
      if (now >= eventStart && (!nextStart || now < nextStart)) {
        return { ...event, status: 'Live' };
      } else if (now < eventStart) {
        return { ...event, status: 'Pending' };
      } else if (now > eventEnd && nextEvent && now > nextStart && !event.checked) {
        return { ...event, status: 'Missed' };
      }
      return { ...event, status: 'Pending' };
    });
  }, [filteredEntries, sortedTimetableEntries]);

  // Group filtered entries by date for search results
  const groupedByDate = useMemo(() => {
    if (!searchQuery.trim()) return {};
    return filteredEntriesWithStatus.reduce((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    }, {});
  }, [filteredEntriesWithStatus, searchQuery]);

  const addModalFields = useMemo(
    () => [
      { name: 'subject', label: 'Subject', placeholder: 'e.g., Anatomy', required: true },
      { name: 'topic', label: 'Topic', placeholder: 'e.g., Cardiovascular System', required: true },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: true,
        defaultValue: selectedDisplayDate,
      },
      { name: 'time', label: 'Time', type: 'time', required: true, defaultValue: '09:00' },
    ],
    [selectedDisplayDate]
  );

  const handleSelectCalendarDate = useCallback((date) => {
    setSelectedDisplayDate(getLocalDateString(date));
  }, []);

  const handlePrevDay = useCallback(() => {
    const newDate = new Date(memoizedSelectedDateObject);
    newDate.setDate(newDate.getDate() - 1);
    handleSelectCalendarDate(newDate);
  }, [memoizedSelectedDateObject, handleSelectCalendarDate]);

  const handleNextDay = useCallback(() => {
    const newDate = new Date(memoizedSelectedDateObject);
    newDate.setDate(newDate.getDate() + 1);
    handleSelectCalendarDate(newDate);
  }, [memoizedSelectedDateObject, handleSelectCalendarDate]);

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-24 h-24 mb-4 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">Your timetable is empty</h3>
      <p className="mt-2 text-sm text-gray-500">Start by adding your first event to see it here.</p>
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Event
      </button>
    </div>
  );

  return (
    <>
      <div id="page-timetable" className="page px-6 py-8 pb-40">
        <header className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
        </header>
        <p className="text-gray-500 mb-6">Upcoming Study Schedule</p>

        {/* Search Bar */}
        <div className="mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by subject, topic, or time..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* Search results header */}
        {searchQuery.trim() && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
          </div>
        )}

        {/* Only show Add New button and date picker if not searching */}
        {!searchQuery.trim() && (
          <>
            <div className="flex items-center justify-between px-0 py-6 text-gray-700 font-semibold text-lg">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-full hover:bg-gray-100 active:scale-95 active:bg-gray-200 transition-all duration-200 ease-in-out"
                aria-label="Previous day"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span className="flex-grow text-center text-lg sm:text-base">
                {memoizedSelectedDateObject.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <button
                onClick={handleNextDay}
                className="p-2 rounded-full hover:bg-gray-100 active:scale-95 active:bg-gray-200 transition-all duration-200 ease-in-out"
                aria-label="Next day"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Edit Button */}
        {isAdmin && (
          <button
            onClick={handleToggleEditMode}
            className={`
                fixed bottom-[9.5rem] right-6 z-50
                bg-blue-50 text-blue-700 font-semibold 
                py-3 px-5 rounded-xl shadow-md 
                flex items-center text-sm
                transition-all duration-200 ease-in-out
                hover:bg-blue-100 hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.98] active:shadow-sm
              `}
            title={timetableEditMode ? 'Done editing timetable' : 'Edit timetable'}
          >
            {timetableEditMode ? (
              <>
                <FaCheck className="mr-2" /> Done
              </>
            ) : (
              <>
                <FaPen className="mr-2" />
                Edit
              </>
            )}
          </button>
        )}

        {/* Add Event Button */}
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`
                fixed bottom-20 right-6 z-50
                bg-blue-600 text-white font-semibold 
                py-4 px-6 rounded-xl shadow-lg 
                flex items-center
                transition-all duration-200 ease-in-out
                hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5
                active:scale-[0.98] active:shadow-sm
              `}
            title="Add a new study event"
          >
            <FaPlus className="mr-2" />
            <span>Add Event</span>
          </button>
        )}

        <div id="timetable-events-list" className="space-y-4 bg-white rounded-lg min-h-[100px] pb-24">
          {filteredEntriesWithStatus.length > 0 ? (
            <div className="space-y-4">
              {/* Group by date and show bold date headers when searching */}
              {searchQuery.trim()
                ? Object.keys(groupedByDate)
                    .sort()
                    .map((date) => (
                      <div key={date}>
                        <div className="font-semibold text-base text-blue-700 mb-2.5 mt-5 pl-1 tracking-normal pb-1">
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="space-y-4">
                          {groupedByDate[date].map((event, i, arr) => {
                            const statusEvent =
                              filteredEntriesWithStatus.find((e) => e.id === event.id) || event;
                            return (
                              <TimetableEventCard
                                key={event.id}
                                event={event}
                                status={statusEvent.status}
                                nextEvent={arr[i + 1]}
                                isEditMode={timetableEditMode}
                                onDelete={handlers.deleteTimetableEntry}
                                onCheck={handlers.checkTimetableEntry}
                                onEdit={handleEditEvent}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))
                : filteredEntriesWithStatus.map((event, idx) => (
                    <TimetableEventCard
                      key={event.id}
                      event={event}
                      status={event.status}
                      nextEvent={filteredEntriesWithStatus[idx + 1]}
                      isEditMode={timetableEditMode}
                      onDelete={handleDeleteTimetableEntry}
                      onCheck={handleCheckTimetableEntry}
                      onEdit={handleEditEvent}
                    />
                  ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No events match your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveEvent}
        title="Add New Study Event"
        fields={addModalFields}
      />

      <EditTimetableModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        eventData={currentEventToEdit}
        onUpdate={handleUpdateEvent}
        onAddSimilar={handleAddSimilarEvent}
        showNotification={showNotification}
      />
    </>
  );
}, areEqual);

export default TimetablePage;