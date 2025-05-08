import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  FileText, 
  Users, 
  Settings,
  Menu,
  Search,
  Bell,
  X,
  ChevronRight,
  ChevronLeft,
  LogOut,
  User,
  Sparkles,
  Eye,
  Filter,
  Clock,
  CheckCircle2,
  Zap,
  Award,
  Star,
  Calendar,
  DollarSign,
  Timer,
  Users2,
  Laptop,
  Server,
  Code,
  Database,
  Blocks,
  Cpu,
  GitBranch,
  FileCode,
  Braces,
  FileCheck,
  MessageSquare,
  ArrowUpRight,
  Github,
  Linkedin,
  Globe,
  UserCheck
} from 'lucide-react';
import CustomCursor from '@/components/ui/CustomCursor';
import PostTaskForm from '@/components/dashboard/PostTaskForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AnimatedCard, 
  StaggeredSection, 
  Shimmer, 
  AnimatedCounter,
  GlowContainer
} from '@/components/ui/dashboardAnimations';
import axios from 'axios';
import { authUtils } from '@/utils/authUtils';
import { getToken, fetchUserProfile, getUserProfile } from '../services/authService'; // Update imports
import {
  TaskApplicationStatus,
  Role,
  STATUS_LABELS,
  getAllowedTransitions,
  canRoleUpdateStatus,
  STATUS_DIALOG_CONFIG
} from '../constants/taskApplicationStatus';

// Import our new company dashboard view component
import CompanyViewDashboard from '@/components/dashboard/CompanyViewDashboard';

// Import the new ApplicationDetails component
import ApplicationDetails from '@/components/dashboard/ApplicationDetails';
import { NAV_LINKS } from '../config/navLinks';
import { UserRole } from '../constants/Role';
import DeveloperPayments from './DeveloperPayments';

// Import the new AllTasks component
import AllTasks from '@/components/dashboard/AllTasks';
import Applications from './CompanyApplication';

// New DashboardHome component that uses our professional dashboard
const DashboardHome = () => (
  //<CompanyViewDashboard />
  <div>
    THIS IS COMPANY DASHBOARD
  </div>
);

