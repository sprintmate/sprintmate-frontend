import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, CheckCircle2, TrendingUp, Users, Clock, ArrowRight, Code, DollarSign, Calendar } from 'lucide-react';

const DeveloperHome = ({ developer }) => {
  // Extract developer skills
  const skills = developer?.developerProfiles?.[0]?.skills?.split(',') || [];
  const name = developer?.name || 'Developer';
  const firstName = name.split(' ')[0];

  // Mock data for recommended projects
  const recommendedProjects = [
    {
      id: 1,
      title: "E-commerce Platform Frontend",
      description: "Build a responsive e-commerce frontend with React and Redux",
      budget: "₹70,000",
      deadline: "2 weeks",
      skills: ["React", "Redux", "JavaScript"],
      company: "TechSolutions Inc.",
      postedDate: "2 days ago",
      applicants: 7
    },
    {
      id: 2,
      title: "API Integration for Payment Gateway",
      description: "Integrate multiple payment gateways into an existing Node.js application",
      budget: "₹40,000",
      deadline: "1 week",
      skills: ["Node.js", "API", "Payment Gateway"],
      company: "FinTech Solutions",
      postedDate: "5 days ago",
      applicants: 12
    },
    {
      id: 3,
      title: "Database Optimization for High-Traffic App",
      description: "Optimize MySQL queries and database structure for performance",
      budget: "₹55,000",
      deadline: "10 days",
      skills: ["MySQL", "Database Optimization", "SQL"],
      company: "DataFlow Systems",
      postedDate: "1 day ago",
      applicants: 4
    }
  ];

  // Stats data
  const stats = [
    { 
      title: "Available Projects", 
      value: "145", 
      icon: <Briefcase className="h-4 w-4 text-blue-600" />, 
      color: "blue" 
    },
    { 
      title: "Applied Projects", 
      value: developer?.developerProfiles?.[0]?.applications ? Object.keys(developer.developerProfiles[0].applications).length : "0", 
      icon: <CheckCircle2 className="h-4 w-4 text-green-600" />, 
      color: "green" 
    },
    { 
      title: "Active Developers", 
      value: "1,240", 
      icon: <Users className="h-4 w-4 text-purple-600" />, 
      color: "purple" 
    },
    { 
      title: "Average Response", 
      value: "24h", 
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}!</h1>
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
          {recommendedProjects.map((project, index) => (
            <motion.div
              key={`project-${project.id}`} // Use a unique key with project id
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
                        {project.budget}
                      </Badge>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.skills.map((skill, skillIndex) => (
                        <Badge key={`project-${project.id}-skill-${skillIndex}`} variant="outline" className="text-xs bg-blue-50 border-blue-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{project.applicants} applied</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-gray-500">{project.postedDate}</span>
                    <Button variant="outline" size="sm" className="gap-1">
                      View Details
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
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
