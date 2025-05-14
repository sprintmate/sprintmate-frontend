import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, CheckCircle2, TrendingUp, Users, Clock, ArrowRight, Code, DollarSign, Calendar, X } from 'lucide-react';
import { getToken } from '../../services/authService';
import axios from 'axios';
import CurrencyFormatter from '../ui/CurrencyFormatter';
import { capitalizeWords, formatDate } from '../../utils/applicationUtils';
import { getDeveloperStatistics } from '../../services/developerService';
import DashboardStats from '../common/DashboardAnalyticsStats';

const DeveloperHome = ({ developer }) => {
  // Extract developer skills
  const skills = developer?.developerProfiles?.[0]?.skills?.split(',') || [];
  const name = developer?.name || 'Developer';
  const firstName = name.split(' ')[0];

  const developerId = developer?.developerProfiles?.[0].externalId;


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
        const response = await getDeveloperStatistics();
        console.log('response from api ', response);
        setStatusStats(response);
        // }
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

  // State for recent activities
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setActivitiesLoading(true);
        const token = getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/developers/applications?size=3&page=0&sort=createdAt,desc`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.data && Array.isArray(response.data.content)) {
          setRecentActivities(response.data.content);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchRecentActivities();
  }, []);

  const navigate = useNavigate(); // Hook for navigation

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
              <Link to={`/developer/dashboard/profile/${developerId}`} className="text-blue-600 hover:underline ml-1">
                {capitalizeWords(firstName)}!
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
      <DashboardStats data={statusStats} />

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
          <CardHeader >
            <div className="flex justify-between items-center">
              <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest applications and updates</CardDescription>
            </div>
            <div>
              <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/developer/dashboard/applications')}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              View All
            </Button>
            </div>
            </div>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="text-center py-8 text-gray-500">Loading recent activities...</div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.externalId}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-900">{activity.task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {activity.task.description || 'No description available'}
                    </p>
                    <div className="mt-3 flex justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Applied on {new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>Status: {activity.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent activities found.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeveloperHome;
