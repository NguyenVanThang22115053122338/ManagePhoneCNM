import axiosClient from './AxiosClient';
import type { ISupplier } from './Interface';

const supplierService = {

  getAllSuppliers: async (): Promise<ISupplier[]> => {
    try {
      const res = await axiosClient.get('/api/suppliers');

      if (!Array.isArray(res.data)) {
        console.warn('API không trả array, fallback []');
        return [];
      }

      return res.data;
    } catch (error) {
      console.error('getAllSuppliers failed', error);
      return [];
    }
  },

  async getSupplierById(id: number): Promise<ISupplier> {
    const res = await axiosClient.get<ISupplier>(`/api/suppliers/${id}`);
    return res.data;
  },

  async createSupplier(supplierName: string): Promise<ISupplier> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const res = await axiosClient.post(
      '/api/suppliers',
      { supplierName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  async updateSupplier(
    id: number,
    supplierName: string
  ): Promise<ISupplier> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const res = await axiosClient.put(
      `/api/suppliers/${id}`,
      { supplierName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

  async deleteSupplier(id: number): Promise<boolean> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    await axiosClient.delete(`/api/suppliers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  },
};

export default supplierService;
