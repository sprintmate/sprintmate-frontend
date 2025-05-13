import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import {
  Briefcase, Clock, DollarSign, Calendar, ExternalLink, ChevronDown,
  Check, X, AlertCircle, Filter, Search, Loader2, Sparkles, User,Paperclip,
  ArrowRight, Github, Linkedin, Code, MessageSquare, Tag, FileCode
} from 'lucide-react';
import { getToken } from '../../services/authService';
import {
  TaskApplicationStatus,
  STATUS_LABELS,
  getAllowedTransitions,
  canRoleUpdateStatus,
  STATUS_DIALOG_CONFIG,
} from '../../constants/taskApplicationStatus';

import { authUtils } from '../../utils/authUtils';
import { updateApplicationStatus,withdrawApplication } from '../../api/taskApplicationService';
import { ApplicationStatus } from '../../constants/ApplicationStatus';

import { ConfirmationDialog } from '../ui/ConfirmationDialogue';
import SecureDocumentViewer from '../DocumentViewer';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported


// Status badge component with appropriate styling for each status
const StatusBadge = ({ status }) => {
  // Define styling based on status
  const statusConfig = {
    'APPLIED': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Clock className="w-3 h-3 mr-1" /> },
    'ACCEPTED': { color: 'bg-green-50 text-green-700 border-green-200', icon: <Check className="w-3 h-3 mr-1" /> },
    'REJECTED': { color: 'bg-red-50 text-red-700 border-red-200', icon: <X className="w-3 h-3 mr-1" /> },
    'WITHDRAWN': { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: <X className="w-3 h-3 mr-1" /> },
    'COMPLETED': { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Check className="w-3 h-3 mr-1" /> },
    'IN_PROGRESS': { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" /> }
  };

  const { color, icon } = statusConfig[status] || statusConfig['APPLIED'];

  return (
    <Badge className={`${color} flex items-center px-2 py-1`} variant="outline">
      {icon}
      {status.replace('_', ' ')}
    </Badge>
  );
};

