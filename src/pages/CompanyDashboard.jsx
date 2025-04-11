import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
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
  ArrowUpRight
} from 'lucide-react';
import CustomCursor from '@/components/ui/CustomCursor';
import PostTaskForm from '@/components/dashboard/PostTaskForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AnimatedCard, 
  StaggeredSection, 
  Shimmer, 
  AnimatedCounter,
  GlowContainer
} from '@/components/ui/dashboardAnimations';

// Import our new company dashboard view component
import CompanyViewDashboard from '@/components/dashboard/companyViewDashboard';

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
  const scrollRef = useRef(null);
  
  // Remove the scroll-based opacity and scale transformation
  // We'll keep the ref for other potential uses
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });
  
  // These variables are no longer tied to scroll position
  // const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Enhanced data for more detailed views
  const recentTasks = [
    {
      id: 1,
      title: "Frontend Developer for Dashboard UI",
      description: "Looking for a skilled frontend developer to create a modern dashboard interface with responsive design and advanced data visualization components.",
      applications: 12,
      status: "active",
      posted: "2 days ago",
      deadline: "Apr 15, 2025",
      budget: "$2,000 - $3,500",
      techStack: ["React", "TypeScript", "Tailwind"],
      applicants: [
        { id: 101, name: "Alex Johnson", rating: 4.9, experience: "5 years" },
        { id: 102, name: "Sarah Chen", rating: 4.7, experience: "3 years" }
      ],
      priority: "High",
      duration: "2 weeks",
      views: 156
    },
    {
      id: 2,
      title: "Backend API Development",
      description: "Need an experienced developer to build robust RESTful APIs with proper authentication, data validation, and comprehensive documentation.",
      applications: 8,
      status: "reviewing",
      posted: "1 day ago",
      deadline: "Apr 20, 2025",
      budget: "$2,500 - $4,000",
      techStack: ["Node.js", "Express", "MongoDB"],
      applicants: [
        { id: 103, name: "Michael Lee", rating: 4.5, experience: "4 years" }
      ],
      priority: "Medium",
      duration: "3 weeks",
      views: 89
    },
    {
      id: 5,
      title: "DevOps Engineer for CI/CD Pipeline",
      description: "Setting up automated CI/CD pipelines with Docker and Kubernetes for our microservices architecture.",
      applications: 5,
      status: "active",
      posted: "3 days ago",
      deadline: "Apr 25, 2025",
      budget: "$3,000 - $5,000",
      techStack: ["Docker", "Kubernetes", "Jenkins"],
      applicants: [
        { id: 107, name: "David Miller", rating: 4.8, experience: "6 years" }
      ],
      priority: "High",
      duration: "4 weeks",
      views: 72
    }
  ];

  const pastTasks = [
    {
      id: 3,
      title: "Mobile App Development",
      description: "Cross-platform mobile app development project with React Native for iOS and Android platforms.",
      status: "completed",
      hired: "John Doe",
      completedDate: "March 15, 2025",
      duration: "4 weeks",
      budget: "$4,200",
      finalCost: "$4,000",
      techStack: ["React Native", "Firebase", "Redux"],
      rating: 4.8,
      feedback: "Excellent work, delivered on time with great attention to detail."
    },
    {
      id: 4,
      title: "Database Optimization",
      description: "Optimize database performance and queries for our e-commerce platform to handle increased traffic.",
      status: "completed",
      hired: "Jane Smith",
      completedDate: "March 1, 2025",
      duration: "2 weeks",
      budget: "$1,800",
      finalCost: "$1,800",
      techStack: ["PostgreSQL", "Redis", "SQL"],
      rating: 5.0,
      feedback: "Outstanding performance improvements. Queries are now 10x faster."
    },
    {
      id: 6,
      title: "UI/UX Redesign for Mobile App",
      description: "Complete redesign of our mobile app interface with modern design principles and improved user flows.",
      status: "completed",
      hired: "Emma Wilson",
      completedDate: "February 20, 2025",
      duration: "3 weeks",
      budget: "$2,500",
      finalCost: "$2,350",
      techStack: ["Figma", "Adobe XD", "Sketch"],
      rating: 4.9,
      feedback: "Creative designs that perfectly matched our brand identity. Users love the new interface!"
    }
  ];

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

  // Detailed task activity data for visualization
  const taskActivityData = {
    daily: [25, 36, 42, 29, 38, 46, 53],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-[1500px] mx-auto">
      {/* Hero Section with Animated Elements - Now always visible */}
      <motion.div 
        ref={scrollRef}
        className="relative rounded-2xl p-6 sm:p-8 mb-8 overflow-hidden"
        // Remove the scroll-dependent style
        // style={{ opacity, scale }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background */}
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
                cy: [30, 40, 30],
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
                cy: [70, 60, 70],
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
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                My Tasks Dashboard
                <motion.div
                  className="ml-3 inline-flex items-center"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <span className="bg-white/20 backdrop-blur-sm text-xs rounded-full py-1 px-2 flex items-center gap-1 font-normal">
                    <Sparkles size={12} className="text-yellow-300" />
                    <span>April 2025</span>
                  </span>
                </motion.div>
              </h1>
            </div>
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
              <button className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-blue-700 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors">
                <Zap size={16} />
                <span className="hidden sm:inline">Post New Task</span>
                <span className="sm:hidden">New</span>
              </button>
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

      {/* Time Period Selector */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200/60 mb-8">
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
                  <div className="text-sm flex flex-col items-end">
                    <div className="text-gray-500 font-medium text-xs">Time to hire</div>
                    <div className="flex items-center gap-1 text-purple-600 font-medium">
                      <Clock size={14} />
                      <span>{analytics.timeToHire} days</span>
                    </div>
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
        <div className="lg:col-span-2">
          <StaggeredSection 
            title="Recent Tasks"
            delay={0.5}
            staggerDelay={0.15}
            actionButton={
              <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 gap-1">
                View All
                <ChevronRight size={16} />
              </Button>
            }
          >
            {recentTasks.map((task) => (
              <div key={task.id} className="group">
                <Card className="overflow-hidden backdrop-blur-sm border-blue-100/50 hover:border-blue-200/70 transition-all duration-300">
                  <CardContent className="relative p-4 sm:p-5">
                    {/* Status indicator line with animation */}
                    <motion.div 
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        task.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pl-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
                          <div className="mr-3">
                            {task.status === 'active' ? (
                              <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center">
                                <Laptop size={15} className="text-blue-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-amber-100/80 flex items-center justify-center">
                                <Server size={15} className="text-amber-600" />
                              </div>
                            )}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </h3>
                          
                          <div className="sm:ml-auto sm:pl-2 flex gap-2">
                            <Badge 
                              variant={task.status === 'active' ? 'blue' : 'yellow'} 
                              gradient 
                              glow 
                              size="sm"
                              className="capitalize"
                            >
                              {task.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1 animate-pulse" />}
                              {task.status}
                            </Badge>
                            <Badge 
                              variant={task.priority === 'High' ? 'red' : 'blue'} 
                              size="sm"
                              className="capitalize hidden sm:flex"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2 pl-11">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3 pl-11">
                          {task.techStack.map((tech, idx) => (
                            <motion.div
                              key={tech}
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
                                {tech === "React" && <Code size={12} className="mr-1" />}
                                {tech === "Node.js" && <Server size={12} className="mr-1" />}
                                {tech === "MongoDB" && <Database size={12} className="mr-1" />}
                                {tech === "Docker" && <Blocks size={12} className="mr-1" />}
                                {tech === "Kubernetes" && <Cpu size={12} className="mr-1" />}
                                {tech === "Jenkins" && <GitBranch size={12} className="mr-1" />}
                                {tech === "TypeScript" && <FileCode size={12} className="mr-1" />}
                                {tech === "Express" && <Server size={12} className="mr-1" />}
                                {tech === "Tailwind" && <Braces size={12} className="mr-1" />}
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 mt-4 pt-3 border-t border-gray-100 pl-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-blue-500" />
                            Deadline: {task.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={12} className="text-blue-500" />
                            {task.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Timer size={12} className="text-blue-500" />
                            {task.duration}
                          </span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Users2 size={12} className="text-blue-500" />
                            {task.applications} applicants
                          </span>
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
                          onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
                        >
                          <Users size={14} className="mr-1" />
                          <span className="hidden sm:inline">Applicants</span>
                          <span className="sm:hidden">{task.applicants.length}</span>
                        </Button>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 -mr-2 group h-8">
                        <span className="hidden sm:inline">Details</span>
                        <motion.div
                          className="inline-block ml-1"
                          whileHover={{ x: 2, y: -2 }}
                        >
                          <ArrowUpRight size={14} />
                        </motion.div>
                      </Button>
                    </div>
                    
                    {/* Applicants panel (collapsible) */}
                    <AnimatePresence>
                      {selectedTask === task.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-gray-100 pl-3 pt-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-800 flex items-center">
                              <UserCheck size={14} className="mr-2 text-blue-500" />
                              Top Applicants
                            </h4>
                            <Badge variant="blue" size="sm">{task.applicants.length} total</Badge>
                          </div>
                          <div className="space-y-2">
                            {task.applicants.map((applicant) => (
                              <div 
                                key={applicant.id} 
                                className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
                                    {applicant.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{applicant.name}</p>
                                    <p className="text-xs text-gray-500">{applicant.experience}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center">
                                    <Star size={12} className="text-amber-400" fill="currentColor" />
                                    <span className="text-xs font-medium ml-1">{applicant.rating}</span>
                                  </div>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-600">View</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            ))}
          </StaggeredSection>
        </div>

        {/* Past Tasks - Minor Half */}
        <div>
          <StaggeredSection 
            title="Completed Tasks"
            delay={0.7}
            staggerDelay={0.15}
            actionButton={
              <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 gap-1">
                History
                <ChevronRight size={16} />
              </Button>
            }
          >
            {pastTasks.map((task) => (
              <div key={task.id} className="group">
                <Card className="bg-white border-green-100/50 hover:border-green-200/70 transition-all duration-300">
                  <CardContent className="relative p-4 sm:p-5">
                    {/* Status indicator line with animation */}
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    <div className="flex justify-between items-start gap-4 pl-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
                          <div className="w-8 h-8 rounded-lg bg-green-100/80 flex items-center justify-center mr-3">
                            <FileCheck size={15} className="text-green-600" />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                            {task.title}
                          </h3>
                          <Badge 
                            variant="green" 
                            gradient 
                            glow 
                            size="sm" 
                            className="capitalize flex items-center gap-1 sm:ml-auto sm:pl-2"
                          >
                            <CheckCircle2 size={12} />
                            {task.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2 pl-11">
                          {task.techStack.map((tech, idx) => (
                            <motion.div
                              key={tech}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + (idx * 0.1) }}
                            >
                              <Badge
                                variant="green"
                                size="sm"
                                className="bg-green-50/80"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="ml-11 mt-2 space-y-1">
                          <p className="text-sm text-gray-700 flex items-center">
                            <Users2 size={14} className="text-green-500 mr-1.5" />
                            <span className="font-medium">{task.hired}</span>
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="text-green-500 mr-1.5" />
                            {task.completedDate}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <DollarSign size={12} className="text-green-500 mr-1.5" />
                            Budget: {task.budget} / Final: {task.finalCost}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 pl-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <motion.div
                            key={`star-${task.id}-${idx}`}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            whileHover={{ scale: 1.2 }}
                            className="cursor-pointer"
                          >
                            <Star
                              size={14}
                              fill={idx < Math.floor(task.rating) ? "currentColor" : "none"}
                              className={idx < Math.floor(task.rating) ? "" : "text-gray-300"}
                            />
                          </motion.div>
                        ))}
                        <span className="ml-1 text-sm font-medium text-gray-700">{task.rating}</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50/50 -mr-2 group h-8"
                      >
                        <span className="hidden sm:inline">Details</span>
                        <motion.div
                          className="inline-block ml-1"
                          whileHover={{ x: 2, y: -2 }}
                        >
                          <ArrowUpRight size={14} />
                        </motion.div>
                      </Button>
                    </div>
                    
                    {/* Feedback summary (always shown) */}
                    <div className="mt-3 pt-3 border-t border-gray-100 pl-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 italic line-clamp-2">
                          "{task.feedback}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </StaggeredSection>
        </div>
      </div>
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

// Applications Component
const Applications = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-6">Applications</h2>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4">
        <p>Developer applications will appear here</p>
      </div>
    </div>
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

// Sidebar Link Component for better organization and styling
const SidebarLink = ({ to, icon, label, isExpanded, isActive }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 font-medium border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-blue-50/50 hover:text-blue-600'
        }
      `}
    >
      <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

const CompanyDashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);
  
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

  // Navbar links configuration - using absolute paths for proper routing
  const navLinks = [
    { to: "/company/dashboard", icon: <Home size={20} />, label: 'Dashboard' },
    { to: "/company/dashboard/tasks", icon: <CheckSquare size={20} />, label: 'My Tasks' },
    { to: "/company/dashboard/post-task", icon: <FileText size={20} />, label: 'Post Task' },
    { to: "/company/dashboard/applications", icon: <Users size={20} />, label: 'Applications' },
    { to: "/company/dashboard/settings", icon: <Settings size={20} />, label: 'Settings' }
  ];

  // Get the current active link
  const getActiveRoute = () => {
    const currentPath = location.pathname;
    const activeLink = navLinks.find(link => 
      currentPath === link.to || 
      (link.to !== "/company/dashboard" && currentPath.includes(link.to))
    );
    return activeLink ? activeLink.label : 'Dashboard';
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
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md flex flex-col border-r border-blue-100
                  lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        animate={{ 
          // For mobile, always show full width when open
          width: (isSidebarExpanded || isMobileMenuOpen) ? 240 : 80,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
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
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
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
        
        {/* Nav links */}
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isExpanded={isSidebarExpanded || isMobileMenuOpen}
              isActive={
                link.to === location.pathname || 
                (link.to !== "/company/dashboard" && location.pathname.includes(link.to))
              }
            />
          ))}
        </nav>
        
        {/* User profile section */}
        <div className={`p-4 border-t border-blue-100 ${(isSidebarExpanded || isMobileMenuOpen) ? 'px-4' : 'px-3'}`}>
          <div className={`flex items-center gap-3 ${(isSidebarExpanded || isMobileMenuOpen) ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-medium">
              SC
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
                    <p className="font-medium text-gray-900">Sam Cooper</p>
                    <p className="text-xs text-gray-500">sam@example.com</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {(isSidebarExpanded || isMobileMenuOpen) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50/50"
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </Button>
            </motion.div>
          )}
        </div>
      </motion.aside>
      
      {/* Main Content Area */}
      <motion.main 
        className="flex-1 min-w-0 min-h-screen"
        animate={{ 
          marginLeft: isSidebarExpanded ? 0 : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Bar */}
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
        
        {/* Page Content */}
        <div className="py-4">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/post-task" element={<PostTask />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </motion.main>
    </div>
  );
};

export default CompanyDashboard;