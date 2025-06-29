// src/pages/ProfilePage.js
import React from 'react';

const ProfilePage = React.memo(({ onManageContent, onLogout, currentUserId, userName, userEmail, onResetLocalData }) => {
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
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
                <button onClick={onLogout} className="w-full bg-red-100 text-red-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-red-200 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="17 16 22 12 17 8"></polyline><line x1="22" y1="12" x2="10" y2="12"></line></svg>
                    Logout
                </button>
            </div>
        </div>
    );
});

export default ProfilePage;