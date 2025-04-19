import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { getToken } from '../../services/authService';

import { 
  User, Calendar, Clock, ChevronLeft, Award, 
  Briefcase, CheckCircle, XCircle, Filter, Search,
  DollarSign, Star, Download, ArrowUpRight,
  MessageSquare, FileText, AlertCircle, ExternalLink,
  ChevronRight // Add this for pagination
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

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusInfo = () => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14} className="mr-1" /> };
      case 'accepted':
      case 'hired':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} className="mr-1" /> };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle size={14} className="mr-1" /> };
      case 'shortlisted':
        return { color: 'bg-blue-100 text-blue-800', icon: <Star size={14} className="mr-1" /> };
      case 'interviewing':
        return { color: 'bg-purple-100 text-purple-800', icon: <MessageSquare size={14} className="mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <FileText size={14} className="mr-1" /> };
    }
  };
  
  const { color, icon } = getStatusInfo();
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status || 'Unknown'}
    </span>
  );
};

// Application card component
const SimpleAvatar = ({ name, profilePicture, className = "h-12 w-12" }) => {
  if (profilePicture) {
    return (
      <div className={`${className} rounded-full overflow-hidden border`}>
        <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  
  return (
    <div className={`${className} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-semibold border`}>
      {name ? name.charAt(0).toUpperCase() : "U"}
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
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === tab.value
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const url = import.meta.env.VITE_API_BASE_URL

  const token = getToken()
  
  // Fetch applications for the task
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/v1/tasks/${taskId}/applications`, {
          headers: { Authorization: `${token}` }
        });
        setApplications(response.data.applications || []);
        setTask(response.data.task || null);
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
  }, [taskId, token]);
  
  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const nameMatch = app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || app.status?.toLowerCase() === statusFilter.toLowerCase();
    return nameMatch && statusMatch;
  });
  
  // Pagination settings
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle application details view
  const handleViewDetails = (applicationId) => {
    const application = applications.find(app => app.id === applicationId);
    setSelectedApplication(application);
  };
  
  // Handle going back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
    <div className="p-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="ghost" size="sm" className="mr-2" onClick={handleBackToDashboard}>
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{task?.title || 'Task Applications'}</h1>
            <p className="text-gray-500">
              {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download size={16} />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-1">
            <Briefcase size={16} />
            Post Similar Job
          </Button>
        </div>
      </div>
      
      {/* Task info card */}
      {task && (
        <Card className="mb-6 border-blue-100 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Task Status</h3>
                <StatusBadge status={task.status || 'Open'} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Budget</h3>
                <p className="text-gray-900 font-medium">
                  <DollarSign className="inline h-4 w-4 mb-0.5" />
                  {task.budget || '$500'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Application Deadline</h3>
                <p className="text-gray-900 font-medium">
                  {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Required Experience</h3>
                <p className="text-gray-900 font-medium">
                  {task.requiredExperience || '2+ years'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Filters and search section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search applicants..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter size={14} className="mr-2" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <SimpleTabs 
        tabs={[
          { value: 'all', label: `All Applications (${applications.length})` },
          { value: 'shortlisted', label: `Shortlisted (${applications.filter(a => a.status?.toLowerCase() === 'shortlisted').length})` },
          { value: 'interviewed', label: `Interviewed (${applications.filter(a => a.status?.toLowerCase() === 'interviewing').length})` },
          { value: 'hired', label: `Hired (${applications.filter(a => a.status?.toLowerCase() === 'hired').length})` }
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      {/* Application list */}
      {paginatedApplications.length > 0 ? (
        <div className="space-y-4">
          {paginatedApplications.map(application => (
            <ApplicationCard 
              key={application.id} 
              application={application} 
              onViewDetails={handleViewDetails} 
            />
          ))}
          
          {/* Replace pagination with a simpler version */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" /> Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    className={`w-9 h-9 p-0 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="w-full border-dashed border-2">
          <CardContent className="p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more results'
                : 'You haven\'t received any applications for this task yet.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1">
                <ExternalLink size={16} />
                Share Job Posting
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Application detail modal would go here */}
      {/* This would be implemented with a modal component */}
    </div>
  );
};

export default ApplicationDetails;
