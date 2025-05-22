import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import OAuthCallback from './pages/OAuthCallback';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileCompletionChecker from './components/ProfileCompletionChecker';
import ErrorBoundary from './components/common/ErrorBoundary';
import OtpVerifyPage from './pages/auth/OtpVerifyPage';

const Landing = React.lazy(() => import('./pages/Landing'));
const DeveloperDashboard = React.lazy(() => import('./pages/DeveloperDashboard'));
const CreateDeveloperProfile = React.lazy(() => import('./pages/CreateDeveloperProfile'));
const CompanyDashboard = React.lazy(() => import('./pages/CompanyDashboard'));
const DeveloperProfilePage = React.lazy(() => import('./components/developer/DeveloperProfilePage'));
const CompanyProfileRegistration = React.lazy(() => import('./pages/CompanyProfileRegistration'));
const DeveloperProfileRegistration = React.lazy(() => import('./pages/DeveloperProfileRegistration'));

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <div className="bg-white min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/developer/login" element={<Login />} />
              <Route path="/company/login" element={<Login />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              
              {/* Handle both routes for OAuth redirects */}
              <Route path="/auth/callback" element={<OAuthCallback />} />
              
              {/* Add login route that redirects to developer login by default */}
              <Route path="/login" element={<Navigate to="/developer/login" replace />} />
              
              {/* Profile registration routes - These should NOT be protected */}
              <Route path="/complete-company-profile/:userId" element={<CompanyProfileRegistration />} />
              <Route path="/complete-developer-profile/:userId" element={<DeveloperProfileRegistration />} />
              
              {/* Protected Routes */}
              <Route
                path="/developer/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DeveloperDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/developer/profile/:developerId"
                element={
                  <ProtectedRoute>
                    <DeveloperProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/developer/create-profile"
                element={
                  <ProtectedRoute>
                    <CreateDeveloperProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard/*"
                element={
                  <ProtectedRoute>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/verify" element={<OtpVerifyPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
};

export default App;
