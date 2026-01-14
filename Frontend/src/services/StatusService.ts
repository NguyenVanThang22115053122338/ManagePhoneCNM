import axiosClient from "./AxiosClient";
import type { IUser, OrderResponse } from "./Interface";

/* ================= ORDER STATUS ================= */
export type OrderStatus = "PENDING" | "APPROVED" | "CANCELLED";

const OrderService = {
  /* ================= GET ================= */

  getAll(): Promise<OrderResponse[]> {
    return axiosClient
      .get("/api/order")
      .then(res => res.data.data);
  },

  getById(id: number): Promise<OrderResponse> {
    return axiosClient
      .get(`/api/order/${id}`)
      .then(res => res.data.data);
  },

  /* ================= UPDATE STATUS ================= */

  updateStatus(id: number, status: OrderStatus) {
    return axiosClient.put(`/api/order/${id}`, { status });
  },

  /* ================= USER ================= */

  getUserById(id: number): Promise<IUser> {
    return axiosClient
      .get(`/api/users/${id}`)
      .then(res => res.data.data);
  },
};

export default OrderService;
