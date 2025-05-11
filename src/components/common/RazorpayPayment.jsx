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
import { createOrderPayment } from '../../api/paymentService';
import CurrencyFormatter from "../ui/CurrencyFormatter";

import * as Tooltip from "@radix-ui/react-tooltip"


const RazorpayPayment = ({
  applicationId,
  onSuccess,
  onError,
  buttonText = "Accept & Fund",
  buttonClassName = "",
  taskId = null // This prop should now be passed from parent component
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentHoldResponse, setPaymentHoldResponse] = useState(null);
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

      console.log("Payment hold response from hook :", paymentHoldResponse);

      // Store the passed taskId if available
      console.log("Starting payment process with taskId:", taskId);

      // STEP 1: Create payment hold/create API
      console.log("Creating payment hold...");
      const payloadData = { taskApplicationId: applicationId };

      // Add taskId to request payload if available
      if (taskId) {
        payloadData.taskId = taskId;
      }

      const createResponse = paymentHoldResponse;

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
        handler: async function (response) {
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
          ondismiss: function () {
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
      razorpayInstance.on('payment.failed', function (response) {
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


  const handleOpenDialog = async () => {
    console.log("handle dialog open");
    setIsLoading(true); // show loading UI in dialog  
    try {
      const payloadData = { taskApplicationId: applicationId };
      const res = await createOrderPayment(payloadData)
      setPaymentHoldResponse(res);
      console.log("payment hold response after open dialoguee", res);
      setIsDialogOpen(true); // open the dialog immediately (optional: delay until data fetched)
    } catch (error) {
      console.error("Error creating hold payment", error);
      // Optionally close dialog or show error UI
    } finally {
      setIsLoading(false);
    }
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

      {/* <Button
        onClick={handleOpenDialog}
        disabled={isLoading}
        className={`flex items-center gap-2 ${buttonClassName} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
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
      </Button> */}

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              onClick={handleOpenDialog}
              disabled={isLoading}
              className={`flex items-center gap-2 ${buttonClassName} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
          </Tooltip.Trigger>

          <Tooltip.Content
            side="top"
            align="center"
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-white"
          >
            {isLoading
              ? "Fetching breakdown…"
              : "Accept the application and block funds"
            }
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Breakdown</DialogTitle>
          </DialogHeader>

          <div className="mb-3 p-3 bg-blue-50 rounded-md text-sm">
            {isLoading ? (
              <p className="text-gray-500">Fetching payment details...</p>
            ) : (
              <ul className="space-y-1">
                {paymentHoldResponse?.data?.amountBreakdown.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">{item.message}</span>
                    <span className="font-medium text-gray-900">
                      <CurrencyFormatter currency={paymentHoldResponse?.data?.currency}>
                        {item.amount}
                      </CurrencyFormatter>
                    </span>
                  </li>
                ))}
                <li className="flex justify-between pt-1 border-t border-blue-200 mt-1">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-medium text-blue-800">

                    <CurrencyFormatter currency={paymentHoldResponse?.data?.currency}>
                      {paymentHoldResponse?.data?.displayAmount}

                    </CurrencyFormatter>
                  </span>
                </li>
              </ul>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => handleContinuePayment()}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!paymentHoldResponse}
            >
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
