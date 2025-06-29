// src/pages/TestsCompletedPage.js
import React, { useState, useEffect } from 'react';
import TestCard from '../components/TestCard';

const TestsCompletedPage = React.memo(({ testData, currentSelectedSubject, setCurrentSelectedSubject, addTest, deleteTest, handleToggleTestCompletion }) => {
    const [trophyEditMode, setTrophyEditMode] = useState(false);
    const [showAddTestForm, setShowAddTestForm] = useState(false);
    const [newTestTitle, setNewTestTitle] = useState('');
    const [newTestMcqs, setNewTestMcqs] = useState('');
    const [newTestDate, setNewTestDate] = useState('');
    const [newTestLink, setNewTestLink] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddTest = () => {
        addTest(currentSelectedSubject, newTestTitle, newTestMcqs, newTestDate, newTestLink);
        setNewTestTitle('');
        setNewTestMcqs('');
        setNewTestDate('');
        setNewTestLink('');
        setShowAddTestForm(false);
    };

    const subjects = Object.keys(testData);

    // Set initial selected subject if none is selected or if the current one is deleted/invalid
    useEffect(() => {
        if (subjects.length > 0 && (!currentSelectedSubject || !subjects.includes(currentSelectedSubject))) {
            setCurrentSelectedSubject(subjects[0]);
        } else if (subjects.length === 0 && currentSelectedSubject !== '') {
            setCurrentSelectedSubject('');
        }
    }, [subjects, currentSelectedSubject, setCurrentSelectedSubject]);

    const filteredTests = currentSelectedSubject && testData[currentSelectedSubject]
        ? testData[currentSelectedSubject].filter(test =>
            test.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div id="page-trophy" className="page px-6 py-8">
            <header className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
                <button
                    onClick={() => setTrophyEditMode(!trophyEditMode)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    aria-label={trophyEditMode ? 'Done editing tests' : 'Edit tests'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    {trophyEditMode ? 'Done' : 'Edit'}
                </button>
            </header>
            <p className="text-gray-500 mb-6">Completed Tests & Progress</p>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search tests"
                />
            </div>

            <div className="flex space-x-3 mb-6 overflow-x-auto no-scrollbar" id="subject-filters-container">
                {subjects.map(subject => (
                    <button
                        key={subject}
                        className={`subject-filter flex-shrink-0 text-left p-3 rounded-lg transition-colors duration-200 shadow-sm
                            ${currentSelectedSubject === subject ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setCurrentSelectedSubject(subject)}
                    >
                        <p className="font-bold">{subject}</p>
                        <p className={`text-sm ${currentSelectedSubject === subject ? 'opacity-80' : 'text-gray-500'}`}>
                            {testData[subject]?.length || 0} Test{testData[subject]?.length === 1 ? '' : 's'}
                        </p>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <h3 id="subject-test-header" className="font-bold text-lg text-gray-800">{currentSelectedSubject} Tests</h3>
            </div>

            <button
                onClick={() => setShowAddTestForm(!showAddTestForm)}
                className="w-full bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-100 transition duration-300 mb-6"
                disabled={subjects.length === 0}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                {showAddTestForm ? `Hide Add Test Form for ${currentSelectedSubject}` : `Add New Test to ${currentSelectedSubject}`}
            </button>

            {showAddTestForm && currentSelectedSubject && (
                <div id="add-new-test-form-container" className="bg-white p-4 rounded-lg mb-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-3">Add New Test to <span id="current-subject-name-for-add">{currentSelectedSubject}</span></h4>
                    <div className="mb-3">
                        <label htmlFor="new-trophy-test-title" className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
                        <input type="text" id="new-trophy-test-title" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., New Test Name" value={newTestTitle} onChange={(e) => setNewTestTitle(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="new-trophy-test-mcqs" className="block text-sm font-medium text-gray-700 mb-1">Number of MCQs</label>
                        <input type="number" id="new-trophy-test-mcqs" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., 40" value={newTestMcqs} onChange={(e) => setNewTestMcqs(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-trophy-test-date" className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
                        <input type="date" id="new-trophy-test-date" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={newTestDate} onChange={(e) => setNewTestDate(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="new-trophy-test-link" className="block text-sm font-medium text-gray-700 mb-1">Test Link (Optional)</label>
                        <input type="url" id="new-trophy-test-link" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., https://example.com/test" value={newTestLink} onChange={(e) => setNewTestLink(e.target.value)} />
                    </div>
                    <button onClick={handleAddTest} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 mb-4">
                        Add Test
                    </button>
                </div>
            )}

            <div id="test-list-container" className="space-y-3">
                {filteredTests.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tests available for {currentSelectedSubject} matching your search.</p>
                ) : (
                    filteredTests.map(test => (
                        <TestCard
                            key={test.title}
                            test={test}
                            subject={currentSelectedSubject}
                            isEditMode={trophyEditMode}
                            onDelete={deleteTest}
                            handleToggleTestCompletion={handleToggleTestCompletion}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

export default TestsCompletedPage;