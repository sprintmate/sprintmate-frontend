import { Label } from 'recharts';
import { AnalyticEvents } from '../constants/AnalyticsEvents';
import { trackEvent } from '../utils/analytics';
import httpInstance from './axiosInstance';


export const refundPayment = async (paymentId) => {
    try {
        const response = await httpInstance.post(
            `/v1/order/payments/refund`,
            { paymentId }
        );
        trackEvent(AnalyticEvents.PAYMENT_UPDATE,{label:'refundPayment',paymentId:paymentId})

        return response.data;
    } catch (error) {
        console.error('Error refund payment:', error);
        throw error;
    }
}

export const cancelPayment = async (paymentId) => {
    try {
        const response = await httpInstance.post(
            `/v1/order/payments/cancel/${paymentId}`,
            {}
        );
        trackEvent(AnalyticEvents.PAYMENT_UPDATE,{label:'cancelPayment',paymentId:paymentId})
        return response.data;
    } catch (error) {
        console.error('Error refund payment:', error);
        throw error;
    }
}

export const fetchPayments = async ({ page = 0, size = 10, statuses = 'HELD, RELEASED, REFUNDED, CANCELLED, PROCESSING,FAILED, PAID,WITHDRAWN' }) => {
    try {
        const url = `/v1/order/payments?page=${page}&size=${size}&statuses=${statuses}`;
        const response = await httpInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetchPayments payment:', error);
        throw error;
    }
}

export const fetchBankDetails = async () => {
    try {
        const response = await httpInstance.get(
            `/v1/payment-instrumentations`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetchBankDetails payment:', error);
        throw error;
    }
}


export const createBankDetails = async (bankData) => {
    try {
        const response = await httpInstance.post(
            `/v1/payment-instrumentations`,
            bankData
        );
        trackEvent(AnalyticEvents.BANK_DETAIL_UPDATED,{label:'createBankDetails'})
        return response.data;
    } catch (error) {
        console.error('Error fetchBankDetails payment:', error);
        throw error;
    }
}



export const withDrawFunds = async (paymentId) => {
    try {
        const response = await httpInstance.post(
            `/v1/order/payments/withdraw`,
            { paymentId }
        );
        trackEvent(AnalyticEvents.PAYMENT_UPDATE,{label:'withdraw funds',paymentId:paymentId})
        return response.data;
    } catch (error) {
        console.error('Error withDrawFunds payment:', error);
        throw error;
    }
}

export const createOrderPayment = async (paymentData) => {

    try {
        const url = `/v1/order/payments/hold`;
        const response = await httpInstance.post(
            url,
            paymentData 
        );
        trackEvent(AnalyticEvents.PAYMENT_INITIATED,paymentData)
        return response;
    } catch (error) {
        console.error('Error createOrderPayment payment:', error);
        throw error;
    }
}