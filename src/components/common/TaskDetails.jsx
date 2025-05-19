import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, DollarSign, Code, FileText, ShieldCheck, Tag, Layers, Clock } from 'lucide-react';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { formatDate } from '../../utils/applicationUtils';
import { getToken } from '../../services/authService';

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/company-profiles/abcd/tasks/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setTask(response.data);
      } catch (err) {
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  // Determine back path
  const backPath =
    location.state?.from ||
    (window.location.pathname.startsWith('/developer') ? '/developer/dashboard/projects' : '/company/dashboard/tasks');

  // Determine if company flow
  const isCompanyFlow = backPath === '/company/dashboard/tasks' || window.location.pathname.startsWith('/company');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">Loading task details...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">No task found.</div>
    );
  }

  // Helper for status color
  const statusColor = {
    OPEN: 'bg-green-100 text-green-700 border-green-200',
    CLOSED: 'bg-red-100 text-red-700 border-red-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200'
  }[task.status] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back & Edit Buttons */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition text-sm font-medium"
        >
          &#8592; Back
        </button>
        {/* Show Edit button for company flow and OPEN status */}
        {isCompanyFlow && task.status === 'OPEN' && (
          <button
            onClick={() => navigate(`/company/dashboard/edit-task/${task.externalId}`)}
            className="inline-flex items-center px-3 py-1.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition text-sm font-medium"
          >
            Edit Task
          </button>
        )}
      </div>

      {/* Animated Header */}
      <motion.div
        className="rounded-xl shadow-lg bg-gradient-to-r from-blue-50 via-white to-green-50 border border-blue-100 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <Layers size={40} className="text-blue-500 drop-shadow" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={statusColor + " font-semibold"}>
                  <Clock size={14} className="mr-1" />
                  {task.status}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Tag size={14} className="mr-1" />
                  {task.category?.toUpperCase() || 'Uncategorized'}
                </Badge>
                {task.ndaRequired && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <ShieldCheck size={14} className="mr-1" />
                    NDA Required
                  </Badge>
                )}
                {task.tags && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Code size={14} className="mr-1" />
                    {task.tags}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-lg font-semibold text-green-700 flex items-center">
              {/* <DollarSign size={18} className="mr-1" /> */}
              <CurrencyFormatter currency={task.currency}>{task.budget}</CurrencyFormatter>
            </span>
            <span className="text-xs text-gray-500">
              Posted: {task.createdAt ? formatDate(task.createdAt) : 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        className="rounded-xl bg-white shadow border border-gray-100 p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="mb-6">
          <CardTitle className="text-lg mb-2 flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            Description
          </CardTitle>
          <CardDescription className="text-gray-700 text-base">{task.description}</CardDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} className="text-blue-400" />
            <span>
              Deadline: <span className="font-medium">{task.deadline ? formatDate(task.deadline) : 'N/A'}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} className="text-blue-400" />
            <span>
              Applicants: <span className="font-medium">{task.applicationsCount ?? 0}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Layers size={18} className="text-blue-400" />
            <span>
              Category: <span className="font-medium">{task.category?.toUpperCase() || 'N/A'}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <ShieldCheck size={18} className="text-blue-400" />
            <span>
              NDA Required: <span className="font-medium">{task.ndaRequired ? 'Yes' : 'No'}</span>
            </span>
          </div>
        </div>
        {/* Attachments */}
        {task.attachments && Object.keys(task.attachments).length > 0 && (
          <div className="mt-8">
            <CardTitle className="text-lg mb-2 flex items-center gap-2">
              <FileText size={20} className="text-blue-400" />
              Attachments
            </CardTitle>
            <div className="flex flex-wrap gap-3">
              {Object.entries(task.attachments).map(([type, id]) => (
                <a
                  key={id}
                  href={`${import.meta.env.VITE_API_BASE_URL}/v1/attachments/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition"
                >
                  <FileText size={16} className="mr-1" />
                  {type.replace('_', ' ')}
                </a>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer/Meta Info */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {/* <div className="text-xs text-gray-400">
          Created by: <span className="font-medium text-gray-600">{task.createdBy}</span> | Last updated: <span className="font-medium text-gray-600">{task.updatedAt ? formatDate(task.updatedAt) : 'N/A'}</span>
        </div> */}
        {/* <div>
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-600">
            Task ID: {task.externalId}
          </Badge>
        </div> */}
      </motion.div>
    </motion.div>
  );
}

export default TaskDetails;