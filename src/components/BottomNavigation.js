// src/components/BottomNavigation.js
import React from 'react';

const BottomNavigation = React.memo(({ currentPage, onNavigate }) => {
    const navItems = [
        { page: 'dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
        { page: 'timetable', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
        { page: 'trophy', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg> },
        { page: 'profile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    ];
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 transition-colors duration-300">
            <div className="flex justify-around h-16 max-w-md mx-auto">
                {navItems.map((item) => (
                    <button
                        key={item.page}
                        onClick={() => onNavigate(item.page)}
                        className={`flex flex-col items-center justify-center flex-1 text-center text-xs transition-colors duration-200 ${
                            currentPage === item.page ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label={`Navigate to ${item.page} page`}
                    >
                        {React.cloneElement(item.icon, {
                            className: `mb-1 ${currentPage === item.page ? 'text-blue-600' : 'text-gray-500'}`
                        })}
                        <span className="font-medium capitalize">{item.page}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
});

export default BottomNavigation;