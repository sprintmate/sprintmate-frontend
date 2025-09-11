import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Code,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Globe,
  AlignLeft,
  Sparkles,
  Clock,
  Monitor,
  FileText,
  Briefcase,
  Image,
  User,
  Plus,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { authUtils } from '../utils/authUtils';
import { createDeveloperProfile } from '../api/developerService';
import { uploadFile as documentUploadFile } from '../api/documentService';

// Available options for work types (enums from backend)
const availabilityOptions = [
  { value: "FULL_TIME", label: "Full Time", icon: "" },
  { value: "PART_TIME", label: "Part Time", icon: "" },
  { value: "WEEKENDS_ONLY", label: "Weekends Only", icon: "" },
  { value: "UNAVAILABLE", label: "Unavailable", icon: "" }
];

const workTypeOptions = [
  { value: "REMOTE", label: "Remote", icon: "" },
  { value: "ONSITE", label: "Onsite", icon: "" },
  { value: "HYBRID", label: "Hybrid", icon: "" },
  { value: "CONTRACT", label: "Contract", icon: "" },
  { value: "FREELANCE", label: "Freelance", icon: "" },
  { value: "FULL_TIME", label: "Full Time", icon: "" },
  { value: "OPEN_TO_ALL", label: "Open to All", icon: "" }
];

// List of popular skills for suggestions
const popularSkills = [
  "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
  "PHP", "Ruby", "C#", ".NET", "AWS", "Azure", "Docker", "Kubernetes",
  "TypeScript", "Go", "Rust", "Swift", "Kotlin", "SQL", "MongoDB", "Firebase"
];

const DeveloperProfileRegistration = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const resumeInputRef = useRef(null);
  const profilePicInputRef = useRef(null);

  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [workType, setWorkType] = useState('');
  const [about, setAbout] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFileId, setResumeFileId] = useState('');
  const [profilePicFileId, setProfilePicFileId] = useState('');
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setResumeFile(selectedFile);
      setResumeFileName(selectedFile.name);
      // Upload resume file immediately
      uploadFile(selectedFile, 'resume');
    }
  };

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfilePicFile(selectedFile);

      // Create a preview URL for the image
      const previewURL = URL.createObjectURL(selectedFile);
      setProfilePicPreview(previewURL);

      // Upload profile pic immediately
      uploadFile(selectedFile, 'profilePic');
    }
  };

  const uploadFile = async (fileToUpload, fileType) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      const uploadFileType = fileType == 'resume' ? 'LATEST_RESUME' : 'PROFILE_PIC';
      formData.append('file', fileToUpload);
      formData.append('type', uploadFileType);

      const response = await documentUploadFile(formData);

      // Use externalId from response as fileId
      if (response.data && response.data.externalId) {
        if (fileType === 'resume') {
          setResumeFileId(response.data.externalId);
          toast.success('Resume uploaded successfully!');
        } else if (fileType === 'profilePic') {
          setProfilePicFileId(response.data.externalId);
          toast.success('Profile picture uploaded successfully!');
        }
      }
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Failed to upload ${fileType}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === 'Tab' && currentSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === ',' && currentSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }

    if (!availability) {
      toast.error('Please select your availability');
      return;
    }

    if (!workType) {
      toast.error('Please select your preferred work type');
      return;
    }

    if (!about.trim()) {
      toast.error('Please provide information about yourself');
      return;
    }

    if (!resumeFileId) {
      toast.error('Please upload your resume');
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        skills: skills.join(','),
        resume: resumeFileId,
        availability: availability, // Enum value
        preferredWorkType: workType, // Enum value
        about: about,
        portfolio: {
          LATEST_RESUME: resumeFileId
        }
      };

      // Add optional fields if they exist
      if (profilePicFileId) {
        payload.portfolio.PROFILE_PIC = profilePicFileId;
      }

      if (githubUrl) {
        payload.portfolio.GITHUB = githubUrl;
      }

      if (linkedinUrl) {
        payload.portfolio.LINKEDIN = linkedinUrl;
      }

      const token = authUtils.getAuthToken();

      const response = await createDeveloperProfile(payload);
      console.log('response after creating developer profile ', response);

      authUtils.removeUserProfile();

      toast.success('Developer profile created successfully!');
      console.log("navigating to developer dashboard")
      navigate('/developer/dashboard', { replace: true });

    } catch (error) {
      console.error('Error creating developer profile:', error);
      toast.error(error.response?.data?.message || 'Failed to create developer profile');
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (skills.length === 0) {
        toast.error('Please add at least one skill');
        return;
      }
      if (!availability) {
        toast.error('Please select your availability');
        return;
      }
      if (!workType) {
        toast.error('Please select your preferred work type');
        return;
      }
    } else if (currentStep === 2) {
      if (!resumeFileId) {
        toast.error('Please upload your resume');
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Effect to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [profilePicPreview]);

  const userName = authUtils.getUserProfile().name;
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Code className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Build Your Developer Profile
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join our community of talented developers and showcase your expertise to connect with exciting opportunities
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: step * 0.1, type: "spring" }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        currentStep >= step
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        step
                      )}
                    </motion.div>
                  </div>
                  {step < 3 && (
                    <div className={`w-24 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-slate-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-32 text-sm font-medium">
            <span className={currentStep >= 1 ? 'text-blue-600' : 'text-slate-400'}>Skills & Preferences</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : 'text-slate-400'}>Portfolio & Resume</span>
            <span className={currentStep >= 3 ? 'text-blue-600' : 'text-slate-400'}>About You</span>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 rounded-3xl overflow-hidden p-1">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-8">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {currentStep === 1 && "Skills & Availability"}
                {currentStep === 2 && "Resume & Portfolio"}
                {currentStep === 3 && "About You"}
              </CardTitle>
              <CardDescription className="text-slate-600 text-lg">
                {currentStep === 1 && "Tell us about your technical expertise and availability"}
                {currentStep === 2 && "Upload your resume and showcase your work"}
                {currentStep === 3 && "Share your story and complete your profile"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Skills & Availability */}
                {currentStep === 1 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    {/* Skills Section */}
                    <motion.div variants={itemVariants} className="space-y-4 mt-5">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Code className="w-4 h-4 text-blue-600" />
                        </div>
                        Technical Skills
                      </Label>
                      
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                        <div className="flex space-x-3 mb-4">
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="Add a skill (e.g., React, Python, AWS)..."
                              value={currentSkill}
                              onChange={(e) => setCurrentSkill(e.target.value)}
                              onKeyDown={handleSkillKeyDown}
                              className="h-12 border-0 bg-white shadow-sm rounded-xl text-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleAddSkill}
                            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Added Skills */}
                        {skills.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-slate-700">Your Skills ({skills.length})</h4>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  className="group"
                                >
                                  <Badge
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
                                    onClick={() => removeSkill(skill)}
                                  >
                                    {skill}
                                    <X className="w-3 h-3 ml-2 opacity-60 group-hover:opacity-100" />
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Popular Skills */}
                        <div className="mt-6">
                          <h4 className="font-medium text-slate-700 mb-3">Popular Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {popularSkills.filter(skill => !skills.includes(skill)).slice(0, 12).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 px-3 py-1 rounded-lg border-slate-300"
                                onClick={() => {
                                  if (!skills.includes(skill)) {
                                    setSkills([...skills, skill]);
                                  }
                                }}
                              >
                                + {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Availability Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        Availability
                      </Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {availabilityOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-200 ${
                              availability === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                            onClick={() => setAvailability(option.value)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{option.icon}</div>
                              <div>
                                <div className="font-semibold text-slate-900">{option.label}</div>
                              </div>
                            </div>
                            <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                              availability === option.value
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-slate-300'
                            }`}>
                              {availability === option.value && (
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Work Type Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <Monitor className="w-4 h-4 text-purple-600" />
                        </div>
                        Preferred Work Type
                      </Label>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {workTypeOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                              workType === option.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                            onClick={() => setWorkType(option.value)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-xl">{option.icon}</div>
                              <div className="font-medium text-slate-900 text-sm">{option.label}</div>
                            </div>
                            <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              workType === option.value
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-slate-300'
                            }`}>
                              {workType === option.value && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Pro Tip</h3>
                          <p className="text-blue-800 leading-relaxed">
                            Be specific with your skills! Instead of "Frontend Development", list specific technologies like "React", "Vue.js", "TypeScript". This helps us match you with the most relevant opportunities.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 2: Resume & Portfolio */}
                {currentStep === 2 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    {/* Resume Upload */}
                    <motion.div variants={itemVariants} className="space-y-4 mt-5">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                        Resume Upload
                      </Label>
                      
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                          resumeFileName
                            ? 'border-green-300 bg-green-50'
                            : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50'
                        }`}
                        onClick={() => resumeInputRef.current.click()}
                      >
                        <div className="p-12 text-center">
                          {resumeFileName ? (
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{resumeFileName}</p>
                                <div className="flex items-center justify-center mt-2">
                                  {resumeFileId && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                                  <span className="text-sm text-green-700">
                                    {resumeFileId ? 'Upload successful' : 'Processing...'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                                <Upload className="w-8 h-8 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xl font-semibold text-slate-900 mb-2">Upload Your Resume</p>
                                <p className="text-slate-600">Drag and drop or click to browse</p>
                                <p className="text-sm text-slate-500 mt-1">PDF, DOC, DOCX up to 5MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={resumeInputRef}
                          onChange={handleResumeChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Profile Picture */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                          <Image className="w-4 h-4 text-pink-600" />
                        </div>
                        Profile Picture <span className="text-sm font-normal text-slate-500 ml-2">(Optional)</span>
                      </Label>
                      
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                        onClick={() => profilePicInputRef.current.click()}
                      >
                        <div className="p-8 text-center">
                          {profilePicPreview ? (
                            <div className="space-y-4">
                              <div className="relative w-24 h-24 mx-auto">
                                <img
                                  src={profilePicPreview}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                  <Upload className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">Change Picture</p>
                                {profilePicFileId && (
                                  <div className="flex items-center justify-center mt-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                    <span className="text-sm text-green-700">Upload successful</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto">
                                <User className="w-8 h-8 text-slate-400" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">Add Profile Picture</p>
                                <p className="text-sm text-slate-500">JPG, PNG up to 2MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          ref={profilePicInputRef}
                          onChange={handleProfilePicChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div variants={itemVariants} className="space-y-6">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <Globe className="w-4 h-4 text-indigo-600" />
                        </div>
                        Portfolio Links <span className="text-sm font-normal text-slate-500 ml-2">(Optional)</span>
                      </Label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                              <FaGithub className="w-5 h-5 text-white" />
                            </div>
                            <Label className="font-medium text-slate-900">GitHub Profile</Label>
                          </div>
                          <Input
                            type="url"
                            placeholder="https://github.com/yourusername"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="h-12 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                              <FaLinkedin className="w-5 h-5 text-white" />
                            </div>
                            <Label className="font-medium text-slate-900">LinkedIn Profile</Label>
                          </div>
                          <Input
                            type="url"
                            placeholder="https://linkedin.com/in/yourusername"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="h-12 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-emerald-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-emerald-900 mb-2">Stand Out From The Crowd</h3>
                          <p className="text-emerald-800 leading-relaxed">
                            Developers with complete profiles including portfolio links are 3x more likely to be selected for projects. Show off your best work!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: About Section */}
                {currentStep === 3 && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                  >
                    {/* About Textarea */}
                    <motion.div variants={itemVariants} className="space-y-4 mt-5">
                      <Label className="text-lg font-semibold text-slate-900 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <AlignLeft className="w-4 h-4 text-purple-600" />
                        </div>
                        Tell Us About Yourself
                      </Label>
                      
                      <div className="relative">
                        <Textarea
                          placeholder="Share your journey, expertise, and what makes you unique as a developer. What projects are you passionate about? What's your development philosophy?"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                          className="min-h-[200px] border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg leading-relaxed p-6"
                          required
                        />
                        <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                          {about.length}/1000
                        </div>
                      </div>
                    </motion.div>

                    {/* Writing Tips */}
                    <motion.div variants={itemVariants} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-amber-900 mb-3">Tips for a Compelling Profile</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Highlight your years of experience and key specialties</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Mention notable projects or achievements</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Describe your problem-solving approach</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Share your passion and what drives you</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Profile Preview */}
                    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        Profile Preview
                      </h3>

                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                            {profilePicPreview ? (
                              <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-10 h-10 text-blue-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-bold text-slate-900 mb-2">{capitalizedUserName}</h4>
                          
                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {skills.slice(0, 6).map((skill, i) => (
                                <Badge key={i} className="bg-blue-100 text-blue-800 rounded-lg px-3 py-1">
                                  {skill}
                                </Badge>
                              ))}
                              {skills.length > 6 && (
                                <Badge className="bg-slate-100 text-slate-600 rounded-lg px-3 py-1">
                                  +{skills.length - 6} more
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center space-x-4 mb-4 text-sm text-slate-600">
                            {availability && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{availabilityOptions.find(opt => opt.value === availability)?.label}</span>
                              </div>
                            )}
                            {workType && (
                              <div className="flex items-center space-x-1">
                                <Monitor className="w-4 h-4" />
                                <span>{workTypeOptions.find(opt => opt.value === workType)?.label}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-slate-700 leading-relaxed">
                            {about ? (
                              <p className="line-clamp-3">{about}</p>
                            ) : (
                              <p className="italic text-slate-400">Your professional story will appear here...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </form>
            </CardContent>

            <CardFooter className="bg-slate-50 border-t border-slate-200 p-8">
              <div className="flex justify-between w-full mt-5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentStep === 1}
                  onClick={goToPreviousStep}
                  className="h-12 px-8 rounded-xl border-slate-300 hover:bg-slate-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="h-12 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold shadow-lg shadow-green-500/25 disabled:opacity-50"
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperProfileRegistration;