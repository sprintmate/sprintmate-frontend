import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getToken } from '../../services/authService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatComponent from './ChatComponent';

const ApplicationDetail = ({ application, ...props }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  const url = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();

  // Updated function to check if chat should be available
  const isChatEnabled = () => {
    // List of statuses that should have chat enabled
    const chatEnabledStatuses = [
      'SHORTLISTED',
      'ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'SUBMITTED'
    ];
    
    // Get application status and convert to uppercase for comparison
    const status = application?.status?.toUpperCase();
    return chatEnabledStatuses.includes(status);
  };

  // Function to handle complete payment flow
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // STEP 1: Create payment hold/create API
      console.log("Creating payment hold...");
      const createResponse = await axios.post(
        `${url}/v1/order/payments/hold`,
        { taskApplicationId: application.id },
        { headers: { Authorization: `${token}` } }
      );
      
      console.log("Payment hold created:", createResponse.data);
      
      if (!createResponse.data || !createResponse.data.paymentId || !createResponse.data.externalOrderId) {
        throw new Error("Payment creation failed. Missing payment details in response.");
      }
      
      // Store the complete payment data
      setPaymentData(createResponse.data);
      
      const { 
        paymentId, 
        amount,
        displayAmount, 
        currency, 
        externalOrderId,
        amountBreakdown
        // Don't extract taskId here as it might not be in the initial response
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
              try {
                // Extract taskId and applicationId from capture response
                const responseTaskId = captureResponse.data.taskId;
                // Use the applicationId from the response, falling back to the prop if needed
                const responseApplicationId = captureResponse.data.applicationId || application.id;
                
                console.log("Extracted from capture response - taskId:", responseTaskId, "applicationId:", responseApplicationId);
                
                if (!responseTaskId || !responseApplicationId) {
                  console.error("Missing taskId or applicationId in capture response:", captureResponse.data);
                  throw new Error("Cannot update application status: Missing taskId or applicationId");
                }
                
                // Make the status update API call with the extracted IDs
                console.log(`Updating application status to ACCEPTED for task ${responseTaskId}, application ${responseApplicationId}...`);
                
                const statusUpdateResponse = await axios.patch(
                  `${url}/v1/tasks/${responseTaskId}/applications/${responseApplicationId}/status`,
                  { status: "ACCEPTED" },
                  { 
                    headers: { 
                      Authorization: `${token}`,
                      'Content-Type': 'application/json'
                    } 
                  }
                );
                
                console.log("Application status update successful:", statusUpdateResponse.data);
              } catch (statusUpdateError) {
                console.error("Error updating application status:", statusUpdateError);
                console.error("Error details:", statusUpdateError.response?.data || "No response data");
                console.log("Will continue with success flow despite status update error");
              }
              
              // Call the success callback regardless of status update result
              props.onSuccess && props.onSuccess({
                ...captureResponse.data,
                applicationId: application.id,
                statusUpdated: true
              });
            } else {
              setError(`Payment verification failed. Status: ${captureResponse.data.status}`);
              props.onError && props.onError(new Error("Payment not held properly"));
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
            setError("Failed to verify payment. Please contact support.");
            props.onError && props.onError(error);
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
          applicationId: application.id
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
        props.onError && props.onError(response.error);
      });
      
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Payment process error:", error);
      setError(error.response?.data?.message || error.message || "Payment process failed");
      setIsLoading(false);
      props.onError && props.onError(error);
    }
  };

  return (
    <div className="application-detail-container">
      <h2 className="text-2xl font-bold mb-4">Application Detail</h2>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Application Info</h3>
        <p><strong>ID:</strong> {application.id}</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p><strong>Position:</strong> {application.position}</p>
        <p><strong>Applicant:</strong> {application.applicantName}</p>
        <p><strong>Applied On:</strong> {new Date(application.appliedOn).toLocaleDateString()}</p>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Payment</h3>
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
          onClick={handlePayment}
          disabled={isLoading}
          className={`flex items-center gap-2 ${props.buttonClassName} ${
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
              {props.buttonText || "Accept & Pay"}
            </>
          )}
        </Button>
        
        {error && (
          <div className="flex items-center text-red-600 text-sm mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Communication</h3>
        
        {isChatEnabled() ? (
          <div className="chat-section">
            {/* Chat component or UI */}
            <ChatComponent applicationId={application.id} />
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-600">
              Chat is only available for applications that are shortlisted, accepted, 
              in progress, completed, or submitted.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;