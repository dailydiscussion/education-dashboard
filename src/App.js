// src/App.js
import React, { useState, useCallback, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import TimetablePage from './pages/TimetablePage';
import TestCompleted from './pages/TestCompleted';
import ManageContent from './pages/ManageContent';
import { HandlerProvider } from './context/HandlerContext';
import { AdminProvider } from './context/AdminContext';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [timetableEntries, setTimetableEntries] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [userId] = useState('user123');
  const [notifications, setNotifications] = useState([]);

  // Sample data for demo
  useEffect(() => {
    // Sample timetable entries
    const sampleTimetableEntries = [
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
      {
        id: 4,
        subject: 'Biology',
        topic: 'Cell Structure',
        date: '2024-01-17',
        time: '14:00',
        checked: false,
      },
    ];

    // Sample test results
    const sampleTestResults = [
      {
        id: 1,
        title: 'Midterm Exam',
        subject: 'Mathematics',
        topic: 'Algebra',
        score: 85,
        questionsTotal: 20,
        questionsCorrect: 17,
        duration: 60,
        type: 'Multiple Choice',
        completedAt: '2024-01-10T10:00:00Z',
        completed: true
      },
      {
        id: 2,
        title: 'Quiz 1',
        subject: 'Physics',
        topic: 'Mechanics',
        score: 92,
        questionsTotal: 10,
        questionsCorrect: 9,
        duration: 30,
        type: 'Multiple Choice',
        completedAt: '2024-01-08T14:30:00Z',
        completed: true
      },
      {
        id: 3,
        title: 'Final Exam',
        subject: 'Chemistry',
        topic: 'Organic Reactions',
        score: 78,
        questionsTotal: 25,
        questionsCorrect: 19,
        duration: 90,
        type: 'Mixed',
        completedAt: '2024-01-12T09:00:00Z',
        completed: true
      },
      {
        id: 4,
        title: 'Practice Test',
        subject: 'Biology',
        topic: 'Cell Biology',
        score: 45,
        questionsTotal: 15,
        questionsCorrect: 7,
        duration: 45,
        type: 'True/False',
        completedAt: '2024-01-14T16:00:00Z',
        completed: true
      }
    ];

    // Sample content items
    const sampleContentItems = [
      {
        id: 1,
        title: 'Introduction to Calculus',
        description: 'Basic concepts of differential and integral calculus',
        subject: 'Mathematics',
        type: 'documents',
        tags: ['calculus', 'derivatives', 'integrals'],
        studied: true,
        createdAt: '2024-01-05T09:00:00Z'
      },
      {
        id: 2,
        title: 'Quantum Physics Lecture',
        description: 'Video lecture on quantum mechanics principles',
        subject: 'Physics',
        type: 'videos',
        tags: ['quantum', 'physics', 'mechanics'],
        studied: false,
        createdAt: '2024-01-06T14:00:00Z'
      },
      {
        id: 3,
        title: 'Organic Chemistry Notes',
        description: 'Comprehensive notes on organic chemistry reactions',
        subject: 'Chemistry',
        type: 'notes',
        tags: ['organic', 'chemistry', 'reactions'],
        studied: true,
        createdAt: '2024-01-07T11:00:00Z'
      },
      {
        id: 4,
        title: 'Cell Biology Diagrams',
        description: 'Visual diagrams of cell structures and organelles',
        subject: 'Biology',
        type: 'images',
        tags: ['cell', 'biology', 'organelles'],
        studied: false,
        createdAt: '2024-01-08T13:00:00Z'
      }
    ];

    setTimetableEntries(sampleTimetableEntries);
    setTestResults(sampleTestResults);
    setContentItems(sampleContentItems);
  }, []);

  // Notification system
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications((prev) => [...prev, notification]);
    
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

  // Test operations
  const addTestResult = useCallback((testData) => {
    setTestResults((prev) => [...prev, testData]);
    showNotification('Test result added successfully!', 'success');
  }, [showNotification]);

  const retakeTest = useCallback((testId) => {
    showNotification('Test retake initiated!', 'info');
  }, [showNotification]);

  // Content operations
  const addContent = useCallback((contentData) => {
    const newContent = {
      ...contentData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      studied: false
    };
    setContentItems((prev) => [...prev, newContent]);
    showNotification('Content added successfully!', 'success');
  }, [showNotification]);

  const updateContent = useCallback((id, contentData) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...contentData } : item
      )
    );
    showNotification('Content updated successfully!', 'success');
  }, [showNotification]);

  const deleteContent = useCallback((id) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    showNotification('Content deleted successfully!', 'success');
  }, [showNotification]);

  // Handler object for context
  const handlers = {
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    checkTimetableEntry,
    showNotification,
    editTimetableEntry: updateTimetableEntry,
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            timetableEntries={timetableEntries}
            testResults={testResults}
            contentItems={contentItems}
          />
        );
      case 'timetable':
        return (
          <TimetablePage
            timetableEntries={timetableEntries}
            showNotification={showNotification}
            userId={userId}
          />
        );
      case 'tests':
        return (
          <TestCompleted
            testResults={testResults}
            onAddTest={addTestResult}
            onRetakeTest={retakeTest}
          />
        );
      case 'content':
        return (
          <ManageContent
            contentItems={contentItems}
            onAddContent={addContent}
            onUpdateContent={updateContent}
            onDeleteContent={deleteContent}
          />
        );
      default:
        return (
          <Dashboard
            timetableEntries={timetableEntries}
            testResults={testResults}
            contentItems={contentItems}
          />
        );
    }
  };

  return (
    <AdminProvider>
      <HandlerProvider handlers={handlers}>
        <div className="App flex h-screen bg-gray-50">
          {/* Navigation */}
          <Navigation
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isAdmin={true}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 overflow-y-auto">
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
            
            {renderCurrentPage()}
          </div>
        </div>
      </HandlerProvider>
    </AdminProvider>
  );
};

export default App;