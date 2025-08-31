import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verifyResetPasswordToken } from '../../api/userService';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authUtils } from '../../utils/authUtils';

const ResetPasswordTokenHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    const handleTokenVerification = async () => {
      const token = searchParams.get('token');
      authUtils.setAuthToken(token);
      if (!token) {
        setStatus('error');
        setError('No reset token found in the URL');
        return;
      }

      try {
        // Store the token in localStorage
        localStorage.setItem('reset_token', token);
        
        // Verify the token with the API
        await verifyResetPasswordToken(token);
        
        // Token is valid, redirect to reset password form
        setStatus('success');
        toast.success('Token verified successfully');
        
        // Redirect after a short delay to show success state
        setTimeout(() => {
          navigate('/reset-password', { replace: true });
        }, 1500);
        
      } catch (error) {
        console.error('Token verification error:', error);
        setStatus('error');
        setError('Reset link has expired or is invalid');
        
        // Clear any stored reset token
        localStorage.removeItem('reset_token');
        
        // Redirect to link expired page after a delay
        setTimeout(() => {
          navigate('/link-expired', { replace: true });
        }, 3000);
      }
    };

    handleTokenVerification();
  }, [searchParams, navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Loader2 size={48} className="text-blue-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Reset Link
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your password reset link...
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-4"
          >
            <CheckCircle2 size={48} className="text-green-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Link Verified!
          </h2>
          <p className="text-gray-600">
            Redirecting you to the password reset form...
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-4"
          >
            <XCircle size={48} className="text-red-600" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to help page...
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ResetPasswordTokenHandler;
