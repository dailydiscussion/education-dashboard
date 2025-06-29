// src/pages/EditFocusPage.js
import React, { useState, useEffect } from 'react';
import FocusItemCard from '../components/FocusItemCard';
import AvailableTestCard from '../components/AvailableTestCard';
import LoadingSpinner from '../components/LoadingSpinner';

const EditFocusPage = React.memo(({ testData, todayFocusItems, addFocusItem, removeFocusItem, reorderFocusItems, onBackToDashboard, handleToggleTestCompletion, isLoadingTodayFocus }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAvailableSubject, setSelectedAvailableSubject] = useState('');
    const [localFocusItems, setLocalFocusItems] = useState(() =>
        todayFocusItems.map((item, index) => ({ ...item, order: item.order !== undefined ? item.order : index }))
    );

    useEffect(() => {
        setLocalFocusItems(todayFocusItems.map((item, index) => ({ ...item, order: item.order !== undefined ? item.order : index })));
    }, [todayFocusItems]);

    const allTests = Object.keys(testData).flatMap(subject =>
        testData[subject].map(test => ({ ...test, subject, id: `${subject}-${test.title}` }))
    );

    const filteredAllTests = allTests.filter(test => {
        const matchesSubject = selectedAvailableSubject === '' || test.subject === selectedAvailableSubject;
        const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    const subjects = Object.keys(testData);

    const handleMoveUp = async (index) => {
        if (index > 0) {
            const newOrder = [...localFocusItems];
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
            setLocalFocusItems(newOrder);
            await reorderFocusItems(newOrder);
        }
    };

    const handleMoveDown = async (index) => {
        if (index < localFocusItems.length - 1) {
            const newOrder = [...localFocusItems];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            setLocalFocusItems(newOrder);
            await reorderFocusItems(newOrder);
        }
    };

    return (
        <div id="page-edit-focus" className="page px-6 py-8">
            <header className="flex items-center justify-between mb-2">
                <button onClick={onBackToDashboard} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center" aria-label="Back to Dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back to Dashboard
                </button>
                <h1 className="text-xl font-bold text-gray-900">Edit Focus</h1>
            </header>
            <p className="text-gray-500 mb-6">Manage your daily focus items.</p>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Focus Items</h2>
            {isLoadingTodayFocus ? (
                <LoadingSpinner />
            ) : localFocusItems.length === 0 ? (
                <p className="text-gray-500 text-center mb-6">No focus items added yet. Add from "Available Tests".</p>
            ) : (
                <div className="flex flex-col space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                    {localFocusItems.map((item, index) => (
                        <FocusItemCard
                            key={item.id}
                            item={item}
                            onRemove={removeFocusItem}
                            onMoveUp={() => handleMoveUp(index)}
                            onMoveDown={() => handleMoveDown(index)}
                            isFirst={index === 0}
                            isLast={index === localFocusItems.length - 1}
                            allowReorder={true}
                            handleToggleTestCompletion={handleToggleTestCompletion}
                        />
                    ))
                    }
                </div>
            )}

            <hr className="my-6 border-t border-gray-200" />

            <h3 className="font-bold text-gray-900 mb-4 my-6">Available Tests to Add</h3>
            <div className="mb-4">
                <label htmlFor="select-available-subject" className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject:</label>
                <select
                    id="select-available-subject"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={selectedAvailableSubject}
                    onChange={(e) => setSelectedAvailableSubject(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search available tests..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search available tests"
                />
            </div>

            <div id="available-tests-list" className="space-y-3 mb-8">
                {filteredAllTests.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No tests available to add matching your filters.</p>
                ) : (
                    filteredAllTests.map(test => (
                        <AvailableTestCard
                            key={test.id}
                            test={test}
                            subject={test.subject}
                            isAdded={todayFocusItems.some(item => item.id === test.id || (item.subject === test.subject && item.title === test.title))}
                            onAdd={addFocusItem}
                            handleToggleTestCompletion={handleToggleTestCompletion}
                        />
                    ))
                )}
            </div>
        </div>
    );
});

export default EditFocusPage;