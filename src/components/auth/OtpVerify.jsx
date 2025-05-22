// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { verifyUser } from '../../api/userService';
// import { useNavigate } from 'react-router-dom';
// import { setAuthToken } from '../../utils/authUtils';

// const OtpVerify = ({ email, onVerificationComplete }) => {
//   const navigate = useNavigate();
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const inputRefs = useRef([]);

//   // Focus first input on mount
//   useEffect(() => {
//     if (inputRefs.current[0]) {
//       inputRefs.current[0].focus();
//     }
//   }, []);

//   // Handle OTP input change
//   const handleOtpChange = (index, value) => {
//     // Only allow numbers
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   // Handle backspace
//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Handle paste
//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text').slice(0, 4);
//     if (!/^\d+$/.test(pastedData)) return;

//     const newOtp = [...otp];
//     for (let i = 0; i < pastedData.length; i++) {
//       newOtp[i] = pastedData[i];
//     }
//     setOtp(newOtp);

//     // Focus the next empty input or the last input
//     const nextEmptyIndex = newOtp.findIndex(val => !val);
//     if (nextEmptyIndex !== -1) {
//       inputRefs.current[nextEmptyIndex].focus();
//     } else {
//       inputRefs.current[3].focus();
//     }
//   };

//   // Verify OTP
//   const handleVerify = async () => {
//     const otpString = otp.join('');
//     if (otpString.length !== 4) {
//       setError('Please enter a valid 4-digit OTP');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await verifyUser(otpString);
      
//       // Store the token and user ID
//       if (response.data?.token) {
//         setAuthToken(response.data.token);
//         setSuccess(true);
        
//         // Notify parent component
//         if (onVerificationComplete) {
//           onVerificationComplete(response.data);
//         }
        
//         // Redirect after a short delay
//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 1500);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
//       // Clear OTP on error
//       setOtp(['', '', '', '']);
//       // Focus first input
//       inputRefs.current[0].focus();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Resend OTP
//   const handleResend = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Call resend OTP API
//       await resendOtp(email);
//       setError('New OTP sent successfully!');
//     } catch (err) {
//       setError('Failed to resend OTP. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
//       <Card className="w-full max-w-md">
//         <CardContent className="p-6">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
//             <p className="text-gray-600">
//               We've sent a 4-digit verification code to {email}
//             </p>
//           </div>

//           {/* OTP Input */}
//           <div className="flex justify-center gap-2 mb-6">
//             {otp.map((digit, index) => (
//               <Input
//                 key={index}
//                 ref={el => inputRefs.current[index] = el}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={e => handleOtpChange(index, e.target.value)}
//                 onKeyDown={e => handleKeyDown(index, e)}
//                 onPaste={handlePaste}
//                 className={`w-14 h-14 text-center text-2xl font-bold ${
//                   error ? 'border-red-500' : 
//                   success ? 'border-green-500' : 
//                   'border-gray-300'
//                 }`}
//                 disabled={loading || success}
//               />
//             ))}
//           </div>

//           {/* Status Messages */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`text-center mb-4 ${
//                 error.includes('sent successfully') ? 'text-green-600' : 'text-red-600'
//               }`}
//             >
//               {error}
//             </motion.div>
//           )}

//           {success && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="flex items-center justify-center text-green-600 mb-4"
//             >
//               <CheckCircle2 className="w-5 h-5 mr-2" />
//               <span>Verification successful!</span>
//             </motion.div>
//           )}

//           {/* Action Buttons */}
//           <div className="space-y-4">
//             <Button
//               onClick={handleVerify}
//               disabled={loading || success || otp.join('').length !== 4}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Verifying...
//                 </>
//               ) : success ? (
//                 <>
//                   <CheckCircle2 className="w-4 h-4 mr-2" />
//                   Verified
//                 </>
//               ) : (
//                 'Verify'
//               )}
//             </Button>

//             <Button
//               onClick={handleResend}
//               variant="outline"
//               disabled={loading || success}
//               className="w-full"
//             >
//               Resend OTP
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OtpVerify; 