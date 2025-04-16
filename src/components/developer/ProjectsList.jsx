import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, DollarSign, Clock, Calendar, Building2, Users, 
  Code, ChevronDown, Briefcase, Check
} from 'lucide-react';

// Sample projects data
const projects = [
  {
    id: 1,
    title: "E-commerce Platform Frontend",
    description: "Build a responsive e-commerce frontend with React and Redux. The project requires implementation of product listing, cart functionality, checkout process, and user authentication.",
    budget: "₹70,000",
    deadline: "2 weeks",
    skills: ["React", "Redux", "JavaScript", "HTML", "CSS"],
    company: "TechSolutions Inc.",
    postedDate: "2 days ago",
    applicants: 7,
    status: "open"
  },
  {
    id: 2,
    title: "API Integration for Payment Gateway",
    description: "Integrate multiple payment gateways into an existing Node.js application. The project involves implementing Stripe, PayPal, and Razorpay payment processing with proper error handling and transaction management.",
    budget: "₹40,000",
    deadline: "1 week",
    skills: ["Node.js", "API Integration", "Payment Gateway", "Express"],
    company: "FinTech Solutions",
    postedDate: "5 days ago",
    applicants: 12,
    status: "open"
  },
  {
    id: 3,
    title: "Database Optimization for High-Traffic App",
    description: "Optimize MySQL queries and database structure for performance in a high-traffic application. The project requires analyzing current database schema, identifying bottlenecks, and implementing optimizations.",
    budget: "₹55,000",
    deadline: "10 days",
    skills: ["MySQL", "Database Optimization", "SQL", "Performance Tuning"],
    company: "DataFlow Systems",
    postedDate: "1 day ago",
    applicants: 4,
    status: "open"
  },
  {
    id: 4,
    title: "Mobile App UI/UX Redesign",
    description: "Redesign the user interface and experience for an existing Android and iOS application. The project involves creating new visual designs, improving user flows, and preparing assets for developers.",
    budget: "₹65,000",
    deadline: "3 weeks",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Mobile Design"],
    company: "DesignHub Agency",
    postedDate: "3 days ago",
    applicants: 9,
    status: "open"
  },
  {
    id: 5,
    title: "DevOps Pipeline Setup",
    description: "Set up a complete CI/CD pipeline using GitHub Actions, Docker, and AWS. The project includes configuring automated testing, deployment to staging and production environments, and monitoring setup.",
    budget: "₹85,000",
    deadline: "2 weeks",
    skills: ["DevOps", "GitHub Actions", "Docker", "AWS", "CI/CD"],
    company: "CloudTech Solutions",
    postedDate: "4 days ago",
    applicants: 6,
    status: "open"
  }
];

const ProjectsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
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
      project.skills.some(skill => skill.toLowerCase().includes(value.toLowerCase()))
    );
    
    setFilteredProjects(filtered);
  };
  
  const toggleProjectDetails = (id) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };
  
  const applyToProject = (id) => {
    // Implement the application logic here
    console.log(`Applied to project with ID: ${id}`);
    // In a real app, you would send a request to your API
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
      
      {/* Projects Count */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Available Projects <span className="text-gray-500 font-normal">({filteredProjects.length})</span>
        </h2>
        <div className="text-sm text-gray-500">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>
      
      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-gray-200 hover:border-blue-300 transition-colors overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Building2 size={14} className="text-gray-500" />
                        {project.company} • <span className="text-gray-400">{project.postedDate}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {project.budget}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <p className={`text-gray-700 ${expandedProjectId === project.id ? '' : 'line-clamp-2'}`}>
                      {project.description}
                    </p>
                    
                    {expandedProjectId !== project.id && (
                      <button 
                        onClick={() => toggleProjectDetails(project.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Show more
                      </button>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {expandedProjectId === project.id && (
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
                              <p className="text-gray-500">Duration</p>
                              <p className="font-medium">{project.deadline}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" />
                            <div>
                              <p className="text-gray-500">Posted</p>
                              <p className="font-medium">{project.postedDate}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-500" />
                            <div>
                              <p className="text-gray-500">Applicants</p>
                              <p className="font-medium">{project.applicants}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-100 justify-between flex-wrap gap-2">
                  <button 
                    onClick={() => toggleProjectDetails(project.id)}
                    className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
                  >
                    {expandedProjectId === project.id ? 'Show less' : 'Show details'}
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
                      onClick={() => applyToProject(project.id)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
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
    </div>
  );
};

export default ProjectsList;
