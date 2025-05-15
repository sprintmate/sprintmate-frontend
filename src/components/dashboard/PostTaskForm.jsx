import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, Search, Plus, AlertCircle, Calendar, Check, XCircle, CheckSquare, Square } from 'lucide-react';
import axios from 'axios';
import { postTask } from '../../api/companyService';
import { authUtils } from '../../utils/authUtils';
import { fetchUserProfile } from '../../api/userService';
import { trackEvent } from '../../utils/analytics';
import { AnalyticEvents } from '../../constants/AnalyticsEvents';

// Custom checkbox component
const CustomCheckbox = ({ id, checked, onCheckedChange, label }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        id={id}
        onClick={() => onCheckedChange(!checked)}
        className="flex items-center justify-center w-4 h-4 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-checked={checked}
        role="checkbox"
      >
        {checked ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
      </button>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  );
};

const PostTaskForm = () => {
  const { companyProfile } = useAuth();
  const [notification, setNotification] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const toast = ({ title, description, variant }) => {
    setNotification({ title, description, variant });
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    techStack: [],
    techInput: '',
    budget: '',
    currency: 'INR',
    category: 'p0',
    timeline: '',
    deadline: '',
    experienceLevel: '',
    devType: '',
    ndaRequired: false,
    additionalInfo: '',
    attachments: []
  });
  
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [filteredTechOptions, setFilteredTechOptions] = useState([]);
  const techInputRef = useRef(null);
  const techDropdownRef = useRef(null);

  const predefinedTechStacks = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 
    'Angular', 'Vue.js', 'PHP', 'Ruby', 'C#', '.NET', 'MongoDB', 
    'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes', 'Go', 'Swift',
    'Rust', 'Kotlin', 'Flutter', 'Django', 'Express', 'GraphQL', 'Redux',
    'Firebase', 'Next.js', 'Tailwind CSS', 'Bootstrap'
  ];

  // Get company profile from context
  useEffect(() => {
    if (companyProfile) {
      // Use externalId as companyId
      setCompanyId(companyProfile.externalId || companyProfile.companyId);
    } else {
      // Fallback to localStorage if context doesn't have it yet
      fetchCompanyProfileFromStorage();
    }
  }, [companyProfile]);

  const fetchCompanyProfileFromStorage = () => {
    try {
      // Check for userProfile in localStorage
      const parsedProfile = authUtils.getUserProfile();
      console.log("Stored profile:", parsedProfile);
      
      if (parsedProfile) {        
        // Extract companyId from companyProfiles array
        if (parsedProfile.companyProfiles && parsedProfile.companyProfiles.length > 0) {
          const companyExternalId = parsedProfile.companyProfiles[0].externalId;
          if (companyExternalId) {
            console.log("Found company externalId:", companyExternalId);
            setCompanyId(companyExternalId);
            return;
          }
        }
      } else {
        fetchCompanyIdFromAPI();
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
      fetchCompanyIdFromAPI();
    }
  };

  const fetchCompanyIdFromAPI = async () => {
    try {
      const response = await fetchUserProfile();
      console.log("API response for user profile:", response.data);
      
      if (response && response.companyProfiles && response.companyProfiles.length > 0) {
        const companyExternalId = response.companyProfiles[0].externalId;
        if (companyExternalId) {
          setCompanyId(companyExternalId);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Profile Error",
        description: "Failed to load user profile data.",
        variant: "destructive",
      });
    }
  };

  // ... existing tech stack filtering code ...
  useEffect(() => {
    if (formData.techInput) {
      const filtered = predefinedTechStacks.filter(
        tech => tech.toLowerCase().includes(formData.techInput.toLowerCase()) && 
               !formData.techStack.includes(tech)
      );
      setFilteredTechOptions(filtered);
    } else {
      setFilteredTechOptions([]);
    }
  }, [formData.techInput, formData.techStack]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target) &&
          techInputRef.current && !techInputRef.current.contains(event.target)) {
        setShowTechDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate form fields based on current step
  const validateStep = (stepNumber) => {
    const errors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.projectTitle.trim()) errors.projectTitle = "Project title is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        break;
      case 2:
        if (formData.techStack.length === 0) errors.techStack = "At least one technology is required";
        break;
      case 3:
        if (!formData.experienceLevel) errors.experienceLevel = "Experience level is required";
        if (!formData.devType) errors.devType = "Developer type is required";
        break;
      case 4:
        if (!formData.budget.trim()) errors.budget = "Budget is required";
        if (isNaN(parseFloat(formData.budget))) errors.budget = "Budget must be a valid number";
        if (!formData.deadline) errors.deadline = "Deadline is required";
        break;
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ... existing tech stack handlers ...
  const handleTechStackAdd = (tech) => {
    if (!formData.techStack.includes(tech) && tech.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech],
        techInput: ''
      }));
      setShowTechDropdown(false);
    }
  };

  const handleTechStackRemove = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleTechInputChange = (e) => {
    setFormData(prev => ({ ...prev, techInput: e.target.value }));
    setShowTechDropdown(true);
  };

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && formData.techInput.trim()) {
      e.preventDefault();
      handleTechStackAdd(formData.techInput);
    } else if (e.key === 'Escape') {
      setShowTechDropdown(false);
    }
  };

  const handleTechInputFocus = () => {
    setShowTechDropdown(true);
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
    // Clear errors when going back
    setFormErrors({});
  };
  
  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      deadline: e.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }

    if (!companyId) {
      console.error("Company ID is missing, attempting one more lookup");
      
      // One last attempt to get companyId from localStorage
      try {
        const parsedProfile = await fetchUserProfile();
        if (parsedProfile) {
          if (parsedProfile.companyProfiles && parsedProfile.companyProfiles.length > 0) {
            const externalId = parsedProfile.companyProfiles[0].externalId;
            if (externalId) {
              setCompanyId(externalId);
            } else {
              throw new Error("No externalId found in company profiles");
            }
          } else {
            throw new Error("No company profiles found");
          }
        } else {
          throw new Error("No user profile found in localStorage");
        }
      } catch (error) {
        console.error("Final attempt to get companyId failed:", error);
        toast({
          title: "Submission Error",
          description: "Company profile not found. Please try again later.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Format attachments if any
      const attachmentIds = formData.attachments.length > 0 
        ? formData.attachments.join(',') 
        : "";
      
      // Format the deadline manually without using date-fns
      let formattedDeadline = null;
      if (formData.deadline) {
        // Replace T with a space and add seconds
        formattedDeadline = formData.deadline.replace('T', ' ') + ':00';
      }
      
      // Prepare payload according to API requirements
      const payload = {
        title: formData.projectTitle,
        description: formData.description,
        category: formData.category,
        budget: parseFloat(formData.budget),
        currency: formData.currency,
        deadline: formattedDeadline,
        ndaRequired: formData.ndaRequired,
        tags: formData.techStack.join(','),
        "tech-stack": formData.techStack,
        attachments: attachmentIds ? {
          TASK_ATTACHMENT: attachmentIds
        } : {}
      };
            
      const postTaskResponse = await postTask(companyId,payload);
      
      trackEvent(AnalyticEvents.TASK_POSTED,postTaskResponse);
      
      if (postTaskResponse) {
        toast({
          title: "Task Posted Successfully",
          description: "Your task has been submitted successfully!",
        });
        
        // Reset form or redirect
        setFormData({
          projectTitle: '',
          description: '',
          techStack: [],
          techInput: '',
          budget: '',
          currency: 'INR',
          category: 'p0',
          timeline: '',
          deadline: '',
          experienceLevel: '',
          devType: '',
          ndaRequired: false,
          additionalInfo: '',
          attachments: []
        });
        setStep(1);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "There was a problem posting your task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-bold mb-1">Project Overview</h3>
              <p className="text-gray-600 text-sm mb-4">Let's start with the basics of your project.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.projectTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}
                  placeholder="Enter a clear title for your project"
                  className={`w-full ${formErrors.projectTitle ? 'border-red-500' : ''}`}
                />
                {formErrors.projectTitle && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.projectTitle}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project requirements in detail..."
                  className={`w-full min-h-[120px] ${formErrors.description ? 'border-red-500' : ''}`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-bold mb-1">Technical Requirements</h3>
              <p className="text-gray-600 text-sm mb-4">Define the technical aspects of your project.</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack Requirements <span className="text-red-500">*</span>
                </label>
                
                {/* Selected Tech Tags */}
                {formData.techStack.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200 gap-1.5 transition-all"
                      >
                        {tech}
                        <button
                          onClick={() => handleTechStackRemove(tech)}
                          className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${tech}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Search Input */}
                <div className="relative">
                  <div className={`flex items-center rounded-md border ${formErrors.techStack ? 'border-red-500' : 'border-gray-300'} focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 overflow-hidden`}>
                    <div className="flex-shrink-0 pl-3 text-gray-400">
                      <Search size={16} />
                    </div>
                    <input
                      ref={techInputRef}
                      value={formData.techInput}
                      onChange={handleTechInputChange}
                      onFocus={handleTechInputFocus}
                      onKeyDown={handleTechInputKeyDown}
                      placeholder="Search or add technologies..."
                      className="flex-1 py-2 px-2 outline-none text-sm"
                    />
                    {formData.techInput && (
                      <button
                        onClick={() => handleTechStackAdd(formData.techInput)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Add custom technology"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  
                  {formErrors.techStack && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.techStack}
                    </p>
                  )}
                  
                  {/* Tech Dropdown */}
                  {showTechDropdown && (formData.techInput || filteredTechOptions.length > 0) && (
                    <div 
                      ref={techDropdownRef}
                      className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-y-auto"
                    >
                      <ul className="py-1">
                        {filteredTechOptions.length > 0 ? (
                          filteredTechOptions.map(tech => (
                            <li 
                              key={tech}
                              onClick={() => handleTechStackAdd(tech)}
                              className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                            >
                              {tech}
                            </li>
                          ))
                        ) : formData.techInput ? (
                          <li 
                            onClick={() => handleTechStackAdd(formData.techInput)}
                            className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                          >
                            <Plus size={14} className="text-blue-600" />
                            <span>Add "<span className="font-medium">{formData.techInput}</span>"</span>
                          </li>
                        ) : (
                          <li className="px-4 py-2 text-sm text-gray-500">No matching technologies found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Popular Technologies */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Popular Technologies
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {predefinedTechStacks
                      .filter(tech => !formData.techStack.includes(tech))
                      .slice(0, 10)
                      .map(tech => (
                        <button
                          key={tech}
                          onClick={() => handleTechStackAdd(tech)}
                          className="px-2.5 py-1 rounded-md text-xs border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          {tech}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-bold mb-1">Developer Requirements</h3>
              <p className="text-gray-600 text-sm mb-4">Specify what you're looking for in a developer.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className={`grid grid-cols-3 gap-3 ${formErrors.experienceLevel ? 'border border-red-500 rounded-lg p-1' : ''}`}>
                  {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                      className={`p-2.5 rounded-lg border text-sm transition-all ${
                        formData.experienceLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {formErrors.experienceLevel && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.experienceLevel}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer Type <span className="text-red-500">*</span>
                </label>
                <div className={`grid grid-cols-2 gap-3 ${formErrors.devType ? 'border border-red-500 rounded-lg p-1' : ''}`}>
                  {['Full-time', 'Part-time', 'Contract', 'Hourly'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData(prev => ({ ...prev, devType: type }))}
                      className={`p-2.5 rounded-lg border text-sm transition-all ${
                        formData.devType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formErrors.devType && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.devType}
                  </p>
                )}
              </div>
              
              <CustomCheckbox 
                id="nda" 
                checked={formData.ndaRequired}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, ndaRequired: checked }))
                } 
                label="Require NDA before task details are shared"
              />
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-xl font-bold mb-1">Project Details</h3>
              <p className="text-gray-600 text-sm mb-4">Almost there! Let's finalize the project details.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (INR) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="Enter your budget (e.g., 10000)"
                  className={`w-full ${formErrors.budget ? 'border-red-500' : ''}`}
                />
                {formErrors.budget && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formErrors.budget}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`flex items-center rounded-md border ${formErrors.deadline ? 'border-red-500' : 'border-gray-300'} focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 overflow-hidden`}>
                    <div className="flex-shrink-0 pl-3 text-gray-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={handleDateChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="flex-1 py-2 px-2 outline-none text-sm"
                    />
                  </div>
                  {formErrors.deadline && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {formErrors.deadline}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any other details you'd like to share..."
                  className="w-full min-h-[100px]"
                />
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Simple notification component */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg border shadow-md p-4 w-80 animate-in fade-in slide-in-from-right-5 ${
          notification.variant === 'destructive' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                {notification.variant === 'destructive' ? (
                  <XCircle size={18} className="text-red-600" />
                ) : (
                  <Check size={18} className="text-green-600" />
                )}
                <h3 className="font-medium text-sm">{notification.title}</h3>
              </div>
              {notification.description && (
                <p className="text-sm mt-1 opacity-90 ml-6">{notification.description}</p>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Card className="p-5 bg-white shadow-md border-0">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <motion.button
                key={stepNumber}
                onClick={() => setStep(stepNumber)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber === step
                    ? 'bg-blue-600 text-white'
                    : stepNumber < step
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {stepNumber}
              </motion.button>
            ))}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>
          
          {step === 4 ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit Task'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight size={16} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PostTaskForm;