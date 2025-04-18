import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  FileText, 
  User, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCheck, 
  MessageSquare, 
  Globe, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Award,
  Code,
  Terminal
} from 'lucide-react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ApplicationDetails = ({ applicationIdProp }) => {
  const { taskId, applicationId: routeApplicationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the prop if provided, otherwise use the route param
  const resolvedApplicationId = applicationIdProp || routeApplicationId;
  
  const [application, setApplication] = useState(null);
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applied");
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [applications, setApplications] = useState({
    applied: [],
    shortlisted: []
  });

  // Fetch application details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch task details first
        const taskResponse = await axios.get(
          `${apiBaseUrl}/v1/tasks/${taskId}`,
          {
            headers: { 'Authorization': token }
          }
        );
        
        setTask(taskResponse.data);

        console.log(applicationIdProp , "*******")
        
        // Fetch all applications for this task*
        const allApplicationsResponse = await axios.get(
          `${apiBaseUrl}/v1/tasks/${taskId}/applications`,
          {
            headers: { 'Authorization': token }
          }
        );
        
        console.log("All applications API response:", allApplicationsResponse.data);
        
        // Process and categorize applications
        if (Array.isArray(allApplicationsResponse.data)) {
          const processedApps = allApplicationsResponse.data.map(app => ({
            externalId: app.externalId,
            developerId: app.developerId,
            developerName: app.developerName || "Anonymous Developer",
            proposal: app.proposal,
            status: app.status,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          }));
          
          setApplications({
            applied: processedApps.filter(app => app.status === 'APPLIED' || app.status === 'PENDING'),
            shortlisted: processedApps.filter(app => app.status === 'SHORTLISTED')
          });
          
          // If we don't have a specific applicationId but have applications, select the first one
          if (!resolvedApplicationId && processedApps.length > 0) {
            navigate(`/company/dashboard/tasks/${taskId}/applications/${processedApps[0].externalId}`);
            return; // Exit early as we're redirecting
          }
        }
        
        // If we have a specific applicationId, fetch its details
        if (resolvedApplicationId) {
          console.log("Fetching specific application:", resolvedApplicationId);
          
          const response = await axios.get(
            `${apiBaseUrl}/v1/tasks/${taskId}/applications/${resolvedApplicationId}`,
            {
              headers: { 'Authorization': token }
            }
          );
          
          console.log("Application details API response:", response.data);
          
          // Process the application data
          const appData = response.data;
          setApplication({
            externalId: appData.externalId,
            createdAt: appData.createdAt,
            updatedAt: appData.updatedAt,
            developerId: appData.developerId,
            developerName: appData.developerName || "Anonymous Developer",
            developerTitle: appData.developerTitle || "Software Developer",
            proposal: appData.proposal,
            status: appData.status,
            experience: appData.experience || "N/A",
            rating: appData.rating || 4.5,
            skills: appData.tags ? appData.tags.split(',') : [],
            email: appData.email,
            phone: appData.phone,
            education: appData.education,
            portfolioLinks: {
              github: appData.githubUrl,
              linkedin: appData.linkedinUrl,
              website: appData.websiteUrl
            },
            avatarUrl: appData.avatarUrl
          });
        }
      } catch (err) {
        console.error("Error fetching application details:", err);
        
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response?.status === 404) {
          setError("Application not found. It may have been removed or you don't have access.");
        } else {
          setError(err.message || 'Failed to load application details');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicationDetails();
  }, [taskId, resolvedApplicationId, navigate]);

  // Handle shortlisting a candidate
  const handleShortlist = async (appId) => {
    setActionInProgress(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Make the actual API call to shortlist this application
      const response = await axios.put(
        `${apiBaseUrl}/v1/tasks/${taskId}/applications/${appId}/shortlist`,
        {},
        {
          headers: { 'Authorization': token }
        }
      );
      
      console.log("Shortlist API response:", response.data);
      
      // Update local state
      const updatedApp = applications.applied.find(app => app.externalId === appId);
      
      if (updatedApp) {
        setApplications(prev => ({
          applied: prev.applied.filter(app => app.externalId !== appId),
          shortlisted: [...prev.shortlisted, {...updatedApp, status: 'SHORTLISTED'}]
        }));
        
        // Show success message
        toast({
          title: "Candidate Shortlisted",
          description: "The candidate has been moved to your shortlist.",
          variant: "success",
        });
        
        // If we're viewing this specific application, update its status
        if (application && application.externalId === appId) {
          setApplication({...application, status: 'SHORTLISTED'});
        }
        
        // Switch to shortlisted tab if we've just shortlisted the currently viewed application
        if (application && application.externalId === appId) {
          setActiveTab("shortlisted");
        }
      }
    } catch (err) {
      console.error("Error shortlisting candidate:", err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else if (err.response?.status === 403) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Action Failed",
          description: err.response?.data?.message || "Failed to shortlist the candidate. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle rejecting a candidate
  const handleReject = async (appId) => {
    setActionInProgress(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Make the actual API call to reject this application
      const response = await axios.put(
        `${apiBaseUrl}/v1/tasks/${taskId}/applications/${appId}/reject`,
        {},
        {
          headers: { 'Authorization': token }
        }
      );
      
      console.log("Reject API response:", response.data);
      
      // Update local state - remove from both lists
      setApplications(prev => ({
        applied: prev.applied.filter(app => app.externalId !== appId),
        shortlisted: prev.shortlisted.filter(app => app.externalId !== appId)
      }));
      
      // Show success message
      toast({
        title: "Candidate Rejected",
        description: "The candidate has been rejected for this task.",
        variant: "success",
      });
      
      // Navigate back to applications list if we rejected the current application
      if (application && application.externalId === appId) {
        navigate(`/company/dashboard/tasks/${taskId}/applications`);
      }
      
    } catch (err) {
      console.error("Error rejecting candidate:", err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      } else if (err.response?.status === 403) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Action Failed",
          description: err.response?.data?.message || "Failed to reject the candidate. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setActionInProgress(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Navigate to a specific application
  const navigateToApplication = (appId) => {
    navigate(`/company/dashboard/tasks/${taskId}/applications/${appId}`);
  };

  // Go back to applications list
  const handleBackToList = () => {
    navigate(`/company/dashboard/tasks/${taskId}/applications`);
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
          <Button 
            onClick={() => navigate('/company/dashboard/tasks')} 
            variant="outline" 
            className="mt-2"
          >
            Go Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 text-gray-600 hover:text-gray-900 -ml-2"
        onClick={handleBackToList}
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to All Applications
      </Button>
      
      {/* Task Details Header */}
      <Card className="mb-6 border-blue-100 overflow-hidden">
        <div className="h-2 bg-blue-600"></div>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="space-y-3 py-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {task?.title || "Task Details"}
                  </h1>
                  <p className="text-gray-500 mt-1">{task?.description?.substring(0, 120)}...</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {task?.budget} {task?.currency}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-blue-500" />
                  Deadline: {formatDate(task?.deadline)}
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={14} className="text-blue-500" />
                  {applications.applied.length + applications.shortlisted.length} Applications
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Applications Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="applied" className="relative">
              Applied
              {applications.applied.length > 0 && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {applications.applied.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="shortlisted">
              Shortlisted
              {applications.shortlisted.length > 0 && (
                <span className="ml-1 text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
                  {applications.shortlisted.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Applications List */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <TabsContent value="applied" className="mt-0">
                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-800">Applied Candidates</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : applications.applied.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <User className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2">No applied candidates</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {applications.applied.map((app) => (
                          <motion.div 
                            key={app.externalId}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-3 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 ${
                              application?.externalId === app.externalId ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => navigateToApplication(app.externalId)}
                          >
                            <Avatar className="h-10 w-10 border border-blue-100">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {getInitials(app.developerName || "User")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {app.developerName || "Anonymous Developer"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Applied: {formatDate(app.createdAt)}
                              </p>
                            </div>
                            {application?.externalId === app.externalId && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-blue-600"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shortlisted" className="mt-0">
                <Card className="border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-gray-800">Shortlisted Candidates</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : applications.shortlisted.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <User className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-2">No shortlisted candidates yet</p>
                        <p className="text-xs mt-1">Shortlist candidates from the Applied tab</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {applications.shortlisted.map((app) => (
                          <motion.div 
                            key={app.externalId}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-3 hover:bg-green-50/50 cursor-pointer flex items-center gap-3 ${
                              application?.externalId === app.externalId ? 'bg-green-50' : ''
                            }`}
                            onClick={() => navigateToApplication(app.externalId)}
                          >
                            <Avatar className="h-10 w-10 border border-green-100">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                {getInitials(app.developerName || "User")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {app.developerName || "Anonymous Developer"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Shortlisted: {formatDate(app.updatedAt)}
                              </p>
                            </div>
                            {application?.externalId === app.externalId && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-green-600"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </div>
          
          {/* Right Side - Application Details */}
          <div className="lg:col-span-2">
            <Card className="border-blue-100 h-full">
              {isLoading ? (
                <CardContent className="p-6 space-y-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-32 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              ) : !resolvedApplicationId || !application ? (
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-12 w-12 text-blue-200 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Application Selected</h3>
                  <p className="text-gray-500 mt-1 max-w-md">
                    Select an application from the list to view detailed information about the candidate.
                  </p>
                </CardContent>
              ) : (
                <CardContent className="p-0">
                  {/* Status banner */}
                  <div className={`p-2 text-center text-sm font-medium ${
                    application.status === 'SHORTLISTED' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {application.status === 'SHORTLISTED' ? (
                      <div className="flex items-center justify-center gap-1">
                        <CheckCheck size={16} />
                        <span>Shortlisted Candidate</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <Clock size={16} />
                        <span>Applied Candidate</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Developer info */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="flex flex-col items-center text-center">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={application.avatarUrl} alt={application.developerName || "Developer"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
                              {getInitials(application.developerName || "User")}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div className="mt-4 space-y-1">
                          <h3 className="font-semibold text-gray-900">
                            {application.developerName || "Anonymous Developer"}
                          </h3>
                          {application.developerTitle && (
                            <p className="text-sm text-gray-500">{application.developerTitle}</p>
                          )}
                        </div>
                        
                        {/* Experience & Rating */}
                        <div className="mt-3 flex items-center gap-3">
                          {application.experience && (
                            <Badge variant="secondary">
                              <Briefcase size={12} className="mr-1" />
                              {application.experience} yrs exp
                            </Badge>
                          )}
                          
                          {application.rating && (
                            <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-medium">
                              <Star size={12} className="mr-0.5" fill="currentColor" />
                              {application.rating}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3 w-full">
                          {application.status !== 'SHORTLISTED' ? (
                            <Button 
                              onClick={() => handleShortlist(application.externalId)}
                              disabled={actionInProgress}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp size={16} className="mr-2" />
                              Shortlist
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              onClick={() => {}}
                              className="flex-1 border-green-200 text-green-600 bg-green-50"
                              disabled={true}
                            >
                              <CheckCircle2 size={16} className="mr-2" />
                              Shortlisted
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline"
                            onClick={() => handleReject(application.externalId)}
                            disabled={actionInProgress}
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <ThumbsDown size={16} className="mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 space-y-6">
                        {/* Application Details */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" />
                            Application Details
                          </h3>
                          
                          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <span>Applied on {formatDate(application.createdAt)}</span>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="prose prose-sm max-w-none text-gray-700">
                                <p>{application.proposal}</p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                        
                        {/* Skills */}
                        {application.skills && application.skills.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Code size={18} className="text-blue-600" />
                              Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {application.skills.map((skill, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + (idx * 0.05) }}
                                >
                                  <Badge variant="secondary" className="bg-gray-100/70">
                                    {skill}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Education */}
                        {application.education && (
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <GraduationCap size={18} className="text-blue-600" />
                              Education
                            </h3>
                            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                              {application.education}
                            </div>
                          </div>
                        )}
                        
                        {/* Contact & Links */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                          <div className="space-y-2 text-sm">
                            {application.email && (
                              <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-500" />
                                <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">
                                  {application.email}
                                </a>
                              </div>
                            )}
                            
                            {application.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-500" />
                                <a href={`tel:${application.phone}`} className="text-blue-600 hover:underline">
                                  {application.phone}
                                </a>
                              </div>
                            )}
                            
                            {/* Portfolio links */}
                            {application.portfolioLinks && (
                              <div className="flex flex-wrap gap-3 mt-3">
                                {application.portfolioLinks.github && (
                                  <a 
                                    href={application.portfolioLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                                  >
                                    <Github size={14} />
                                    <span>GitHub</span>
                                  </a>
                                )}
                                
                                {application.portfolioLinks.linkedin && (
                                  <a 
                                    href={application.portfolioLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                                  >
                                    <Linkedin size={14} />
                                    <span>LinkedIn</span>
                                  </a>
                                )}
                                
                                {application.portfolioLinks.website && (
                                  <a 
                                    href={application.portfolioLinks.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                                  >
                                    <Globe size={14} />
                                    <span>Portfolio</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notes & Contact Section */}
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Next Steps</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-center gap-2">
                          <MessageSquare size={16} />
                          Message Candidate
                        </Button>
                        <Button className="justify-center gap-2 bg-blue-600">
                          <Calendar size={16} />
                          Schedule Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ApplicationDetails;
