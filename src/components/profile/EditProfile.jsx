import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Save,
  Building2,
  User,
  Lock,
  FileText,
  Upload,
  Loader2,
  Briefcase,
  MapPin,
  Link2,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchSecureDocument, uploadFile } from '../../api/documentService';
import { reloadPage } from '../../utils/applicationUtils';



// Configuration for editable fields based on role
const EDITABLE_FIELDS_CONFIG = {
  CORPORATE: {
    name: true,
    companyProfiles: {
      companyName: true,
      industry: true,
      about: true,
      email: false,
      attachments: {
        LOGO: true
      }
    }
  },
  DEVELOPER: {
    name: true,
    developerProfiles: {
      skills: true,
      about: true,
      availability: true,
      preferredWorkType: true,
      yearsOfExperience: true,
      portfolio: {
        GITHUB: true,
        LINKEDIN: true,
        WEBSITE: true,
        PROFILE_PIC: true,
        LATEST_RESUME: true
      }
    }
  }
};

import { updateUser } from '../../api/userService';

const EditProfile = ({ userData, onSave, onCancel, open }) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [resumePreview, setResumePreview] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Get the first profile based on role
  const profile = userData?.role === 'CORPORATE'
    ? userData?.companyProfiles?.[0]
    : userData?.developerProfiles?.[0];

  // Form data state with user and profile data pre-filled
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    password: '',
    confirmPassword: '',
    // Corporate fields
    companyName: profile?.companyName || '',
    industry: profile?.industry || '',
    about: profile?.about || '',
    email: profile?.email || '',
    logo: profile?.attachments?.LOGO || '',
    // Developer fields
    skills: profile?.skills || '',
    availability: profile?.availability || 'FULL_TIME',
    preferredWorkType: profile?.preferredWorkType || 'REMOTE',
    yearsOfExperience: profile?.yearsOfExperience || '',
    portfolio: {
      GITHUB: profile?.portfolio?.GITHUB || '',
      LINKEDIN: profile?.portfolio?.LINKEDIN || '',
      WEBSITE: profile?.portfolio?.WEBSITE || '',
      PROFILE_PIC: profile?.portfolio?.PROFILE_PIC || '',
      LATEST_RESUME: profile?.portfolio?.LATEST_RESUME || ''
    }
  });

  // Get editable fields for current role
  const editableFields = EDITABLE_FIELDS_CONFIG[userData?.role] || {};

  // Fetch logo/profile pic and resume preview on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      if (userData?.role === 'CORPORATE' && formData.logo) {
        try {
          setLogoLoading(true);
          const response = await fetchSecureDocument(formData.logo);
          setLogoPreview(response.fileUrl);
        } catch (error) {
          console.error('Error fetching logo:', error);
        } finally {
          setLogoLoading(false);
        }
      } else if (userData?.role === 'DEVELOPER') {
        if (formData.portfolio.PROFILE_PIC) {
          try {
            setLogoLoading(true);
            const response = await fetchSecureDocument(formData.portfolio.PROFILE_PIC);
            setLogoPreview(response.fileUrl);
          } catch (error) {
            console.error('Error fetching profile picture:', error);
          } finally {
            setLogoLoading(false);
          }
        }
        if (formData.portfolio.LATEST_RESUME) {
          try {
            setResumeLoading(true);
            const response = await fetchSecureDocument(formData.portfolio.LATEST_RESUME);
            setResumePreview(response.fileUrl);
          } catch (error) {
            console.error('Error fetching resume:', error);
          } finally {
            setResumeLoading(false);
          }
        }
      }
    };
    fetchFiles();
  }, [userData?.role, formData.logo, formData.portfolio.PROFILE_PIC, formData.portfolio.LATEST_RESUME]);

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

  // Handle file upload
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (type === 'LOGO' || type === 'PROFILE_PIC') {
        setLogoLoading(true);
      } else {
        setResumeLoading(true);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await uploadFile(formData);

      if (response.data && response.data.externalId) {
        if (userData?.role === 'CORPORATE') {
          setFormData(prev => ({
            ...prev,
            logo: response.data.externalId
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            portfolio: {
              ...prev.portfolio,
              [type === 'LOGO' || type ==='PROFILE_PIC' ? 'PROFILE_PIC' : 'LATEST_RESUME']: response.data.externalId
            }
          }));
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        if (type === 'LOGO' || type === 'PROFILE_PIC') {
          setLogoPreview(previewUrl);
        } else {
          setResumePreview(previewUrl);
        }

        setNotification({
          type: 'success',
          message: `${type === 'RESUME' ? 'Resume' : 'Profile picture'} uploaded successfully!`
        });
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setNotification({
        type: 'error',
        message: `Failed to upload ${type === 'RESUME' ? 'resume' : 'profile picture'}.`
      });
    } finally {
      if (type === 'LOGO' || type === 'PROFILE_PIC') {
        setLogoLoading(false);
      } else {
        setResumeLoading(false);
      }
    }
  };

  // Handle file removal
  const handleRemoveFile = (type) => {
    if (userData?.role === 'CORPORATE') {
      setFormData(prev => ({
        ...prev,
        logo: ''
      }));
      setLogoPreview(null);
    } else {
      setFormData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [type === 'LOGO' ? 'PROFILE_PIC' : 'LATEST_RESUME']: ''
        }
      }));
      if (type === 'LOGO') {
        setLogoPreview(null);
      } else {
        setResumePreview(null);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setNotification({
        type: 'error',
        message: 'Passwords do not match!'
      });
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        ...userData,
        name: formData.name,
        ...(formData.password && { password: formData.password })
      };

      if (userData?.role === 'CORPORATE') {
        updatedData.companyProfiles = [{
          ...profile,
          companyName: formData.companyName,
          industry: formData.industry,
          about: formData.about,
          email: formData.email,
          attachments: {
            ...profile.attachments,
            LOGO: formData.logo
          }
        }];
      } else {
        updatedData.developerProfiles = [{
          ...profile,
          skills: formData.skills,
          about: formData.about,
          availability: formData.availability,
          preferredWorkType: formData.preferredWorkType,
          yearsOfExperience: formData.yearsOfExperience,
          portfolio: {
            ...profile.portfolio,
            GITHUB: formData.portfolio.GITHUB,
            LINKEDIN: formData.portfolio.LINKEDIN,
            WEBSITE: formData.portfolio.WEBSITE,
            PROFILE_PIC: formData.portfolio.PROFILE_PIC,
            LATEST_RESUME: formData.portfolio.LATEST_RESUME
          }
        }];
      }

      await updateUser(userData.userId, updatedData);
      reloadPage();

      setNotification({
        type: 'success',
        message: 'Profile updated successfully!'
      });

      setTimeout(() => {
        onCancel();
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

  const isCorporate = userData?.role === 'CORPORATE';
  const imageKey = isCorporate ? 'LOGO' : 'PROFILE_PIC';
  const isEditable =
    isCorporate
      ? editableFields?.companyProfiles?.attachments?.LOGO
      : editableFields?.developerProfiles?.portfolio?.PROFILE_PIC;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
              'bg-red-100 border-l-4 border-red-500 text-red-700'
              }`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <Card className="overflow-hidden border-blue-100">
            <CardContent className="p-0">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User size={18} className="mr-2 text-blue-600" />
                  User Information
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
                      disabled={!editableFields.name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      className="w-full p-3"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="w-full p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="w-full p-3"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Picture/Logo */}
          <Card className="overflow-hidden border-blue-100">
            <CardContent className="p-0">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User size={18} className="mr-2 text-blue-600" />
                  {userData?.role === 'CORPORATE' ? 'Company Logo' : 'Profile Picture'}
                </h2>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-32 h-32 rounded-lg border-2 border-blue-200 overflow-hidden bg-blue-50 flex items-center justify-center group">
                    {logoLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    ) : logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt={userData?.role === 'CORPORATE' ? 'Company Logo' : 'Profile Picture'}
                          className="w-full h-full object-contain"
                        />
                        {/* {editableFields[userData?.role === 'CORPORATE' ? 'companyProfiles' : 'developerProfiles']?.attachments.LOGO && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleRemoveFile('LOGO')}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )} */}

                        {isEditable && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(imageKey)}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        )}

                      </>
                    ) : (
                      <User size={40} className="text-blue-300" />
                    )}
                  </div>

                  {/* {editableFields[userData?.role === 'CORPORATE' ? 'companyProfiles' : 'developerProfiles']?.attachments.LOGO && (
                    <div className="w-full max-w-xs">
                      <label className="block w-full">
                        <span className="sr-only">Choose {userData?.role === 'CORPORATE' ? 'company logo' : 'profile picture'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, userData?.role === 'CORPORATE' ? 'LOGO' : 'PROFILE_PIC')}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-medium
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended size: 200x200px</p>
                    </div>
                  )} */}

                  {isEditable && (
                    <div className="w-full max-w-xs">
                      <label className="block w-full">
                        <span className="sr-only">Choose {isCorporate ? 'company logo' : 'profile picture'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, imageKey)}
                          className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended size: 200x200px</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          {userData?.role === 'CORPORATE' && (
            <Card className="overflow-hidden border-blue-100">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Building2 size={18} className="mr-2 text-blue-600" />
                    Company Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <Input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        className="w-full p-3"
                        disabled={!editableFields.companyProfiles?.companyName}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <Input
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="Your industry"
                        className="w-full p-3"
                        disabled={!editableFields.companyProfiles?.industry}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Company
                      </label>
                      <Textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        placeholder="Tell us about your company..."
                        className="w-full p-3 min-h-[120px]"
                        disabled={!editableFields.companyProfiles?.about}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Developer Information */}
          {userData?.role === 'DEVELOPER' && (
            <>
              {/* Resume */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText size={18} className="mr-2 text-blue-600" />
                      Resume
                    </h2>

                    <div className="space-y-4">
                      {resumeLoading ? (
                        <div className="flex items-center justify-center h-20">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                      ) : resumePreview ? (
                        <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <FileText size={18} className="text-blue-600 mr-2" />
                            <span className="text-sm text-gray-700">Resume uploaded</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={resumePreview}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              View
                            </a>
                            {editableFields.developerProfiles?.portfolio?.LATEST_RESUME && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFile('RESUME')}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No resume uploaded yet</div>
                      )}

                      {/* {editableFields.developerProfiles?.portfolio?.PROFILE_PIC && (
                        <div>
                          <label className="block w-full">
                            <span className="sr-only">Choose {userData?.role === 'CORPORATE' ? 'company logo' : 'profile picture'}</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={e => handleFileUpload(e, 'PROFILE_PIC')}
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                        </div>
                      )} */}

                      {editableFields.developerProfiles?.portfolio?.LATEST_RESUME && (
                        <div>
                          <label className="block w-full">
                            <span className="block text-sm font-medium text-gray-700 mb-1">Upload new resume</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={e => handleFileUpload(e, 'LATEST_RESUME')}
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
                        </div>
                      )}



                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase size={18} className="mr-2 text-blue-600" />
                      Professional Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skills
                        </label>
                        <Input
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="e.g. React, Node.js, Python"
                          className="w-full p-3"
                          disabled={!editableFields.developerProfiles?.skills}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience
                        </label>
                        <Input
                          name="yearsOfExperience"
                          type="number"
                          value={formData.yearsOfExperience}
                          onChange={handleInputChange}
                          placeholder="Years of experience"
                          className="w-full p-3"
                          min="0"
                          max="50"
                          disabled={!editableFields.developerProfiles?.yearsOfExperience}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Availability
                        </label>
                        <select
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
                          disabled={!editableFields.developerProfiles?.availability}
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
                          disabled={!editableFields.developerProfiles?.preferredWorkType}
                        >
                          <option value="REMOTE">Remote</option>
                          <option value="HYBRID">Hybrid</option>
                          <option value="ONSITE">Onsite</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          About
                        </label>
                        <Textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          className="w-full p-3 min-h-[120px]"
                          disabled={!editableFields.developerProfiles?.about}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Links */}
              <Card className="overflow-hidden border-blue-100">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Link2 size={18} className="mr-2 text-blue-600" />
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
                          disabled={!editableFields.developerProfiles?.portfolio?.GITHUB}
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
                          disabled={!editableFields.developerProfiles?.portfolio?.LINKEDIN}
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
                          disabled={!editableFields.developerProfiles?.portfolio?.WEBSITE}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
