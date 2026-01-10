import axiosClient from './AxiosClient';
import type { ISupplier } from './Interface';

const supplierService = {

  getAllSuppliers: async (): Promise<ISupplier[]> => {
    try {
      const res = await axiosClient.get('/api/suppliers');

      // Laravel Resource / Collection
      const raw = res.data?.data ?? res.data;

      if (!Array.isArray(raw)) {
        console.warn('Supplier API không trả array:', res.data);
        return [];
      }

      return raw;
    } catch (error) {
      console.error('getAllSuppliers failed', error);
      return [];
    }
  },

  async getSupplierById(id: number): Promise<ISupplier> {
    const res = await axiosClient.get(`/api/suppliers/${id}`);

    const raw = res.data?.data ?? res.data;

    return {
      supplierId: raw.supplierId ?? raw.id,
      supplierName: raw.supplierName ?? raw.name ?? "",
    };
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
