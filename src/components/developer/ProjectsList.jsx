import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { 
  Search, Filter, DollarSign, Clock, Calendar, Building2, Users, 
  Code, ChevronDown, Briefcase, Check, ArrowLeft, ArrowRight, 
  Loader2, AlertCircle
} from 'lucide-react';
import TaskApplicationModal from './TaskApplicationModal';
import toast from 'react-hot-toast';
import { authUtils } from '@/utils/authUtils';

const ProjectsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 11
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Fetch projects from API
  const fetchProjects = async (page = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = authUtils.getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://round-georgianna-sprintmate-8451e6d8.koyeb.app';
      
      const response = await axios.get(`${baseUrl}/v1/developers/tasks`, {
        params: {
          page,
          size: pagination.pageSize
        },
        headers: {
          'Authorization': token
        },
        // Add timeout to prevent hanging requests
        timeout: 15000
      });
      
      // Check if response has the expected structure
      if (response.data && Array.isArray(response.data.content)) {
        setProjects(response.data.content);
        setFilteredProjects(response.data.content);
        
        // Set pagination with fallbacks for missing data
        setPagination({
          currentPage: response.data.pageable?.pageNumber || 0,
          totalPages: response.data.totalPages || 1,
          totalElements: response.data.totalElements || response.data.content.length,
          pageSize: response.data.pageable?.pageSize || pagination.pageSize
        });
      } else {
        console.warn("Projects API response doesn't have expected format:", response.data);
        // Set as empty arrays rather than breaking
        setProjects([]);
        setFilteredProjects([]);
        setError("Received unexpected data format. Please try refreshing.");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      
      // Provide user-friendly error message
      if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please check your internet connection and try again.");
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        // Could redirect to login page here
      } else {
        setError(err.message || 'Failed to load projects. Please try again later.');
      }
      
      // Ensure states are still set even when errors occur
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(value.toLowerCase()) ||
      project.description.toLowerCase().includes(value.toLowerCase()) ||
      project.tags?.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredProjects(filtered);
  };
  
  // Toggle project details expansion
  const toggleProjectDetails = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchProjects(newPage);
    }
  };
  
  // Apply to project function
  const applyToProject = (project) => {
    setSelectedTask(project);
    setIsApplyModalOpen(true);
  };
  
  const handleApplySuccess = () => {
    // Refresh the project list to reflect the new application status
    fetchProjects(pagination.currentPage);
    
    // Show success message
    toast({
      title: "Application Successful",
      description: "Your application has been submitted successfully!",
      status: "success"
    });
  };
  
  // Format date from API
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    
    // Check if it's already in the right format
    if (dateString.includes(' ')) {
      // Format: "2025-06-03 18:30:00"
      const [datePart, timePart] = dateString.split(' ');
      const date = new Date(`${datePart}T${timePart}`);
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // If it's in ISO format
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract tags from project
  const getProjectTags = (project) => {
    if (!project.tags) return [];
    
    // Handle both comma-separated string and array formats
    if (typeof project.tags === 'string') {
      return project.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    
    return Array.isArray(project.tags) ? project.tags : [];
  };

  // Calculate remaining days until deadline
  const getRemainingDays = (deadline) => {
    if (!deadline) return 'No deadline';
    
    const deadlineDate = new Date(deadline.replace(' ', 'T'));
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };

  // Add null checking for project rendering
  const renderProject = (project) => {
    // Ensure project has all required properties with fallbacks
    const safeProject = {
      externalId: project.externalId || `temp-${Date.now()}`,
      title: project.title || "Untitled Project",
      description: project.description || "No description provided",
      budget: project.budget || 0,
      currency: project.currency || "INR",
      deadline: project.deadline || null,
      tags: project.tags || "",
      status: project.status || "OPEN",
      applications: project.applications || {},
      createdAt: project.createdAt || new Date().toISOString(),
      ndaRequired: project.ndaRequired || false
    };

    return (
      <motion.div
        key={safeProject.externalId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-gray-200 hover:border-blue-300 transition-colors overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-xl">{safeProject.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Building2 size={14} className="text-gray-500" />
                  {safeProject.companyName || "Company"} • <span className="text-gray-400">{formatDate(safeProject.createdAt)}</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                <DollarSign size={14} className="mr-1" />
                {safeProject.budget} {safeProject.currency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <p className={`text-gray-700 ${expandedProjectId === safeProject.externalId ? '' : 'line-clamp-2'}`}>
                {safeProject.description}
              </p>
              
              {expandedProjectId !== safeProject.externalId && (
                <button 
                  onClick={() => toggleProjectDetails(safeProject.externalId)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Show more
                </button>
              )}
              
              <div className="flex flex-wrap gap-1.5">
                {getProjectTags(safeProject).map((tag, index) => (
                  <Badge key={`${safeProject.externalId}-tag-${index}`} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {expandedProjectId === safeProject.externalId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 space-y-3"
                >
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Deadline</p>
                        <p className="font-medium">{formatDate(safeProject.deadline)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-medium">{getRemainingDays(safeProject.deadline)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <div>
                        <p className="text-gray-500">Applicants</p>
                        <p className="font-medium">
                          {safeProject.applications ? Object.keys(safeProject.applications).length : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {safeProject.ndaRequired && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-md text-sm flex items-center">
                      <Shield size={14} className="mr-2" />
                      This project requires an NDA before full details can be accessed.
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 justify-between flex-wrap gap-2">
            <button 
              onClick={() => toggleProjectDetails(safeProject.externalId)}
              className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
            >
              {expandedProjectId === safeProject.externalId ? 'Show less' : 'Show details'}
            </button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300"
              >
                Save
              </Button>
              <Button 
                size="sm"
                onClick={() => applyToProject(safeProject)}
              >
                Apply Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Search and Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search projects, skills, or keywords..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white mt-4 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <div className="flex gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Any duration</option>
                <option value="1-week">Less than 1 week</option>
                <option value="2-weeks">1-2 weeks</option>
                <option value="1-month">2-4 weeks</option>
                <option value="long-term">More than 1 month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <Input placeholder="e.g., React, Node.js" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600 font-medium">Loading projects...</span>
        </div>
      )}
      
      {/* Projects Count */}
      {!loading && !error && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Available Projects <span className="text-gray-500 font-normal">({pagination.totalElements})</span>
          </h2>
          <div className="text-sm text-gray-500">
            Showing {filteredProjects.length} of {pagination.totalElements} projects
          </div>
        </div>
      )}
      
      {/* Projects List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => renderProject(project))
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-gray-500 max-w-sm mx-auto">
                We couldn't find any projects matching your search criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Previous
          </Button>
          
          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Calculate page numbers to show (always show current page in the middle if possible)
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i;
              } else if (pagination.currentPage < 2) {
                pageNum = i;
              } else if (pagination.currentPage > pagination.totalPages - 3) {
                pageNum = pagination.totalPages - 5 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={pagination.currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
            
            {/* Show ellipsis if there are more pages */}
            {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 3 && (
              <span className="text-gray-500">...</span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages - 1}
            className="flex items-center gap-1"
          >
            Next
            <ArrowRight size={14} />
          </Button>
        </div>
      )}

      {/* Task Application Modal */}
      <TaskApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        taskId={selectedTask?.externalId}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default ProjectsList;
