// src/components/TestDetailsModal.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';

const TestDetailsModal = ({ isOpen, onClose, test }) => {
  if (!test) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock detailed results - in a real app, this would come from the test data
  const mockQuestions = [
    {
      id: 1,
      question: "What is the capital of France?",
      userAnswer: "Paris",
      correctAnswer: "Paris",
      isCorrect: true,
      points: 10
    },
    {
      id: 2,
      question: "Which planet is closest to the Sun?",
      userAnswer: "Venus",
      correctAnswer: "Mercury",
      isCorrect: false,
      points: 0
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      userAnswer: "4",
      correctAnswer: "4",
      isCorrect: true,
      points: 5
    }
  ];

  const passed = test.score >= 60;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{test.title || test.subject}</h2>
                <p className="text-gray-600 mt-1">{test.subject}</p>
                {test.topic && (
                  <p className="text-sm text-gray-500 mt-1">{test.topic}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Score Overview */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(test.score)}`}>
                    {test.score}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Final Score</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                    {getGrade(test.score)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Grade</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {test.questionsCorrect || Math.round((test.score / 100) * (test.questionsTotal || 10))} / {test.questionsTotal || 10}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Questions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {test.duration || 45} min
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Duration</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      passed ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${test.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Test Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Completed on:</span>
                  <p className="font-medium text-gray-900">{formatDate(test.completedAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Test Type:</span>
                  <p className="font-medium text-gray-900">{test.type || 'Multiple Choice'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Passing Score:</span>
                  <p className="font-medium text-gray-900">60%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Attempt:</span>
                  <p className="font-medium text-gray-900">{test.attempt || 1}</p>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
              <div className="space-y-4">
                {mockQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      question.isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {question.isCorrect ? (
                          <FaCheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaTimesCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm font-medium text-gray-600">
                          {question.points} pts
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Your Answer:</span>
                        <p className={`font-medium ${
                          question.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {question.userAnswer}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Correct Answer:</span>
                        <p className="font-medium text-green-700">{question.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              {!passed && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Retake Test
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestDetailsModal;