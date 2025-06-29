// src/pages/ManageContentPage.js
import React, { useState, useEffect, useCallback } from 'react';
import ManagedSubjectSection from '../components/ManagedSubjectSection';

const ManageContentPage = React.memo(({ testData, addSubject, addTest, deleteSubject, deleteTest, onBackToProfile }) => {
    const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
    const [showAddTestForm, setShowAddTestForm] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedSubjectForTest, setSelectedSubjectForTest] = useState('');
    const [newTestTitle, setNewTestTitle] = useState('');
    const [newTestMcqs, setNewTestMcqs] = useState('');
    const [newTestDate, setNewTestDate] = useState('');
    const [newTestLink, setNewTestLink] = useState('');
    const [expandedSubjects, setExpandedSubjects] = useState({});

    useEffect(() => {
        const subjects = Object.keys(testData);
        if (subjects.length > 0 && !selectedSubjectForTest) {
            setSelectedSubjectForTest(subjects[0]);
        }
    }, [testData, selectedSubjectForTest]);

    const handleToggleExpand = useCallback((subjectName) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectName]: !prev[subjectName]
        }));
    }, []);

    const handleAddSubject = () => {
        addSubject(newSubjectName);
        setNewSubjectName('');
        setShowAddSubjectForm(false);
        setExpandedSubjects(prev => ({ ...prev, [newSubjectName]: true }));
    };

    const handleAddTest = () => {
        if (!selectedSubjectForTest) {
            console.error("No subject selected for adding test.");
            return;
        }
        addTest(selectedSubjectForTest, newTestTitle, newTestMcqs, newTestDate, newTestLink);
        setNewTestTitle('');
        setNewTestMcqs('');
        setNewTestDate('');
        setNewTestLink('');
        setShowAddTestForm(false);
        setExpandedSubjects(prev => ({ ...prev, [selectedSubjectForTest]: true }));
    };

    const subjects = Object.keys(testData);

    return (
        <div id="page-manage-tests" className="page px-6 py-8">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Manage Content</h1>
                <button onClick={onBackToProfile} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Done</button>
            </header>

            <button
                onClick={() => setShowAddSubjectForm(!showAddSubjectForm)}
                className="w-full bg-green-50 text-green-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-100 transition duration-300 mb-6"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                {showAddSubjectForm ? 'Hide Add Subject Form' : 'Add New Subject'}
            </button>

            {showAddSubjectForm && (
                <div id="add-new-subject-form-container" className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4">Add New Subject</h2>
                    <div className="mb-4">
                        <label htmlFor="new-subject-name" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                        <input type="text" id="new-subject-name" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="e.g., Biochemistry" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
                    </div>
                    <button onClick={handleAddSubject} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300">
                        Add Subject
                    </button>
                </div>
            )}

            <button
                onClick={() => setShowAddTestForm(!showAddTestForm)}
                className="w-full bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-100 transition duration-300 mb-6"
                disabled={subjects.length === 0}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                {showAddTestForm ? 'Hide Add Test Form' : 'Add New Test'}
            </button>

            {showAddTestForm && (
                <div id="add-new-test-form-container" className="mb-8 p-4 bg-white rounded-lg shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4">Add New Test</h2>
                    <div className="mb-4">
                        <label htmlFor="select-subject-for-test" className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                        <select id="select-subject-for-test" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" value={selectedSubjectForTest} onChange={(e) => setSelectedSubjectForTest(e.target.value)}>
                            <option value="">Select a Subject</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    {selectedSubjectForTest && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="new-test-title-manage" className="block text-sm font-medium text-gray-700 mb-1">Test Title:</label>
                                <input
                                    type="text"
                                    id="new-test-title-manage"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    placeholder="Test Title"
                                    value={newTestTitle}
                                    onChange={(e) => setNewTestTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="new-test-mcqs-manage" className="block text-sm font-medium text-gray-700 mb-1">Number of MCQs:</label>
                                <input
                                    type="number"
                                    id="new-test-mcqs-manage"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    placeholder="e.g., 50"
                                    value={newTestMcqs}
                                    onChange={(e) => setNewTestMcqs(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="new-test-date-manage" className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                                <input
                                    type="date"
                                    id="new-test-date-manage"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    value={newTestDate}
                                    onChange={(e) => setNewTestDate(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="new-test-link-manage" className="block text-sm font-medium text-gray-700 mb-1">Test Link (Optional):</label>
                                <input
                                    type="url"
                                    id="new-test-link-manage"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    placeholder="e.g., https://example.com/test"
                                    value={newTestLink}
                                    onChange={(e) => setNewTestLink(e.target.value)}
                                />
                            </div>
                            <button onClick={handleAddTest} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 mb-4">
                                Add Test
                            </button>
                        </>
                    )}
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Content</h2>
            <div id="manage-content-list" className="space-y-4">
                {subjects.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No subjects available. Add a new subject above.</p>
                ) : (
                    subjects.map(subject => (
                        <ManagedSubjectSection
                            key={subject}
                            subjectName={subject}
                            tests={testData[subject]}
                            onDeleteSubject={deleteSubject}
                            onDeleteTest={deleteTest}
                            isExpanded={expandedSubjects[subject]}
                            onToggleExpand={handleToggleExpand}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

export default ManageContentPage;