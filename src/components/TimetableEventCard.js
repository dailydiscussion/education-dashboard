// src/components/TimetableEventCard.js
import React from 'react';
import { useHandlers } from '../context/HandlerContext';
import { HiPencil, HiTrash, HiDotsVertical, HiCheck, HiX, HiPlus } from 'react-icons/hi';
import { motion } from 'framer-motion';

// IMPORTANT: This component now accepts a single 'event' object as a prop.
// The list mapping and date navigation are handled in TimetablePage.js.
const TimetableEventCard = React.memo(({ event, nextEvent, isEditMode, onEdit, status }) => {
  const handlers = useHandlers();

  // Helper: get study day (4am–4am)
  function getStudyDay(dateObj) {
    const studyDay = new Date(dateObj);
    if (studyDay.getHours() < 4) {
      studyDay.setDate(studyDay.getDate() - 1);
    }
    studyDay.setHours(0, 0, 0, 0);
    return studyDay;
  }

  // Helper: convert 24-hour time to 12-hour AM/PM format
  function formatTimeToAMPM(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  /**
   * Determines the status of an event (Completed, Missed, or Pending).
   * @param {string} eventDate - The date of the event in 'YYYY-MM-DD' format.
   * @param {string} eventTime - The time of the event in 'HH:MM' format.
   * @param {boolean} isChecked - The checked status of the event.
   * @returns {{text: string, colorClass: string}} An object with status text and Tailwind CSS color class.
   */
  const getEventStatus = (event, nextEvent, now = new Date()) => {
    if (event.checked) {
      return { text: 'Completed', colorClass: 'text-green-600', dotClass: 'bg-green-500' };
    }
    const eventStart = new Date(`${event.date}T${event.time}`);
    const DEFAULT_DURATION_MINUTES = 180;
    const eventEnd = new Date(eventStart.getTime() + DEFAULT_DURATION_MINUTES * 60000);
    const nextStart = nextEvent ? new Date(`${nextEvent.date}T${nextEvent.time}`) : null;
    const studyDay = getStudyDay(eventStart);
    const studyDayEnd = new Date(studyDay);
    studyDayEnd.setDate(studyDay.getDate() + 1);
    studyDayEnd.setHours(4, 0, 0, 0); // 4am next day
    // If now is after study day end, missed
    if (now > studyDayEnd) {
      return { text: 'Missed', colorClass: 'text-red-600', dotClass: 'bg-red-500' };
    }
    // If now is before event start time
    if (now < eventStart) {
      return { text: 'Upcoming', colorClass: 'text-orange-600', dotClass: 'bg-orange-400' };
    }
    // If now is between event start and event end: Live
    if (now >= eventStart && now < eventEnd) {
      return { text: 'Live', colorClass: 'text-cyan-600', dotClass: 'bg-cyan-500' };
    }
    // If now is after event end and before next event's start (or no next event): Missed
    if (now >= eventEnd && (!nextStart || now < nextStart)) {
      return { text: 'Missed', colorClass: 'text-red-600', dotClass: 'bg-red-500' };
    }
    // If now is after next event's start: Missed
    if (nextStart && now >= nextStart) {
      return { text: 'Missed', colorClass: 'text-red-600', dotClass: 'bg-red-500' };
    }
    // Default fallback
    return { text: 'Upcoming', colorClass: 'text-orange-600', dotClass: 'bg-orange-400' };
  };

  // If status prop provided, use it for text/color, otherwise fallback to local calculation
  let statusObj;
  if (status) {
    switch (status) {
      case 'Completed':
        statusObj = { text: 'Completed', colorClass: 'text-green-600', dotClass: 'bg-green-500' };
        break;
      case 'Live':
        statusObj = { text: 'Live', colorClass: 'text-cyan-600', dotClass: 'bg-cyan-500' };
        break;
      case 'Missed':
        statusObj = { text: 'Missed', colorClass: 'text-red-600', dotClass: 'bg-red-500' };
        break;
      case 'Pending':
        statusObj = { text: 'Upcoming', colorClass: 'text-orange-600', dotClass: 'bg-orange-400' };
        break;
      default:
        statusObj = { text: status, colorClass: 'text-gray-600', dotClass: 'bg-gray-300' };
    }
  } else {
    statusObj = getEventStatus(event, nextEvent, new Date());
  }

  // Card background: green for completed, gray for normal, red for missed
  let cardClasses = `flex flex-col p-4 mb-3 rounded-xl`;
  if (event.checked || (status && status === 'Completed')) {
    cardClasses += ' bg-green-100'; // Completed: green background
  } else if ((status && status === 'Missed') || (!status && statusObj.text === 'Missed')) {
    cardClasses += ' bg-red-100'; // Missed: red background
  } else {
    cardClasses += ' bg-gray-50'; // Normal: subtle gray background
  }

  return (
    <div id={`timetable-event-${event.id}`} className={cardClasses}>
      {/* Main row: Checkmark | Details | Time */}
      <div className="flex items-center justify-between">
        {/* Left: Checkmark (always visible) */}
        <div className="flex items-center pr-3">
          <motion.button
            onClick={() => handlers.checkTimetableEntry(event.id)}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white"
            aria-label={event.checked ? 'Mark as incomplete' : 'Mark as complete'}
            whileTap={{ scale: 0.85 }}
            animate={{
              scale: event.checked ? 1.1 : 1,
              backgroundColor: event.checked ? '#22c55e' : '#ffffff',
              borderColor: event.checked ? '#22c55e' : '#d1d5db',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {event.checked && (
              <motion.svg
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </motion.button>
        </div>

        {/* Center: Subject, Topic, Status */}
        <div className="flex-1 min-w-0">
          <p className={`text-lg font-semibold text-gray-800 truncate ${event.checked ? 'line-through opacity-70' : ''}`}>
            {event.subject}
          </p>
          <h4 className="text-base text-gray-600 truncate">{event.topic}</h4>
          {!event.checked && statusObj && (
            <span className="flex items-center gap-1 mt-1">
              <span
                className={`inline-block w-3 h-3 rounded-full border border-white flex-shrink-0 mr-2 ${statusObj.dotClass}`}
              ></span>
              <span className={`text-sm font-semibold ${statusObj.colorClass}`}>
                {statusObj.text}
              </span>
            </span>
          )}
        </div>

        {/* Right: Time */}
        <div className="flex flex-col items-end">
          <p className="text-lg font-bold text-gray-400">{formatTimeToAMPM(event.time)}</p>
        </div>
      </div>

      {/* Bottom bar: Edit/Delete (only in edit mode) */}
      {isEditMode && (
        <div className="flex items-center gap-3 pt-3 border-white justify-end">
          <motion.button
            onClick={() => onEdit(event.id)}
            className={`flex items-center justify-center gap-1.5 w-20 py-1.5 rounded-lg transition-colors duration-200 text-blue-600 hover:bg-opacity-70 ${
              event.checked || (status && status === 'Completed')
                ? 'bg-green-200 hover:bg-green-300'
                : (status && status === 'Missed') || (!status && statusObj.text === 'Missed')
                ? 'bg-red-200 hover:bg-red-300'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Edit event"
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <HiPencil className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </motion.button>
          <motion.button
            onClick={() => handlers.deleteTimetableEntry(event.id)}
            className={`flex items-center justify-center gap-1.5 w-20 py-1.5 rounded-lg transition-colors duration-200 text-red-600 hover:bg-opacity-70 ${
              event.checked || (status && status === 'Completed')
                ? 'bg-green-200 hover:bg-green-300'
                : (status && status === 'Missed') || (!status && statusObj.text === 'Missed')
                ? 'bg-red-200 hover:bg-red-300'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Delete event"
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <HiTrash className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </motion.button>
        </div>
      )}
    </div>
  );
});

export default TimetableEventCard;