// Application card component
const ApplicationCard = ({ application, index, onStatusUpdate }) => {
  const navigate = useNavigate(); // Hook for navigation
  const { task, externalId: applicationId } = application;
  const taskId = task?.externalId;

  const [isExpanded, setIsExpanded] = useState(false);
  // const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null); // e.g., 'WITHDRAWN'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { status, createdAt } = application;
  const role = authUtils.getUserProfile().role;
  console.log("role fetched from user profile ", role);
  const [attachedDocs, setAttachedDocs] = useState([]);

  // Check if required data exists and provide fallbacks
  if (!application || !application.task) {
    return null; // Don't render anything if application or task is missing
  }

  // Ensure task has required properties with fallbacks
  const safeTask = {
    title: task?.title || "Untitled Project",
    description: task?.description || "No description provided",
    budget: task?.budget || 0,
    currency: task?.currency || "INR",
    deadline: task?.deadline || null,
    tags: task?.tags || "",
    externalId: task?.externalId || `temp-${Date.now()}-${index}`,
    status: task?.status || "OPEN",
    expectedEarnings: application.expectedEarnings
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';

    try {
      // Check if it's already in the right format
      if (dateString.includes(' ')) {
        // Format: "2025-06-03 18:30:00"
        const [datePart, timePart] = dateString.split(' ');
        const date = new Date(`${datePart}T${timePart}`);
        if (isNaN(date.getTime())) throw new Error("Invalid date");

        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // If it's in ISO format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.warn(`Error formatting date: ${dateString}`, error);
      return 'Invalid date';
    }
  };

  // Extract tags from task
  const getTags = () => {
    if (!safeTask.tags) return [];
    return safeTask.tags.split(',').map(tag => tag.trim());
  };

  // Handle withdraw application
  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    setError(null);

    try {

      if(newStatus === ApplicationStatus.WITHDRAWN) {
        const response = await withdrawApplication(taskId,applicationId);
        console.log('Withdraw response:', response);

      } else {
        const updatePayload = {
          status: newStatus,
          taskAttachments: attachedDocs
        }
        const response = await updateApplicationStatus(taskId,applicationId,updatePayload);
        console.log('update application response:', response);

      }
      // Close dialog
      // setIsWithdrawDialogOpen(false);
       setPendingStatus(null);

      // Update parent component with new status
      if (onStatusUpdate) {
        onStatusUpdate(applicationId, newStatus);
      }
    } catch (error) {
      console.error('Error updating application status :', error);
      setError(error.response?.data?.message || 'Failed to update application');
      // Don't auto-close on error so user can see the error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      layout
    >
      <Card className={`overflow-hidden border-l-4 transition-all ${status === 'ACCEPTED' ? 'border-l-green-500' :
        status === 'REJECTED' ? 'border-l-red-500' :
          status === 'WITHDRAWN' ? 'border-l-gray-500' :
            status === 'COMPLETED' ? 'border-l-purple-500' :
              status === 'IN_PROGRESS' ? 'border-l-amber-500' :
                'border-l-blue-500'
        }`}>
        <CardContent className="p-0">
          {/* Card Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900">{safeTask.title}</h3>
                <div className="flex items-center text-sm text-gray-500 gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Applied on {formatDate(createdAt)}</span>
                  <span className="text-gray-300">•</span>
                  <span>Due {formatDate(safeTask.deadline)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {getTags().map((tag, i) => (
                <Badge key={i} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CurrencyFormatter currency={safeTask.currency}>
                  {safeTask.expectedEarnings}
                </CurrencyFormatter>
                {/* <DollarSign className="w-3 h-3 mr-1" /> */}
                {/* {safeTask.budget} {safeTask.currency} */}
              </Badge>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5">
            <div className="space-y-4">
              {/* Project Description - Collapsed by default */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm text-gray-700">Project Description</h4>
                </div>
                <p className={`text-gray-600 text-sm`}>
                  {safeTask.description}
                </p>
              </div>



              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* My Proposal */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">My Proposal</h4>
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-sm text-gray-700">
                        <p className="italic">{proposal || '-'}</p>
                      </div>
                    </div>


                     {/* Attachments */}
                     {Array.isArray(application.taskAttachments) && application.taskAttachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <Paperclip size={14} className="mr-1.5" /> Attachments
                          </div>
                          <div className="space-y-4">
                            {application.taskAttachments.map((id) => (
                              <SecureDocumentViewer key={id} documentId={id} />
                            ))}
                          </div>
                        </div>
                      )}


                    {/* Additional details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {/* <div>
                        <h4 className="font-medium text-gray-700 mb-1">Task ID</h4>
                        <p className="text-gray-600 break-all">{safeTask.externalId}</p>
                      </div> */}
                       <div>
                        <h4 className="font-medium text-gray-700 mb-1">Task ETA</h4>
                        <p className="text-gray-600 break-all">{formatDate(safeTask.deadline)}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">Category</h4>
                        <p className="text-gray-600">{task.category.toUpperCase()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'Show less' : 'Show more'}
            </button>

            <div className="flex gap-2">
              {/* View Details Button */}
              <Button
                size="sm"
                className="gap-1"
                onClick={() => navigate(`/developer/dashboard/applications/${taskId}/${applicationId}`)}
              >
                View Details
                <ArrowRight className="w-3 h-3" />
              </Button>

              {/* Dynamic Status Transition Buttons */}
              {getAllowedTransitions(status)
                .filter((nextStatus) => canRoleUpdateStatus(role, nextStatus))
                .map((nextStatus) => (
                  <Button
                    key={nextStatus}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPendingStatus(nextStatus);
                      setError(null);
                    }}
                  >
                    {STATUS_LABELS[nextStatus] || `Move to ${nextStatus}`}
                  </Button>
                ))}
            </div>


          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {pendingStatus && (
          <ConfirmationDialog
            isOpen={!!pendingStatus}
            onClose={() => {
              setPendingStatus(null);
              setError(null);
            }}
            onConfirm={(e) => {
              e?.stopPropagation?.();
              handleStatusChange(pendingStatus);
            }}
            title={STATUS_DIALOG_CONFIG[pendingStatus]?.title || "Confirm Action"}
            message={error || STATUS_DIALOG_CONFIG[pendingStatus]?.message || ""}
            confirmText={STATUS_DIALOG_CONFIG[pendingStatus]?.confirmText || "Confirm"}
            isLoading={isLoading}
            // showSubmitDocuments={pendingStatus===TaskApplicationStatus.SUBMITTED}
            showSubmitDocuments={true}
            setAttachedDocs={setAttachedDocs}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// Empty state component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 px-4"
  >
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <Briefcase className="h-8 w-8 text-blue-500" />
    </div>
    <h3 className="text-xl font-medium text-gray-900">No applications yet</h3>
    <p className="mt-2 text-gray-600 max-w-sm mx-auto">
      You haven't applied to any projects yet. Browse available projects and start applying!
    </p>
    <Button className="mt-6 bg-blue-600 hover:bg-blue-700 gap-2">
      <Search size={16} />
      Browse Projects
    </Button>
  </motion.div>
);

// Loading state component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative w-20 h-20">
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-blue-200"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="text-blue-600 w-8 h-8" />
      </motion.div>
    </div>
    <p className="mt-4 text-gray-600 font-medium">Loading your applications...</p>
  </div>
);

// Error state component
const ErrorState = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center max-w-md mx-auto my-8"
  >
    <AlertCircle className="text-red-500 w-10 h-10 mb-4" />
    <h3 className="font-medium text-red-700 text-lg mb-2">Error Loading Applications</h3>
    <p className="text-center text-red-600 mb-4">
      {error || "We couldn't load your applications. Please try again."}
    </p>
    <Button onClick={onRetry} variant="outline" className="border-red-300 hover:bg-red-100">
      Try Again
    </Button>
  </motion.div>
);

// Filter component
const ApplicationFilter = ({ activeFilter, setActiveFilter, count }) => {
  const filters = [
    { id: 'all', label: 'All', count },
    { id: 'APPLIED', label: 'Applied' },
    { id: 'ACCEPTED', label: 'Accepted' },
    { id: 'REJECTED', label: 'Rejected' },
    { id: 'WITHDRAWN', label: 'Withdrawn' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
  ];

  return (
    <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter(filter.id)}
          className={`gap-2 ${activeFilter === filter.id
            ? "bg-blue-600"
            : "hover:bg-blue-50 hover:text-blue-700 border-gray-200"
            }`}
        >
          {filter.label}
          {filter.count !== undefined && (
            <Badge variant="outline" className={`${activeFilter === filter.id
              ? "bg-blue-700 text-white border-blue-800"
              : "bg-gray-100 text-gray-700 border-gray-200"
              }`}>
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

// Main component
const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch applications from API
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://round-georgianna-sprintmate-8451e6d8.koyeb.app';
      const response = await axios.get(`${baseUrl}/v1/developers/applications`, {
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `${token}`
        },
        // Add timeout to prevent hanging requests
        timeout: 15000
      });

      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.content)) {
        setApplications(response.data.content);
        setFilteredApplications(response.data.content);
      } else {
        console.warn("API response doesn't have expected format:", response.data);
        // Set as empty array rather than breaking
        setApplications([]);
        setFilteredApplications([]);
        setError("Received unexpected data format. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to load applications");
      // Ensure states are still set properly even when error occurs
      setApplications([]);
      setFilteredApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications based on active filter and search query
  useEffect(() => {
    if (!applications.length) return;

    let filtered = [...applications];

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(app => app.status === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.task.title.toLowerCase().includes(query) ||
        app.task.description.toLowerCase().includes(query) ||
        (app.task.tags && app.task.tags.toLowerCase().includes(query))
      );
    }

    setFilteredApplications(filtered);
  }, [activeFilter, searchQuery, applications]);

  // Handle application status update
  const handleStatusUpdate = (applicationId, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.externalId === applicationId ? { ...app, status: newStatus } : app
    );

    setApplications(updatedApplications);

    // This will trigger the useEffect to filter applications
    // based on the updated applications array
  };

  // Display appropriate state
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchApplications} />;
  if (!applications.length) return <EmptyState />;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track and manage your project applications with ease.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
          />
        </div>
      </div>

      {/* Status Filters */}
      <ApplicationFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        count={applications.length}
      />

      {/* Applications List */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={fetchApplications} />
        ) : applications.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence>
            {filteredApplications.length > 0 ? (
              <motion.div layout className="space-y-6">
                {filteredApplications.map((application, index) => (
                  <ApplicationCard
                    key={application.externalId}
                    application={application}
                    index={index}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Filter className="text-gray-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching applications</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
