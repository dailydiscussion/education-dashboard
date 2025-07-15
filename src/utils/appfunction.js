// ============================================================================
// Study Management System - Utility Functions
// ============================================================================

// ====================
// DATE & TIME UTILITIES
// ====================

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type: 'full', 'short', 'time', 'date'
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    short: { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    date: { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    }
  };
  
  return d.toLocaleDateString('en-US', options[format]);
};

/**
 * Get time difference in human readable format
 * @param {Date|string} date - Date to compare
 * @returns {string} Human readable time difference
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

/**
 * Get week dates starting from Monday
 * @param {Date} startDate - Reference date
 * @returns {Array} Array of dates for the week
 */
export const getWeekDates = (startDate = new Date()) => {
  const week = [];
  const start = new Date(startDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  
  start.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    week.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  
  return week;
};

// ====================
// STATUS UTILITIES
// ====================

/**
 * Calculate event status based on time and completion
 * @param {Object} event - Event object
 * @returns {string} Status: 'live', 'pending', 'completed', 'missed'
 */
export const calculateEventStatus = (event) => {
  if (!event || !event.time) return 'pending';
  
  const now = new Date();
  const eventTime = new Date(event.time);
  const eventEndTime = new Date(eventTime.getTime() + (event.duration || 60) * 60000);
  
  if (event.completed) return 'completed';
  if (now > eventEndTime) return 'missed';
  if (now >= eventTime && now <= eventEndTime) return 'live';
  return 'pending';
};

/**
 * Get status color classes for UI
 * @param {string} status - Status string
 * @returns {Object} Color classes for different elements
 */
export const getStatusColors = (status) => {
  const colors = {
    live: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      indicator: 'bg-yellow-500'
    },
    pending: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      indicator: 'bg-blue-500'
    },
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      indicator: 'bg-green-500'
    },
    missed: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      indicator: 'bg-red-500'
    }
  };
  
  return colors[status] || colors.pending;
};

/**
 * Get grade color based on score
 * @param {number} score - Test score
 * @returns {string} Color class
 */
export const getGradeColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};

// ====================
// DATA FORMATTING
// ====================

/**
 * Format score to grade letter
 * @param {number} score - Numeric score
 * @returns {string} Grade letter
 */
export const scoreToGrade = (score) => {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 65) return 'D';
  return 'F';
};

/**
 * Format duration in minutes to readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ====================
// VALIDATION UTILITIES
// ====================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required fields
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with errors
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {};
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors[field] = `${capitalize(field)} is required`;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

/**
 * Validate score range
 * @param {number} score - Score to validate
 * @param {number} min - Minimum score
 * @param {number} max - Maximum score
 * @returns {boolean} True if valid score
 */
export const isValidScore = (score, min = 0, max = 100) => {
  return !isNaN(score) && score >= min && score <= max;
};

// ====================
// STORAGE UTILITIES
// ====================

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 * @returns {boolean} True if successful
 */
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to storage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored data or default value
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from storage:', error);
    return false;
  }
};

// ====================
// SEARCH & FILTER UTILITIES
// ====================

/**
 * Filter array by search term
 * @param {Array} items - Items to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered items
 */
export const filterBySearch = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item =>
    searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

/**
 * Get nested object value by path
 * @param {Object} obj - Object to search
 * @param {string} path - Path to value (e.g., 'user.name')
 * @returns {*} Value at path
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Sort array by field
 * @param {Array} items - Items to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted items
 */
export const sortBy = (items, field, direction = 'asc') => {
  return [...items].sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// ====================
// STATISTICS UTILITIES
// ====================

/**
 * Calculate average of array values
 * @param {Array} numbers - Array of numbers
 * @returns {number} Average value
 */
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + Number(num), 0);
  return Math.round((sum / numbers.length) * 100) / 100;
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get statistics from test results
 * @param {Array} tests - Array of test results
 * @returns {Object} Statistics object
 */
export const getTestStatistics = (tests) => {
  if (!tests || tests.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      total: 0,
      passRate: 0
    };
  }
  
  const scores = tests.map(test => test.score);
  const passed = tests.filter(test => test.score >= 70).length;
  
  return {
    average: calculateAverage(scores),
    highest: Math.max(...scores),
    lowest: Math.min(...scores),
    total: tests.length,
    passRate: calculatePercentage(passed, tests.length)
  };
};

// ====================
// NOTIFICATION UTILITIES
// ====================

/**
 * Generate notification message
 * @param {string} type - Notification type
 * @param {Object} data - Data for notification
 * @returns {Object} Notification object
 */
export const createNotification = (type, data) => {
  const notifications = {
    event_added: {
      title: 'Event Added',
      message: `New study session for ${data.subject} has been scheduled`,
      type: 'success'
    },
    event_updated: {
      title: 'Event Updated',
      message: `Study session for ${data.subject} has been updated`,
      type: 'info'
    },
    event_completed: {
      title: 'Session Completed',
      message: `Great job! You completed ${data.subject}`,
      type: 'success'
    },
    test_added: {
      title: 'Test Result Added',
      message: `Test result for ${data.subject} (${data.score}%) has been recorded`,
      type: 'success'
    },
    content_added: {
      title: 'Content Added',
      message: `New ${data.type.toLowerCase()} "${data.title}" has been added`,
      type: 'success'
    }
  };
  
  return notifications[type] || {
    title: 'Update',
    message: 'Something has been updated',
    type: 'info'
  };
};

// ====================
// UTILITY HELPERS
// ====================

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// ====================
// EXPORT DEFAULT UTILITIES
// ====================

const appFunctions = {
  // Date & Time
  formatDate,
  getTimeAgo,
  isToday,
  getWeekDates,
  
  // Status
  calculateEventStatus,
  getStatusColors,
  getGradeColor,
  
  // Data Formatting
  scoreToGrade,
  formatDuration,
  capitalize,
  truncateText,
  
  // Validation
  isValidEmail,
  validateRequired,
  isValidScore,
  
  // Storage
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  
  // Search & Filter
  filterBySearch,
  getNestedValue,
  sortBy,
  
  // Statistics
  calculateAverage,
  calculatePercentage,
  getTestStatistics,
  
  // Notifications
  createNotification,
  
  // Utilities
  generateId,
  debounce,
  deepClone,
  isEmpty
};

export default appFunctions;