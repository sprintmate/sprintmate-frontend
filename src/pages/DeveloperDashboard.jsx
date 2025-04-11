// DeveloperDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProfile,
  createDeveloperProfile, 
  getDeveloperProfile, 
  getDeveloperStatistics,
  getAvailableTasks,
  getApplications,
  applyForTask,
  withdrawApplication,
  uploadDocument
} from '@/services/developerService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

// Components
import ProfileSection from '@/components/developer/ProfileSection';
import TaskList from '@/components/developer/TaskList';
import ApplicationList from '@/components/developer/ApplicationList';
import StatisticsCard from '@/components/developer/StatisticsCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UserHeader from '@/components/common/UserHeader';

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [applications, setApplications] = useState(null);
  const [currentTaskPage, setCurrentTaskPage] = useState(0);
  const [currentApplicationPage, setCurrentApplicationPage] = useState(0);
  const [developerId, setDeveloperId] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setErrors({ auth: 'User not authenticated' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrors({});
        
        // First get user profile to check for developer profile
        const userProfile = await getUserProfile();
        
        if (!userProfile.developerProfiles || userProfile.developerProfiles.length === 0) {
          // No developer profile exists, redirect to create profile
          navigate('/developer/create-profile');
          return;
        }

        // Get the first developer profile ID
        const devId = userProfile.developerProfiles[0].externalId;
        setDeveloperId(devId);

        // Fetch all data independently
        try {
          const profileData = await getDeveloperProfile(devId);
          setProfile(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setErrors(prev => ({ ...prev, profile: error.message }));
        }

        try {
          const stats = await getDeveloperStatistics(devId);
          setStatistics(stats);
        } catch (error) {
          console.error('Error fetching statistics:', error);
          setErrors(prev => ({ ...prev, statistics: error.message }));
        }

        try {
          const tasksData = await getAvailableTasks(devId, 0, 10);
          setTasks(tasksData.content);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          setErrors(prev => ({ ...prev, tasks: error.message }));
        }

        try {
          const apps = await getApplications(devId);
          setApplications(apps.content);
        } catch (error) {
          console.error('Error fetching applications:', error);
          setErrors(prev => ({ ...prev, applications: error.message }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrors(prev => ({ ...prev, userProfile: error.message }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAvailableTasks(developerId, currentTaskPage, 10);
        setTasks(data.content);
        setErrors(prev => ({ ...prev, tasks: null }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setErrors(prev => ({ ...prev, tasks: error.message }));
      }
    };

    fetchTasks();
  }, [developerId, currentTaskPage]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications(currentApplicationPage);
        console.log('Applications data:', data);
        setApplications(data.content);
        setErrors(prev => ({ ...prev, applications: null }));
      } catch (error) {
        console.error('Error fetching applications:', error);
        setErrors(prev => ({ ...prev, applications: error.message }));
      }
    };

    fetchApplications();
  }, [currentApplicationPage]);

  // Handle task application
  const handleApplyForTask = async (taskId, proposal) => {
    try {
      const applicationData = {
        developerId,
        proposal
      };
      
      await applyForTask(taskId, applicationData);
      toast.success('Application submitted successfully');
      
      // Refresh applications list
      try {
        const updatedApps = await getApplications(developerId);
        setApplications(updatedApps.content);
      } catch (error) {
        console.error('Error refreshing applications:', error);
        toast.error('Application submitted but failed to refresh list');
      }
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Application error:', error);
    }
  };

  // Handle application withdrawal
  const handleWithdrawApplication = async (taskId, applicationId) => {
    try {
      await withdrawApplication(taskId, applicationId);
      toast.success('Application withdrawn successfully');
      
      // Refresh applications list
      try {
        const updatedApps = await getApplications(developerId);
        setApplications(updatedApps.content);
      } catch (error) {
        console.error('Error refreshing applications:', error);
        toast.error('Application withdrawn but failed to refresh list');
      }
    } catch (error) {
      toast.error('Failed to withdraw application');
      console.error('Withdrawal error:', error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await createDeveloperProfile(updatedProfile);
      setProfile(response);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (file, type) => {
    try {
      const response = await uploadDocument(file, type);
      toast.success('Document uploaded successfully');
      return response;
    } catch (error) {
      toast.error('Failed to upload document');
      console.error('Document upload error:', error);
      throw error;
    }
  };

  const handleTaskPageChange = (page) => {
    setCurrentTaskPage(page);
  };

  const handleApplicationPageChange = (page) => {
    setCurrentApplicationPage(page);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Left Column - Profile and Statistics */}
            {!errors.profile && (
              <ProfileSection 
                profile={profile}
                onUpdate={handleProfileUpdate}
                onDocumentUpload={handleDocumentUpload}
              />
            )}
            {!errors.statistics && (
              <StatisticsCard statistics={statistics} />
            )}
          </div>
          
          <div className="space-y-8">
            {errors.applications && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.applications}
              </div>
            )}
            {!errors.tasks && (
              <TaskList 
                tasks={tasks}
                currentPage={currentTaskPage}
                totalPages={tasks?.totalPages || 0}
                onPageChange={handleTaskPageChange}
                onApply={handleApplyForTask}
              />
            )}
            <ApplicationList 
              applications={applications} 
              onWithdraw={handleWithdrawApplication}
              onPageChange={handleApplicationPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
