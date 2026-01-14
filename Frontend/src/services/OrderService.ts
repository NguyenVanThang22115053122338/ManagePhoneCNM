import axiosClient from "./AxiosClient";
import type {
    OrderRequest,
    OrderResponse,
    OrderFullResponse,
    ApiResponse,
} from "../services/Interface";

const orderService = {
    create(data: OrderRequest) {
        return axiosClient
            .post<OrderResponse>("/api/order", data)
            .then(res => res.data);
    },

    getById(orderId: number) {
        return axiosClient
            .get<ApiResponse<OrderResponse>>(`/api/order/${orderId}`)
            .then(res => res.data.data);
    },

    getByUser(userId: number) {
        return axiosClient
            .get<ApiResponse<OrderFullResponse[]>>(`/api/order/user/${userId}`)
            .then(res => res.data.data);
    },

    getAll() {
        return axiosClient
            .get<OrderResponse[]>("/api/order")
            .then(res => res.data);
    },

    update(orderId: number, data: Partial<OrderRequest>) {
        return axiosClient
            .put<OrderResponse>(`/api/order/${orderId}`, data)
            .then(res => res.data);
    },

    delete(orderId: number) {
        return axiosClient
            .delete<string>(`/api/order/${orderId}`)
            .then(res => res.data);
    },

    checkUserPurchased(userId: number, productId: number) {
        return axiosClient.get<{
            hasPurchased: boolean;
            orderId?: number;
        }>(`api/orders/check/${userId}/${productId}`);
    }
};

export default orderService;
