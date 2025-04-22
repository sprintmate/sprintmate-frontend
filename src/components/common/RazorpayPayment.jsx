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

const RazorpayPayment = ({ 
  applicationId, 
  onSuccess, 
  onError, 
  buttonText = "Accept & Pay", 
  buttonClassName = "" 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = getToken();
  
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
        // document.body.removeChild(script);
      }
    };
  }, []);

  // Function to handle complete payment flow
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // STEP 1: Create payment hold
      console.log("Creating payment hold...");
      const createResponse = await axios.post(
        `${url}/v1/order/payments/hold`,
        { taskApplicationId: applicationId },
        { headers: { Authorization: `${token}` } }
      );
      
      console.log("Payment hold created:", createResponse.data);
      
      if (!createResponse.data || !createResponse.data.paymentId || !createResponse.data.externalOrderId) {
        throw new Error("Payment creation failed. Missing payment details in response.");
      }
      
      const { paymentId, amount, currency, externalOrderId } = createResponse.data;
      
      // Store paymentId for later use in capturing payment
      const paymentIdForCapture = paymentId; // Keep track of this for the capture step
      
      // The key should come from the backend response or a specific endpoint
      const razorpayKey = 'rzp_test_iNCZQhL5xjIvb0'; // Hard-coded for testing
      
      // After getting the order ID from the server, open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: currency,
        name: "Anonymous Freelancer",
        description: "Payment for Hiring Developer",
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
            
            if (captureResponse.data.status === 'HELD') {
              onSuccess && onSuccess({
                ...captureResponse.data,
                applicationId
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
  
  return (
    <div>
      <Button
        onClick={handlePayment}
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
