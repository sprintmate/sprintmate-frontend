
import EditProfile from '@/components/profile/EditProfile';

// Add UserProfile component
const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  // This would typically come from a context or API call
  const [userData, setUserData] = useState(null);

  // Get company ID from localStorage with better fallbacks
  useEffect(() => {
    const getCompanyProfileData = async () => {
      try {
        // First try to get from localStorage directly using the helper
        const storedProfile = getUserProfile();

        if (storedProfile && storedProfile.companyProfiles && storedProfile.companyProfiles.length > 0) {
          const companyExternalId = storedProfile.companyProfiles[0].externalId;
          if (companyExternalId) {
            console.log("Found company externalId from stored profile:", companyExternalId);
            setUserData(storedProfile.companyProfiles[0]);
            // setCompanyId(companyExternalId);
            return; // Exit if we found the ID
          }
        }

        // Fetch profile from API as a last resort
        const profileData = await fetchUserProfile();
        console.log('fetched profile data is ', profileData);

        if (profileData && profileData.companyProfiles && profileData.companyProfiles.length > 0) {
          const companyExternalId = profileData.companyProfiles[0].externalId;
          if (companyExternalId) {
            console.log("Found company externalId from API:", companyExternalId);
            // setCompanyId(companyExternalId);
            setUserData(profileData.companyProfiles[0]);
            return;
          }
        }

        // If we still don't have a company ID, show an error
        setError("Could not load company profile. Please try logging in again.");
      } catch (error) {
        console.error("Error in getCompanyProfileData:", error);
        setError("Could not load company profile. Please try again later.");
      }
    };

    getCompanyProfileData();
  }, []);

  // Check if we should be in edit mode based on url
  useEffect(() => {
    if (location.pathname.includes('/edit')) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [location.pathname]);

  // Extract first letters of first and last name for avatar
  const getInitials = (name) => {
    if (!name) return "-";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedData) => {
    try {
      // This would typically be an API call to update the profile
      console.log("Profile data to update:", updatedData);
      setUserData(prev => ({
        ...prev,
        ...updatedData
      }));

      // Navigate back to view mode
      navigate('/company/dashboard/profile');
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating profile:", error);
      return Promise.reject(error);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    navigate('/company/dashboard/profile');
  };

  // Show edit form if in edit mode
  if (isEditing) {
    return <EditProfile
      userData={userData}
      onSave={handleProfileUpdate}
      onCancel={handleCancelEdit}
    />;
  }

  // Otherwise show profile view
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-48 relative">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>

          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <span className="text-white text-4xl font-semibold">
                  {getInitials(userData?.name)}
                </span>
              </div>
            </div>
          </div>
        </div>  {/* Grid Pattern Overlay */}

        {/* Profile information */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData?.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <span className="text-sm">{userData?.email}</span>
                {userData?.verified && (
                  <Badge variant="blue" className="capitalize" size="sm">
                    Verified
                  </Badge>
                )}
              </p>
            </div>
            <div className="flex gap-3 px-8">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => navigate('/company/dashboard/profile/edit')}
              >
                <FileText size={16} />
                Edit Profile
              </Button>
              <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Settings size={16} />
                Settings
              </Button>
            </div>
          </div>

          {/* About section */}
          {userData?.about && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-gray-700">{userData.about}</p>
            </div>
          )}

          {/* Skills section */}
          {userData?.skills && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {userData.skills.split(',').map((skill) => (
                  <Badge key={skill} variant="blue" className="bg-blue-50/80">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Role & ID information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">{userData?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium text-gray-900 break-all">{userData.userId}</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Company Information */}
            {userData.companyProfiles && userData.companyProfiles.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500 uppercase tracking-wider">Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium text-gray-900">{userData.companyProfiles[0].companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium text-gray-900">{userData.companyProfiles[0].industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Verification Status</p>
                      <Badge variant={userData.companyProfiles[0].verificationStatus ? "green" : "yellow"} className="mt-1">
                        {userData.companyProfiles[0].verificationStatus ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Portfolio Links */}
          {userData.portfolio && Object.values(userData.portfolio).some(link => link) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Portfolio & Links</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="whitespace-pre-line">
                    {userData.education}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="p-6 text-center text-gray-500">
                  <div className="mb-3 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <p>No recent activity to display</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>{/* Activity section */}
      </motion.div>
    </div>
  );
};


export default UserProfile;