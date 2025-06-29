// src/App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db, app_id, auth } from './firebaseConfig';
import {
    addSubject, addTest, deleteSubject, deleteTest, handleToggleTestCompletion,
    addFocusItem, removeFocusItem, reorderFocusItems, addTimetableEntry as addTimetableEntryUtil,
    deleteTimetableEntry, handleLogin as handleLoginUtil, handleLogout as handleLogoutUtil,
    handleResetLocalData, showNotification as showNotificationUtil
} from './utils/appFunctions';

// Import Page Components
import DashboardPage from './pages/DashboardPage';
import TimetablePage from './pages/TimetablePage';
import TestsCompletedPage from './pages/TestsCompletedPage';
import EditFocusPage from './pages/EditFocusPage';
import ManageContentPage from './pages/ManageContentPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './components/LoginPage';

// Import Shared UI Components
import ErrorBoundary from './components/ErrorBoundary';
import NotificationMessage from './components/NotificationMessage';
import LoadingSpinner from './components/LoadingSpinner';
import BottomNavigation from './components/BottomNavigation';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoadingApp, setIsLoadingApp] = useState(true);
    const [isLoadingTodayFocus, setIsLoadingTodayFocus] = useState(true);
    const [testData, setTestData] = useState({});
    const [timetableEntries, setTimetableEntries] = useState([]);
    const [currentSelectedSubject, setCurrentSelectedSubject] = useState('');
    const [currentTimetableSubject, setCurrentTimetableSubject] = useState('');
    const [todayFocusItems, setTodayFocusItems] = useState([]);

    // Refs to hold the latest values of currentSelectedSubject and currentTimetableSubject
    const currentSelectedSubjectRef = useRef('');
    const currentTimetableSubjectRef = useRef('');

    // Update refs whenever state changes
    useEffect(() => {
        currentSelectedSubjectRef.current = currentSelectedSubject;
    }, [currentSelectedSubject]);

    useEffect(() => {
        currentTimetableSubjectRef.current = currentTimetableSubject;
    }, [currentTimetableSubject]);

    // Initialize Auth State and check localStorage
    useEffect(() => {
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        const storedUserEmail = localStorage.getItem('userEmail');

        if (storedLoggedIn === 'true' && storedUserId) {
            setUserId(storedUserId);
            setUserName(storedUserName || 'Guest');
            setUserEmail(storedUserEmail || '');
            setIsLoggedIn(true);
            setCurrentPage('dashboard');
        } else {
            setIsLoggedIn(false);
            setUserId(null);
            setUserName(null);
            setUserEmail(null);
            setCurrentPage('login');
            setIsLoadingApp(false);
        }
        setIsAuthReady(true);
    }, []);

    // Request Notification Permission
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    setNotificationPermission(permission);
                });
            }
        }
    }, []);

    // Notification message auto-hide
    useEffect(() => {
        if (notification.visible) {
            const timer = setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification.visible]);

    // Pass setNotification to the utility function for common use
    const showNotification = useCallback((message, type = 'info') => {
        showNotificationUtil(setNotification)(message, type);
    }, []);

    // Firebase Data Listeners
    useEffect(() => {
        let unsubscribeFunctions = [];
        let timeoutId;

        if (isAuthReady && userId && db) {
            setIsLoadingApp(true);
            setIsLoadingTodayFocus(true);

            timeoutId = setTimeout(() => {
                if (isLoadingApp) {
                    setIsLoadingApp(false);
                    showNotification("Some data streams might be delayed or failed to load. Please check your your connection.", "error");
                }
            }, 15000);

            const userSubjectsCollectionRef = collection(db, "artifacts", app_id, "users", userId, "subjects");
            const userTimetableCollectionRef = collection(db, "artifacts", app_id, "users", userId, "timetable");
            const userTodayFocusCollectionRef = collection(db, "artifacts", app_id, "users", userId, "todayFocus");

            let loadedStreamsCount = 0;
            const totalStreamsToLoad = 3;

            const checkIfAllStreamsLoaded = () => {
                loadedStreamsCount++;
                if (loadedStreamsCount >= totalStreamsToLoad) {
                    setIsLoadingApp(false);
                    if (timeoutId) clearTimeout(timeoutId);
                }
            };

            const handleError = (error, streamName) => {
                console.error(`Error listening to ${streamName} data:`, error);
                showNotification(`Failed to load ${streamName} data.`, 'error');
                checkIfAllStreamsLoaded();
            };

            const unsubscribeSubjects = onSnapshot(userSubjectsCollectionRef, (snapshot) => {
                const loadedTestData = {};
                snapshot.forEach((doc) => {
                    loadedTestData[doc.id] = doc.data().tests || [];
                });
                setTestData(loadedTestData);

                const availableSubjects = Object.keys(loadedTestData);
                const latestSelectedSubject = currentSelectedSubjectRef.current;
                const latestTimetableSubject = currentTimetableSubjectRef.current;
                const persistedTimetableSubject = localStorage.getItem('currentTimetableSubject');

                if (persistedTimetableSubject && availableSubjects.includes(persistedTimetableSubject)) {
                    setCurrentTimetableSubject(persistedTimetableSubject);
                    setCurrentSelectedSubject(persistedTimetableSubject);
                } else if (availableSubjects.length > 0) {
                    if (!latestSelectedSubject || !availableSubjects.includes(latestSelectedSubject)) {
                        setCurrentSelectedSubject(availableSubjects[0]);
                    }
                    if (!latestTimetableSubject || !availableSubjects.includes(latestTimetableSubject)) {
                        setCurrentTimetableSubject(availableSubjects[0]);
                        localStorage.setItem('currentTimetableSubject', availableSubjects[0]);
                    }
                } else {
                    if (latestSelectedSubject !== '') {
                        setCurrentSelectedSubject('');
                        showNotification("No subjects found. Add new subjects to get started!", 'info');
                    }
                    if (latestTimetableSubject !== '') {
                        setCurrentTimetableSubject('');
                        localStorage.removeItem('currentTimetableSubject');
                    }
                }
                checkIfAllStreamsLoaded();
            }, (error) => handleError(error, "subjects"));
            unsubscribeFunctions.push(unsubscribeSubjects);

            const unsubscribeTimetable = onSnapshot(userTimetableCollectionRef, (snapshot) => {
                const loadedTimetableEntries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTimetableEntries(loadedTimetableEntries);
                checkIfAllStreamsLoaded();
            }, (error) => handleError(error, "timetable"));
            unsubscribeFunctions.push(unsubscribeTimetable);

            const unsubscribeTodayFocus = onSnapshot(userTodayFocusCollectionRef, (snapshot) => {
                const loadedFocusItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => (a.order || 0) - (b.order || 0));
                setTodayFocusItems(loadedFocusItems);
                setIsLoadingTodayFocus(false);
                checkIfAllStreamsLoaded();
            }, (error) => handleError(error, "Today's Focus"));
            unsubscribeFunctions.push(unsubscribeTodayFocus);

            return () => {
                unsubscribeFunctions.forEach(unsub => unsub());
                if (timeoutId) clearTimeout(timeoutId);
            };
        } else if (isAuthReady && !userId) {
            setIsLoadingApp(false);
            setIsLoadingTodayFocus(false);
        }
    }, [isAuthReady, userId, showNotification]);

    // Wrapped utility functions with useCallback for prop stability
    const handleAddSubject = useCallback((subjectName) => {
        addSubject(userId, showNotification, testData, subjectName);
    }, [userId, showNotification, testData]);

    const handleAddTest = useCallback((subjectName, title, mcqs, date, link = '') => {
        addTest(userId, showNotification, testData, subjectName, title, mcqs, date, link);
    }, [userId, showNotification, testData]);

    const handleDeleteSubject = useCallback((subjectName) => {
        deleteSubject(userId, showNotification, testData, setTodayFocusItems, setTimetableEntries, setCurrentSelectedSubject, setCurrentTimetableSubject, subjectName);
    }, [userId, showNotification, testData]);

    const handleDeleteTest = useCallback((subjectName, testTitle) => {
        deleteTest(userId, showNotification, testData, setTodayFocusItems, subjectName, testTitle);
    }, [userId, showNotification, testData]);

    const handleToggleCompletion = useCallback((subjectName, testTitle, completedStatus) => {
        handleToggleTestCompletion(userId, showNotification, subjectName, testTitle, completedStatus);
    }, [userId, showNotification]);

    const handleAddFocusItem = useCallback((testToAdd, subjectName) => {
        addFocusItem(userId, showNotification, todayFocusItems, testToAdd, subjectName);
    }, [userId, showNotification, todayFocusItems]);

    const handleRemoveFocusItem = useCallback((itemId) => {
        removeFocusItem(userId, showNotification, itemId);
    }, [userId, showNotification]);

    const handleReorderFocusItems = useCallback((newOrder) => {
        reorderFocusItems(userId, showNotification, newOrder);
    }, [userId, showNotification]);

    const handleAddTimetableEntry = useCallback((subject, topic, date, time) => {
        addTimetableEntryUtil(userId, showNotification, notificationPermission, subject, topic, date, time);
    }, [userId, showNotification, notificationPermission]);

    const handleDeleteTimetableEntry = useCallback((idToDelete) => {
        deleteTimetableEntry(userId, showNotification, idToDelete);
    }, [userId, showNotification]);

    const navigateTo = useCallback((pageName, options = {}) => {
        setCurrentPage(pageName);
        if (pageName === 'trophy' && options.fromTimetable && options.subject) {
            setCurrentSelectedSubject(options.subject);
        }
        window.scrollTo(0, 0);
    }, []);

    const handleUserLogin = useCallback((enteredUsername, enteredPassword) => {
        handleLoginUtil(showNotification, setIsLoggedIn, setUserId, setUserName, setUserEmail, enteredUsername, enteredPassword);
    }, [showNotification]);

    const handleUserLogout = useCallback(async () => {
        await handleLogoutUtil(showNotification, setIsLoggedIn, setUserId, setUserName, setUserEmail);
        setCurrentPage('login'); // Ensure navigation after logout
    }, [showNotification]);

    const handleUserResetLocalData = useCallback(() => {
        handleResetLocalData();
    }, []);

    const renderPage = () => {
        if (!isAuthReady || isLoadingApp) {
            return <LoadingSpinner />;
        }

        if (!isLoggedIn) {
            return <LoginPage onLogin={handleUserLogin} />;
        }

        if (currentPage === 'login' && isLoggedIn) {
            setCurrentPage('dashboard');
            return null;
        }

        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage
                    testData={testData} todayFocusItems={todayFocusItems} onEditFocus={() => navigateTo('edit-focus')}
                    removeFocusItem={handleRemoveFocusItem} onNavigate={navigateTo} userName={userName}
                    userEmail={userEmail} currentUserId={userId} handleToggleTestCompletion={handleToggleCompletion}
                    isLoadingTodayFocus={isLoadingTodayFocus}
                />;
            case 'timetable':
                return <TimetablePage
                    timetableEntries={timetableEntries} testData={testData} currentTimetableSubject={currentTimetableSubject}
                    setCurrentTimetableSubject={setCurrentTimetableSubject} setCurrentSelectedSubject={setCurrentSelectedSubject}
                    addTimetableEntry={handleAddTimetableEntry} deleteTimetableEntry={handleDeleteTimetableEntry}
                    navigateToTrophyPage={(subject) => navigateTo('trophy', { fromTimetable: true, subject })}
                    showNotification={showNotification}
                    userId={userId}
                />;
            case 'trophy':
                return <TestsCompletedPage
                    testData={testData} currentSelectedSubject={currentSelectedSubject} setCurrentSelectedSubject={setCurrentSelectedSubject}
                    addTest={handleAddTest} deleteTest={handleDeleteTest} handleToggleTestCompletion={handleToggleCompletion}
                />;
            case 'edit-focus':
                return <EditFocusPage
                    testData={testData} todayFocusItems={todayFocusItems} addFocusItem={handleAddFocusItem}
                    removeFocusItem={handleRemoveFocusItem} reorderFocusItems={handleReorderFocusItems}
                    onBackToDashboard={() => navigateTo('dashboard')} handleToggleTestCompletion={handleToggleCompletion}
                    isLoadingTodayFocus={isLoadingTodayFocus}
                />;
            case 'manage-tests':
                return <ManageContentPage
                    testData={testData} addSubject={handleAddSubject} addTest={handleAddTest}
                    deleteSubject={handleDeleteSubject} deleteTest={handleDeleteTest} onBackToProfile={() => navigateTo('profile')}
                />;
            case 'profile':
                return <ProfilePage
                    onManageContent={() => navigateTo('manage-tests')} onLogout={handleUserLogout}
                    currentUserId={userId} userName={userName} userEmail={userEmail}
                    onResetLocalData={handleUserResetLocalData}
                />;
            default:
                console.warn("renderPage: Unknown currentPage. Defaulting to Dashboard.");
                return <DashboardPage
                    testData={testData} todayFocusItems={todayFocusItems} onEditFocus={() => navigateTo('edit-focus')}
                    removeFocusItem={handleRemoveFocusItem} onNavigate={navigateTo} userName={userName}
                    userEmail={userEmail} currentUserId={userId} handleToggleTestCompletion={handleToggleCompletion}
                    isLoadingTodayFocus={isLoadingTodayFocus}
                />;
        }
    };

    return (
        <>
            <main id="main-content" className="pb-24">
                <ErrorBoundary>{renderPage()}</ErrorBoundary>
            </main>
            {isLoggedIn && <BottomNavigation currentPage={currentPage} onNavigate={navigateTo} />}
            {notification.visible && (
                <NotificationMessage
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
                />
            )}
        </>
    );
};

export default App;