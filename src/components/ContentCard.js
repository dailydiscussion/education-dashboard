// src/components/ContentCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaFile, 
  FaVideo, 
  FaImage, 
  FaLink, 
  FaBookOpen, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle
} from 'react-icons/fa';

const ContentCard = ({ content, viewMode = 'grid', onView, onEdit, onDelete, isAdmin }) => {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const TypeIcon = getTypeIcon(content.type);
  const typeColors = getTypeColor(content.type);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg ${typeColors}`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{content.title}</h3>
              <div className="flex items-center space-x-2">
                {content.studied && (
                  <FaCheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm text-gray-500">{content.subject}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 truncate mt-1">{content.description}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-gray-500">
                  <FaCalendarAlt className="w-3 h-3 mr-1" />
                  {formatDate(content.createdAt)}
                </div>
                
                {content.tags && content.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <FaTag className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {content.tags.slice(0, 2).join(', ')}
                      {content.tags.length > 2 && '...'}
                    </span>
                  </div>
                )}
              </div>
              
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(content)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onEdit(content)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <FaEdit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(content.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${typeColors}`}>
          <TypeIcon className="w-6 h-6" />
        </div>
        
        <div className="flex items-center space-x-2">
          {content.studied && (
            <div className="flex items-center text-green-600">
              <FaCheckCircle className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Studied</span>
            </div>
          )}
          
          {isAdmin && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onView(content)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <FaEye className="w-3 h-3" />
              </button>
              <button
                onClick={() => onEdit(content)}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <FaEdit className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(content.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{content.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-medium">{content.subject}</span>
          <span className="flex items-center">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            {formatDate(content.createdAt)}
          </span>
        </div>
        
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{content.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(content)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <FaEye className="w-4 h-4" />
          <span className="text-sm font-medium">View</span>
        </button>
        
        {!content.studied && (
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <FaCheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Mark Studied</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ContentCard;