import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Building,
  Briefcase,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Globe,
  AlignLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { authUtils } from '../utils/authUtils';
import { createCompanyProfile } from '../api/companyService';

const industries = [
  { value: 'Tech', label: 'Technology' },
  { value: 'Finance', label: 'Finance & Banking' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Entertainment', label: 'Media & Entertainment' },
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Legal', label: 'Legal Services' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Marketing', label: 'Marketing & Advertising' },
];

const CompanyProfileRegistration = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [about, setAbout] = useState('');
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState('');
  const [filePreview, setFilePreview] = useState(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL for the image
      const previewURL = URL.createObjectURL(selectedFile);
      setFilePreview(previewURL);
      
      // Upload file immediately
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (fileToUpload) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('type', 'LOGO');

      const token = authUtils.getAuthToken();
      const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/documents/upload`;
      // Log the upload URL for debugging
      console.log('Uploading to:', uploadUrl);

      const response = await axios.post(
        uploadUrl,
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
        setFileId(response.data.externalId);
        toast.success('Logo uploaded successfully!');
      }
    } catch (error) {
      // Improved error logging
      console.error('Error uploading file:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response) {
        console.error('Upload error response:', error.response);
        toast.error(`Failed to upload logo: ${error.response.status} ${error.response.statusText}`);
      } else {
        toast.error('Failed to upload logo. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!companyName.trim()) {
      toast.error('Company name is required');
      return;
    }
    
    if (!industry.trim()) {
      toast.error('Industry is required');
      return;
    }
    
    if (!about.trim()) {
      toast.error('About section is required');
      return;
    }
    
    if (!fileId) {
      toast.error('Please upload a company logo');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const payload = {
        companyName,
        industry,
        verificationStatus: true,
        attachments: {
          LOGO: fileId
        },
        about
      };
      
      const token = authUtils.getAuthToken();
      await createCompanyProfile(userId,payload);

      authUtils.removeUserProfile();
      
      toast.success('Company profile created successfully!');
      navigate('/company/dashboard');
      
    } catch (error) {
      console.error('Error creating company profile:', error);
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    } finally {
      setIsLoading(false);
    }
  };


  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!companyName.trim()) {
        toast.error('Company name is required');
        return;
      }
      if (!industry.trim()) {
        toast.error('Industry is required');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      
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
            <div className="bg-blue-600 text-white p-4 rounded-full inline-flex items-center justify-center mb-4">
              <Building size={24} />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900"
          >
            Complete Your Company Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-gray-600"
          >
            Help us personalize your experience and connect you with the right talent
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
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </motion.div>
              <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </motion.div>
              <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </motion.div>
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm">
            <div className="w-28 text-center">Company Info</div>
            <div className="w-28 text-center">Company Logo</div>
            <div className="w-28 text-center">About</div>
          </div>
        </div>
        
        <Card className="shadow-xl border-blue-100">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Company Information"}
              {currentStep === 2 && "Upload Company Logo"}
              {currentStep === 3 && "About Your Company"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter the basic details about your company"}
              {currentStep === 2 && "Add your company logo to make your profile stand out"}
              {currentStep === 3 && "Tell us more about what your company does"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-700">
                      <Building className="inline-block mr-2 h-4 w-4" />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="industry" className="text-gray-700">
                      <Briefcase className="inline-block mr-2 h-4 w-4" />
                      Industry
                    </Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.value} value={ind.value}>
                            {ind.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Why we need this information</h3>
                        <p className="text-sm text-blue-700">
                          This helps us match you with developers who have relevant experience in your industry.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Logo Upload */}
              {currentStep === 2 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {filePreview ? (
                      <div className="relative w-48 h-48 mb-4">
                        <img 
                          src={filePreview} 
                          alt="Company logo preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <p className="text-sm font-medium text-blue-600">
                      {filePreview ? 'Change logo' : 'Upload your company logo'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG or GIF up to 2MB
                    </p>
                    
                    {fileId && (
                      <div className="flex items-center mt-4 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Logo uploaded successfully
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Make your company stand out</h3>
                        <p className="text-sm text-amber-700">
                          Companies with logos get 50% more responses from developers.
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
                      About Your Company
                    </Label>
                    <Textarea
                      id="about"
                      placeholder="Tell us about your company, mission, values and what makes your company unique..."
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className="h-40 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Globe className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-purple-800">Tips for a great company description</h3>
                        <ul className="mt-2 text-sm text-purple-700 list-disc list-inside space-y-1">
                          <li>Briefly describe what your company does</li>
                          <li>Highlight your company culture and values</li>
                          <li>Mention any notable achievements or clients</li>
                          <li>Explain why developers should be excited to work with you</li>
                        </ul>
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
              <Button type="button" onClick={goToNextStep}>
                Continue
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
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

export default CompanyProfileRegistration;
