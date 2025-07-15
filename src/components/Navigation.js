// src/components/Navigation.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaFolder, 
  FaChartBar,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';

const Navigation = ({ currentPage, onPageChange, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FaHome },
    { id: 'timetable', name: 'Timetable', icon: FaCalendarAlt },
    { id: 'tests', name: 'Test Results', icon: FaClipboardList },
    { id: 'content', name: 'Content', icon: FaFolder },
    ...(isAdmin ? [{ id: 'analytics', name: 'Analytics', icon: FaChartBar }] : []),
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <motion.nav
        initial={{ x: -280 }}
        animate={{ x: isMenuOpen ? 0 : -280 }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="lg:translate-x-0 fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 lg:static lg:shadow-none border-r border-gray-200"
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-8">StudyManager</h1>
          
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <FaUser className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <FaCog className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200">
              <FaSignOutAlt className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;