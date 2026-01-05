import axiosClient from "./AxiosClient";
import type { Brand, BrandCreateRequest } from "./Interface";

const API_URL = "/api/brands";

export const brandService = {
  /* ================= GET ================= */
  getAll: async (): Promise<Brand[]> => {
    const res = await axiosClient.get(API_URL);
    return res.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const res = await axiosClient.get(`${API_URL}/${id}`);
    return res.data;
  },

  searchByName: async (name: string): Promise<Brand[]> => {
    const res = await axiosClient.get(`${API_URL}/search`, {
      params: { name },
    });
    return res.data;
  },

  getByCountry: async (country: string): Promise<Brand[]> => {
    const res = await axiosClient.get(`${API_URL}/country/${country}`);
    return res.data;
  },

  /* ================= CREATE ================= */
  create: async (data: BrandCreateRequest): Promise<Brand> => {
    const res = await axiosClient.post(API_URL, data);
    return res.data;
  },

  /* ================= UPDATE ================= */
  update: async (id: number, data: BrandCreateRequest): Promise<Brand> => {
    const res = await axiosClient.put(`${API_URL}/${id}`, data);
    return res.data;
  },

  /* ================= DELETE ================= */
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`${API_URL}/${id}`);
  },
};
