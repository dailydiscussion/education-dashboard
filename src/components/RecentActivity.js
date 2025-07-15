// src/components/RecentActivity.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaClipboardList, FaClock } from 'react-icons/fa';

const RecentActivity = ({ timetableEntries, testResults }) => {
  // Combine and sort activities
  const activities = React.useMemo(() => {
    const timetableActivities = (timetableEntries || [])
      .filter(entry => entry.checked)
      .map(entry => ({
        id: `timetable-${entry.id}`,
        type: 'timetable',
        title: `Completed: ${entry.subject}`,
        subtitle: entry.topic,
        timestamp: new Date(entry.date),
        icon: FaCheckCircle,
        color: 'green'
      }));

    const testActivities = (testResults || [])
      .map(test => ({
        id: `test-${test.id}`,
        type: 'test',
        title: `Test: ${test.subject}`,
        subtitle: `Score: ${test.score}%`,
        timestamp: new Date(test.completedAt),
        icon: FaClipboardList,
        color: test.score >= 60 ? 'green' : 'red'
      }));

    return [...timetableActivities, ...testActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  }, [timetableEntries, testResults]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg ${
                  activity.color === 'green' ? 'bg-green-100 text-green-600' : 
                  activity.color === 'red' ? 'bg-red-100 text-red-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.subtitle}
                  </p>
                </div>
                
                <div className="flex items-center text-xs text-gray-400">
                  <FaClock className="w-3 h-3 mr-1" />
                  {formatTime(activity.timestamp)}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <FaCalendarAlt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;