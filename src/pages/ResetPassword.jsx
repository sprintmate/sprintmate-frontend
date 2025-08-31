import { useState, useEffect } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Sparkles,
  Shield
} from 'lucide-react';
import { fetchUserProfile, resetPassword } from '../api/userService';
import { authUtils } from '../utils/authUtils';
import { getLoginPage } from '../utils/redirectionUtil';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const navigate = useNavigate();
  useEffect(() => {
    // Check if reset token exists
    const resetToken = authUtils.getAuthToken();
    authUtils.setAuthToken(resetToken);
    if (!resetToken) {
      toast.error('No reset token found. Please request a new password reset.');
      navigate('/forgot-password');
      return;
    }
    
  }, [navigate]);

  const validatePassword = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one lowercase letter');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one uppercase letter');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('At least one special character');
    }

    setPasswordStrength({ score, feedback });
    return score >= 3; // Require at least 3 out of 5 criteria
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Password does not meet security requirements');
      setLoading(false);
      return;
    }

    try {
      const userData = await fetchUserProfile();
      console.log('userData is ' ,userData);
      await resetPassword(formData.password);
      setSuccess(true);
      toast.success('Password reset successful!');
      const redirectPath = await getLoginPage(userData.role);

      // Redirect to login after a delay
      setTimeout(() => {
        navigate(redirectPath, { 
          replace: true,
          state: { message: 'Password reset successful. Please log in with your new credentials.' }
        });
      }, 2000);
      
    } catch (error) {
      const errorMessage = 'Old link expired. Please request new link';
      setError(errorMessage);
      setTimeout(() => {
        navigate('/forgot-password', { 
          replace: true,
          state: { message: 'Old link expired. Please request new link'}
        });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 1) return 'text-red-500';
    if (passwordStrength.score <= 2) return 'text-orange-500';
    if (passwordStrength.score <= 3) return 'text-yellow-500';
    if (passwordStrength.score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 1) return 'Very Weak';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-6"
          >
            <CheckCircle2 size={64} className="text-green-600 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>
          <div className="w-16 h-16 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

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
              onClick={() => navigate('/forgot-password')}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Forgot Password
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
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                    Reset Your Password
                  </motion.h2>
                  <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-600">
                    Enter your new password below
                  </motion.p>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center text-red-700">
                        <XCircle size={20} className="mr-3 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div className="space-y-1" variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Enter your new password"
                        value={formData.password}
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
                    
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Password strength:</span>
                          <span className={`font-medium ${getPasswordStrengthColor()}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.score <= 1 ? 'bg-red-500' :
                              passwordStrength.score <= 2 ? 'bg-orange-500' :
                              passwordStrength.score <= 3 ? 'bg-yellow-500' :
                              passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            <p className="font-medium mb-1">Requirements:</p>
                            <ul className="space-y-1">
                              {passwordStrength.feedback.map((feedback, index) => (
                                <li key={index} className="flex items-center">
                                  <XCircle size={12} className="text-red-400 mr-1" />
                                  {feedback}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  <motion.div className="space-y-1" variants={itemVariants}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    
                    {/* Password match indicator */}
                    {formData.confirmPassword && (
                      <div className="mt-2">
                        {formData.password === formData.confirmPassword ? (
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle2 size={12} className="mr-1" />
                            Passwords match
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-red-600">
                            <XCircle size={12} className="mr-1" />
                            Passwords do not match
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={loading || formData.password !== formData.confirmPassword || passwordStrength.score < 3}
                      className="w-full relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </form>

                {/* Help text */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 pt-6 border-t border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <Sparkles size={16} className="text-blue-500 mr-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Password Security Tips
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Use a mix of letters, numbers, and symbols</p>
                    <p>• Avoid common words or personal information</p>
                    <p>• Consider using a password manager</p>
                  </div>
                </motion.div>
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

export default ResetPassword;
