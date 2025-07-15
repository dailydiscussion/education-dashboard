// src/components/UpcomingEvents.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaEdit, FaPlay } from 'react-icons/fa';

const UpcomingEvents = ({ timetableEntries, onEditEvent }) => {
  // Filter and sort upcoming events
  const upcomingEvents = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return (timetableEntries || [])
      .filter(entry => {
        const eventDate = new Date(entry.date);
        return eventDate >= today && !entry.checked;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      })
      .slice(0, 5);
  }, [timetableEntries]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventStart = new Date(`${event.date}T${event.time}`);
    const eventEnd = new Date(eventStart.getTime() + 3 * 60 * 60 * 1000); // 3 hours later
    
    if (now >= eventStart && now < eventEnd) {
      return { status: 'live', color: 'text-green-600 bg-green-100' };
    } else if (now < eventStart) {
      const timeDiff = eventStart - now;
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      if (hours < 2) {
        return { status: 'soon', color: 'text-orange-600 bg-orange-100' };
      }
      return { status: 'upcoming', color: 'text-blue-600 bg-blue-100' };
    }
    return { status: 'pending', color: 'text-gray-600 bg-gray-100' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <FaCalendarAlt className="w-5 h-5 text-blue-500" />
      </div>
      
      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => {
            const eventStatus = getEventStatus(event);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-shrink-0">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                    {eventStatus.status === 'live' ? 'LIVE' : 
                     eventStatus.status === 'soon' ? 'SOON' : 
                     eventStatus.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.subject}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {event.topic}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <FaClock className="w-3 h-3 mr-1" />
                    {formatDate(event.date)} at {formatTime(event.time)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {eventStatus.status === 'live' && (
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <FaPlay className="w-3 h-3" />
                    </button>
                  )}
                  <button 
                    onClick={() => onEditEvent && onEditEvent(event.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;