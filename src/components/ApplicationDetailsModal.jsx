import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaTimes, FaGithub, FaLinkedin, FaFileAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { getToken } from '../services/authService';

const ApplicationDetailsModal = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [isWithdrawConfirmOpen, setIsWithdrawConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  if (!application) return null;
  
  const { task, developer, proposal, status, createdAt, externalId } = application;
  const taskId = task.externalId;
  const applicationId = externalId;

  // Format the date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Status badge color based on application status
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800';
      case 'WITHDRAWN':
        return 'bg-red-100 text-red-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };
  
  // Handle withdraw button click - shows confirmation dialog
  const handleWithdrawClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Withdraw button clicked");
    setIsWithdrawConfirmOpen(true);
  };
  
  // Execute withdrawal after confirmation
  const confirmWithdraw = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("Confirming withdrawal for application:", applicationId, "task:", taskId);
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      console.log("Using token:", token ? "Valid token" : "No token");
      const url = `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${taskId}/applications/${applicationId}/withdraw`;
      console.log("Calling API:", url);
      
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("API response:", response);
      
      // Close confirmation dialog
      setIsWithdrawConfirmOpen(false);
      
      // Notify the parent component about the status change
      if (onStatusUpdate) {
        onStatusUpdate(applicationId, 'WITHDRAWN');
      }
      
      // Close the modal after successful withdrawal
      onClose();
      
    } catch (error) {
      console.error('Error withdrawing application:', error);
      setError(error.response?.data?.message || 'Failed to withdraw application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel withdrawal
  const cancelWithdraw = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsWithdrawConfirmOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white darkdummy:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 darkdummy:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 darkdummy:text-white">Application Details</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 darkdummy:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-gray-500 darkdummy:text-gray-400" />
              </button>
            </div>

            {/* Error message display */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Modal content */}
            <div className="p-6">
              {/* Task information section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 darkdummy:text-white mb-2 border-l-4 border-blue-500 pl-3">
                  Task Details
                </h3>
                <div className="bg-gray-50 darkdummy:bg-gray-700 p-4 rounded-md">
                  <h4 className="text-xl font-medium mb-2 text-gray-800 darkdummy:text-white">{task.title}</h4>
                  <p className="text-gray-600 darkdummy:text-gray-300 mb-4">{task.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">Budget</p>
                      <p className="font-medium text-gray-800 darkdummy:text-gray-200">{task.budget} {task.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">Deadline</p>
                      <p className="font-medium text-gray-800 darkdummy:text-gray-200">{formatDate(task.deadline)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">Category</p>
                      <p className="font-medium text-gray-800 darkdummy:text-gray-200 uppercase">{task.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">Status</p>
                      <p className="font-medium text-gray-800 darkdummy:text-gray-200">{task.status}</p>
                    </div>
                  </div>
                  
                  {task.tags && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400 mb-1">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.split(',').map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Developer information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 darkdummy:text-white mb-2 border-l-4 border-green-500 pl-3">
                  Developer Profile
                </h3>
                <div className="bg-gray-50 darkdummy:bg-gray-700 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 mr-4">
                      {developer.avatar ? (
                        <img src={developer.avatar} alt={developer.name} className="w-full h-full rounded-full" />
                      ) : (
                        <FaUser className="w-full h-full text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 darkdummy:text-white">{developer.name}</h4>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">{developer.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {developer.github && (
                      <a href={developer.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 darkdummy:hover:text-gray-300">
                        <FaGithub className="h-5 w-5" />
                      </a>
                    )}
                    {developer.linkedin && (
                      <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 darkdummy:hover:text-gray-300">
                        <FaLinkedin className="h-5 w-5" />
                      </a>
                    )}
                    {developer.resume && (
                      <a href={developer.resume} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 darkdummy:hover:text-gray-300">
                        <FaFileAlt className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Application details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 darkdummy:text-white mb-2 border-l-4 border-purple-500 pl-3">
                  Application Information
                </h3>
                <div className="bg-gray-50 darkdummy:bg-gray-700 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500 darkdummy:text-gray-400">Submitted on</p>
                      <p className="font-medium text-gray-800 darkdummy:text-gray-200">{formatDate(createdAt)}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 darkdummy:text-gray-400 mb-1">Proposal</p>
                    <div className="p-3 bg-white darkdummy:bg-gray-800 border border-gray-200 darkdummy:border-gray-600 rounded-md">
                      <p className="text-gray-700 darkdummy:text-gray-300 whitespace-pre-wrap">{proposal}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 darkdummy:bg-gray-700 darkdummy:hover:bg-gray-600 text-gray-800 darkdummy:text-white rounded-md transition-colors"
                >
                  Close
                </button>
                
                {status === 'APPLIED' && (
                  <button 
                    onClick={handleWithdrawClick}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Withdraw Application'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Withdrawal Confirmation Dialog */}
            {isWithdrawConfirmOpen && (
              <div 
                className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-70"
                onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white darkdummy:bg-gray-800 rounded-lg p-6 max-w-md w-full m-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
                >
                  <h3 className="text-xl font-semibold text-gray-800 darkdummy:text-white mb-4">Confirm Withdrawal</h3>
                  <p className="text-gray-600 darkdummy:text-gray-300 mb-6">
                    Are you sure you want to withdraw your application for this task? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelWithdraw}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 darkdummy:bg-gray-700 darkdummy:hover:bg-gray-600 text-gray-800 darkdummy:text-white rounded-md transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmWithdraw}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {isLoading ? 'Processing...' : 'Yes, Withdraw'}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationDetailsModal;