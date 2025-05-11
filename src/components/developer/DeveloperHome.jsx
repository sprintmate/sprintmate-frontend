import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, CheckCircle2, TrendingUp, Users, Clock, ArrowRight, Code, DollarSign, Calendar, X } from 'lucide-react';
import { getToken } from '../../services/authService';
import axios from 'axios';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { formatDate } from '../../utils/applicationUtils';

const DeveloperHome = ({ developer }) => {
  // Extract developer skills
  const skills = developer?.developerProfiles?.[0]?.skills?.split(',') || [];
  const name = developer?.name || 'Developer';
  const firstName = name.split(' ')[0];


  // State for recommended projects from API
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProjects = async () => {
      try {
        setProjectsLoading(true);
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/developers/tasks?page=0&size=3&sort=createdAt,desc`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        if (response.data && Array.isArray(response.data.content)) {
          setRecommendedProjects(response.data.content);
        } else {
          setRecommendedProjects([]);
        }
      } catch (err) {
        setRecommendedProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchRecommendedProjects();
  }, []);

  const statusColors = {
    "Shortlisted": "blue",
    "Submitted": "amber",
    "Completed": "green",
    "In Progress": "purple",
    "Withdrawn": "gray",
    "Cancelled": "red",
    "Rejected": "red"
  };

  const statusIcons = {
    "Shortlisted": <CheckCircle2 className="h-4 w-4 text-blue-600" />,
    "Submitted": <Briefcase className="h-4 w-4 text-amber-600" />,
    "Completed": <CheckCircle2 className="h-4 w-4 text-green-600" />,
    "In Progress": <Clock className="h-4 w-4 text-purple-600" />,
    "Withdrawn": <X className="h-4 w-4 text-gray-600" />,
    "Cancelled": <X className="h-4 w-4 text-red-600" />,
    "Rejected": <X className="h-4 w-4 text-red-600" />
  };

  // State for statistics from API
  const [statsData, setStatsData] = useState({
    availableProjects: 0,
    appliedProjects: 0,
    activeDevelopers: 0,
    averageResponse: "N/A"
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statusStats, setStatusStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const token = getToken();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/developers/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}` // <-- Fix: add Bearer
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStatsData({
            availableProjects: data.availableProjects ?? 0,
            appliedProjects: data.appliedProjects ?? 0,
            activeDevelopers: data.activeDevelopers ?? 0,
            averageResponse: data.averageResponse ?? "N/A"
          });
          setStatusStats(data);
        }
      } catch (err) {
        // Optionally handle error
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Available Projects",
      value: statsLoading ? "..." : statsData.availableProjects,
      icon: <Briefcase className="h-4 w-4 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Applied Projects",
      value: statsLoading ? "..." : statsData.appliedProjects,
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      color: "green"
    },
    {
      title: "Active Developers",
      value: statsLoading ? "..." : statsData.activeDevelopers,
      icon: <Users className="h-4 w-4 text-purple-600" />,
      color: "purple"
    },
    {
      title: "Average Response",
      value: statsLoading ? "..." : statsData.averageResponse,
      icon: <Clock className="h-4 w-4 text-amber-600" />,
      color: "amber"
    }
  ];

  return (
    <div className="px-4 md:px-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-blue-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome ,
              <Link to={`/developer/profile/${developer?.userId}`} className="text-blue-600 hover:underline ml-1">
                {firstName}!
              </Link>
            </h1>
            <p className="mt-1 text-gray-600">Here's what's happening with your applications and recommended projects.</p>
          </div>
          <Link to="/developer/dashboard/projects">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Search size={16} />
              Find Projects
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={`stat-${index}`} // Use a unique key
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <span className={`text-${stat.color}-600 text-sm font-medium flex items-center gap-1`}>
                    <TrendingUp size={14} />
                    Active
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Application Status Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusStats).map(([status, count], idx) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-lg bg-${statusColors[status] || "gray"}-50 flex items-center justify-center`}>
                    {statusIcons[status] || <Briefcase className="h-4 w-4 text-gray-600" />}
                  </div>
                  <span className={`text-${statusColors[status] || "gray"}-600 text-sm font-medium`}>
                    {status}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-bold text-gray-900">{statsLoading ? "..." : count}</h3>
                  <p className="text-sm text-gray-500">{status}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Skills section */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Skills</CardTitle>
              <CardDescription>Projects are matched based on these skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={`skill-${index}`} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                    <Code size={12} className="mr-1" />
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommended Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recommended Projects</h2>
          <Link to="/developer/dashboard/projects" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View all projects
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <Card key={idx} className="h-full border-gray-100 animate-pulse">
                <CardContent className="p-0">
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-5 w-16 bg-gray-100 rounded"></div>
                      <div className="h-5 w-16 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : recommendedProjects.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No recommended projects found.
            </div>
          ) : (
            recommendedProjects.map((project, index) => (
              <motion.div
                key={`project-${project.id || project.externalId || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-gray-100 hover:border-blue-200 transition-colors">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{project.title}</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {/* Show currency with cost if available */}
                          <CurrencyFormatter currency={project.currency}>
                            {project.expectedEarnings}
                          </CurrencyFormatter>
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(project.skills ? project.skills.split(',') : project.tags ? project.tags.split(',') : []).map((skill, skillIndex) => (
                          <Badge key={`project-${project.id || project.externalId}-${skillIndex}`} variant="outline" className="text-xs bg-blue-50 border-blue-100">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {project.deadline
                              ? formatDate(project.deadline)
                              : project.deadlineDate
                                ? formatDate(project.deadline)
                                : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>
                            {project.applicants !== undefined
                              ? project.applicants
                              : project.applicationsCount !== undefined
                                ? project.applicationsCount
                                : 0} applied
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {project.postedDate
                          ? project.postedDate
                          : project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : ''}
                      </span>
                      <Button variant="outline" size="sm" className="gap-1">
                        View Details
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest applications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {developer?.developerProfiles?.[0]?.applications &&
              Object.keys(developer.developerProfiles[0].applications).length > 0 ? (
              <div className="space-y-4">
                {/* Add application history here */}
                <p>Your recent application activity will appear here.</p>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                  Start exploring projects and applying to find your next opportunity.
                </p>
                <Link to="/developer/dashboard/projects" className="mt-4 inline-block">
                  <Button className="gap-2">
                    <Search size={16} />
                    Browse Projects
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeveloperHome;
