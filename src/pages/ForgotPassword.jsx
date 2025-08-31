import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  User,
  Mail,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { forgotPassword } from '../api/userService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.pathname.includes('company') ? 'company' : 'developer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await forgotPassword(email);
      setSuccess(true);
      toast.success('Check your email for reset instructions');
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(`/${userType}/login`);
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
              onClick={handleBackToLogin}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Login
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
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                    Forgot Password
                  </motion.h2>
                  <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password
                  </motion.p>
                </div>

                {/* Success message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center text-green-700">
                        <CheckCircle2 size={20} className="mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Check your email!</p>
                          <p className="text-sm mt-1">
                            We've sent password reset instructions to <strong>{email}</strong>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                {!success && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <motion.div className="space-y-1" variants={itemVariants}>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">@</span>
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder={`${userType}@example.com`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.button
                        type="submit"
                        disabled={loading}
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
                          {loading ? 'Sending...' : 'Send Reset Link'}
                        </motion.span>
                      </motion.button>
                    </motion.div>
                  </form>
                )}

                {/* Back to login */}
                <motion.div
                  variants={itemVariants}
                  className="mt-6 text-center text-sm"
                >
                  <p className="text-gray-600">
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                    >
                      Back to login
                    </button>
                  </p>
                </motion.div>

                {/* Help text */}
                {!success && (
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-gray-100"
                  >
                    <div className="flex items-center mb-3">
                      <Sparkles size={16} className="text-blue-500 mr-2" />
                      <p className="text-sm font-medium text-gray-900">
                        Need help?
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Check your spam folder if you don't see the email</p>
                      <p>• Make sure you're using the email associated with your account</p>
                      <p>• Contact support if you continue having issues</p>
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

export default ForgotPassword;
