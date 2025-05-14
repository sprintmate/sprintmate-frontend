import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../../services/authService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, Calendar, DollarSign, Tag, FileText, User, Link as LinkIcon } from 'lucide-react';

const ApplicationDetails = () => {
  const { taskId, applicationId } = useParams(); // Get taskId and applicationId from URL
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${taskId}/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicationDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch application details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [taskId, applicationId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="ml-4 text-blue-600">Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-16">
        <AlertCircle className="w-10 h-10 text-red-600 mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const { task, developer, proposal, status, createdAt, expectedEarnings } = applicationDetails;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Task Details */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">{task.title}</CardTitle>
          <CardDescription className="text-gray-600">{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-gray-900">{task.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-gray-900 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {task.budget} {task.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-gray-900 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(task.deadline).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-900">{status}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">Tags</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm border border-blue-200"
                >
                  <Tag className="inline-block w-4 h-4 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Details */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Developer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900 flex items-center gap-1">
                <User className="w-4 h-4" />
                {developer.developerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{developer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skills</p>
              <p className="text-gray-900">{developer.skills}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Preferred Work Type</p>
              <p className="text-gray-900">{developer.preferredWorkType}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">Portfolio</p>
            <div className="flex flex-wrap gap-4 mt-2">
              {developer.portfolio.GITHUB && (
                <a
                  href={developer.portfolio.GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {developer.portfolio.LINKEDIN && (
                <a
                  href={developer.portfolio.LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Section */}
      {proposal && (
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">{proposal}</p>
          </CardContent>
        </Card>
      )}

      {/* Attachments Section */}
      {task.attachments && Object.keys(task.attachments).length > 0 && (
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-900">
              {Object.entries(task.attachments).map(([key, value]) => (
                <li key={key} className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/v1/files/${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {key}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationDetails;
