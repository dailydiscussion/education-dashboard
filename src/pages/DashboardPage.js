// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import Greeting from '../components/Greeting';
import StatCard from '../components/StatCard';
import FocusItemCard from '../components/FocusItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = React.memo(({ testData, todayFocusItems, onEditFocus, removeFocusItem, onNavigate, userName, userEmail, currentUserId, handleToggleTestCompletion, isLoadingTodayFocus }) => {
    const [stats, setStats] = useState({ days: 0, mcqs: 0, tests: 0, subjects: 0 });

    useEffect(() => {
        let uniqueDates = new Set();
        let totalMCQs = 0;
        let totalTests = 0;
        let uniqueSubjects = new Set();

        for (const subject in testData) {
            if (testData.hasOwnProperty(subject)) {
                if (testData[subject].length > 0) {
                    uniqueSubjects.add(subject);
                }
                testData[subject].forEach(test => {
                    totalTests++;
                    totalMCQs += test.mcqs;
                    uniqueDates.add(test.date);
                });
            }
        }
        setStats({
            days: uniqueDates.size,
            mcqs: totalMCQs,
            tests: totalTests,
            subjects: uniqueSubjects.size
        });
    }, [testData]);

    return (
        <div id="page-dashboard" className="page px-6 py-8">
            <div
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl mb-8 cursor-pointer transition-colors duration-300 shadow-sm"
                onClick={() => onNavigate('profile')}
            >
                <img src="https://placehold.co/80x80/E2E8F0/4A5568?text=NK" alt="User Avatar" className="w-16 h-16 rounded-full" />
                <div>
                    <h2 className="font-bold text-xl text-gray-800">Welcome {userName || 'User'}</h2>
                    <Greeting userName={userName || 'User'} />
                    <p className="text-sm text-600 break-all">User ID: {currentUserId || 'Not authenticated'}</p>
                </div>
            </div>

            <hr className="my-6 border-t border-gray-200" />

            <header className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </header>
            <p className="text-gray-500 mb-8">Your progress at a glance...</p>
            <div className="grid grid-cols-2 gap-4 mb-10">
                <StatCard
                    category="Days"
                    value={stats.days}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-600"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}

                />
                <StatCard
                    category="MCQs"
                    value={stats.mcqs}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-600"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>}
                />
                <StatCard
                    category="Tests"
                    value={stats.tests}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-600"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>}
                />
                <StatCard
                    category="Subjects"
                    value={stats.subjects}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-gray-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>}
                />
            </div>
            <div>

                <hr className="my-6 border-t border-gray-200" />

                <header className="flex items-center justify-between py-2">
                    <h2 className="text-xl font-bold text-gray-900">Today's Focus</h2>
                    <button
                        onClick={onEditFocus}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit Focus
                    </button>
                </header>
                <p className="text-gray-500 mb-6">Your tests today...</p>
                <div id="today-focus-container" className="flex flex-col space-y-4 pb-4">
                    {isLoadingTodayFocus ? (
                        <LoadingSpinner />
                    ) : todayFocusItems.length === 0 ? (
                        <p className="text-gray-500 text-center w-full">No focus items for today. Click "Edit Focus" to add some.</p>
                    ) : (
                        todayFocusItems.map(item => (
                            <FocusItemCard
                                key={item.id}
                                item={item}
                                onRemove={removeFocusItem}
                                handleToggleTestCompletion={handleToggleTestCompletion}
                                allowReorder={false}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
});

export default DashboardPage;