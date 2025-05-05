import httpInstance from './axiosInstance';


export const refundPayment = async (paymentId) => {
    try {
        const response = await httpInstance.post(
            `/v1/order/payments/refund`,
            { paymentId }
        );
        return response.data;
    } catch (error) {
        console.error('Error refund payment:', error);
        throw error;
    }
}