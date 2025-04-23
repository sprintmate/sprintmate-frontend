import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Briefcase, 
  Code, 
  FileText, 
  Github, 
  Linkedin, 
  Globe, 
  Calendar, 
  Clock, 
  MapPin,
  Award,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authUtils } from '@/utils/authUtils';

const DeveloperProfilePage = () => {
  const { developerId } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function to safely get and process data
  const safelyGetData = (obj, path, defaultValue = '') => {
    try {
      const value = path.split('.').reduce((o, p) => (o && o[p] !== undefined) ? o[p] : null, obj);
      return value !== null && value !== undefined ? value : defaultValue;
    } catch (err) {
      console.warn(`Error accessing path ${path}:`, err);
      return defaultValue;
    }
  };

  // Helper function to format date with error handling
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.warn(`Error formatting date ${dateString}:`, err);
      return 'Invalid date';
    }
  };
  
  // Helper to get initials from name with error handling
  const getInitials = (name) => {
    if (!name) return 'D';
    
    try {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    } catch (err) {
      console.warn(`Error getting initials for ${name}:`, err);
      return 'D';
    }
  };

  useEffect(() => {
    const fetchDeveloperProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = authUtils.getAuthToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://round-georgianna-sprintmate-8451e6d8.koyeb.app';
        
        const response = await axios.get(`${apiBaseUrl}/v1/developers/${developerId}`, {
          headers: {
            'Authorization': token
          },
          timeout: 15000
        });
        
        // Validate response data
        if (response.data) {
          console.log('Developer profile data:', response.data);
          setDeveloper(response.data);
        } else {
          throw new Error('Empty response from server');
        }
      } catch (err) {
        console.error('Error fetching developer profile:', err);
        
        if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please check your internet connection and try again.");
        } else if (err.response?.status === 404) {
          setError("Developer profile not found.");
        } else if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(err.message || 'Failed to load developer profile');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (developerId) {
      fetchDeveloperProfile();
    }
  }, [developerId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-blue-600 font-medium">Loading developer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Profile</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <User className="w-16 h-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Developer Not Found</h2>
              <p className="text-gray-600 mb-6">The developer profile you're looking for does not exist or has been removed.</p>
              <Button onClick={() => navigate(-1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        >
          {/* Header with gradient background */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-400 relative">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}></div>
            
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
                {developer.profilePicture ? (
                  <img 
                    src={developer.profilePicture}
                    alt={developer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                    <span className="text-white text-4xl font-semibold">
                      {getInitials(developer.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile information */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{safelyGetData(developer, 'name', 'Developer')}</h1>
                  {developer.verified && (
                    <Badge variant="blue" className="bg-blue-100">
                      <CheckCircle className="h-3 w-3 mr-1 text-blue-600" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{developer.email}</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Contact
                </Button>
                <Button 
                  size="sm"
                >
                  Hire Now
                </Button>
              </div>
            </div>
            
            {/* About section */}
            {developer.about && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{developer.about}</p>
              </div>
            )}
            
            {/* Skills section */}
            {developer.skills && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {safelyGetData(developer, 'skills', '').split(',').map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200">
                      <Code className="h-3 w-3 mr-1 text-blue-600" />
                      {skill.trim() || 'Unknown'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Professional details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">Developer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Developer ID</p>
                      <p className="font-medium text-gray-900 break-all">{developer.externalId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium text-gray-900">{formatDate(developer.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium text-gray-900">{developer.availability || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preferred Work Type</p>
                      <p className="font-medium text-gray-900">{developer.preferredWorkType || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">Portfolio & Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {developer.portfolio && (
                      <div className="space-y-3">
                        {developer.portfolio.GITHUB && (
                          <div className="flex items-center">
                            <Github className="h-4 w-4 text-gray-700 mr-2" />
                            <a 
                              href={developer.portfolio.GITHUB}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                            >
                              {developer.portfolio.GITHUB}
                            </a>
                          </div>
                        )}
                        
                        {developer.portfolio.LINKEDIN && (
                          <div className="flex items-center">
                            <Linkedin className="h-4 w-4 text-gray-700 mr-2" />
                            <a 
                              href={developer.portfolio.LINKEDIN}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                            >
                              {developer.portfolio.LINKEDIN}
                            </a>
                          </div>
                        )}
                        
                        {developer.portfolio.PERSONAL_WEBSITE && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-gray-700 mr-2" />
                            <a 
                              href={developer.portfolio.PERSONAL_WEBSITE}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                            >
                              {developer.portfolio.PERSONAL_WEBSITE}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {developer.resume && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Resume</p>
                        <a 
                          href={`/api/files/${developer.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Stats and accomplishments */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Stats & Accomplishments</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Briefcase className="h-8 w-8 text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{developer.completedProjects || 0}</p>
                    <p className="text-sm text-gray-500">Projects Completed</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Award className="h-8 w-8 text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{developer.rating || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Avg. Rating</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Clock className="h-8 w-8 text-green-600 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{developer.onTimeDelivery || 'N/A'}</p>
                    <p className="text-sm text-gray-500">On-time Delivery</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center">
                    <Calendar className="h-8 w-8 text-amber-600 mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{
                      developer.yearsOfExperience || 
                      (developer.createdAt ? 
                        Math.floor((new Date() - new Date(developer.createdAt)) / (1000 * 60 * 60 * 24 * 365)) + 
                        'y' : 'N/A')
                    }</p>
                    <p className="text-sm text-gray-500">Experience</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperProfilePage;
