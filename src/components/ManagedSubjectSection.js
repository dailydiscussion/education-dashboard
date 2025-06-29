// src/components/ManagedSubjectSection.js
import React from 'react';

const ManagedSubjectSection = React.memo(({ subjectName, tests, onDeleteSubject, onDeleteTest, isExpanded, onToggleExpand }) => {
    return (
        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={() => onToggleExpand(subjectName)}
            >
                <h3 className="font-bold text-lg text-gray-800">{subjectName}</h3>
                <div className="flex items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteSubject(subjectName); }}
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200 mr-2"
                        aria-label="Delete subject"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {isExpanded && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    {tests.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No tests in this subject.</p>
                    ) : (
                        tests.map(test => (
                            <div key={test.title} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200 text-sm">
                                <span>{test.title} ({test.mcqs} MCQs, {test.date})</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteTest(subjectName, test.title); }}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2"
                                    aria-label="Delete test"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
});

export default ManagedSubjectSection;