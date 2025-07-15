// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import TimetablePage from './pages/TimetablePage';
import { HandlerProvider } from './context/HandlerContext';
import { AdminProvider } from './context/AdminContext';
import './App.css';

const App = () => {
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [userId] = useState('user123'); // Mock user ID
  const [notifications, setNotifications] = useState([]);

  // Sample data for demo
  useEffect(() => {
    const sampleEntries = [
      {
        id: 1,
        subject: 'Mathematics',
        topic: 'Calculus',
        date: '2024-01-15',
        time: '09:00',
        checked: false,
      },
      {
        id: 2,
        subject: 'Physics',
        topic: 'Quantum Mechanics',
        date: '2024-01-15',
        time: '11:00',
        checked: false,
      },
      {
        id: 3,
        subject: 'Chemistry',
        topic: 'Organic Chemistry',
        date: '2024-01-16',
        time: '10:00',
        checked: true,
      },
    ];
    setTimetableEntries(sampleEntries);
  }, []);

  // Notification system
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Timetable operations
  const addTimetableEntry = useCallback((subject, topic, date, time) => {
    const newEntry = {
      id: Date.now(),
      subject,
      topic,
      date,
      time,
      checked: false,
    };
    setTimetableEntries((prev) => [...prev, newEntry]);
    showNotification('Event added successfully!', 'success');
  }, [showNotification]);

  const updateTimetableEntry = useCallback(async (id, subject, topic, date, time) => {
    setTimetableEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, subject, topic, date, time }
          : entry
      )
    );
    showNotification('Event updated successfully!', 'success');
  }, [showNotification]);

  const deleteTimetableEntry = useCallback((id) => {
    setTimetableEntries((prev) => prev.filter((entry) => entry.id !== id));
    showNotification('Event deleted successfully!', 'success');
  }, [showNotification]);

  const checkTimetableEntry = useCallback((id) => {
    setTimetableEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, checked: !entry.checked } : entry
      )
    );
  }, []);

  // Handler object for context
  const handlers = {
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    checkTimetableEntry,
    showNotification,
  };

  return (
    <AdminProvider>
      <HandlerProvider handlers={handlers}>
        <div className="App">
          {/* Notification display */}
          {notifications.length > 0 && (
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 rounded-lg shadow-lg text-white ${
                    notification.type === 'success'
                      ? 'bg-green-500'
                      : notification.type === 'error'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {notification.message}
                </div>
              ))}
            </div>
          )}
          
          <TimetablePage
            timetableEntries={timetableEntries}
            showNotification={showNotification}
            userId={userId}
          />
        </div>
      </HandlerProvider>
    </AdminProvider>
  );
};

export default App;