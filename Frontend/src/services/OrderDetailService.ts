import axiosClient from "./AxiosClient";
import type {
    CreateOrderDetailRequest,
    OrderDetailResponse
} from "../services/Interface";

const orderDetailService = {
    // tạo order detail
    create(data: CreateOrderDetailRequest) {
        return axiosClient.post<OrderDetailResponse>(
            "/api/order-details",
            data
        );
    },

    getByOrderId(orderId: number) {
        return axiosClient
            .get<OrderDetailResponse[]>(`/api/order-details/order/${orderId}`)
            .then(res => res.data);
    }

};

export default orderDetailService;
