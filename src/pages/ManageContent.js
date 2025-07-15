// src/pages/ManageContent.js
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaDownload,
  FaUpload,
  FaSearch,
  FaFilter,
  FaFolder,
  FaFile,
  FaVideo,
  FaImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaLink,
  FaBookOpen
} from 'react-icons/fa';
import { useHandlers } from '../context/HandlerContext';
import { useAdmin } from '../context/AdminContext';
import ContentCard from '../components/ContentCard';
import ContentModal from '../components/ContentModal';
import AddContentModal from '../components/AddContentModal';
import ContentDetailsModal from '../components/ContentDetailsModal';

const ManageContent = ({ contentItems, onAddContent, onUpdateContent, onDeleteContent }) => {
  const handlers = useHandlers();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, documents, videos, images, links
  const [sortBy, setSortBy] = useState('date'); // date, title, subject, type
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [selectedContent, setSelectedContent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Content categories
  const categories = [
    { id: 'all', name: 'All Content', icon: FaFolder },
    { id: 'documents', name: 'Documents', icon: FaFile },
    { id: 'videos', name: 'Videos', icon: FaVideo },
    { id: 'images', name: 'Images', icon: FaImage },
    { id: 'links', name: 'Links', icon: FaLink },
    { id: 'notes', name: 'Notes', icon: FaBookOpen }
  ];

  // Filter and sort content
  const filteredAndSortedContent = useMemo(() => {
    let filtered = contentItems || [];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content => 
        content.title?.toLowerCase().includes(query) ||
        content.description?.toLowerCase().includes(query) ||
        content.subject?.toLowerCase().includes(query) ||
        content.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content => content.type === selectedCategory);
    }

    // Apply type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(content => content.type === filterBy);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [contentItems, searchQuery, filterBy, sortBy, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = contentItems?.length || 0;
    const byType = contentItems?.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {}) || {};

    const studied = contentItems?.filter(item => item.studied).length || 0;
    const recent = contentItems?.filter(item => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(item.createdAt) > oneWeekAgo;
    }).length || 0;

    return {
      total,
      studied,
      recent,
      byType,
      studyProgress: total > 0 ? Math.round((studied / total) * 100) : 0
    };
  }, [contentItems]);

  const handleAddContent = (contentData) => {
    if (onAddContent) {
      onAddContent(contentData);
    }
    setShowAddModal(false);
  };

  const handleUpdateContent = (contentData) => {
    if (onUpdateContent) {
      onUpdateContent(selectedContent.id, contentData);
    }
    setShowEditModal(false);
    setSelectedContent(null);
  };

  const handleDeleteContent = (contentId) => {
    if (onDeleteContent) {
      onDeleteContent(contentId);
    }
  };

  const handleViewDetails = (content) => {
    setSelectedContent(content);
    setShowDetailsModal(true);
  };

  const handleEditContent = (content) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

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

  return (
    <div className="manage-content-page px-6 py-8 pb-24 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
            <p className="text-gray-600">Organize and manage your study materials</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add Content</span>
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaFolder className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Studied</p>
                <p className="text-2xl font-bold text-green-600">{stats.studied}</p>
              </div>
              <FaBookOpen className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent</p>
                <p className="text-2xl font-bold text-purple-600">{stats.recent}</p>
              </div>
              <FaUpload className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-orange-600">{stats.studyProgress}%</p>
              </div>
              <FaEye className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const count = category.id === 'all' ? stats.total : (stats.byType[category.id] || 0);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Controls */}
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="subject">Sort by Subject</option>
                  <option value="type">Sort by Type</option>
                </select>

                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    <FaFolder className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    <FaFile className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid/List */}
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}`}>
            <AnimatePresence>
              {filteredAndSortedContent.map((content) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContentCard
                    content={content}
                    viewMode={viewMode}
                    onView={() => handleViewDetails(content)}
                    onEdit={() => handleEditContent(content)}
                    onDelete={() => handleDeleteContent(content.id)}
                    isAdmin={isAdmin}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredAndSortedContent.length === 0 && (
            <div className="text-center py-12">
              <FaFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery.trim() ? 'No content found' : 'No content available'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery.trim() 
                  ? 'Try adjusting your search criteria'
                  : 'Add some study materials to get started'
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
        </div>
      </div>

      {/* Modals */}
      <AddContentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddContent}
      />
      
      <ContentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateContent}
        content={selectedContent}
        isEdit={true}
      />
      
      <ContentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        content={selectedContent}
      />
    </div>
  );
};

export default ManageContent;