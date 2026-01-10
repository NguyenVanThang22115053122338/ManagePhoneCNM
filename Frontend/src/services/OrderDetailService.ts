import axiosClient from "./AxiosClient";
import type {
    ApiResponse,
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
            .get<ApiResponse<OrderDetailResponse[]>>(
                `/api/order-details/order/${orderId}`
            )
            .then(res => res.data.data);
    }


};

export default orderDetailService;
