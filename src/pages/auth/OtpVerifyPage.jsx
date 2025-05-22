import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, ArrowLeft, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchUserProfile, verifyUser } from '../../api/userService';
import { useNavigate, useLocation } from 'react-router-dom';
import { authUtils } from '../../utils/authUtils';
import { getBaseRedirectionPath } from '../../utils/applicationUtils';

const OtpVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef([]);

  // Get email from location state or redirect to login
  const email = location.state?.email;
  
  useEffect(() => {
    if (!email) {
      navigate('/login', { 
        state: { 
          message: 'Please login first to verify your account' 
        }
      });
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      // Set countdown based on resend count
      setCountdown(resendCount === 0 ? 30 : 60);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, countdown, resendCount]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle OTP input change
 const handleOtpChange = (index, value) => {
  console.log('handling otp change ', index, value);
  
  // Allow only digits
  if (!/^\d*$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Auto-focus next input
  if (value && index < 3 && inputRefs.current[index + 1]) {
    inputRefs.current[index + 1].focus();
  }

  // // Auto-submit if all digits are filled
  // const otpString = newOtp.join('');
  // if (otpString.length === 4 && newOtp.every(d => d !== '')) {
  //   handleVerify(otpString); // Pass OTP directly
  // }
};





  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else {
      inputRefs.current[3].focus();
    }
  };

  // Verify OTP
  const handleVerify = async (otpString) => {
     console.log(' handleVerify otp string',otpString)

    // const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await verifyUser(otpString);
      
      // Store the token and user ID
      if (response.data?.token) {
        authUtils.setAuthToken(response.data.token);
        setSuccess(true);
        const userProfile = await fetchUserProfile();
        authUtils.setUserProfile(userProfile);
        // Redirect after a short delay
        // setTimeout(() => {
          navigate(getBaseRedirectionPath(), { 
            replace: true,
            state: { 
              message: 'Account verified successfully!' 
            }
          });
        // }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '']);
      // Focus first input
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call resend OTP API
      await resendOtp(email);
      setError('New OTP sent successfully!');
      setResendDisabled(true);
      setResendCount(prev => prev + 1);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format countdown time
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!email) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-lg">
          <CardContent className="p-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-6"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail size={32} className="text-blue-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
              <p className="text-gray-600">
                We've sent a 4-digit verification code to{' '}
                <span className="font-medium text-gray-800">{email}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Input
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-14 h-14 text-center text-2xl font-bold ${
                      error ? 'border-red-500 bg-red-50' : 
                      success ? 'border-green-500 bg-green-50' : 
                      'border-gray-300 hover:border-blue-500 focus:border-blue-500'
                    } transition-all duration-200`}
                    disabled={loading || success}
                  />
                </motion.div>
              ))}
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center mb-4 ${
                    error.includes('sent successfully') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center text-green-600 mb-4"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  <span>Verification successful!</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => handleVerify(otp.join(''))}
                disabled={loading || success || otp.join('').length !== 4}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Verified
                  </>
                ) : (
                  'Verify'
                )}
              </Button>

              <div className="text-center">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  disabled={loading || success || resendDisabled}
                  className="w-full"
                >
                  {resendDisabled ? (
                    `Resend OTP in ${formatCountdown(countdown)}`
                  ) : (
                    'Resend OTP'
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Didn't receive the code? Check your spam folder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OtpVerifyPage; 