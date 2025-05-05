// DeveloperDashboard.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Home,
  CheckSquare,
  Briefcase,
  Search,
  Bell,
  User,
  Menu,
  X,
  ArrowRight,
  Settings,
  LogOut,
  Code
} from 'lucide-react';

import CustomCursor from "@/components/ui/CustomCursor";

// Import developer dashboard components
import DeveloperHome from '@/components/developer/DeveloperHome';
import ProjectsList from '@/components/developer/ProjectsList';
import MyApplications from '@/components/developer/MyApplications';
import SettingsPage from '@/components/developer/SettingsPage';
import DeveloperProfile from '@/components/developer/DeveloperProfile';
import NotFound from '@/components/developer/NotFound';
import { authUtils } from '../utils/authUtils';
import { fetchUserProfile } from '../api/userService';

// Sidebar link component
const SidebarLink = ({ to, icon: Icon, label, isActive, isExpanded }) => {
  return (
    <Link
      to={to}
      className={`flex items-center py-3 px-3 rounded-lg transition-colors ${isActive
          ? 'bg-blue-50 text-blue-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
      {isExpanded && (
        <span className="ml-3 transition-opacity duration-200">
          {label}
        </span>
      )}
    </Link>
  );
};

const DeveloperDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [developer, setDeveloper] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sidebarRef = useRef(null);

  // Navigation links for the sidebar - use full paths to match Routes definition
  const navLinks = [
    { to: '/developer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/developer/dashboard/projects', icon: Briefcase, label: 'Find Projects' },
    { to: '/developer/dashboard/applications', icon: CheckSquare, label: 'My Applications' },
    { to: '/developer/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/developer/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  // Fetch developer profile on mount
  useEffect(() => {
    const fetchDeveloperProfile = async () => {
      try {
        const storedProfile = await fetchUserProfile();
        console.log("fetched user profile from developer dashboard " , storedProfile)
        if (storedProfile) {
          setDeveloper(storedProfile);
          authUtils.setUserProfile(storedProfile);
          return;
        }
  
        const token = authUtils.getAuthToken();
        if (!token) {
          navigate('/developer/login');
          return;
        }
      } catch (error) {
        console.error("Error fetching developer profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDeveloperProfile();
  }, [navigate]);
  

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    authUtils.clearAllData();
    navigate('/developer/login');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Function to determine if a route is active (accounting for index route)
  const isRouteActive = (path) => {
    if (path === '/developer/dashboard') {
      return location.pathname === '/developer/dashboard';
    }
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50 cursor-none flex">
      <CustomCursor />

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-900 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-md flex flex-col border-r border-blue-100
                  h-screen overflow-hidden lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        animate={{
          width: (isSidebarExpanded || isMobileMenuOpen) ? 240 : 80,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo section */}
        <div className={`py-6 ${(isSidebarExpanded || isMobileMenuOpen) ? 'px-6' : 'px-4'} border-b border-blue-100 flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="p-1 bg-blue-100 rounded text-blue-600">
              <Code size={20} />
            </div>
            {(isSidebarExpanded || isMobileMenuOpen) && (
              <h1 className="ml-3 font-bold text-xl">Dev Portal</h1>
            )}
          </div>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-gray-500 hover:text-gray-700 hidden lg:block"
          >
            <ArrowRight
              size={20}
              className={`transform transition-transform ${isSidebarExpanded ? '' : 'rotate-180'
                }`}
            />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isExpanded={isSidebarExpanded || isMobileMenuOpen}
              isActive={isRouteActive(link.to)}
            />
          ))}
        </nav>

        {/* User profile section */}
        <div className={`p-4 border-t border-blue-100 ${(isSidebarExpanded || isMobileMenuOpen) ? 'px-4' : 'px-3'}`}>
          <div
            onClick={() => navigate('/developer/dashboard/profile')}
            className={`flex items-center cursor-pointer hover:bg-gray-100 ${isRouteActive('/developer/dashboard/profile') ? 'bg-blue-50 text-blue-600' : ''} rounded-lg p-2 transition-colors`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-semibold">
              {getInitials(developer?.name)}
            </div>
            {(isSidebarExpanded || isMobileMenuOpen) && (
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {developer?.name || "Developer"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {developer?.email || "developer@example.com"}
                </p>
              </div>
            )}
          </div>

          {(isSidebarExpanded || isMobileMenuOpen) && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        className="flex-1 min-w-0 h-screen overflow-y-auto"
        animate={{
          marginLeft: isSidebarExpanded ? 0 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <header className="bg-white border-b border-blue-100 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={24} />
              </button>

              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-800">
                  {location.pathname.includes('/projects') ? 'Available Projects' :
                    location.pathname.includes('/applications') ? 'My Applications' :
                      location.pathname.includes('/profile') ? 'Developer Profile' :
                        location.pathname.includes('/settings') ? 'Settings' : 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <Bell size={20} />
                </button>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>

              <div className="hidden md:flex items-center bg-gray-100 rounded-lg py-1.5 px-2 gap-2">
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="bg-transparent border-none outline-none text-sm w-40"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="py-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <Routes>
            <Route index element={<DeveloperHome developer={developer} />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<DeveloperProfile developer={developer} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </motion.main>
    </div>
  );
};

export default DeveloperDashboard;
