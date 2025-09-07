import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  Mail,
  Clock
} from 'lucide-react';

const LinkExpiredPage = () => {
  const navigate = useNavigate();

  const handleGoToForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleGoToLogin = () => {
    navigate('/login');
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
              <span>CodeForContract</span>
            </div>
            <button
              onClick={handleGoToLogin}
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
              className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 w-16 h-16 rounded-full bg-orange-300 opacity-10 blur-xl"
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
              className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 w-20 h-20 rounded-full bg-red-400 opacity-10 blur-xl"
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
              className="bg-white/90 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl overflow-hidden"
              variants={itemVariants}
            >
              <div className="p-1">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-lg"></div>
              </div>

              <div className="px-6 py-8 sm:px-10">
                <div className="text-center mb-8">
                  <motion.div className="inline-block mb-2" whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900">
                    Reset Link Expired
                  </motion.h2>
                  <motion.p variants={itemVariants} className="mt-2 text-sm text-gray-600">
                    Your password reset link has expired or is no longer valid
                  </motion.p>
                </div>

                {/* Main content */}
                <motion.div variants={itemVariants} className="mb-8">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Clock size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-orange-800">
                        <p className="font-medium mb-1">Why did this happen?</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Reset links expire after a certain time for security</li>
                          <li>• The link may have been used already</li>
                          <li>• The link format may be incorrect</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">What you can do:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Request a new password reset link</li>
                          <li>• Check your email for the most recent link</li>
                          <li>• Contact support if you continue having issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <motion.button
                    onClick={handleGoToForgotPassword}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Request New Reset Link
                  </motion.button>

                  <motion.button
                    onClick={handleGoToLogin}
                    className="w-full flex items-center justify-center bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back to Login
                  </motion.button>
                </motion.div>

                {/* Help text */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 pt-6 border-t border-gray-100"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Need immediate assistance?
                    </p>
                    <div className="flex justify-center space-x-4 text-xs">
                      <button className="text-blue-600 hover:text-blue-800 hover:underline">
                        Contact Support
                      </button>
                      <span className="text-gray-400">|</span>
                      <button className="text-blue-600 hover:text-blue-800 hover:underline">
                        Help Center
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CodeForContract. All rights reserved.
      </footer>
    </div>
  );
};

export default LinkExpiredPage;
