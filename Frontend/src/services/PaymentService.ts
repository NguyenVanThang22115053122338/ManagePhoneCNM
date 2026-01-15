import axiosClient from "./AxiosClient";
import type {
    PayPalPaymentRequest,
    PayPalCreateResponse
} from "./Interface";

const paymentService = {
    createPayPalPayment(orderId: number): Promise<PayPalCreateResponse> {
        return axiosClient
            .post<PayPalCreateResponse>('api/paypal/create', {
                orderId
            })
            .then(res => res.data);
    },


    getPaymentByOrderId(orderId: number) {
        return axiosClient
            .get(`api/paypal/payment/${orderId}`)
            .then(res => res.data);
    },

    getFullPayment(orderId: number) {
        return axiosClient
            .get(`api/paypal/payment/full/${orderId}`)
            .then(res => res.data);
    }
};

export default paymentService;
