import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SendHorizonal, CheckCircle2, AlertCircle, Loader2, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { authUtils } from '@/utils/authUtils';


const TaskApplicationModal = ({ isOpen, onClose, taskId, onSuccess }) => {
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;
  const { toast } = useToast();
  
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setProposal('');
      setError(null);
      setSuccess(false);
      setCharCount(0);
    }
  }, [isOpen]);
  
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };
  
  const handleProposalChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setProposal(text);
      setCharCount(text.length);
    }
  };

  const handleSubmit = async () => {
    if (proposal.trim().length < 10) {
      setError('Please provide a detailed proposal of at least 10 characters.');
      
      // Show toast notification for better user feedback
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Your proposal must be at least 10 characters long.",
        duration: 3000,
      });
      return;
    }

    console.log("Applying for application")
    
    setLoading(true);
    setError(null);
    
    try {
      // Get developer ID from local storage with error handling
      const userProfileStr = localStorage.getItem('userProfile');
      if (!userProfileStr) {
        throw new Error('User profile not found. Please log in again.');
      }
      
      let userProfile;
      try {
        userProfile = JSON.parse(userProfileStr);
      } catch (err) {
        console.error("Error parsing user profile:", err);
        throw new Error('Invalid user profile data. Please log in again.');
      }
      
      if (!userProfile) {
        throw new Error('User profile is empty. Please log in again.');
      }
      
      let developerId;
      
      // Extract developerId from the profile with fallbacks
      if (userProfile.developerProfiles && userProfile.developerProfiles.length > 0) {
        developerId = userProfile.developerProfiles[0].externalId;
      } else if (userProfile.userId) {
        developerId = userProfile.userId;
      } else if (userProfile.externalId) {
        developerId = userProfile.externalId;
      } else {
        throw new Error('Developer ID not found in profile. Please update your profile.');
      }
      
      // Get auth token
      const token = authUtils.getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Validate taskId
      if (!taskId) {
        throw new Error('Task ID is missing. Please try again.');
      }
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL ;
      
      // Make API call to apply for the task
      const response = await axios.post(
        `${baseUrl}/v1/tasks/${taskId}/apply`,
        {
          developerId,
          proposal
        },
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          // Add timeout to prevent hanging requests
          timeout: 15000
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        // Wait a moment before closing to show success animation
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (err) {
      console.error('Error applying for task:', err);
      
      // Provide user-friendly error messages based on specific errors
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid request. Please check your information and try again.");
      } else if (err.response?.status === 409) {
        setError("You have already applied to this task.");
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0 cursor-auto">
          {/* Backdrop - make sure cursor is visible here */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-auto"
            onClick={handleClose}
          />
          
          {/* Modal - ensure cursor is visible */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden cursor-auto"
          >
            {/* Decorative header */}
            <div className="h-3 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden cursor-auto">
              <motion.div 
                className="absolute inset-0 bg-white opacity-30 cursor-auto"
                animate={{ 
                  x: ['-100%', '100%'],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "linear"
                }}
              />
            </div>
            
            {/* Close button - ensure cursor is visible */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="p-6 cursor-auto">
              <div className="text-center mb-6 cursor-auto">
                {success ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">Application Submitted!</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Your application has been successfully submitted. You'll be notified if the client responds.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 cursor-auto">
                      <FileText size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-auto">Apply for Project</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 cursor-auto">
                      Explain why you're a great fit for this project and what makes you stand out.
                    </p>
                  </>
                )}
              </div>
              
              {!success && (
                <>
                  {/* Tips section - ensure cursor is visible */}
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg cursor-auto">
                    <div className="flex gap-2">
                      <Sparkles className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Application Tips</h4>
                        <ul className="mt-1 text-xs text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Highlight relevant experience and skills</li>
                          <li>• Mention your approach to the project</li>
                          <li>• Set clear expectations about your availability</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form - ensure cursor is visible */}
                  <div className="space-y-4 cursor-auto">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursor-auto">
                        Your Proposal
                      </label>
                      <div className="relative cursor-text">
                        <Textarea
                          value={proposal}
                          onChange={handleProposalChange}
                          placeholder="I would be a great fit for this project because..."
                          className="w-full min-h-[140px] rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 cursor-text"
                          disabled={loading}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 cursor-auto">
                          {charCount}/{maxChars}
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg cursor-auto">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                          <AlertCircle size={16} className="flex-shrink-0" />
                          <span className="text-sm">{error}</span>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || proposal.trim().length < 10}
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <SendHorizonal size={16} />
                          <span>Submit Application</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskApplicationModal;
