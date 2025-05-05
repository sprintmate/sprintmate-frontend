import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authUtils } from '@/utils/authUtils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Github,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { createUser, generateToken, fetchUserProfile } from '../api/userService';
import { getPostLoginRedirectPath } from '../utils/redirectionUtil';



const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    cred: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.pathname.includes('company') ? 'company' : 'developer';
  const oauthRole = userType === 'company' ? 'CORPORATE' : 'DEVELOPER';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let tokenResponse;

      if (isSignUp) {
        await createUser({
          name,
          email: formData.email,
          role: oauthRole,
          cred: formData.cred
        });

        toast.success("Account created! Logging in...");
      }

      tokenResponse = await generateToken({
        email: formData.email,
        cred: formData.cred
      });

      console.log('token response ', tokenResponse)

      if (tokenResponse?.token) {
        console.log('inside if block ', tokenResponse)
        authUtils.setAuthToken(tokenResponse.token);
        const userProfile = await fetchUserProfile();
        console.log("user profile ", userProfile, 'userType', userType);
        authUtils.setUserProfile(userProfile);
        toast.success(isSignUp ? 'Signup successful!' : 'Login successful!');
        const redirectPath = getPostLoginRedirectPath(userProfile);
        console.log("redirectPath " , redirectPath);

        if (redirectPath.includes('complete')) {
          toast('Please complete your profile', { icon: 'ℹ️' });
        } else {
          toast.success('Successfully signed in!');
          authUtils.removeOAuthRole();
        }

        navigate(redirectPath, { replace: true });
      }

    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    authUtils.setOAuthRole(oauthRole);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google?role=${userType}`;
  };

  const handleGithubLogin = () => {
    authUtils.setOAuthRole(oauthRole);
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github?role=${userType}`;
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      name: '',
    });
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    });
    setName('');
    setError('');
    setSuccess('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const formLabelVariants = {
    focus: { y: -5, scale: 0.95, originX: 0 },
    initial: { y: 0, scale: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header with navigation */}
      <header className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xl font-bold text-gray-900">
              <Code size={24} className="text-blue-600" />
              <span>SprintFlow</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <motion.div
        className="flex-1 flex items-center justify-center px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Floating decorative elements */}
            <motion.div
              className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-16 h-16 rounded-full bg-blue-300 opacity-10 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-20 h-20 rounded-full bg-indigo-400 opacity-10 blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                x: [0, 10, 0],
                y: [0, -10, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Main card */}
            <motion.div
              className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1">
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg"></div>
              </div>

              <div className="px-6 py-8 sm:px-10">
                <div className="text-center mb-8">
                  <motion.div className="inline-block mb-2" whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                    {isSignUp ? `Create ${userType === 'company' ? 'Company' : 'Developer'} Account` : `${userType === 'company' ? 'Company' : 'Developer'} Login`}
                  </motion.h2>
                  <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-600">
                    {isSignUp
                      ? `Join our platform as a ${userType === 'company' ? 'company' : 'developer'} and start your journey`
                      : `Access your ${userType === 'company' ? 'company' : 'developer'} dashboard`}
                  </motion.p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center text-green-700">
                        <CheckCircle2 size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm">{success}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center text-red-700">
                        <XCircle size={16} className="mr-2 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {isSignUp && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your full name"
                            required={isSignUp}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div className="space-y-1" variants={itemVariants}>
                    <motion.label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                      variants={formLabelVariants}
                      initial="initial"
                      whileFocus="focus"
                    >
                      Email Address
                    </motion.label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.span
                          className="text-gray-400"
                          whileHover={{ rotate: 10 }}
                        >
                          @
                        </motion.span>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder={`${userType}@example.com`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>

                  <motion.div className="space-y-1" variants={itemVariants}>
                    <label htmlFor="cred" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="cred"
                        name="cred"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your password"
                        value={formData.cred}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: loading ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: loading ? 0 : 1 }}
                      >
                        {isSignUp ? 'Create Account' : 'Login to Dashboard'}
                      </motion.span>
                      <motion.div
                        className="ml-2"
                        animate={{ x: loading ? 10 : 0, opacity: loading ? 0 : 1 }}
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Social login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={handleGoogleLogin}
                      className="w-full inline-flex justify-center items-center py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      whileTap={{ y: 0 }}
                    >
                      <FaGoogle className="mr-2" />
                      Google
                    </motion.button>
                    <motion.button
                      onClick={handleGithubLogin}
                      className="w-full inline-flex justify-center items-center py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      whileTap={{ y: 0 }}
                    >
                      <FaGithub className="mr-2" />
                      GitHub
                    </motion.button>
                  </div>
                </div>

                {/* Toggle login/signup */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 text-center text-sm"
                >
                  <p className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      type="button"
                      onClick={handleToggleMode}
                      className="ml-1 text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                    >
                      {isSignUp ? 'Log in' : 'Sign up'}
                    </button>
                  </p>
                </motion.div>

                {/* User type specific highlights */}
                {!isSignUp && (
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center mb-3">
                      <Sparkles size={16} className="text-blue-500 mr-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {userType === 'company' ? 'Company Benefits' : 'Developer Benefits'}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(userType === 'company'
                        ? [
                          "Find top talent",
                          "Manage projects",
                          "Track progress",
                          "Secure payments"
                        ]
                        : [
                          "Find exciting projects",
                          "Build your portfolio",
                          "Flexible remote work",
                          "Secure payments"
                        ]
                      ).map((benefit, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center text-xs text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (i * 0.1) }}
                        >
                          <CheckCircle2 size={12} className="text-green-500 mr-1.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SprintFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default Login; 