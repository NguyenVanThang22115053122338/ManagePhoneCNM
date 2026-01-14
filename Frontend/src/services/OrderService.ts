import axiosClient from "./AxiosClient";
import type {
  OrderRequest,
  OrderResponse,
  OrderFullResponse,
  ApiResponse,
  OrderSummaryResponse,
} from "../services/Interface";

const orderService = {
  /* ================= CREATE ================= */
  create(data: OrderRequest) {
    return axiosClient
      .post<OrderSummaryResponse>("/api/order", data)
      .then(res => res.data);
  },

  /* ================= GET ================= */
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
      .get<ApiResponse<OrderResponse[]>>("/api/order")
      .then(res => res.data.data);
  },

  /* ================= UPDATE ================= */
  update(orderId: number, data: Partial<OrderRequest>) {
    return axiosClient
      .put<OrderResponse>(`/api/order/${orderId}`, data)
      .then(res => res.data);
  },

  updateStatus(orderId: number, status: string) {
    return axiosClient
      .put(`/api/order/${orderId}`, { status })
      .then(res => res.data);
  },

  /* ================= DELETE ================= */
  delete(orderId: number) {
    return axiosClient
      .delete<string>(`/api/order/${orderId}`)
      .then(res => res.data);
  },

  /* ================= CHECK PURCHASE ================= */
  checkUserPurchased(userId: number, productId: number) {
    return axiosClient.get<{
      hasPurchased: boolean;
      orderId?: number;
    }>(`/api/order/check/${userId}/${productId}`);
  },

  /* ================= APPLY DISCOUNT 🔥 ================= */
  applyDiscount(
    orderId: number,
    code: string | null
  ): Promise<{
    subTotal: number;
    discountAmount: number;
    totalAmount: number;
  }> {
    return axiosClient
      .post(`/api/orders/${orderId}/apply-discount`, { code })
      .then(res => res.data);
  },
};

export default orderService;
