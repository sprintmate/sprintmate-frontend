import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  Save, 
  User, 
  Mail, 
  Briefcase, 
  MapPin, 
  Calendar,
  Link2,
  Code,
  FileText,
  Upload,
  Github,
  Linkedin,
  Award,
  Clock,
  Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const EditProfile = ({ userData, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Form data state with user data pre-filled
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    skills: userData?.skills || '',
    about: userData?.about || '',
    availability: userData?.availability || 'FULL_TIME',
    preferredWorkType: userData?.preferredWorkType || 'REMOTE',
    experience: userData?.experience || '',
    portfolio: {
      GITHUB: userData?.portfolio?.GITHUB || '',
      LINKEDIN: userData?.portfolio?.LINKEDIN || '',
      WEBSITE: userData?.portfolio?.WEBSITE || '',
    },
    education: userData?.education || '',
    resume: userData?.resume || '',
    profileImage: userData?.profileImage || ''
  });
  
  const [selectedSkills, setSelectedSkills] = useState(
    userData?.skills ? userData.skills.split(',').map(skill => skill.trim()) : []
  );
  
  const [skillInput, setSkillInput] = useState('');
  
  // Common tech skills for suggestions
  const techSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
    'Express', 'Django', 'Flask', 'Python', 'Java', 'Spring Boot',
    'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI',
    'Git', 'GitHub', 'GitLab', 'Agile', 'Scrum', 'TDD'
  ].filter(skill => !selectedSkills.includes(skill));
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('portfolio.')) {
      const [_, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle skill addition
  const handleAddSkill = (skill) => {
    if (skill && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      setFormData(prev => ({
        ...prev,
        skills: newSkills.join(', ')
      }));
      setSkillInput('');
    }
  };
  
  // Handle skill removal
  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(newSkills);
    setFormData(prev => ({
      ...prev,
      skills: newSkills.join(', ')
    }));
  };
  
  // Handle skill input change
  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };
  
  // Handle skill input keydown (for Enter key)
  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput.trim());
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    try {
      setLoading(true);
      // Replace with your actual API endpoint for file uploads
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.fileId) {
        setFormData(prev => ({
          ...prev,
          [type === 'RESUME' ? 'resume' : 'profileImage']: response.data.fileId
        }));
        
        setNotification({
          type: 'success',
          message: `${type === 'RESUME' ? 'Resume' : 'Profile image'} uploaded successfully!`
        });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setNotification({
        type: 'error',
        message: `Failed to upload ${type === 'RESUME' ? 'resume' : 'profile image'}.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Call the onSave function passed as a prop
      await onSave(formData);
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/company/dashboard/profile');
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50 p-6">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 
            'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`}
        >
          {notification.message}
        </motion.div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onCancel}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back to Profile
          </button>
          
          <h1 className="text-2xl font-bold text-center text-gray-800">Edit Your Profile</h1>
          
          <div className="w-24">
            {/* Spacer for alignment */}
          </div>
        </div>
        
        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Image */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User size={18} className="mr-2 text-blue-600" />
                      Profile Picture
                    </h2>
                    
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-32 h-32 rounded-full border-2 border-blue-200 overflow-hidden bg-blue-50 flex items-center justify-center">
                        {formData.profileImage ? (
                          <img 
                            src={`/api/files/${formData.profileImage}`} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-blue-300" />
                        )}
                      </div>
                      
                      <div className="w-full">
                        <label className="block w-full">
                          <span className="sr-only">Choose profile photo</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => handleFileUpload(e, 'PROFILE')}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Resume */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText size={18} className="mr-2 text-purple-600" />
                      Resume
                    </h2>
                    
                    <div className="space-y-4">
                      {formData.resume ? (
                        <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <FileText size={18} className="text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">Resume uploaded</span>
                          </div>
                          <a 
                            href={`/api/files/${formData.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            View
                          </a>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No resume uploaded yet</div>
                      )}
                      
                      <div>
                        <label className="block w-full">
                          <span className="block text-sm font-medium text-gray-700 mb-1">Upload new resume</span>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            onChange={e => handleFileUpload(e, 'RESUME')}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-medium
                              file:bg-purple-50 file:text-purple-700
                              hover:file:bg-purple-100"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Availability */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-green-600 to-green-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock size={18} className="mr-2 text-green-600" />
                      Availability
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Availability Type
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                        >
                          <option value="FULL_TIME">Full Time</option>
                          <option value="PART_TIME">Part Time</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="FREELANCE">Freelance</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Work Type
                        </label>
                        <select
                          name="preferredWorkType"
                          value={formData.preferredWorkType}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                        >
                          <option value="REMOTE">Remote</option>
                          <option value="HYBRID">Hybrid</option>
                          <option value="ONSITE">Onsite</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User size={18} className="mr-2 text-blue-600" />
                      Personal Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full p-3"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="w-full p-3"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Experience (years)
                        </label>
                        <Input
                          name="experience"
                          type="number"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="Years of experience"
                          className="w-full p-3"
                          min="0"
                          max="50"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          About
                        </label>
                        <Textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                          className="w-full p-3 min-h-[120px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-indigo-600 to-indigo-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Code size={18} className="mr-2 text-indigo-600" />
                      Skills & Expertise
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Skills
                        </label>
                        
                        {/* Selected skills display */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedSkills.map((skill) => (
                            <Badge 
                              key={skill}
                              className="px-3 py-1.5 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 flex items-center gap-1.5 cursor-pointer"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              {skill}
                              <span className="ml-1">&times;</span>
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Skill input */}
                        <div className="flex">
                          <Input
                            value={skillInput}
                            onChange={handleSkillInputChange}
                            onKeyDown={handleSkillInputKeyDown}
                            placeholder="Add a skill (e.g. React, Python, UX Design)"
                            className="w-full p-3"
                          />
                          <Button
                            type="button"
                            onClick={() => handleAddSkill(skillInput)}
                            className="ml-2"
                            disabled={!skillInput.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                      
                      {/* Skill suggestions */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Popular Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {techSkills.slice(0, 10).map(skill => (
                            <Badge 
                              key={skill}
                              className="px-3 py-1.5 bg-gray-100 text-gray-800 hover:bg-indigo-100 hover:text-indigo-800 cursor-pointer transition-colors"
                              onClick={() => handleAddSkill(skill)}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Portfolio Links */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-cyan-600 to-cyan-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Link2 size={18} className="mr-2 text-cyan-600" />
                      Portfolio & Links
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <Github size={16} className="mr-2" />
                          GitHub Profile
                        </label>
                        <Input
                          name="portfolio.GITHUB"
                          value={formData.portfolio.GITHUB}
                          onChange={handleInputChange}
                          placeholder="https://github.com/yourusername"
                          className="w-full p-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <Linkedin size={16} className="mr-2" />
                          LinkedIn Profile
                        </label>
                        <Input
                          name="portfolio.LINKEDIN"
                          value={formData.portfolio.LINKEDIN}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/yourusername"
                          className="w-full p-3"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <Globe size={16} className="mr-2" />
                          Personal Website
                        </label>
                        <Input
                          name="portfolio.WEBSITE"
                          value={formData.portfolio.WEBSITE}
                          onChange={handleInputChange}
                          placeholder="https://yourwebsite.com"
                          className="w-full p-3"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Education */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-amber-600 to-amber-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Award size={18} className="mr-2 text-amber-600" />
                      Education
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education Background
                      </label>
                      <Textarea
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="Enter your education details (degrees, institutions, graduation years)..."
                        className="w-full p-3 min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end mt-8 space-x-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
              <Save size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
