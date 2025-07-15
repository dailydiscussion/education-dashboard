// src/pages/TestCompleted.js
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartLine, 
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaRedo,
  FaAward,
  FaTrophy
} from 'react-icons/fa';
import { useHandlers } from '../context/HandlerContext';
import { useAdmin } from '../context/AdminContext';
import TestResultCard from '../components/TestResultCard';
import TestDetailsModal from '../components/TestDetailsModal';
import AddTestModal from '../components/AddTestModal';

const TestCompleted = ({ testResults, onAddTest, onRetakeTest, onViewDetails }) => {
  const handlers = useHandlers();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, passed, failed, recent
  const [sortBy, setSortBy] = useState('date'); // date, score, subject
  const [selectedTest, setSelectedTest] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter and sort tests
  const filteredAndSortedTests = useMemo(() => {
    let filtered = testResults || [];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        test.subject?.toLowerCase().includes(query) ||
        test.title?.toLowerCase().includes(query) ||
        test.topic?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'passed':
          filtered = filtered.filter(test => test.score >= 60);
          break;
        case 'failed':
          filtered = filtered.filter(test => test.score < 60);
          break;
        case 'recent':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filtered = filtered.filter(test => new Date(test.completedAt) > oneWeekAgo);
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'date':
        default:
          return new Date(b.completedAt) - new Date(a.completedAt);
      }
    });

    return filtered;
  }, [testResults, searchQuery, filterBy, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = testResults?.length || 0;
    const passed = testResults?.filter(test => test.score >= 60).length || 0;
    const failed = total - passed;
    const averageScore = total > 0 
      ? Math.round((testResults.reduce((sum, test) => sum + test.score, 0) / total) * 10) / 10
      : 0;
    const highestScore = total > 0 
      ? Math.max(...testResults.map(test => test.score))
      : 0;

    return {
      total,
      passed,
      failed,
      averageScore,
      highestScore,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }, [testResults]);

  const handleViewDetails = (test) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  const handleRetakeTest = (testId) => {
    if (onRetakeTest) {
      onRetakeTest(testId);
    }
  };

  const handleAddTest = (testData) => {
    if (onAddTest) {
      onAddTest(testData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="test-completed-page px-6 py-8 pb-24 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
            <p className="text-gray-600">Track your test performance and progress</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaChartLine className="w-4 h-4" />
              <span>Add Test Result</span>
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaChartLine className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <FaCheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <FaTimesCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
              </div>
              <FaAward className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-orange-600">{stats.highestScore}%</p>
              </div>
              <FaTrophy className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests by subject, title, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tests</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="recent">Recent</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="subject">Sort by Subject</option>
            </select>
          </div>
        </div>
      </div>

      {/* Test Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAndSortedTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TestResultCard
                test={test}
                onViewDetails={() => handleViewDetails(test)}
                onRetake={() => handleRetakeTest(test.id)}
                showRetakeButton={test.score < 60}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedTests.length === 0 && (
        <div className="text-center py-12">
          <FaChartLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery.trim() ? 'No tests found' : 'No test results yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery.trim() 
              ? 'Try adjusting your search or filter criteria'
              : 'Complete some tests to see your results here'
            }
          </p>
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <TestDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        test={selectedTest}
      />
      
      <AddTestModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTest}
      />
    </div>
  );
};

export default TestCompleted;