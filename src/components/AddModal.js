// src/components/AddModal.js
import React, { useState, useEffect } from 'react';
import { useHandlers } from '../context/HandlerContext';
import { AnimatePresence, motion } from 'framer-motion';

const EMPTY_INITIAL_STATE = {};

const AddModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialState = EMPTY_INITIAL_STATE,
}) => {
  const handlers = useHandlers();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialData = fields.reduce((acc, field) => {
        acc[field.name] = initialState[field.name] || field.defaultValue || '';
        return acc;
      }, {});
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [isOpen, fields, initialState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        if (handlers.showNotification) {
          handlers.showNotification(`${field.label} is required.`, 'error');
        } else {
          console.error(`${field.label} is required.`);
        }
        return;
      }
    }
    if (onSave) {
      onSave(formData);
    } else if (handlers.addTimetableEntry) {
      handlers.addTimetableEntry(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto relative"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder || ''}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      disabled={field.disabled || false}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-200"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      disabled={field.disabled || false}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-200"
                    >
                      {field.options &&
                        field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder || ''}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      disabled={field.disabled || false}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:bg-gray-200"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddModal;