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
  User
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

// Available options for work types (enums from backend)
const availabilityOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "WEEKENDS_ONLY", label: "Weekends Only" },
  { value: "UNAVAILABLE", label: "Unavailable" }
];

const workTypeOptions = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "Onsite" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "OPEN_TO_ALL", label: "Open to All" }
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
      formData.append('file', fileToUpload);
      formData.append('type', "LATEST_RESUME");

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/documents/upload`,
        formData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

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
      toast.error(`Failed to upload ${fileType}. Please try again.`);
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/developers`,
        payload,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-indigo-600 text-white p-4 rounded-full inline-flex items-center justify-center mb-4">
              <Code size={24} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            Complete Your Developer Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600"
          >
            Showcase your skills and experience to connect with ideal projects
          </motion.p>
        </div>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                1
              </motion.div>
              <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                2
              </motion.div>
              <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
              >
                3
              </motion.div>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm">
            <div className="w-28 text-center">Skills & Availability</div>
            <div className="w-28 text-center">Resume & Portfolio</div>
            <div className="w-28 text-center">About You</div>
          </div>
        </div>

        <Card className="shadow-xl border-indigo-100">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Skills & Availability"}
              {currentStep === 2 && "Resume & Portfolio"}
              {currentStep === 3 && "About You"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Add your skills and availability preferences"}
              {currentStep === 2 && "Upload your resume and add profile details"}
              {currentStep === 3 && "Tell us more about your experience and expertise"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Skills & Availability */}
              {currentStep === 1 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="skills" className="text-gray-700">
                      <Code className="inline-block mr-2 h-4 w-4" />
                      Skills (press Enter, Tab or comma to add)
                    </Label>
                    <div className="flex">
                      <Input
                        id="skills"
                        type="text"
                        placeholder="Add your technical skills..."
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <Button
                        type="button"
                        onClick={handleAddSkill}
                        className="ml-2 bg-indigo-600 hover:bg-indigo-700"
                      >
                        Add
                      </Button>
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill}
                          <span className="ml-1 text-xs">×</span>
                        </Badge>
                      ))}
                    </div>

                    {/* Popular skills suggestions */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Popular skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {popularSkills.filter(skill => !skills.includes(skill)).slice(0, 10).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-indigo-50"
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
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">
                        <Clock className="inline-block mr-2 h-4 w-4" />
                        Availability
                      </Label>
                      <RadioGroup value={availability} onValueChange={setAvailability} className="grid grid-cols-2 gap-2">
                        {availabilityOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`availability-${option.value}`} />
                            <Label htmlFor={`availability-${option.value}`} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">
                        <Monitor className="inline-block mr-2 h-4 w-4" />
                        Preferred Work Type
                      </Label>
                      <RadioGroup value={workType} onValueChange={setWorkType} className="grid grid-cols-3 gap-2">
                        {workTypeOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`workType-${option.value}`} />
                            <Label htmlFor={`workType-${option.value}`} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-indigo-800">Pro tip: Be specific with your skills</h3>
                        <p className="text-sm text-indigo-700">
                          List specific technologies (e.g., "React", "Node.js") rather than general areas (e.g., "Frontend"). This helps match you with the most relevant projects.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Resume & Portfolio Links */}
              {currentStep === 2 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants}>
                    <Label className="text-gray-700 mb-2 block">
                      <FileText className="inline-block mr-2 h-4 w-4" />
                      Upload Resume
                    </Label>

                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => resumeInputRef.current.click()}
                    >
                      {resumeFileName ? (
                        <div className="flex items-center text-sm">
                          <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                          <span className="text-gray-900 font-medium">{resumeFileName}</span>
                          {resumeFileId && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-indigo-600">
                            Click to upload your resume
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC or DOCX up to 5MB
                          </p>
                        </>
                      )}

                      <input
                        type="file"
                        ref={resumeInputRef}
                        onChange={handleResumeChange}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label className="text-gray-700 mb-2 block">
                      <Image className="inline-block mr-2 h-4 w-4" />
                      Profile Picture (Optional)
                    </Label>

                    <div
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => profilePicInputRef.current.click()}
                    >
                      {profilePicPreview ? (
                        <div className="relative w-32 h-32 mb-2 rounded-full overflow-hidden">
                          <img
                            src={profilePicPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                          <User className="h-12 w-12 text-indigo-400" />
                        </div>
                      )}

                      <p className="text-sm font-medium text-indigo-600">
                        {profilePicPreview ? 'Change picture' : 'Upload profile picture'}
                      </p>

                      <input
                        type="file"
                        ref={profilePicInputRef}
                        onChange={handleProfilePicChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {profilePicFileId && (
                        <div className="flex items-center mt-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Picture uploaded successfully
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github" className="text-gray-700">
                        <FaGithub className="inline-block mr-2 h-4 w-4" />
                        GitHub URL (Optional)
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="text-gray-700">
                        <FaLinkedin className="inline-block mr-2 h-4 w-4" />
                        LinkedIn URL (Optional)
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        placeholder="https://linkedin.com/in/yourusername"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Show your best work</h3>
                        <p className="text-sm text-blue-700">
                          Developers with complete profiles including a profile picture and portfolio links are 3x more likely to be selected for projects.
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
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="about" className="text-gray-700">
                      <AlignLeft className="inline-block mr-2 h-4 w-4" />
                      About You
                    </Label>
                    <Textarea
                      id="about"
                      placeholder="Tell employers about your experience, expertise, and what makes you stand out..."
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="h-40 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-teal-800">Tips for a great developer bio</h3>
                        <ul className="mt-2 text-sm text-teal-700 list-disc list-inside space-y-1">
                          <li>Highlight your years of experience and specialties</li>
                          <li>Mention significant projects or accomplishments</li>
                          <li>Describe your problem-solving approach</li>
                          <li>Note your industries of interest or expertise</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="border border-indigo-100 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Profile Preview</h3>

                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 flex-shrink-0">
                          {profilePicPreview ? (
                            <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-8 w-8 text-indigo-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Your Name</div>
                          <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-1">
                            {skills.slice(0, 5).map((skill, i) => (
                              <Badge key={i} className="bg-indigo-100 text-indigo-800">
                                {skill}
                              </Badge>
                            ))}
                            {skills.length > 5 && (
                              <Badge className="bg-gray-100 text-gray-600">
                                +{skills.length - 5}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            {about ? (
                              <span>{about.substring(0, 100)}...</span>
                            ) : (
                              <span className="italic text-gray-400">Your bio will appear here</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={currentStep === 1}
              onClick={goToPreviousStep}
            >
              Back
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={goToNextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSubmit}
              >
                {isLoading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default DeveloperProfileRegistration;
