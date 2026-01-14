import axiosClient from "./AxiosClient";
import type { Discount } from "./Interface";

const DiscountService = {
  /* ================= GET ================= */

  getAll: async (): Promise<Discount[]> => {
    const res = await axiosClient.get("/api/discounts");
    return res.data.data;
  },

  getById: async (id: number): Promise<Discount> => {
    const res = await axiosClient.get(`/api/discounts/${id}`);
    return res.data.data;
  },

  /* ================= CREATE ================= */

  create: async (data: Discount): Promise<Discount> => {
    const res = await axiosClient.post("/api/discounts", data);
    return res.data.data;
  },

  /* ================= UPDATE ================= */

  update: async (id: number, data: Partial<Discount>): Promise<Discount> => {
    const res = await axiosClient.put(`/api/discounts/${id}`, data);
    return res.data.data;
  },

  /* ================= DELETE ================= */

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/discounts/${id}`);
  },
};

export default DiscountService;
