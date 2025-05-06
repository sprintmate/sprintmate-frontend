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

export const fetchPayments = async ({ page = 0, size = 10, statuses = 'HELD, RELEASED, REFUNDED, CANCELLED, PROCESSING,FAILED, PAID' }) => {
    try {
        const url = `/v1/order/payments?page=${page}&size=${size}&statuses=${statuses}`;
        const response = await httpInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetchPayments payment:', error);
        throw error;
    }
}
