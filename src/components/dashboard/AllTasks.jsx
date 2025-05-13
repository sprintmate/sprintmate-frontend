import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink
} from "@/components/ui/pagination";
import {
  AnimatedCard,
  StaggeredSection,
  Shimmer,
  GlowContainer
} from '@/components/ui/dashboardAnimations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Eye,
  Users,
  FileCheck,
  Laptop,
  DollarSign,
  Calendar,
  Clock,
  Code,
  Server,
  Database,
  Blocks,
  Cpu,
  GitBranch,
  FileCode,
  Braces,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/services/authService';
import { authUtils } from '../../utils/authUtils';
import ApplicationDetailsModal from '@/components/ApplicationDetailsModal';
import CurrencyFormatter from '../ui/CurrencyFormatter';

// Task status options
const TASK_STATUSES = [
  { value: 'OPEN', label: 'Open' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// Sort options
const SORT_OPTIONS = [
  { value: 'budget,asc', label: 'Budget: Low to High' },
  { value: 'budget,desc', label: 'Budget: High to Low' },
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'createdAt,asc', label: 'Oldest First' },
  { value: 'updatedAt,desc', label: 'Recently Updated' },
  { value: 'updatedAt,asc', label: 'Least Recently Updated' }
];

function getPaginationInfo(currentPage, itemsPerPage, totalItems) {
  // Calculate start and end items for the current page (currentPage is 0-based)
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  // Calculate total number of pages (rounded up)
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    startItem,
    endItem,
    totalItems,
    totalPages
  };
}

const AllTasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [sortBy, setSortBy] = useState('updatedAt,desc');
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        size: 10,
        sort: sortBy
      });

      // Add status filters if any are selected
      if (selectedStatuses.length > 0) {
        selectedStatuses.forEach(status => {
          params.append('statuses', status);
        });
      }

      const companyId = authUtils.getUserProfile().companyProfiles[0].externalId;

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/company-profiles/${companyId}/tasks?${params.toString()}`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Format the tasks to match our UI needs
        const formattedTasks = response.data.content.map(task => ({
          id: task.externalId,
          title: task.title,
          description: task.description,
          status: task.status,
          budget: `${task.currency} ${task.budget.toLocaleString()}`,
          deadline: task.deadline,
          applications: task.applicationsCount || 0,
          views: Math.floor(Math.random() * 200) + 50, // Placeholder for views
          // duration: '2 weeks', // Placeholder for duration
          techStack: task.tags ? task.tags.split(',').map(tag => tag.trim()) : [],
          ndaRequired: task.ndaRequired,
          currency:task.currency
        }));

        setTasks(formattedTasks);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
        setPaginationInfo(getPaginationInfo(currentPage, response.data.pageable.pageSize, response.data.totalElements));

      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on initial load and when filters change
  useEffect(() => {
    fetchTasks();
  }, [currentPage, sortBy, selectedStatuses]);

  const handleStatusChange = (values) => {
    setSelectedStatuses(values);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(0); // Reset to first page when sort changes
  };

  const handleViewApplications = (taskId) => {

    console.log("Task ID:", taskId);
    navigate(`/company/dashboard/applications/${taskId.id}`);
  };

  // const handleApplicantsClick = async (task) => {
  //   // Fetch the first application for the task (or all, as needed)
  //   try {
  //     const token = getToken();
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${task.id}/applications`,
  //       {
  //         headers: {
  //           'Authorization': token,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
  //     if (response.data && Array.isArray(response.data.content) && response.data.content.length > 0) {
  //       setSelectedApplication(response.data.content[0]); // Show first application for demo
  //       setIsModalOpen(true);
  //     }
  //   } catch (err) {
  //     // Optionally handle error
  //   }
  // };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString.replace(' ', 'T'));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-[1500px] mx-auto">
      {/* Error message if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p>{error}</p>
          <Button
            onClick={() => { setError(null); fetchTasks(); }}
            variant="outline" className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Header with Post Task button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/company/dashboard/post-task')}
        >
          <FileText size={16} className="mr-2" />
          Post New Task
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
            <MultiSelect
              options={TASK_STATUSES}
              value={selectedStatuses}
              onValueChange={handleStatusChange}
              placeholder="Select statuses..."
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sort option" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <StaggeredSection
        title="All Tasks"
        delay={0.5}
        staggerDelay={0.15}
      >
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden backdrop-blur-sm border-blue-100/50">
              <CardContent className="relative p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-4 pl-3">
                  <Shimmer width="w-8" height="h-8" className="rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <Shimmer width="w-2/3" height="h-6" />
                    <Shimmer width="w-full" height="h-4" />
                    <Shimmer width="w-full" height="h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : tasks.length > 0 ? (
          // Tasks list
          tasks.map((task) => (
            <div key={task.id} className="group">
              <Card className="overflow-hidden backdrop-blur-sm border-blue-100/50 hover:border-blue-200/70 transition-all duration-300">
                <CardContent className="relative p-4 sm:p-5">
                  {/* Status indicator line */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{
                      backgroundColor: task.status === 'OPEN' ? 'rgb(37, 99, 235)' :
                        task.status === 'IN_PROGRESS' ? 'rgb(245, 158, 11)' :
                          task.status === 'SUBMITTED' ? 'rgb(167, 139, 250)' :
                            'rgb(34, 197, 94)'
                    }}
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pl-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center mr-3">
                          <Laptop size={15} className="text-blue-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h3>

                        {/* Status badge */}
                        <div className="ml-auto">
                          <Badge
                            variant={
                              task.status === 'OPEN' ? "blue" :
                                task.status === 'IN_PROGRESS' ? "yellow" :
                                  task.status === 'SUBMITTED' ? "purple" :
                                    "green"
                            }
                            className="capitalize"
                          >
                            {task.status.replace('_', ' ').toLowerCase()}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 pl-11">{task.description}</p>

                      {/* Task metadata */}
                      <div className="flex flex-wrap gap-4 mt-3 pl-11 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {/* <DollarSign size={14} className="text-blue-500" /> */}
                          <CurrencyFormatter currency={task?.currency} className="text-blue-500">
                          {task.budget}
                          </CurrencyFormatter>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-blue-500" />
                          <span>{formatDate(task.deadline)}</span>
                        </div>

                        {/* {task.ndaRequired && (
                          <div className="flex items-center gap-1">
                            <FileCheck size={14} className="text-red-500" />
                            <span className="text-red-600 font-medium">NDA Required</span>
                          </div>
                        )} */}
                      </div>

                      {/* Tech stack tags */}
                      <div className="flex flex-wrap gap-2 mt-3 pl-11">
                        {task.techStack.map((tech, idx) => (
                          <motion.div
                            key={`${task.id}-${tech}-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (idx * 0.1) }}
                          >
                            <Badge
                              variant="blue"
                              gradient
                              size="sm"
                              className="bg-blue-50/80"
                            >
                              {tech === "react" && <Code size={12} className="mr-1" />}
                              {tech === "node.js" && <Server size={12} className="mr-1" />}
                              {tech === "mongodb" && <Database size={12} className="mr-1" />}
                              {tech === "docker" && <Blocks size={12} className="mr-1" />}
                              {tech === "kubernetes" && <Cpu size={12} className="mr-1" />}
                              {tech === "jenkins" && <GitBranch size={12} className="mr-1" />}
                              {tech === "typescript" && <FileCode size={12} className="mr-1" />}
                              {tech === "express" && <Server size={12} className="mr-1" />}
                              {tech === "tailwind" && <Braces size={12} className="mr-1" />}
                              {tech}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Task action buttons */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 pl-3">
                    <div className="flex items-center gap-2">
                      {/* <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 -ml-2 h-8">
                        <Eye size={14} className="mr-1" />
                        <span className="hidden sm:inline">{task.views} views</span>
                        <span className="sm:hidden">{task.views}</span>
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 h-8"
                        onClick={() => handleViewApplications(task)}
                      >
                        <Users size={14} className="mr-1" />
                        <span>{task.applications} {task.applications === 1 ? 'Applicant' : 'Applicants'}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          // Empty state
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <FileCheck className="text-blue-600" size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </StaggeredSection>

      {/* Pagination */}
      {!isLoading && tasks.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage >= totalPages - 1}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{paginationInfo.startItem}</span> to{' '}
                <span className="font-medium">{paginationInfo.endItem}</span> of{' '}
                <span className="font-medium">{paginationInfo.totalItems}</span> results
              </p>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage + 1}</span> of{' '}
                <span className="font-medium">{paginationInfo.totalPages}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ApplicationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApplication}
      />
    </div>
  );
};

export default AllTasks;