import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Briefcase, Users, DollarSign, Award, 
  Clock, CheckCircle, BarChart2, PieChart, Calendar, 
  ArrowUpRight, Code, Zap, Cpu, Layers, Database, 
  Search, Filter, ChevronDown, ChevronRight, Star, 
  Calendar as CalendarIcon,
  User, MousePointer, ArrowRight, Shield, MessageSquare, 
  BookOpen, Coffee, GitBranch,
  Server,
  Cloud,
  Terminal,
  Layout,
  Box,
  Triangle,
  FileText,
  FileCode
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
import { Progress } from '@/components/ui/progress';
import { 
  AnimatedCard, 
  StaggeredSection, 
  Shimmer, 
  AnimatedCounter,
  GlowContainer
} from '@/components/ui/dashboardAnimations';

// Dummy Data as fallback in case localStorage is empty
const dashboardData = {
  companyName: "TechSolutions Inc.",
  summary: {
    activeProjects: 14,
    totalHires: 82,
    openPositions: 7,
    totalSpent: 124650,
    averageRating: 4.8,
    completionRate: 92
  },
  financialOverview: {
    totalBudget: 250000,
    spent: 124650,
    remaining: 125350,
    projectedSavings: 18500,
    monthlyTrend: [32400, 28700, 35250, 42800, 37500, 45300, 52100, 48900, 56700, 63200, 58900, 67500]
  },
  developerMetrics: {
    topTechnologies: [
      { name: "React", count: 42, color: "#61DAFB" },
      { name: "Node.js", count: 38, color: "#68A063" },
      { name: "Python", count: 27, color: "#3776AB" },
      { name: "TypeScript", count: 23, color: "#3178C6" },
      { name: "Angular", count: 18, color: "#DD0031" }
    ],
    averageHireTime: 8.3, // days
    talentRetention: 86, // percentage
    topPerformers: [
      { id: 1, name: "Alex Morgan", rating: 4.9, projects: 12, skills: ["React", "Node.js", "AWS"] },
      { id: 2, name: "Jamie Chen", rating: 4.9, projects: 9, skills: ["Python", "Django", "Docker"] },
      { id: 3, name: "Taylor Smith", rating: 4.8, projects: 11, skills: ["Angular", "TypeScript", "Firebase"] }
    ]
  },
  projectTimeline: {
    ongoing: [
      { id: 101, name: "E-commerce Platform Redesign", progress: 65, dueDate: "2023-05-15", status: "on_track" },
      { id: 102, name: "Mobile App Backend Development", progress: 42, dueDate: "2023-06-02", status: "at_risk" },
      { id: 103, name: "Data Analytics Dashboard", progress: 78, dueDate: "2023-04-28", status: "on_track" }
    ],
    upcoming: [
      { id: 104, name: "API Integration Project", startDate: "2023-05-10", priority: "high" },
      { id: 105, name: "DevOps Infrastructure Setup", startDate: "2023-05-20", priority: "medium" }
    ]
  },
  recentActivities: [
    { id: 201, type: "hire", message: "New developer hired for Frontend Project", time: "2 hours ago" },
    { id: 202, type: "milestone", message: "Backend integration milestone completed", time: "5 hours ago" },
    { id: 203, type: "review", message: "Project code review completed", time: "1 day ago" },
    { id: 204, type: "payment", message: "Invoice #3892 paid successfully", time: "2 days ago" }
  ],
  recommendations: [
    { id: 301, name: "Optimize testing pipeline", benefit: "Reduce deployment time by 35%" },
    { id: 302, name: "Increase senior developer allocation", benefit: "Improve code quality metrics" },
    { id: 303, name: "Implement agile sprints", benefit: "Better milestone tracking" }
  ]
};

// Quick Stats Component with Animation
const QuickStatCard = ({ icon: Icon, title, value, unit, subtitle, accentColor, delay }) => {
  return (
    <AnimatedCard delay={delay}>
      <GlowContainer color={accentColor}>
        <Card className="bg-white backdrop-blur-sm border-opacity-50 overflow-hidden h-full">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-${accentColor}-100 flex items-center justify-center`}>
                  <Icon className={`text-${accentColor}-600`} size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <div className="flex items-baseline">
                  <AnimatedCounter 
                    value={value} 
                    className={`text-3xl font-bold text-${accentColor}-600`}
                  />
                  {unit && <span className="text-sm ml-1 text-gray-500">{unit}</span>}
                </div>
                <Badge variant={accentColor} className="capitalize">
                  <TrendingUp size={12} className="mr-1" />
                  Active
                </Badge>
              </div>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </GlowContainer>
    </AnimatedCard>
  );
};

// Animated Progress Bar Component
const AnimatedProgressBar = ({ value, color }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return <Progress value={progress} className={`h-2 bg-${color}-100`} indicatorColor={color} />;
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  const statusColors = {
    on_track: "green",
    at_risk: "yellow",
    behind: "red"
  };
  
  const color = statusColors[project.status] || "blue";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="cursor-pointer"
    >
      <Card className="border-l-4" style={{ borderLeftColor: `var(--${color}-600)` }}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base text-gray-800">{project.name}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <CalendarIcon size={14} className="mr-1" />
                Due: {new Date(project.dueDate).toLocaleDateString()}
              </div>
            </div>
            <Badge variant={color} className="capitalize">{project.status.replace("_", " ")}</Badge>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <AnimatedProgressBar value={project.progress} color={color} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Developer Card Component
const DeveloperCard = ({ developer, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * index, duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-blue-100">
        <CardContent className="p-0">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {developer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        size={14} 
                        fill={i < Math.floor(developer.rating) ? "currentColor" : "none"} 
                        className={`${i < Math.floor(developer.rating) ? "text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs font-medium">{developer.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase size={14} className="mr-2" />
                <span>{developer.projects} completed projects</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {developer.skills.map((skill, idx) => (
                  <Badge key={idx} variant="blue" className="bg-blue-50">
                    {skill === "React" && <Code size={10} className="mr-1" />}
                    {skill === "Node.js" && <Server size={10} className="mr-1" />}
                    {skill === "AWS" && <Cloud size={10} className="mr-1" />}
                    {skill === "Python" && <Terminal size={10} className="mr-1" />}
                    {skill === "Django" && <Layout size={10} className="mr-1" />}
                    {skill === "Docker" && <Box size={10} className="mr-1" />}
                    {skill === "Angular" && <Triangle size={10} className="mr-1" />}
                    {skill === "TypeScript" && <FileCode size={10} className="mr-1" />}
                    {skill === "Firebase" && <Database size={10} className="mr-1" />}
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -mr-2">
                View Profile
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Timeline Component
const Timeline = ({ activities }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'hire': return <User className="text-blue-600" size={16} />;
      case 'milestone': return <CheckCircle className="text-green-600" size={16} />;
      case 'review': return <BookOpen className="text-purple-600" size={16} />;
      case 'payment': return <DollarSign className="text-amber-600" size={16} />;
      default: return <Calendar className="text-gray-600" size={16} />;
    }
  };
  
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div 
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          className="flex gap-3"
        >
          <div className="relative flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
              {getIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-blue-100 z-0" />
            )}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm text-gray-800">{activity.message}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Finance Chart Component
const FinanceChart = ({ data }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxValue = Math.max(...data);
  
  return (
    <div className="space-y-3">
      <div className="h-[180px] flex items-end gap-2">
        {data.map((value, index) => (
          <motion.div 
            key={index}
            className="relative group flex-1 bg-blue-100 rounded-t-md"
            initial={{ height: 0 }}
            animate={{ height: `${(value / maxValue) * 100}%` }}
            transition={{ delay: 0.05 * index, duration: 0.7, type: "spring" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 opacity-80 rounded-t-md"></div>
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ${value.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between">
        {months.map((month, index) => (
          <div key={index} className="text-xs text-gray-500">{month}</div>
        ))}
      </div>
    </div>
  );
};

// Technology Distribution Component
const TechDistribution = ({ technologies }) => {
  const total = technologies.reduce((sum, tech) => sum + tech.count, 0);
  
  return (
    <div className="space-y-4">
      {technologies.map((tech, index) => (
        <motion.div 
          key={tech.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.4 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: tech.color }}></span>
              <span>{tech.name}</span>
            </div>
            <span className="font-medium">{Math.round((tech.count / total) * 100)}%</span>
          </div>
          <motion.div 
            className="h-2 rounded-full bg-gray-100 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.1 * index + 0.2, duration: 0.6 }}
          >
            <motion.div 
              className="h-full rounded-full" 
              style={{ backgroundColor: tech.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(tech.count / total) * 100}%` }}
              transition={{ delay: 0.1 * index + 0.4, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Budget Donut Chart Component
const BudgetDonutChart = ({ total, spent }) => {
  const percentage = Math.round((spent / total) * 100);
  const circumference = 2 * Math.PI * 42; // 42 is radius
  const dashOffset = circumference * (1 - percentage / 100);
  
  const [offset, setOffset] = useState(circumference);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(dashOffset);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dashOffset]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            fill="none" 
            stroke="#E5E7EB" 
            strokeWidth="8"
          />
          
          {/* Progress circle with animation */}
          <circle 
            cx="50" 
            cy="50" 
            r="42"
            fill="none" 
            stroke="url(#blue-gradient)" 
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
          />
          
          <defs>
            <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-sm text-gray-500">Spent</div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">Total Budget</div>
          <div className="text-xl font-semibold text-gray-900">${total.toLocaleString()}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500">Spent</div>
          <div className="text-xl font-semibold text-blue-600">${spent.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ recommendation, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="cursor-pointer group"
    >
      <Card className="border-blue-100 group-hover:border-blue-300 transition-colors duration-300">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Zap size={16} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {recommendation.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{recommendation.benefit}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Dashboard Component
const CompanyViewDashboard = () => {
  const { user, companyProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Handle navigation to applicants page
  const handleViewApplicants = (taskId) => {
    navigate(`/dashboard/applications/${taskId}`);
  };
  
  // Get company name from profile or use fallback
  const getCompanyName = () => {
    if (companyProfile && companyProfile.companyName) {
      return companyProfile.companyName;
    } else if (user && user.companyProfiles && user.companyProfiles.length > 0) {
      return user.companyProfiles[0].companyName;
    }
    return dashboardData.companyName;
  };
  
  if (isLoading) {
    // Loading skeleton
    return (
      <div className="p-6 space-y-8">
        <Shimmer width="w-1/4" height="h-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="border-gray-100">
              <CardContent className="p-6">
                <Shimmer width="w-1/2" height="h-6" className="mb-4" />
                <Shimmer width="w-2/3" height="h-8" />
                <Shimmer width="w-full" height="h-4" className="mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-100">
            <CardContent className="p-6">
              <Shimmer width="w-1/3" height="h-6" className="mb-4" />
              <Shimmer width="w-full" height="h-40" />
            </CardContent>
          </Card>
          <Card className="border-gray-100">
            <CardContent className="p-6">
              <Shimmer width="w-1/3" height="h-6" className="mb-4" />
              <Shimmer width="w-full" height="h-40" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 py-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back, {getCompanyName()}
          </motion.h1>
          <motion.p 
            className="text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Here's what's happening with your projects and talent pool today
          </motion.p>
        </div>
        
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button variant="outline" className="gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Briefcase size={16} />
            Post New Project
          </Button>
        </motion.div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-6">
        <QuickStatCard 
          icon={Briefcase} 
          title="Active Projects" 
          value={dashboardData.summary.activeProjects} 
          subtitle="3 due this week" 
          accentColor="blue"
          delay={0.1}
        />
        
        <QuickStatCard 
          icon={Users} 
          title="Total Hires" 
          value={dashboardData.summary.totalHires}
          subtitle="82% retention rate" 
          accentColor="purple"
          delay={0.2}
        />
        
        <QuickStatCard 
          icon={DollarSign} 
          title="Total Spent" 
          value={dashboardData.financialOverview.spent}
          unit="USD"
          subtitle="49.8% of budget used" 
          accentColor="green"
          delay={0.3}
        />
        
        <QuickStatCard 
          icon={Award} 
          title="Completion Rate" 
          value={dashboardData.summary.completionRate}
          unit="%"
          subtitle="6% increase from last month" 
          accentColor="amber"
          delay={0.4}
        />
        
        {/* Add a new QuickStatCard for Applicants */}
        <AnimatedCard delay={0.5}>
          <GlowContainer color="indigo">
            <Card className="bg-white backdrop-blur-sm border-opacity-50 overflow-hidden h-full cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => handleViewApplicants("task-123")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Users className="text-indigo-600" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Applicants</h3>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline">
                      <AnimatedCounter 
                        value={27} 
                        className="text-3xl font-bold text-indigo-600"
                      />
                      <span className="text-sm ml-1 text-gray-500">new</span>
                    </div>
                    <Badge variant="indigo" className="capitalize">
                      <TrendingUp size={12} className="mr-1" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">View all applications</p>
                </div>
              </CardContent>
            </Card>
          </GlowContainer>
        </AnimatedCard>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart Section - Budget Overview */}
          <Card className="border-blue-100/60">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Monthly spending and project allocation</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <Filter size={14} className="mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <FinanceChart data={dashboardData.financialOverview.monthlyTrend} />
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500 mb-1">Projected Savings</p>
                  <p className="text-xl font-bold text-blue-600">${dashboardData.financialOverview.projectedSavings.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500 mb-1">Average Project Cost</p>
                  <p className="text-xl font-bold text-green-600">$8,900</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-500 mb-1">Developer Rate</p>
                  <p className="text-xl font-bold text-purple-600">$62/hr</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Projects Section */}
          <Card className="border-blue-100/60">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Current Projects</CardTitle>
                  <CardDescription>Track progress and upcoming deadlines</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  All Projects
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {dashboardData.projectTimeline.ongoing.map((project, idx) => (
                  <ProjectCard key={project.id} project={project} index={idx} />
                ))}
              </div>
              
              {/* Upcoming Projects */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-3">Upcoming Projects</h3>
                <div className="space-y-2">
                  {dashboardData.projectTimeline.upcoming.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx + 0.2, duration: 0.4 }}
                      className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${project.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Starts {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Budget Donut Chart */}
          <Card className="border-blue-100/60">
            <CardHeader className="pb-0">
              <CardTitle>Budget Utilization</CardTitle>
              <CardDescription>Total spending against allocated budget</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <BudgetDonutChart 
                total={dashboardData.financialOverview.totalBudget}
                spent={dashboardData.financialOverview.spent}
              />
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Remaining Budget</span>
                  <span className="font-medium text-gray-800">${dashboardData.financialOverview.remaining.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity Timeline */}
          <Card className="border-blue-100/60">
            <CardHeader className="pb-0">
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from your projects</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Timeline activities={dashboardData.recentActivities} />
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All Activities
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Bottom Section - Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Technology Distribution */}
        <Card className="border-blue-100/60">
          <CardHeader className="pb-0">
            <CardTitle>Technology Distribution</CardTitle>
            <CardDescription>Most used technologies in your projects</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <TechDistribution technologies={dashboardData.developerMetrics.topTechnologies} />
          </CardContent>
        </Card>
        
        {/* Top Performing Talent */}
        <Card className="border-blue-100/60">
          <CardHeader className="pb-0">
            <CardTitle>Top Developers</CardTitle>
            <CardDescription>Your highest rated talent</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {dashboardData.developerMetrics.topPerformers.map((developer, idx) => (
              <DeveloperCard key={developer.id} developer={developer} index={idx} />
            ))}
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full justify-center">
              Browse Talent Pool
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recommendations */}
        <Card className="border-blue-100/60">
          <CardHeader className="pb-0">
            <CardTitle>Smart Recommendations</CardTitle>
            <CardDescription>AI-powered suggestions to optimize your projects</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {dashboardData.recommendations.map((recommendation, idx) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} index={idx} />
            ))}
          </CardContent>
          <CardFooter className="pt-0 flex gap-2">
            <Button variant="outline" className="flex-1">Dismiss All</Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Apply</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanyViewDashboard;
