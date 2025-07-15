// src/components/TestResultCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye, FaRedo, FaCalendarAlt } from 'react-icons/fa';

const TestResultCard = ({ test, onViewDetails, onRetake, showRetakeButton = false }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const passed = test.score >= 60;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{test.title || test.subject}</h3>
          <p className="text-sm text-gray-600">{test.subject}</p>
          {test.topic && (
            <p className="text-xs text-gray-500 mt-1">{test.topic}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {passed ? (
            <FaCheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <FaTimesCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {/* Score Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Score</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(test.score)}`}>
            {getGrade(test.score)}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                passed ? 'bg-green-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${test.score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="text-lg font-bold text-gray-900">{test.score}%</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {test.questionsTotal && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Questions</span>
            <span className="font-medium text-gray-900">
              {test.questionsCorrect || Math.round((test.score / 100) * test.questionsTotal)} / {test.questionsTotal}
            </span>
          </div>
        )}
        
        {test.duration && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium text-gray-900">{test.duration} min</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Completed</span>
          <span className="font-medium text-gray-900 flex items-center">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            {formatDate(test.completedAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <FaEye className="w-4 h-4" />
          <span className="text-sm font-medium">View Details</span>
        </button>
        
        {showRetakeButton && (
          <button
            onClick={onRetake}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200"
          >
            <FaRedo className="w-4 h-4" />
            <span className="text-sm font-medium">Retake</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TestResultCard;