// Tasks Component
const MyTasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeStat, setActiveStat] = useState('week');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  
  // New states for API integration
  const [companyId, setCompanyId] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [pastTasks, setPastTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [error, setError] = useState(null);
  
  // The scroll progress stuff
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });

  const url = import.meta.env.VITE_API_BASE_URL || "http://sprintmate-stage.ap-south-1.elasticbeanstalk.com:8080";
  
  // Analytics data (we'll keep using this for now)
  const analytics = {
    totalTasks: 15,
    activeTasks: 3,
    totalApplications: 45,
    avgApplicationsPerTask: 8,
    completionRate: 85,
    avgRating: 4.7,
    topTechStacks: ["React", "Node.js", "Python", "JavaScript"],
    weeklyStats: {
      taskViews: 347,
      newApplications: 23,
      completedTasks: 2,
      growth: 18
    },
    monthlyStats: {
      taskViews: 1245,
      newApplications: 87,
      completedTasks: 7,
      growth: 22
    },
    yearlyStats: {
      taskViews: 12650,
      newApplications: 684,
      completedTasks: 42,
      growth: 67
    },
    devEngagement: 78,
    timeToHire: 4.3, // days
    tasksByCategory: [
      { name: "Frontend", value: 40 },
      { name: "Backend", value: 30 },
      { name: "Full Stack", value: 15 },
      { name: "Mobile", value: 10 },
      { name: "DevOps", value: 5 }
    ]
  };

  const taskActivityData = {
    daily: [25, 36, 42, 29, 38, 46, 53],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };

  // Get company ID from localStorage with better fallbacks
  useEffect(() => {
    const getCompanyProfileData = async () => {
      try {
        // First try to get from localStorage directly using the helper
        const storedProfile = getUserProfile();
        
        if (storedProfile && storedProfile.companyProfiles && storedProfile.companyProfiles.length > 0) {
          const companyExternalId = storedProfile.companyProfiles[0].externalId;
          if (companyExternalId) {
            console.log("Found company externalId from stored profile:", companyExternalId);
            setCompanyId(companyExternalId);
            return; // Exit if we found the ID
          }
        }
        
        // If we reach here, we need to fetch from API
        console.log("No valid company profile found in storage, fetching from API...");
        
        const token = getToken();
        if (!token) {
          setError("Authentication required. Please log in again.");
          return;
        }
        
        // Fetch profile from API as a last resort
        const profileData = await fetchUserProfile();
        
        if (profileData && profileData.companyProfiles && profileData.companyProfiles.length > 0) {
          const companyExternalId = profileData.companyProfiles[0].externalId;
          if (companyExternalId) {
            console.log("Found company externalId from API:", companyExternalId);
            setCompanyId(companyExternalId);
            return;
          }
        }
        
        // If we still don't have a company ID, show an error
        setError("Could not load company profile. Please try logging in again.");
      } catch (error) {
        console.error("Error in getCompanyProfileData:", error);
        setError("Could not load company profile. Please try again later.");
      }
    };

    getCompanyProfileData();
  }, []);

  // Fetch tasks when companyId is available
  useEffect(() => {
    if (companyId) {
      fetchTasks();
    }
  }, [companyId]);

  // Function to fetch tasks from API
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      
      if (!companyId) {
        console.error("No company ID available for API call");
        setError("No company ID available. Please try logging in again.");
        setIsLoading(false);
        return;
      }
      
      const token = getToken();
      
      if (!token) {
        console.error("No authentication token found");
        setError("Authentication required. Please log in again.");
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${apiBaseUrl}/v1/company-profiles/${companyId}/tasks?page=0&size=3&sort=updatedAt,desc`, 
        { 
          headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data) {
        const formattedTasks = response.data.content.map(task => ({
          id: task.externalId,
          title: task.title,
          description: task.description,
          applications: task.applicationsCount || 0,
          status: task.status,
          category: task.category,
          budget: `${task.currency} ${task.budget.toLocaleString()}`,
          currency: task.currency,
          amount: task.budget,
          posted: formatDateRelative(task.createdAt),
          postedDate: new Date(task.createdAt),
          deadline: formatDate(task.deadline),
          deadlineDate: task.deadline ? new Date(task.deadline) : null,
          techStack: task.tags ? task.tags.split(',').map(tag => tag.trim()) : [],
          views: Math.floor(Math.random() * 200) + 50,
          hasAttachments: !!task.attachments && Object.keys(task.attachments).length > 0,
          attachments: task.attachments || {},
          ndaRequired: task.ndaRequired
        }));
        
        setRecentTasks(formattedTasks);
        setTotalTasks(response.data.totalElements);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate duration between two dates
  const calculateDuration = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "N/A";
    
    const start = new Date(startDateStr.replace(' ', 'T'));
    const end = new Date(endDateStr.replace(' ', 'T'));
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return `${days} days`;
  };

  // Helper function to format date relative to today
  const formatDateRelative = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    // Handle "2025-06-04 00:00:00" format
    const date = new Date(dateString.replace(' ', 'T'));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Helper function to determine priority based on deadline
  const getPriorityFromDeadline = (deadlineString) => {
    if (!deadlineString) return "Low";
    const deadline = new Date(deadlineString.replace(' ', 'T'));
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return "High";
    if (diffDays < 14) return "Medium";
    return "Low";
  };

  // Generate placeholder applicants for testing - updated to respect the count parameter
  const generatePlaceholderApplicants = (count) => {
    const firstNames = ["Alex", "Morgan", "Jamie", "Taylor", "Jordan", "Casey"];
    const lastNames = ["Smith", "Johnson", "Lee", "Garcia", "Chen", "Wilson"];
    const years = [2, 3, 4, 5, 6, 7];
    
    return Array.from({ length: count }, (_, i) => ({
      id: 100 + i,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      rating: (4 + Math.random()).toFixed(1),
      experience: `${years[Math.floor(Math.random() * years.length)]} years`
    }));
  };

  // Determine which stats to show based on active tab
  const getActiveStats = () => {
    switch(activeStat) {
      case 'week':
        return analytics.weeklyStats;
      case 'month':
        return analytics.monthlyStats;
      case 'year':
        return analytics.yearlyStats;
      default:
        return analytics.weeklyStats;
    }
  };

  const activeStats = getActiveStats();

  // Navigate to task applications with first application ID when available
  const handleViewApplications = (taskId) => {
    const task = recentTasks.find(task => task.id === taskId);
    if (task && task.applicants && task.applicants.length > 0) {
      // If we have applicants, navigate to the first one directly
      const firstApplicantId = task.applicants[0].id;
      navigate(`/company/dashboard/tasks/${taskId}/applications/${firstApplicantId}`);
    } else {
      // Otherwise, just navigate to the applications list
      navigate(`/company/dashboard/tasks/${taskId}/applications`);
    }
  };

  const handleApplicantsClick = async (task) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/tasks/${task.id}/applications`,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data && Array.isArray(response.data.content) && response.data.content.length > 0) {
        setSelectedApplication(response.data.content[0]);
        setIsModalOpen(true);
      }
    } catch (err) {
      // Optionally handle error
    }
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

      {/* Hero Section with Animated Elements - Now always visible */}
      <motion.div
        ref={scrollRef}
        className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Banner Background - Keep this blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>

        {/* Mesh Gradient Animation */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle
              cx="75"
              cy="30"
              r="20"
              fill="url(#purpleGradient)"
              animate={{
                cx: [75, 65, 75],
                cy: [30, 40, 30]
              }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />
            <motion.circle
              cx="40"
              cy="70"
              r="25"
              fill="url(#blueGradient)"
              animate={{
                cx: [40, 50, 40],
                cy: [70, 60, 70]
              }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            />
            {/* Gradients */}
            <defs>
              <radialGradient id="purpleGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                <stop offset="0%" stopColor="rgba(167, 139, 250, 0.6)" />
                <stop offset="100%" stopColor="rgba(167, 139, 250, 0)" />
              </radialGradient>
              <radialGradient id="blueGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                <stop offset="0%" stopColor="rgba(96, 165, 250, 0.6)" />
                <stop offset="100%" stopColor="rgba(96, 165, 250, 0)" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center text-white">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
               Dashboard
              <motion.div
                className="ml-3 inline-flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="bg-white/20 backdrop-blur-sm text-xs rounded-full py-1 px-2 flex items-center gap-1 font-normal">
                  <Sparkles size={12} className="text-yellow-300" />
                  <span>Total: {totalTasks || 0}</span>
                </span>
              </motion.div>
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl">
              Track active projects, review applications, and manage completed tasks all in one place
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/company/dashboard/post-task">
                <button className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors">
                  <Zap size={16} />
                  <span className="hidden sm:inline">Post New Task</span>
                  <span className="sm:hidden">New</span>
                </button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600/30 backdrop-blur-sm border border-white/20 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-500/40 transition-colors">
                <Filter size={16} />
                <span className="hidden sm:inline">Filter Tasks</span>
                <span className="sm:hidden">Filter</span>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Rest of content - Normal theme background */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
        {/* Time Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Task Performance</h2>
            <p className="text-sm text-gray-500">Track your project metrics over time</p>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={`stat-${period}`}
                onClick={() => setActiveStat(period)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeStat === period 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AnimatedCard delay={0.1}>
          <GlowContainer color="blue">
            <Card className="bg-white backdrop-blur-sm border-blue-100 h-full">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Eye className="text-blue-600" size={18} />
                    </div>
                    <div className="font-medium text-gray-900">Task Views</div>
                  </div>
                  <Badge variant="blue" gradient glow className="capitalize hidden sm:flex">
                    <ArrowUpRight size={12} className="mr-1" />
                    {activeStats.growth}%
                  </Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Shimmer width="w-20" height="h-9" /> : activeStats.taskViews.toLocaleString()}
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 text-xs sm:text-sm">
                    <Badge variant="blue" gradient glow className="capitalize sm:hidden">
                      <ArrowUpRight size={10} className="mr-1" />
                      {activeStats.growth}%
                    </Badge>
                    <div className="w-16 sm:w-24 h-8 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeStats.growth}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowContainer>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <GlowContainer color="purple">
            <Card className="bg-white backdrop-blur-sm border-purple-100 h-full">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Users className="text-purple-600" size={18} />
                    </div>
                    <div className="font-medium text-gray-900">Applications</div>
                  </div>
                  <Badge variant="purple" gradient glow className="capitalize">New</Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Shimmer width="w-16" height="h-9" /> : activeStats.newApplications}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + (idx * 0.1) }}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={16}
                          fill={idx < Math.floor(analytics.avgRating) ? "currentColor" : "none"}
                          className={idx < Math.floor(analytics.avgRating) ? "" : "text-gray-300"}
                        />
                      </motion.div>
                    ))}
                    <span className="ml-1 text-sm font-medium text-gray-700">{activeStats.newApplications}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowContainer>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <GlowContainer color="green">
            <Card className="bg-white backdrop-blur-sm border-green-100 h-full">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="text-green-600" size={18} />
                    </div>
                    <div className="font-medium text-gray-900">Completed</div>
                  </div>
                  <Badge variant="green" gradient glow className="capitalize">{activeStat}</Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Shimmer width="w-16" height="h-9" /> : activeStats.completedTasks}
                  </div>
                  <div className="sm:w-24 h-8 hidden sm:block">
                    <div className="flex h-full items-end space-x-1">
                      {taskActivityData.daily.map((value, index) => (
                        <motion.div
                          key={index}
                          className="bg-green-200 rounded-sm flex-1"
                          initial={{ height: 0 }}
                          animate={{ height: `${(value / Math.max(...taskActivityData.daily)) * 100}%` }}
                          transition={{ delay: 0.3 + (index * 0.05), duration: 0.5 }}
                        >
                          <div 
                            className="w-full bg-green-500 rounded-sm transition-all" 
                            style={{ height: `${(activeStats.completedTasks / value) * 30}%` }}
                          ></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowContainer>
        </AnimatedCard>

        <AnimatedCard delay={0.4}>
          <GlowContainer color="yellow">
            <Card className="bg-white backdrop-blur-sm border-amber-100 h-full">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Award className="text-amber-600" size={18} />
                    </div>
                    <div className="font-medium text-gray-900">Dev Rating</div>
                  </div>
                  <Badge variant="yellow" gradient glow className="capitalize">Top</Badge>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isLoading ? <Shimmer width="w-16" height="h-9" /> : analytics.avgRating}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + (idx * 0.1) }}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={16}
                          fill={idx < Math.floor(analytics.avgRating) ? "currentColor" : "none"}
                          className={idx < Math.floor(analytics.avgRating) ? "" : "text-gray-300"}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowContainer>
        </AnimatedCard>
      </div>

      {/* Split View Container - Responsive grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tasks - Major Half */}
        <div className="lg:col-span-3">
          <StaggeredSection 
            title="Recent Tasks"
            delay={0.5}
            staggerDelay={0.15}
            actionButton={
              <Button 
                variant="outline" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 gap-1"
                onClick={() => navigate('/company/dashboard/tasks')}
              >
                View All
                <ChevronRight size={16} />
              </Button>
            }
          >
            {/* Loading state - shimmer placeholders */}
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden backdrop-blur-sm border-blue-100/50 hover:border-blue-200/70 transition-all duration-300">
                  <CardContent className="relative p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4 pl-3">
                      <Shimmer width="w-8" height="h-8" className="rounded-lg" />
                      <div className="flex-1 space-y-4">
                        <Shimmer width="w-2/3" height="h-6" />
                        <Shimmer width="w-full" height="h-4" />
                        <Shimmer width="w-full" height="h-4" />
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Shimmer width="w-16" height="h-6" className="rounded-md" />
                          <Shimmer width="w-16" height="h-6" className="rounded-md" />
                          <Shimmer width="w-16" height="h-6" className="rounded-md" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="group">
                  <Card className="overflow-hidden backdrop-blur-sm border-blue-100/50 hover:border-blue-200/70 transition-all duration-300">
                    <CardContent className="relative p-4 sm:p-5">
                      {/* Status indicator line with animation */}
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ 
                          backgroundColor: task.status === 'active' ? 'rgb(37, 99, 235)' : 
                                         task.status === 'reviewing' ? 'rgb(245, 158, 11)' : 
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
                                  task.status === 'active' ? "blue" : 
                                  task.status === 'reviewing' ? "yellow" : 
                                  "green"
                                }
                                className="capitalize"
                              >
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2 pl-11">{task.description}</p>
                          
                          {/* Task metadata - Budget, Deadline, Duration */}
                          <div className="flex flex-wrap gap-4 mt-3 pl-11 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} className="text-blue-500" />
                              <span>{task.budget}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-blue-500" />
                              <span>{task.deadline}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-blue-500" />
                              <span>{task.duration}</span>
                            </div>
                            
                            {task.ndaRequired && (
                              <div className="flex items-center gap-1">
                                <FileCheck size={14} className="text-red-500" />
                                <span className="text-red-600 font-medium">NDA Required</span>
                              </div>
                            )}
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
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 -ml-2 h-8">
                            <Eye size={14} className="mr-1" />
                            <span className="hidden sm:inline">{task.views} views</span>
                            <span className="sm:hidden">{task.views}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 h-8"
                            onClick={() => handleApplicantsClick(task)}
                          >
                            <Users size={14} className="mr-1" />
                            <span>{task.applications} {task.applications === 1 ? 'Applicant' : 'Applicants'}</span>
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Posted: {task.posted}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by posting your first task</p>
                <Button className="mt-4 bg-blue-600" asChild>
                  <Link to="/company/dashboard/post-task">
                    Post a Task
                  </Link>
                </Button>
              </div>
            )}
          </StaggeredSection>
        </div>

        {/* Past Tasks - Minor Half - keeping this as is for now */}
      
        
      </div>

      <ApplicationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApplication}
      />
    </div>
  );
};

