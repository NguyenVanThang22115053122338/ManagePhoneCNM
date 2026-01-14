import axiosClient from "./AxiosClient";

export type OrderStatus = "PENDING" | "APPROVED" | "CANCELLED";

const OrderUserService = {
  cancelOrder(orderId: number) {
    return axiosClient.put(`/api/order/${orderId}`, {
      status: "CANCELLED",
    });
  },
};

export default OrderUserService;
