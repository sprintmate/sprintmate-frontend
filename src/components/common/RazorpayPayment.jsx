import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Loader2
} from 'lucide-react';
import { getToken } from '../../services/authService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const RazorpayPayment = ({ 
  applicationId, 
  onSuccess, 
  onError, 
  buttonText = "Accept & Pay", 
  buttonClassName = "",
  taskId = null // This prop should now be passed from parent component
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();
  
  // Log task ID on component mount for debugging
  useEffect(() => {
    console.log("RazorpayPayment component mounted with taskId:", taskId, "applicationId:", applicationId);
  }, [taskId, applicationId]);
  
  // Load Razorpay script when component mounts
  useEffect(() => {
    // Load the Razorpay script on component mount
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
    };
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Function to handle complete payment flow
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store the passed taskId if available
      console.log("Starting payment process with taskId:", taskId);
      
      // STEP 1: Create payment hold/create API
      console.log("Creating payment hold...");
      const payloadData = { taskApplicationId: applicationId };
      
      // Add taskId to request payload if available
      if (taskId) {
        payloadData.taskId = taskId;
      }
      
      const createResponse = await axios.post(
        `${url}/v1/order/payments/hold`,
        payloadData,
        { headers: { Authorization: `${token}` } }
      );
      
      console.log("Payment hold created:", createResponse.data);
      
      // Extract task ID from the response if possible
      let responseTaskId = null;
      if (createResponse.data) {
        responseTaskId = createResponse.data.taskId || 
                        createResponse.data.task?.id || 
                        createResponse.data.application?.taskId;
        
        console.log("Task ID extracted from response:", responseTaskId);
        
        // Try to parse taskId from applicationId if it follows a pattern like "taskId-applicationNumber"
        if (!responseTaskId && applicationId && applicationId.includes('-')) {
          const possibleTaskId = applicationId.split('-')[0];
          if (possibleTaskId) {
            console.log("Extracted possible taskId from applicationId pattern:", possibleTaskId);
            responseTaskId = possibleTaskId;
          }
        }
      }
      
      // Save the most reliable taskId we have
      const effectiveTaskId = taskId || responseTaskId;
      console.log("Using effective taskId for payment process:", effectiveTaskId);
      
      // Store the complete payment data
      setPaymentData(createResponse.data);
      
      const { 
        paymentId, 
        amount,
        displayAmount, 
        currency, 
        externalOrderId,
        amountBreakdown
      } = createResponse.data;

      // Store paymentId for later use in capturing payment
      const paymentIdForCapture = paymentId;
      
      // Get Razorpay key from environment variables
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        console.error("Razorpay key not found in environment variables");
        throw new Error("Payment configuration error: Missing API key");
      }
      
      console.log("Using Razorpay key:", razorpayKey);
      
      // Create a description using the amount breakdown if available
      let paymentDescription = `Payment for Task Application (₹${displayAmount})`;
      if (amountBreakdown && amountBreakdown.length > 0) {
        const mainAmount = amountBreakdown.find(item => 
          item.message.toLowerCase().includes('amount for task')
        );
        if (mainAmount) {
          paymentDescription = `Task Application Payment: ₹${mainAmount.amount}`;
        }
      }
      
      // After getting the order ID from the server, open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: amount, // The API now provides the amount in the correct format (paise)
        currency: currency,
        name: "SprintMate",
        description: paymentDescription,
        order_id: externalOrderId,
        handler: async function(response) {
          // This function runs after successful payment in Razorpay
          console.log("Razorpay payment successful:", response);
          
          try {
            // STEP 2: Capture the payment using the paymentId from step 1 and razorpay_payment_id
            const orderPaymentId = response.razorpay_payment_id;
            
            console.log("Capturing payment with:", {
              paymentId: paymentIdForCapture,
              orderPaymentId: orderPaymentId
            });
            
            const captureResponse = await axios.post(
              `${url}/v1/order/payments/capture`,
              {
                paymentId: paymentIdForCapture,
                orderPaymentId: orderPaymentId
              },
              { headers: { Authorization: `${token}` } }
            );
            
            console.log("Payment capture successful:", captureResponse.data);
            
            // Print entire capture response for debugging
            console.log("Complete capture response:", JSON.stringify(captureResponse.data, null, 2));
            
            if (captureResponse.data.status === 'HELD' || captureResponse.data.status === 'CREATED') {
              // STEP 3: Update the application status to ACCEPTED after successful payment capture
              // try {
              //   // Re-check for the most reliable taskId
              //   const statusUpdateTaskId = captureResponse.taskId;
                
              //   console.log("Using task ID for status update:", statusUpdateTaskId);
                
              //   if (!statusUpdateTaskId) {
              //     console.warn("Task ID not found, trying alternative API endpoint");
                  
              //     // Try a different API structure that doesn't require taskId
              //     try {
              //       console.log(`Attempting alternative endpoint for application ${applicationId}`);
              //       const alternativeResponse = await axios.patch(
              //         `${url}/v1/applications/${applicationId}/status`,
              //         { status: "ACCEPTED" },
              //         { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
              //       );
                    
              //       console.log("Alternative API call successful:", alternativeResponse.data);
              //     } catch (altError) {
              //       console.error("Alternative API call failed:", altError);
                    
              //       // If both approaches fail, try to extract task ID from URL if available
              //       const urlPathMatch = window.location.pathname.match(/\/tasks\/([^\/]+)/);
              //       if (urlPathMatch && urlPathMatch[1]) {
              //         const urlTaskId = urlPathMatch[1];
              //         console.log("Extracted taskId from URL:", urlTaskId);
                      
              //         try {
              //           const urlBasedResponse = await axios.patch(
              //             `${url}/v1/tasks/${urlTaskId}/applications/${applicationId}/status`,
              //             { status: "ACCEPTED" },
              //             { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
              //           );
                        
              //           console.log("URL-based task ID API call successful:", urlBasedResponse.data);
              //         } catch (urlError) {
              //           console.error("URL-based task ID API call failed:", urlError);
              //         }
              //       }
              //     }
              //   } else {
              //     // We have a task ID, use the standard API endpoint
              //     console.log(`Updating application status to ACCEPTED for task ${statusUpdateTaskId}, application ${applicationId}...`);
                  
              //     // Add timeout to ensure payment processing is complete
              //     await new Promise(resolve => setTimeout(resolve, 1000));
                  
              //     const statusUpdateResponse = await axios.patch(
              //       `${url}/v1/tasks/${statusUpdateTaskId}/applications/${applicationId}/status`,
              //       { status: "ACCEPTED" },
              //       { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
              //     );
                  
              //     console.log("Application status update successful:", statusUpdateResponse.data);
              //   }
              // } catch (statusUpdateError) {
              //   console.error("Error updating application status:", statusUpdateError);
              //   console.error("Error details:", statusUpdateError.response?.data || "No response data");
                
              //   // Try direct API call to accept the application
              //   try {
              //     console.log("Attempting direct accept API call");
              //     const directAcceptResponse = await axios.post(
              //       `${url}/v1/applications/${applicationId}/accept`,
              //       {},
              //       { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } }
              //     );
                  
              //     console.log("Direct accept API call successful:", directAcceptResponse.data);
              //   } catch (directError) {
              //     console.error("Direct accept API call failed:", directError);
              //   }
                
              //   console.log("Will continue with success flow despite status update error");
              // }
              
              // Call the success callback regardless of status update result
              onSuccess && onSuccess({
                ...captureResponse.data,
                applicationId,
                statusUpdated: true
              });
            } else {
              setError(`Payment verification failed. Status: ${captureResponse.data.status}`);
              onError && onError(new Error("Payment not held properly"));
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
            setError("Failed to verify payment. Please contact support.");
            onError && onError(error);
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            setIsLoading(false);
          }
        },
        prefill: {
          name: "Client"
        },
        notes: {
          applicationId: applicationId
        },
        theme: {
          color: "#3366FF"
        }
      };
      
      // Check if Razorpay is loaded
      if (typeof window.Razorpay !== 'function') {
        throw new Error("Razorpay SDK not loaded. Please try again.");
      }
      
      console.log("Opening Razorpay with order ID:", externalOrderId);
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function(response) {
        console.error("Razorpay payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
        onError && onError(response.error);
      });
      
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Payment process error:", error);
      setError(error.response?.data?.message || error.message || "Payment process failed");
      setIsLoading(false);
      onError && onError(error);
    }
  };
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleContinuePayment = () => {
    handleCloseDialog();
    handlePayment();
  };
  
  return (
    <div>
      {paymentData && paymentData.amountBreakdown && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md text-sm">
          <h4 className="font-medium text-blue-700 mb-1">Payment Breakdown:</h4>
          <ul className="space-y-1">
            {paymentData.amountBreakdown.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-gray-700">{item.message}</span>
                <span className="font-medium text-gray-900">₹{item.amount}</span>
              </li>
            ))}
            <li className="flex justify-between pt-1 border-t border-blue-200 mt-1">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-medium text-blue-800">₹{paymentData.displayAmount}</span>
            </li>
          </ul>
        </div>
      )}

      <Button
        onClick={handleOpenDialog}
        disabled={isLoading}
        className={`flex items-center gap-2 ${buttonClassName} ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <DollarSign className="h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Breakdown</DialogTitle>
          </DialogHeader>
          <div className="mb-3 p-3 bg-blue-50 rounded-md text-sm">
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span className="text-gray-700">Platform fee (txnFee + platformFee)</span>
                <span className="font-medium text-gray-900">₹2000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-700">Amount for task application</span>
                <span className="font-medium text-gray-900">₹40000</span>
              </li>
              <li className="flex justify-between pt-1 border-t border-blue-200 mt-1">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-medium text-blue-800">₹42000</span>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={handleContinuePayment} className="bg-green-600 hover:bg-green-700 text-white">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="flex items-center text-red-600 text-sm mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;