// Post Task Component
const PostTask = () => (
  <div className="p-4 space-y-8">
    <motion.div 
      className="text-center max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Post Your Project
      </h2>
      <p className="text-gray-600 text-lg">
        Find the perfect developer for your project by providing detailed requirements
      </p>
    </motion.div>
    <PostTaskForm /> 
  </div>
);

// Settings Component
const SettingsPage = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4">
        <p>Settings options will appear here</p>
      </div>
    </div>
  </div>
);

// Add ProfileEdit component import};
import EditProfile from '@/components/profile/EditProfile';
import CompanyPayments from './CompanyPayments';

// Add UserProfile component
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();  
  const [isEditing, setIsEditing] = useState(false);
  // This would typically come from a context or API call
  const [userData, setUserData] = useState({
    name: "shashant kashyap",
    email: "shashant2538@gmail.com",
    role: "CORPORATE",
    userId: "6b1227af-fe28-4f05-8ab3-f7d475383ca0",
    verified: true,
    about: "Experienced technology leader with a passion for building innovative products.",
    skills: "Project Management, Product Strategy, Team Leadership",
    experience: "8",
    education: "MBA, Business Administration - Stanford University\nBSc, Computer Science - MIT",
    portfolio: {
      GITHUB: "https://github.com/shashant",
      LINKEDIN: "https://linkedin.com/in/shashant-kashyap",
      WEBSITE: "https://shashant.dev"
    },
    companyProfiles: [
      {
        externalId: "7823fdcf-bb3b-47ea-a182-6853ab925ffc",
        createdAt: "2025-04-07T16:02:14.000+00:00",
        updatedAt: "2025-04-07T16:02:14.000+00:00",
        createdBy: "system",
        updatedBy: "system",
        companyName: "Spire Technoligies",
        industry: "Tech",
        verificationStatus: true,
        isDeleted: false,
        attachments: {
          EDIN: "https://linkedin.com/in/shashant-kashyap",
          LOGO: "5c935565-fa32-413b-b15a-a461fde83b18"
        },
        about: null
      }
    ],
    externalId: "7823fdcf-bb3b-47ea-a182-6853ab925ffc",
    developerProfiles: [],
    createdAt: "2025-04-07T16:02:14.000+00:00"
  });

  // Check if we should be in edit mode based on url
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [location.pathname]);

  // Extract first letters of first and last name for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    try {
      // This would typically be an API call to update the profile
      console.log("Profile data to update:", updatedData);
      setUserData(prev => ({
        ...prev,
        ...updatedData
      }));
      
      // Navigate back to view mode
      navigate('/company/dashboard/profile');
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating profile:", error);
      return Promise.reject(error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    navigate('/company/dashboard/profile');
  };

  // Show edit form if in edit mode
  if (isEditing) {
    return <EditProfile 
      userData={userData} 
      onSave={handleProfileUpdate}
      onCancel={handleCancelEdit} 
    />;
  }

  // Otherwise show profile view
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-48 relative">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white text-4xl font-semibold">
                  {getInitials(userData.name)}
                </span>
              </div>
            </div>
          </div>
        </div>  {/* Grid Pattern Overlay */}
        
        {/* Profile information */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <span className="text-sm">{userData.email}</span>
                {userData.verified && (
                  <Badge variant="blue" className="capitalize" size="sm">
                    Verified
                  </Badge>
                )}
              </p>
            </div>
            <div className="flex gap-3 px-8">
              <Button
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => navigate('/company/dashboard/profile/edit')}
              >
                <FileText size={16} />
                Edit Profile
              </Button>
              <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Settings size={16} />
                Settings
              </Button>
            </div>
          </div>

          {/* About section */}
          {userData.about && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{userData.about}</p>
            </div>
          )}

          {/* Skills section */}
          {userData.skills && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {userData.skills.split(',').map((skill) => (
                  <Badge key={skill} variant="blue" className="bg-blue-50/80">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Role & ID information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">{userData.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 break-all">{userData.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            {userData.companyProfiles && userData.companyProfiles.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-gray-900">{userData.companyProfiles[0].companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium text-gray-900">{userData.companyProfiles[0].industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <Badge variant={userData.companyProfiles[0].verificationStatus ? "green" : "yellow"} className="mt-1">
                        {userData.companyProfiles[0].verificationStatus ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
          
          {/* Portfolio Links */}
          {userData.portfolio && Object.values(userData.portfolio).some(link => link) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Portfolio & Links</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="whitespace-pre-line">
                    {userData.education}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Activity section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="p-6 text-center text-gray-500">
                  <div className="mb-3 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <p>No recent activity to display</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>{/* Activity section */}
      </motion.div>
    </div>
  );
};


const SidebarLink = ({ to, icon: Icon, label, isActive, isExpanded }) => {
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-3 rounded-lg transition-colors ${isActive
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
      {isExpanded && (
        <span className="ml-3 transition-opacity duration-200">
          {label}
        </span>
      )}
    </Link>
  );
};

const CompanyDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();          const sidebarRef = useRef(null);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Modified: Responsive behavior - collapse sidebar on smaller screens for desktop only
  useEffect(() => {
    const handleResize = () => {
      // Only adjust sidebar width for desktop view (when mobile menu is closed)
      if (!isMobileMenuOpen) {
        if (window.innerWidth < 1024) {
          setIsSidebarExpanded(false);
        } else {
          setIsSidebarExpanded(true);
        }
      }
    };
    // Set initial state
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Toggle mobile menu - ensure sidebar is expanded when mobile menu opens
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    if (!isMobileMenuOpen) {
      // When opening the mobile menu, ensure sidebar is expanded
      setIsSidebarExpanded(true);
    }
  };

  const navLinks = NAV_LINKS[UserRole.COMPANY.toLowerCase()]
  
  // // Get the current active link
  const getActiveRoute = () => {
    const currentPath = location.pathname;
  
    const activeLink = navLinks.find(link =>
      currentPath === link.to ||
      (link.to !== "/company/dashboard" && currentPath.includes(link.to))
    );
  
    // Make sure only the label (string) is returned
    return activeLink?.label || 'Dashboard';
  };

  const isRouteActive = (path) => {
    if (path === '/company/dashboard') {
      return location.pathname === '/company/dashboard';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-none flex">
      <CustomCursor />
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar - Desktop and Mobile */} 
      <motion.aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md flex flex-col border-r border-blue-100 h-screen overflow-hidden lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        animate={{ 
          // For mobile, always show full width when open
          width: (isSidebarExpanded || isMobileMenuOpen) ? 240 : 80, 
          transition: { duration: 0.3, ease: "easeInOut" }
        }}     onClick={() => setIsMobileMenuOpen(false)}
        transition={{ duration: 0.3 }}
      >
        {/* Logo section */}
        <div className={`py-6 ${(isSidebarExpanded || isMobileMenuOpen) ? 'px-6' : 'px-4'} border-b border-blue-100 flex items-center justify-between`}>
          <Link to="/company/dashboard" className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#4169E1] to-[#79BAEC] text-white p-2 rounded flex-shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <AnimatePresence mode="wait">
              {(isSidebarExpanded || isMobileMenuOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden"
                >
                  SprintFlow
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {/* Toggle sidebar button - desktop only, hidden on mobile */}
          <button 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}       initial={{ opacity: 0, width: 0 }}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
          >
            {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Close button - mobile only */}
          {isMobileMenuOpen && (
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden flex items-center justify-center p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav links - Make this section scrollable if needed */}
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
        {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={isRouteActive(link.to)}
              isExpanded={isSidebarExpanded || isMobileMenuOpen}
            />
          ))}
        </nav>

        {/* User profile section - Keep this at the bottom */}
        <div className={`p-4 border-t border-blue-100 ${(isSidebarExpanded || isMobileMenuOpen) ? 'px-4' : 'px-3'}`}>
          <Link to="/company/dashboard/profile" className={`flex items-center gap-3 ${(isSidebarExpanded || isMobileMenuOpen) ? '' : 'justify-center'} hover:bg-blue-50 p-2 rounded-lg transition-colors`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
              SK
            </div>
            <AnimatePresence mode="wait">
              {(isSidebarExpanded || isMobileMenuOpen) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="whitespace-nowrap">
                    <p className="font-medium text-gray-900">shashant kashyap</p>
                    <p className="text-xs text-gray-500">shashant2538@gmail.com</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area - Make only this part scrollable */}
      <motion.main 
        className="flex-1 min-w-0 h-screen overflow-y-auto bg-gray-50"
        animate={{ marginLeft: isSidebarExpanded ? 0 : 0 }}
      >
        {/* Top Bar - Keep this fixed */}
        <header className="bg-white border-b border-blue-100 sticky top-0 z-10 shadow-sm">
          <div className="px-4 sm:px-6 flex h-16 items-center justify-between">
            {/* Menu button and page title */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none"
                onClick={toggleMobileMenu} // Using the new toggle function
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <h1 className="text-xl font-semibold text-gray-900">{getActiveRoute()}</h1>
            </div>

            {/* User actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="text-gray-500 hover:text-[#4169E1] p-2 rounded-full hover:bg-blue-50">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="text-gray-500 hover:text-[#4169E1] p-2 rounded-full hover:bg-blue-50 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu - mobile only */}
              <button className="lg:hidden text-gray-500 hover:text-[#4169E1] p-2 rounded-full hover:bg-blue-50">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content - This will scroll */}
        <div className="py-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <Routes>
            <Route path="/" element={<MyTasks />} />
            <Route path="/tasks" element={<AllTasks />} />
            {/* <Route path="/all-tasks" element={<AllTasks />} /> */}
            <Route path="/post-task" element={<PostTask />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<UserProfile />} />
            <Route path="payments" element={<CompanyPayments />} />
            
            {/* New routes for task applications */}
            <Route path="/tasks/:taskId/applications" element={<Applications />} />
            <Route path="/tasks/:taskId/applications/:applicationId" element={<Applications />} />
          </Routes>
        </div>
      </motion.main>
    </div>
  );
};

export default CompanyDashboard;