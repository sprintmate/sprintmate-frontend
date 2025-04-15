import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaBuilding, FaUser, FaEnvelope, FaIdCard, FaPhone, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try to get profile from localStorage first
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
          setLoading(false);
          return;
        }
        
        // If not in localStorage, fetch from API
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        const response = await axios.get('https://round-georgianna-sprintmate-8451e6d8.koyeb.app/v1/users/profile', {
          headers: {
            'Authorization': token
          }
        });
        
        if (response.data) {
          setProfile(response.data);
          localStorage.setItem("userProfile", JSON.stringify(response.data));
          
          // Store externalId separately for easy access in other components
          if (response.data.externalId) {
            localStorage.setItem("userId", response.data.externalId);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-blue-600 text-xl font-semibold"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 text-xl font-semibold"
        >
          {error}
        </motion.div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-xl font-semibold"
        >
          Profile not found
        </motion.div>
      </div>
    );
  }
  
  // Animation variants for staggered animations
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Company Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-xl text-gray-500"
          >
            Your company information and details
          </motion.p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden"
        >
          {/* Header with company name */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 sm:px-10">
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="bg-white/20 p-4 rounded-full">
                <FaBuilding className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">
                  {profile.companyProfiles?.[0]?.name || "Company Name"}
                </h2>
                <p className="text-blue-100 mt-1">ID: {profile.externalId}</p>
              </div>
            </motion.div>
          </div>
          
          {/* Company Details */}
          <div className="px-6 py-8 sm:px-10">
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* User Information */}
              <motion.div variants={itemVariants} className="col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" /> User Information
                </h3>
                <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-800">{profile.fullName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center">
                        <FaEnvelope className="text-blue-600 mr-2" />
                        <p className="font-medium text-gray-800">{profile.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <div className="flex items-center">
                        <FaIdCard className="text-blue-600 mr-2" />
                        <p className="font-medium text-gray-800">{profile.externalId || "Not provided"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <div className="flex items-center">
                        <FaPhone className="text-blue-600 mr-2" />
                        <p className="font-medium text-gray-800">{profile.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Company Details */}
              {profile.companyProfiles && profile.companyProfiles.length > 0 && (
                <motion.div variants={itemVariants} className="col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaBuilding className="mr-2 text-blue-600" /> Company Details
                  </h3>
                  <div className="bg-indigo-50 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="font-medium text-gray-800">{profile.companyProfiles[0].name || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Company ID</p>
                        <p className="font-medium text-gray-800">{profile.companyProfiles[0].externalId || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-blue-600 mr-2 mt-1" />
                          <p className="font-medium text-gray-800">
                            {profile.companyProfiles[0].address || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration Number</p>
                        <p className="font-medium text-gray-800">{profile.companyProfiles[0].registrationNumber || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
            
            {/* Edit Profile Button */}
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={()=> navigate('/company/edit-profile') }
              >
                <FaEdit className="mr-2" />
                Edit Profile
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
