import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Clock, DollarSign, Calendar, X, Check, Loader2, ArrowRight, Tag, FileCode, Paperclip, XCircle } from 'lucide-react';
import { getToken } from '../../services/authService';
import axios from 'axios';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { capitalizeWords, formatDate, getCompanyProfileRedirectionPath, getDeveloperProfileRedirectionPath } from '../../utils/applicationUtils';
import { authUtils } from '../../utils/authUtils';
import { updateApplicationStatus, withdrawApplication } from '../../api/taskApplicationService';
import { ApplicationStatus } from '../../constants/ApplicationStatus';
import { ConfirmationDialog } from '../ui/ConfirmationDialogue';
import SecureDocumentViewer from '../DocumentViewer';
import {
  getAllowedTransitions,
  TaskApplicationStatus,
  Role,
  STATUS_LABELS,
  canRoleUpdateStatus,
  STATUS_DIALOG_CONFIG
} from '../../constants/taskApplicationStatusMachine';

import { reloadPage } from '../../utils/applicationUtils';

const ApplicationTaskDetails = () => {
  const { taskId, applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState([]);

  // Fetch application details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${taskId}/applications/${applicationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) {
          setApplication(response.data);
        } else {
          setError('Application not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load application details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [taskId, applicationId]);

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      if (newStatus === ApplicationStatus.WITHDRAWN) {
        await withdrawApplication(taskId, applicationId);
      } else {
        const updatePayload = {
          status: newStatus,
          taskAttachments: attachedDocs
        };
        await updateApplicationStatus(taskId, applicationId, updatePayload);
      }

      setPendingStatus(null);

      // Refetch application details
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/developers/applications/${applicationId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setApplication(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Link to="/developer/dashboard/applications">
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const { task, status, createdAt, proposal } = application;
  const role = authUtils.getUserProfile().role;

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

  const statusColors = {
    "APPLIED": "blue",
    "ACCEPTED": "green",
    "REJECTED": "red",
    "WITHDRAWN": "gray",
    "COMPLETED": "purple",
    "IN_PROGRESS": "amber"
  };

  const statusIcons = {
    "APPLIED": <Clock className="w-4 h-4 text-blue-600" />,
    "ACCEPTED": <Check className="w-4 h-4 text-green-600" />,
    "REJECTED": <X className="w-4 h-4 text-red-600" />,
    "WITHDRAWN": <X className="w-4 h-4 text-gray-600" />,
    "COMPLETED": <Check className="w-4 h-4 text-purple-600" />,
    "IN_PROGRESS": <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
  };

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


  return (
    <div className="px-4 md:px-6 max-w-6xl mx-auto py-8">
      {/* Application Details Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Application Details
          </h1>
          <p className="mt-1 text-gray-600">
            Status:{" "}
            <Badge className={`bg-${statusColors[status]}-50 text-${statusColors[status]}-700 border-${statusColors[status]}-200`} variant="outline">
              {statusIcons[status]}
              {status.replace('_', ' ')}
            </Badge>
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowRight size={16} />
            Back
          </Button>
        </div> */}
      </div>

      {/* Task and Applicant Details */}
      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Task Details
              </h2>
              <div className="space-y-2">
                <a
                  href={getCompanyProfileRedirectionPath(application.companyProfile.companyId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 rounded-md transition"
                >
                  <div className="cursor-pointer px-2 py-1">
                    <span className="text-gray-500 text-sm">Posted By</span>
                    <h3 className="text-gray-900 font-medium hover:text-blue-600 underline underline-offset-2">
                      {capitalizeWords(application?.companyProfile?.companyName)}
                    </h3>
                  </div>
                </a>

                <div>
                  <span className="text-gray-500 text-sm">Title</span>
                  <h3 className="text-gray-900 font-medium">{task.title}</h3>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Description</span>
                  <p className="text-gray-700">{task.description}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Budget</span>
                  <p className="text-gray-700">
                    <CurrencyFormatter currency={task.currency}>
                      {task.budget}
                    </CurrencyFormatter>
                  </p>

                </div>

                {application.expectedEarnings > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">
                      Estimated Earnings:{" "}
                      <p className="text-gray-700" >
                        <CurrencyFormatter currency={task.currency}>
                          {application.expectedEarnings}
                        </CurrencyFormatter>
                      </p>
                    </span>
                  </div>
                )}


                <div>
                  <span className="text-gray-500 text-sm">Deadline</span>
                  <p className="text-gray-700">
                    {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {(task.tags ? task.tags.split(',') : []).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-100">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Applicant Details
              </h2>
              <div className="space-y-2">
                <a
                  href={getDeveloperProfileRedirectionPath(application.developer.externalId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-gray-50 rounded-md transition"
                >
                  <div className="cursor-pointer px-2 py-1">
                    <span className="text-gray-500 text-sm">Name</span>
                    <h3 className="text-gray-900 font-medium hover:text-blue-600 underline underline-offset-2">
                      {capitalizeWords(application?.developer?.developerName)}
                    </h3>
                  </div>
                </a>
                <div>
                  <span className="text-gray-500 text-sm">Email</span>
                  <p className="text-gray-700">{application.developer.email}</p>
                </div>
                {/* <div>
                  <span className="text-gray-500 text-sm">Phone</span>
                  <p className="text-gray-700">{application.applicantPhone}</p>
                </div> */}
                <div>
                  <span className="text-gray-500 text-sm">Applied On</span>
                  <p className="text-gray-700">{formatDate(createdAt)}</p>
                </div>
                {application.status === 'COMPLETED' && (

                  <div>
                    <span className="text-gray-500 text-sm">Completed On</span>
                    <p className="text-gray-700">{formatDate(application.updatedAt)}</p>
                  </div>

                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Section */}
      <Card className="mb-6 mu-2">
        <CardContent>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Proposal Submitted
          </h2>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <p className="text-gray-700 italic">{proposal || 'No proposal submitted'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      {Array.isArray(application.taskAttachments) && application.taskAttachments.length > 0 && (
        <Card className="mb-6">
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Attachments
            </h2>
            <div className="space-y-4">
              {application.taskAttachments.map((id) => (
                <SecureDocumentViewer key={id} documentId={id} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Update Section */}
      {getAllowedTransitions(application.status)
        .filter((nextStatus) => canRoleUpdateStatus(role, nextStatus)).length > 0 && (
          // Status Update Section
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Update Application Status
              </h2>
              <p className="text-gray-600 text-sm">
                Change the status of your application based on the current progress.
              </p>
            </div>
            <div className="flex gap-2">
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
              </div>
            </div>
          </div>
        )}


    </div>
  );
};

export default ApplicationTaskDetails;