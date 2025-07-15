// src/pages/Dashboard.js
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarCheck, 
  FaClipboardList, 
  FaChartLine, 
  FaBookOpen,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlayCircle
} from 'react-icons/fa';
import { useHandlers } from '../context/HandlerContext';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import UpcomingEvents from '../components/UpcomingEvents';
import ProgressChart from '../components/ProgressChart';

const Dashboard = ({ timetableEntries, testResults, contentItems }) => {
  const handlers = useHandlers();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Timetable stats
    const totalEvents = timetableEntries.length;
    const completedEvents = timetableEntries.filter(event => event.checked).length;
    const todayEvents = timetableEntries.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === today.toDateString();
    });
    const upcomingEvents = timetableEntries.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > today && !event.checked;
    });

    // Test stats
    const totalTests = testResults?.length || 0;
    const completedTests = testResults?.filter(test => test.completed).length || 0;
    const averageScore = testResults?.length > 0 
      ? testResults.reduce((sum, test) => sum + (test.score || 0), 0) / testResults.length 
      : 0;

    // Content stats
    const totalContent = contentItems?.length || 0;
    const studiedContent = contentItems?.filter(item => item.studied).length || 0;

    return {
      totalEvents,
      completedEvents,
      todayEvents: todayEvents.length,
      upcomingEvents: upcomingEvents.length,
      totalTests,
      completedTests,
      averageScore: Math.round(averageScore * 10) / 10,
      totalContent,
      studiedContent,
      completionRate: totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0,
      studyStreak: 5 // Mock streak data
    };
  }, [timetableEntries, testResults, contentItems]);

  return (
    <div className="dashboard-page px-6 py-8 pb-24 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your study overview.</p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Today's Events"
          value={dashboardStats.todayEvents}
          icon={FaCalendarCheck}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Completion Rate"
          value={`${dashboardStats.completionRate}%`}
          icon={FaCheckCircle}
          color="green"
          trend="+5%"
        />
        <StatsCard
          title="Average Score"
          value={`${dashboardStats.averageScore}%`}
          icon={FaChartLine}
          color="purple"
          trend="+8%"
        />
        <StatsCard
          title="Study Streak"
          value={`${dashboardStats.studyStreak} days`}
          icon={FaPlayCircle}
          color="orange"
          trend="🔥"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Progress</h3>
            <ProgressChart data={dashboardStats} timeRange={timeRange} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaBookOpen className="text-blue-500" />
                  <span className="text-gray-700">Total Events</span>
                </div>
                <span className="font-semibold text-gray-900">{dashboardStats.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-700">Completed</span>
                </div>
                <span className="font-semibold text-gray-900">{dashboardStats.completedEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaClipboardList className="text-purple-500" />
                  <span className="text-gray-700">Tests Done</span>
                </div>
                <span className="font-semibold text-gray-900">{dashboardStats.completedTests}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-orange-500" />
                  <span className="text-gray-700">Upcoming</span>
                </div>
                <span className="font-semibold text-gray-900">{dashboardStats.upcomingEvents}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity 
          timetableEntries={timetableEntries} 
          testResults={testResults} 
        />
        <UpcomingEvents 
          timetableEntries={timetableEntries} 
          onEditEvent={handlers.editTimetableEntry}
        />
      </div>
    </div>
  );
};

export default Dashboard;