// src/pages/TimetablePage.js
import React, { useState, useCallback, useMemo, useEffect } from 'react';
// Removed AuthContext import as userId is provided via props
import CircularProgressBar from '../components/CircularProgressBar';
import TimetableEventCard from '../components/TimetableEventCard';
// Only import showNotification if it's not strictly passed as a prop from App.js
// For addTimetableEntry and deleteTimetableEntry, we'll assume they are passed as props.
// If they are NOT passed as props from App.js, you would need to re-add their imports
// from '../utils/appFunctions'; and adjust the calls accordingly.

import {
    db, app_id, // Firebase initialized instances and app_id
    doc, setDoc, getDoc, collection, query, where, onSnapshot, deleteDoc // Firestore functions needed here
} from '../firebaseConfig'; // Import ALL needed Firestore functions directly

const TimetablePage = React.memo(({ timetableEntries, testData, currentTimetableSubject, setCurrentTimetableSubject, setCurrentSelectedSubject, addTimetableEntry, deleteTimetableEntry, navigateToTrophyPage, showNotification, userId }) => {
    // userId is directly available from props, no need for useContext here.

    const [timetableEditMode, setTimetableEditMode] = useState(false);
    const [showAddTimetableForm, setShowAddTimetableForm] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [newTopic, setNewTopic] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [selectedDisplayDate, setSelectedDisplayDate] = useState(new Date());

    // Original handleAddEvent logic, calls addTimetableEntry from props
    const handleAddEvent = useCallback(() => {
        // addTimetableEntry is a prop passed from App.js
        if (addTimetableEntry) {
            addTimetableEntry(newSubject, newTopic, newDate, newTime);
        } else {
            console.error("addTimetableEntry function not provided via props. Please check App.js.");
            // Fallback to a notification if the prop is missing
            if (showNotification) {
                showNotification("Failed to add event: Function missing.", "error");
            }
        }
        setNewSubject('');
        setNewTopic('');
        setNewDate('');
        setNewTime('');
        setShowAddTimetableForm(false);
    }, [addTimetableEntry, newSubject, newTopic, newDate, newTime, showNotification]);


    const handleCheckEvent = useCallback(async (eventId) => {
        if (!userId) { showNotification('Authentication not ready. Please log in.', 'error'); return; }
        try {
            // Correctly use imported Firestore functions: doc, db, app_id, getDoc, setDoc
            const timetableEntryDocRef = doc(db, "artifacts", app_id, "users", userId, "timetable", eventId);
            const entryDoc = await getDoc(timetableEntryDocRef);

            if (entryDoc.exists()) {
                const currentCheckedStatus = entryDoc.data().checked || false;
                await setDoc(timetableEntryDocRef, { checked: !currentCheckedStatus }, { merge: true });
                showNotification(`Timetable event marked as ${!currentCheckedStatus ? 'completed' : 'incomplete'}.`, 'success');
            } else {
                showNotification('Timetable entry not found.', 'error');
            }
        } catch (error) {
            console.error("Error toggling timetable event completion:", error);
            showNotification("Failed to update timetable event status.", 'error');
        }
    }, [userId, showNotification]);

    const subjects = useMemo(() => Object.keys(testData || {}), [testData]); // Derive subjects from testData prop

    const calculateProgress = useCallback(() => {
        const subjectTests = testData[currentTimetableSubject] || [];
        const totalTests = subjectTests.length;
        const completedTests = subjectTests.filter(test => test.completed).length;
        return totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
    }, [currentTimetableSubject, testData]);

    const progressPercentage = calculateProgress();
    const completedCount = testData[currentTimetableSubject] ? testData[currentTimetableSubject].filter(test => test.completed).length : 0;
    const totalCount = testData[currentTimetableSubject] ? testData[currentTimetableSubject].length : 0;

    const eventsForSelectedDate = useMemo(() => {
        const selectedDateString = selectedDisplayDate.toLocaleDateString('en-CA');
        return timetableEntries.filter(entry => entry.date === selectedDateString);
    }, [timetableEntries, selectedDisplayDate]);


    const handlePrevDay = useCallback(() => {
        const newDate = new Date(selectedDisplayDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDisplayDate(newDate);
    }, [selectedDisplayDate]);

    const handleNextDay = useCallback(() => {
        const newDate = new Date(selectedDisplayDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDisplayDate(newDate);
    }, [selectedDisplayDate]);

    return (
        <div id="page-timetable" className="page px-6 py-8">
            <header className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
                <button
                    onClick={() => setTimetableEditMode(!timetableEditMode)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    aria-label={timetableEditMode ? 'Done editing timetable' : 'Edit timetable'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    {timetableEditMode ? 'Done' : 'Edit'}
                </button>
            </header>
            <p className="text-gray-500 mb-6">Upcoming Study Schedule</p>

            <div className="mb-6">
                <label htmlFor="select-timetable-subject" className="block text-sm font-medium text-gray-700 mb-1">Track Progress for Subject:</label>
                <select
                    id="select-timetable-subject"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentTimetableSubject}
                    onChange={(e) => {
                        const newSubject = e.target.value;
                        setCurrentTimetableSubject(newSubject);
                        setCurrentSelectedSubject(newSubject);
                        localStorage.setItem('currentTimetableSubject', newSubject);
                    }}
                    disabled={subjects.length === 0}
                >
                    {subjects.length === 0 && <option value="">No Subjects Available</option>}
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            <div id="timetable-progress-card" onClick={() => navigateToTrophyPage(currentTimetableSubject)} className="rounded-xl border p-5 rounded-2xl flex items-center justify-between mb-8 cursor-pointer transition-colors duration-300 shadow-sm">
                <CircularProgressBar percentage={progressPercentage} />
                <div className="flex-1 ml-4">
                    <p className="text-sm text-gray-500">Subject</p>
                    <p id="timetable-progress-subject" className="text-xl font-bold text-gray-800">{currentTimetableSubject || 'Select Subject'}</p>
                    <p className="text-sm text-gray-500 mt-1">Tests Completed</p>
                    <p className="text-lg font-bold text-gray-800">{completedCount}/{totalCount}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>

            <button
                onClick={() => setShowAddTimetableForm(!showAddTimetableForm)}
                className="w-full bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-100 transition duration-300 mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                {showAddTimetableForm ? 'Hide Add Event Form' : 'Add New Study Event'}
            </button>

            {showAddTimetableForm && (
                <div id="add-new-timetable-form-container" className="bg-white p-4 rounded-lg mb-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3">Add New Study Event</h4>
                    <div className="mb-3">
                        <label htmlFor="new-timetable-subject-input" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" id="new-timetable-subject-input" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., Anatomy" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="new-timetable-topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <input type="text" id="new-timetable-topic" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., Cardiovascular System" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="new-timetable-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input type="date" id="new-timetable-date" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-timetable-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input type="time" id="new-timetable-time" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                    </div>
                    <button onClick={handleAddEvent} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                        Add Event
                    </button>
                </div>
            )}

            <div id="timetable-events-list" className="space-y-4 bg-white rounded-lg min-h-[100px]">
                <TimetableEventCard
                    events={eventsForSelectedDate}
                    isEditMode={timetableEditMode}
                    onDelete={deleteTimetableEntry} // This is the prop passed from App.js
                    onCheck={handleCheckEvent}
                    selectedCalendarDate={selectedDisplayDate}
                    onSelectCalendarDate={setSelectedDisplayDate}
                />
            </div>
        </div>
    );
});

export default TimetablePage;
