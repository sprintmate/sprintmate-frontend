import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Briefcase, Code, FileText, Github, Linkedin, Globe, Edit } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchDeveloperProfile } from '../../api/developerService';
import { fetchSecureDocument } from '../../api/documentService';
import { authUtils } from '../../utils/authUtils';
import { fetchUserProfile } from '../../services/authService';
import { set } from 'react-hook-form';
import EditProfile from '../profile/EditProfile';
import { normalizeSocialUrl } from '../../utils/applicationUtils';


const DeveloperProfile = () => {

  const { developerId } = useParams();
  const [developer, setData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDeveloperProfile(developerId);
        const developerUserResponse = await fetchUserProfile();
        setUserData(developerUserResponse);
        setData(response);

        if (response.portfolio?.PROFILE_PIC) {
          const profileUrl = (await fetchSecureDocument(response.portfolio.PROFILE_PIC)).fileUrl;
          console.log("fetched profile url ", profileUrl)
          setProfilePicUrl(profileUrl);
        }

        if (response.portfolio?.LATEST_RESUME) {
          const resumeUrl = (await fetchSecureDocument(response.portfolio.LATEST_RESUME));
          console.log("fetched resumeUrl url ", resumeUrl)

          setResumeUrl(resumeUrl);
        }

      } catch (error) {
        console.error('Failed to fetch developer profile:', error);
      }
    };

    fetchData();
  }, [developerId]);

  if (!developer) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700">Profile not found</h3>
          <p className="text-gray-500 mt-2">Unable to load profile information</p>
        </div>
      </div>
    );
  }

  const isOwner = developerId == authUtils.getUserProfile()?.developerProfiles[0]?.externalId;


  const devProfile = developer;


  const handleProfileUpdate = async (updatedData) => {
    try {
      // This would typically be an API call to update the profile
      console.log("Profile data to update:", updatedData);
      // setUserData(prev => ({
      //   ...prev,
      //   ...updatedData
      // }));

      // // Navigate back to view mode
      // navigate('/company/dashboard/profile');
      // return Promise.resolve();
    } catch (error) {
      console.error("Error updating profile:", error);
      return Promise.reject(error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    console.log('cancel clicked')
    // navigate('/company/dashboard/profile');
  };



  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-48 relative">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md overflow-hidden">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt={developer.developerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-4xl font-semibold">
                    {developer.developerName.split(' ').map(n => n[0]).join('').toUpperCase()}
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
              <h1 className="text-2xl font-bold text-gray-900">{developer.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{developer.developerName}  </span>
                <span className="text-sm">  {developer.email}</span>
                {developer.verified && (
                  <Badge variant="blue" className="ml-2">Verified</Badge>
                )}
              </p>
            </div>


            {/* {isOwner && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            )} */}

            {isOwner && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            )}

            {isEditing && (
              <EditProfile
                userData={userData}
                open={isEditing}
                onSave={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            )}

          </div>

          {/* About section */}
          {devProfile?.about && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{devProfile.about}</p>
            </div>
          )}

          {/* Skills section */}
          {devProfile?.skills && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {devProfile.skills.split(',').map((skill, index) => (
                  <Badge key={`profile-skill-${index}`} variant="outline" className="bg-blue-50 border-blue-200">
                    <Code className="h-3 w-3 mr-1 text-blue-600" />
                    {skill.trim()}
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
                  {/* <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 break-all">{developer.userId}</p>
                  </div> */}
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="font-medium text-gray-900">{devProfile?.availability || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Work Type</p>
                    <p className="font-medium text-gray-900">{devProfile?.preferredWorkType || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">Resume & Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devProfile?.resume && (
                    <div>
                      <p className="text-sm text-gray-500">Resume</p>
                      <div className="flex items-center mt-1">
                        <FileText className="h-4 w-4 text-blue-600 mr-2" />
                        <Button
                          className="px-0 text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(resumeUrl.blob);
                            link.download = resumeUrl.fileName;
                            link.click();
                          }}
                        >
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  )}


                  {devProfile?.portfolio && (
                    <div className="space-y-2">
                      {devProfile.portfolio.GITHUB && (
                        <div className="flex items-center">
                          <Github className="h-4 w-4 text-gray-700 mr-2" />
                          <a
                            href={normalizeSocialUrl(devProfile.portfolio.GITHUB)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            {devProfile.portfolio.GITHUB}
                          </a>
                        </div>
                      )}

                      {devProfile.portfolio.LINKEDIN && (
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 text-gray-700 mr-2" />
                          <a
                            href={normalizeSocialUrl(devProfile.portfolio.LINKEDIN)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            {devProfile.portfolio.LINKEDIN}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeveloperProfile;
