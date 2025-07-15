// src/components/ContentDetailsModal.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FaTimes, 
  FaFile, 
  FaVideo, 
  FaImage, 
  FaLink, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaTag, 
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';

const ContentDetailsModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'documents': return FaFile;
      case 'videos': return FaVideo;
      case 'images': return FaImage;
      case 'links': return FaLink;
      case 'notes': return FaBookOpen;
      default: return FaFile;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'documents': return 'text-blue-500 bg-blue-100';
      case 'videos': return 'text-red-500 bg-red-100';
      case 'images': return 'text-green-500 bg-green-100';
      case 'links': return 'text-purple-500 bg-purple-100';
      case 'notes': return 'text-orange-500 bg-orange-100';
      default: return 'text-gray-500 bg-gray-100';
    }
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

  const TypeIcon = getTypeIcon(content.type);
  const typeColors = getTypeColor(content.type);

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
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${typeColors}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
                  <p className="text-gray-600 mt-1">{content.subject}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status and Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {content.studied && (
                    <div className="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      <FaCheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Studied</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-500">
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    <span className="text-sm">Added {formatDate(content.createdAt)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 capitalize">
                  {content.type}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{content.description}</p>
              </div>

              {/* URL for links */}
              {content.type === 'links' && content.url && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Link</h3>
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                    {content.url}
                  </a>
                </div>
              )}

              {/* Tags */}
              {content.tags && content.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        <FaTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {content.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{content.notes}</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Subject</h4>
                  <p className="text-sm text-gray-600">{content.subject}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Type</h4>
                  <p className="text-sm text-gray-600 capitalize">{content.type}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Created</h4>
                  <p className="text-sm text-gray-600">{formatDate(content.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Status</h4>
                  <p className="text-sm text-gray-600">
                    {content.studied ? 'Studied' : 'Not studied'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                {content.type === 'links' && content.url && (
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FaExternalLinkAlt className="w-4 h-4" />
                    <span>Open Link</span>
                  </a>
                )}
                
                {!content.studied && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2">
                    <FaCheckCircle className="w-4 h-4" />
                    <span>Mark as Studied</span>
                  </button>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentDetailsModal;