import axiosClient from "./AxiosClient";
import type { IUser } from "./Interface";
import type { OrderResponse } from "./Interface";

const OrderService = {
  getAll: (): Promise<OrderResponse[]> =>
    axiosClient.get("/api/order"),

  getById: (id: number): Promise<OrderResponse> =>
    axiosClient.get(`/api/order/${id}`),

  updateStatus: (id: number, status: "APPROVED" | "REJECTED") =>
    axiosClient.put(`/api/order/${id}`, { status }),

  getUserById: (id: number): Promise<IUser> =>
    axiosClient.get(`/api/users/${id}`),
};

export default OrderService;