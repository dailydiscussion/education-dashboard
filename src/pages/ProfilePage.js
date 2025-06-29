// src/pages/ProfilePage.js
import React, { useState } from 'react';
// REMOVED: import { exportUserData, importUserData } from '../utils/appFunctions'; // This import is no longer needed as functions are passed via props

const ProfilePage = React.memo(({ onManageContent, onLogout, currentUserId, userName, userEmail, showNotification, onResetLocalData, exportUserData, importUserData }) => {
    const [showImportConfirmation, setShowImportConfirmation] = useState(false);
    const [importFileData, setImportFileData] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    // Basic validation: Check for expected top-level keys
                    if (parsedData.subjects && parsedData.todayFocus && parsedData.timetable) {
                        setImportFileData(parsedData);
                        setShowImportConfirmation(true);
                    } else {
                        showNotification("Invalid file format. Please upload a valid exported data file.", "error");
                    }
                } catch (error) {
                    showNotification("Failed to parse JSON file. Please ensure it's a valid JSON.", "error");
                    console.error("Error parsing import file:", error);
                }
            };
            reader.readAsText(file);
        }
    };

    const confirmImport = async () => {
        setShowImportConfirmation(false);
        if (importFileData) {
            await importUserData(importFileData); // Now using the prop version, App.js handles currentUserId and showNotification
            setImportFileData(null);
        }
    };

    const cancelImport = () => {
        setShowImportConfirmation(false);
        setImportFileData(null);
        // Clear the file input if the user cancels
        document.getElementById('importFileInput').value = '';
    };

    return (
        <div id="page-profile" className="page px-6 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-2">Manage your account and app settings.</p>
            </header>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center space-x-4">
                    <img src="https://placehold.co/80x80/E2E8F0/4A5568?text=NK" alt="User Avatar" className="w-16 h-16 rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{userName || 'User'}</h2>
                        <p className="text-gray-600 text-sm">{userEmail || 'No Email'}</p>
                        <p className="text-xs text-gray-500 break-all">User ID: {currentUserId || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <button onClick={onManageContent} className="w-full bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-between hover:bg-blue-100 transition duration-200">
                    Manage Subjects & Tests
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

                {/* Export Data Button */}
                <button
                    onClick={exportUserData} // Now using the prop version directly
                    className="w-full bg-green-50 text-green-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-between hover:bg-green-100 transition duration-200"
                >
                    Export All Data
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>

                {/* Import Data Button */}
                <label className="w-full bg-purple-50 text-purple-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-between hover:bg-purple-100 transition duration-200 cursor-pointer">
                    Import Data
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                        id="importFileInput"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </label>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
                <button onClick={onLogout} className="w-full bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-red-200 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="17 16 22 12 17 8"></polyline><line x1="22" y1="12" x2="10" y2="12"></line></svg>
                    Logout
                </button>
            </div>

            {/* Import Confirmation Modal */}
            {showImportConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                        <h3 className="text-lg font-bold mb-4">Confirm Data Import</h3>
                        <p className="text-gray-700 mb-6">
                            Importing this data will overwrite your existing subjects, tests, focus items, and timetable entries.
                            Are you sure you want to proceed?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelImport}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmImport}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
                            >
                                Import Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ProfilePage;