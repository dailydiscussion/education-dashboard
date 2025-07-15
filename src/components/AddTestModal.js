// src/components/AddTestModal.js
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';

const AddTestModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    topic: '',
    score: '',
    questionsTotal: '',
    questionsCorrect: '',
    duration: '',
    type: 'Multiple Choice',
    completedAt: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Test title is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    const score = parseFloat(formData.score);
    if (isNaN(score) || score < 0 || score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }
    
    const questionsTotal = parseInt(formData.questionsTotal);
    if (isNaN(questionsTotal) || questionsTotal < 1) {
      newErrors.questionsTotal = 'Total questions must be at least 1';
    }
    
    const questionsCorrect = parseInt(formData.questionsCorrect);
    if (isNaN(questionsCorrect) || questionsCorrect < 0 || questionsCorrect > questionsTotal) {
      newErrors.questionsCorrect = 'Correct questions must be between 0 and total questions';
    }
    
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }
    
    if (!formData.completedAt) {
      newErrors.completedAt = 'Completion date is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const testData = {
      ...formData,
      id: Date.now(),
      score: parseFloat(formData.score),
      questionsTotal: parseInt(formData.questionsTotal),
      questionsCorrect: parseInt(formData.questionsCorrect),
      duration: parseInt(formData.duration),
      completed: true,
      completedAt: new Date(formData.completedAt).toISOString()
    };
    
    onSave(testData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      subject: '',
      topic: '',
      score: '',
      questionsTotal: '',
      questionsCorrect: '',
      duration: '',
      type: 'Multiple Choice',
      completedAt: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add Test Result</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Test Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Final Exam"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Mathematics"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Algebra"
                  />
                </div>

                {/* Score and Questions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                      Score (%) *
                    </label>
                    <input
                      type="number"
                      id="score"
                      name="score"
                      value={formData.score}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.score ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="85"
                    />
                    {errors.score && (
                      <p className="text-red-500 text-xs mt-1">{errors.score}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="questionsTotal" className="block text-sm font-medium text-gray-700 mb-1">
                      Total Questions *
                    </label>
                    <input
                      type="number"
                      id="questionsTotal"
                      name="questionsTotal"
                      value={formData.questionsTotal}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.questionsTotal ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="20"
                    />
                    {errors.questionsTotal && (
                      <p className="text-red-500 text-xs mt-1">{errors.questionsTotal}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="questionsCorrect" className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answers *
                    </label>
                    <input
                      type="number"
                      id="questionsCorrect"
                      name="questionsCorrect"
                      value={formData.questionsCorrect}
                      onChange={handleChange}
                      min="0"
                      max={formData.questionsTotal || 100}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.questionsCorrect ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="17"
                    />
                    {errors.questionsCorrect && (
                      <p className="text-red-500 text-xs mt-1">{errors.questionsCorrect}</p>
                    )}
                  </div>
                </div>

                {/* Duration and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="60"
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Test Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Multiple Choice">Multiple Choice</option>
                      <option value="True/False">True/False</option>
                      <option value="Essay">Essay</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>

                {/* Completion Date */}
                <div>
                  <label htmlFor="completedAt" className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    id="completedAt"
                    name="completedAt"
                    value={formData.completedAt}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.completedAt ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.completedAt && (
                    <p className="text-red-500 text-xs mt-1">{errors.completedAt}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>Add Test Result</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddTestModal;