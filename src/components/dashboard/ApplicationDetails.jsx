import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getToken } from '../../services/authService';

import {
  User, Calendar, Clock, ChevronLeft, Award,
  Briefcase, CheckCircle, XCircle, Filter, Search,
  DollarSign, Star, Download, ArrowUpRight,
  MessageSquare, FileText, AlertCircle, ExternalLink,
  ChevronRight, Send, X, Phone, Video, MoreVertical,
  Paperclip, Smile, Image, ChevronDown, Play, Pause
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import image3 from "../../assets/image3.webp";
import ChatPanel from '../common/ChatPanel';
import RazorpayPayment from '../common/RazorpayPayment';
import { updateApplicationStatus, acceptApplicationStatus, getTaskApplications } from '../../api/taskApplicationService';

import { refundPayment, cancelPayment } from '../../api/paymentService';

import { getDeveloperProfileRedirectionPath, reloadPage } from '../../utils/applicationUtils';
import { ApplicationStatus } from '../../constants/ApplicationStatus';
import { authUtils } from '../../utils/authUtils';

import {
  TaskApplicationStatus,
  Role,
  STATUS_LABELS,
  getAllowedTransitions,
  canRoleUpdateStatus,
  STATUS_DIALOG_CONFIG
} from '../../constants/taskApplicationStatusMachine';

import SecureDocumentViewer from '../DocumentViewer';
import { getChatRedirectionPath } from '../chat/Rooms';
import ProfilePicViewer from '../common/ProfilePicViewer';
import CurrencyFormatter from '../ui/CurrencyFormatter';

const STATUS_MAP = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} className="mr-1" /> },
  applied: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} className="mr-1" /> },
  accepted: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} className="mr-1" /> },
  hired: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} className="mr-1" /> },
  rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle size={14} className="mr-1" /> },
  withdrawn: { color: 'bg-red-100 text-red-800', icon: <XCircle size={14} className="mr-1" /> },
  shortlisted: { color: 'bg-blue-100 text-blue-800', icon: <Star size={14} className="mr-1" /> },
  interviewing: { color: 'bg-purple-100 text-purple-800', icon: <MessageSquare size={14} className="mr-1" /> },
};

const formatStatusLabel = (status) => {
  return status
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Unknown';
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();
  const { color, icon } = STATUS_MAP[normalizedStatus] || {
    color: 'bg-blue-100 text-blue-800',
    icon: <FileText size={14} className="mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {formatStatusLabel(status)}
    </span>
  );
};


// Enhanced Avatar component with image3 fallback
const SimpleAvatar = ({ name, profilePicture, className = "h-12 w-12" }) => {
  if (profilePicture) {
    return (
      <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
        <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Use image3 as fallback if no profile picture
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <img src={image3} alt={name || "Developer"} className="w-full h-full object-cover" />
    </div>
  );
};

const ApplicationCard = ({ application, onViewDetails }) => {
  return (
    <Card className="mb-4 border-gray-200 hover:border-blue-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <SimpleAvatar
              name={application.applicant.name}
              profilePicture={application.applicant.profilePicture}
            />

            <div>
              <h3 className="font-medium text-gray-900">{application.applicant.name}</h3>
              <div className="text-sm text-gray-500">{application.applicant.title || 'Software Developer'}</div>

              <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  Applied {new Date(application.submittedAt).toLocaleDateString()}
                </div>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= (application.rating || 0) ? "currentColor" : "none"}
                    className={star <= (application.rating || 0) ? "text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{application.rating || '4.5'}</span>
            </div>
            <div className="text-sm font-medium text-blue-600">
              ${application.hourlyRate || '50'}/hr
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700">Skills</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {(application.applicant.skills || ['React', 'Node.js', 'TypeScript']).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-blue-50 border-blue-100">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {application.coverLetter ? application.coverLetter.substring(0, 60) + '...' : 'No cover letter provided'}
          </div>

          <Button variant="outline" size="sm" className="text-blue-600" onClick={() => onViewDetails(application.id)}>
            View Details
            <ArrowUpRight size={14} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Create a simple tabs component
const SimpleTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`px-4 py-2 text-sm font-medium ${activeTab === tab.value
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Main ApplicationDetails component
const ApplicationDetails = () => {
  const { taskId } = useParams();

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based pagination
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [pendingStatus, setPendingStatus] = useState(null); // e.g., 'WITHDRAWN'

  const role = authUtils.getUserProfile().role;


  // Add state for chat panel
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatDeveloper, setActiveChatDeveloper] = useState(null);

  // Add state for payment success
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const url = import.meta.env.VITE_API_BASE_URL

  const token = getToken()

  // Fetch applications for the task
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          size: 20,
          page: 0,
          sort: 'updatedAt,desc'
        });
        const response = await getTaskApplications(taskId, queryParams);
        console.log(response);

        // Extract applications from the paginated response
        const { content, totalPages: totalPagesFromApi, totalElements } = response.data;

        // If we have at least one application, set the task from the first application
        if (content && content.length > 0) {
          setTask(content[0].task);
        }

        setApplications(content || []);
        setTotalPages(totalPagesFromApi || 1);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchApplications();
    }
  }, [taskId, token, currentPage, pageSize]);

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    // We need to check if developer has name property or use externalId as fallback
    const developerName = app.developer?.name || app.developer?.externalId || '';
    const nameMatch = developerName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || app.status?.toUpperCase() === statusFilter.toUpperCase();
    return nameMatch && statusMatch;
  });

  // Handle application details view
  const handleViewDetails = (applicationId) => {
    const application = applications.find(app => app.externalId === applicationId);
    setSelectedApplication(application);
  };

  // Handle going back to dashboard - Updated to use browser history
  const handleBackToDashboard = () => {
    // Use browser's history to go back to the previous page
    // This ensures we respect the navigation path the user took to get here
    navigate('/company/dashboard/tasks');
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    // API pagination is 0-based
    setCurrentPage(newPage);
  };

  // Updated function to handle application status updates
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setIsLoading(true);
      await updateApplicationStatus(taskId, applicationId, { status: newStatus });
      reloadPage();
      // Show success message
      console.log(`Application ${applicationId} updated to ${newStatus}`);

    } catch (err) {
      console.error('Error updating application status:', err);
      // Show error message
      console.error('Failed to update application status:', err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenChat = (app) => {
    const taskId = app.task.externalId;
    const applicationId = app.externalId;
    const url = getChatRedirectionPath(taskId, applicationId);
    navigate(url);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log("handlePaymentSuccess payment data ", paymentData)
      reloadPage();
      const response = await acceptApplicationStatus(paymentData.taskId, paymentData.applicationId);
      if (response) {
        setPaymentSuccessful(true);
      } else {
        setPaymentSuccessful(false);
        const refundPaymentResponse = refundPayment(paymentData.paymentId);
        console.log("payment refunded {}", refundPaymentResponse);
        // refund payment to user again
      }
      // You could add a toast notification here
      console.log('Payment successful!', paymentData);
    } catch (error) {
      const cancelResponse = await cancelPayment(paymentData.paymentId);
      console.log("payment cancelPayment {}", cancelResponse);
      console.error('Error updating application status after payment', error);
    }
  };

  // Handle payment error
  const handlePaymentError = (error) => {
    console.error('Payment failed', error);
    // You could add a toast notification here
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" className="mr-2" onClick={handleBackToDashboard}>
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading applications...</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-5">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" className="mr-2" onClick={handleBackToDashboard}>
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Applications</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-4" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading Applications</h3>
              <p className="text-red-600">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-50">
      {/* Enhanced Header section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="ghost" size="sm" className="mr-2 hover:bg-blue-50" onClick={handleBackToDashboard}>
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{task?.title || 'Task Applications'}</h1>
            <p className="text-gray-500 flex items-center">
              <Briefcase size={14} className="mr-1.5" />
              {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
            </p>
          </div>
        </div>

        {/* <div className="flex gap-2">
          <Button variant="outline" className="gap-1 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            <Download size={16} />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-1 shadow-sm">
            <Briefcase size={16} />
            Post Similar Job
          </Button>
        </div> */}
      </div>

      {/* Enhanced Task info card */}
      {task && (
        <Card className="mb-6 border-blue-100 bg-gradient-to-r from-blue-50/40 to-indigo-50/40 overflow-hidden relative shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full -mr-16 -mt-16 z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <FileText size={14} className="mr-1.5" /> Task Status
                </h3>
                <StatusBadge status={task.status || 'OPEN'} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  {/* <DollarSign size={14} className="mr-1.5" />  */}

                  <CurrencyFormatter currency={task.currency} className='mr-1.5' >
                  </CurrencyFormatter> Budget
                </h3>
                <p className="text-gray-900 font-medium">
                  {task.budget ? `${task.budget} ${task.currency || ''}` : 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Calendar size={14} className="mr-1.5" /> Deadline
                </h3>
                <p className="text-gray-900 font-medium">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Award size={14} className="mr-1.5" /> Tags
                </h3>
                <div className="flex flex-wrap gap-1">
                  {task.tags ? task.tags.split(',').map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 border-blue-100">
                      {tag.trim()}
                    </Badge>
                  )) : (
                    <span className="text-gray-500">No tags</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Filters and search section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search applicants..."
            className="pl-8 border-gray-200 focus:border-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-gray-200 focus:border-blue-300">
              <div className="flex items-center">
                <Filter size={14} className="mr-2 text-gray-500" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
              <SelectItem value="HIRED">Hired</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Tabs */}
      {/* <div className="bg-white rounded-t-lg shadow-sm border border-gray-100 border-b-0">
        <SimpleTabs
          tabs={[

            { value: 'all', label: `All Applications (${applications.length})` },
            { value: 'SHORTLISTED', label: `Shortlisted (${applications.filter(a => a.status === 'SHORTLISTED').length})` },
            { value: 'INTERVIEWING', label: `Interviewed (${applications.filter(a => a.status === 'INTERVIEWING').length})` },
            { value: 'HIRED', label: `Hired (${applications.filter(a => a.status === 'HIRED').length})` }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div> */}

      {/* Application list with enhanced UI */}
      <div className="bg-white rounded-b-lg p-6 shadow-sm border border-gray-100 mb-6">
        {filteredApplications.length > 0 ? (
          <div className="space-y-5">
            {filteredApplications.map(application => (
              <Card key={application.externalId} className="transition-all duration-200 hover:shadow-md border border-gray-200 overflow-hidden bg-white">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left sidebar with developer info */}
                    <div className="bg-gray-50 p-5 md:w-1/4 border-r border-gray-100 flex flex-col items-center justify-center space-y-3">
                      <ProfilePicViewer
                        documentId={application?.developer?.portfolio?.PROFILE_PIC}
                        developerName={application?.developer?.developerName || ''}
                        className="h-20 w-20"
                      />
                      <div className="text-center">
                        <a
                          href={getDeveloperProfileRedirectionPath(application.developer.externalId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gray-900 hover:underline"
                        >
                          <h3 className="font-semibold text-gray-900">
                            {application.developer.developerName}
                          </h3>
                        </a>

                        <div className="text-sm text-gray-500 mt-1">
                          {application.developer?.about?.substring(0, 30) || 'Developer'}
                          {application.developer?.about?.length > 30 ? '...' : ''}
                        </div>
                      </div>
                      <div className="flex justify-center space-x-2 mt-2">
                        {application.developer?.portfolio?.GITHUB && (
                          <a href={application.developer.portfolio.GITHUB} target="_blank" rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                          </a>
                        )}
                        {application.developer?.portfolio?.LINKEDIN && (
                          <a href={application.developer.portfolio.LINKEDIN} target="_blank" rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                              <rect x="2" y="9" width="4" height="12"></rect>
                              <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Main content area */}
                    <div className="p-5 flex-1">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          {/* Skills */}
                          <div className="mb-3">
                            <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <Award size={14} className="mr-1.5" /> Skills
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {(application.developer?.skills?.split(',') || []).map((skill, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-blue-50 border-blue-100 shadow-sm">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Application info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1.5" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                            <StatusBadge status={application.status} />

                            <div className="flex items-center">
                              <Clock size={14} className="mr-1.5" />
                              {application.developer?.availability?.replace('_', ' ') || 'Not specified'}
                            </div>
                            <div className="flex items-center">
                              <Briefcase size={14} className="mr-1.5" />
                              {application.developer?.preferredWorkType?.replace('_', ' ') || 'Not specified'}
                            </div>
                          </div>
                        </div>

                        {/* Resume button */}
                        {application.developer?.portfolio?.LATEST_RESUME && (
                          <div className="md:text-right my-3 md:my-0">
                            <a
                              href={`${url}/v1/files/${application.developer.portfolio.LATEST_RESUME}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-md border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <Download size={14} className="mr-1.5" />
                              Resume
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Proposal */}
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <MessageSquare size={14} className="mr-1.5" /> Proposal
                        </div>
                        <div className="text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 text-sm">
                          {application.proposal || 'No proposal provided'}
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

                      {/* Action buttons with Accept option for SHORTLISTED */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                        {getAllowedTransitions(application.status)
                          .filter((nextStatus) => canRoleUpdateStatus(role, nextStatus))
                          .map((nextStatus) => (
                            <Button
                              key={nextStatus}
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(application.externalId, nextStatus)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <div className="animate-spin mr-1.5 h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                                  Loading...
                                </div>
                              ) : (
                                <>
                                  <XCircle size={14} className="mr-1.5" />
                                  {STATUS_LABELS[nextStatus] || `Move to ${nextStatus}`}
                                </>
                              )}
                            </Button>
                          ))}



                        {application.status !== TaskApplicationStatus.WITHDRAWN && (
                          <div className="flex space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 animate-pulse-subtle"
                              onClick={() => handleOpenChat(application)}
                            >
                              <MessageSquare size={14} className="mr-1.5" />
                              Chat with Developer
                            </Button>

                          </div>
                        )}


                        {application.status === TaskApplicationStatus.SHORTLISTED && (
                          <div className="flex space-x-3">
                            <RazorpayPayment
                              applicationId={application.externalId}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              buttonClassName="bg-green-600 hover:bg-green-700 text-white border-green-700"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="inline-flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
                    disabled={currentPage === 0}
                    className="px-3 py-2 border-r border-gray-200 rounded-none rounded-l-md focus:z-10"
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    // Show current page and adjacent pages for larger page counts
                    let pageNumber = i;
                    if (totalPages > 5) {
                      if (currentPage < 3) {
                        pageNumber = i;
                      } else if (currentPage > totalPages - 3) {
                        pageNumber = totalPages - 5 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                    }

                    return (
                      <button
                        key={pageNumber}
                        className={`px-4 py-2 text-sm font-medium ${currentPage === pageNumber
                          ? 'bg-blue-50 text-blue-600 border-r border-gray-200 focus:z-10'
                          : 'text-gray-700 border-r border-gray-200 hover:bg-gray-50 focus:z-10'
                          }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  })}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 py-2 rounded-none rounded-r-md focus:z-10"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="w-full border-dashed border-2 bg-gray-50">
            <CardContent className="p-10 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : 'You haven\'t received any applications for this task yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-blue-600 hover:bg-blue-700 gap-1 shadow-sm">
                  <ExternalLink size={16} />
                  Share Job Posting
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat panel */}
      <ChatPanel
        user={activeChatDeveloper}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        apiBaseUrl={url}
      />

      {/* Payment success notification */}
      {paymentSuccessful && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-start space-x-3 z-50 max-w-md">
          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-800">Payment Successful</h3>
            <p className="text-green-600 text-sm">Your payment has been processed and the application has been accepted.</p>
            <Button
              variant="link"
              className="text-xs p-0 h-auto text-green-700"
              onClick={() => setPaymentSuccessful(false)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add the pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  .animate-pulse-subtle {
    animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;
document.head.appendChild(style);

export default ApplicationDetails;
