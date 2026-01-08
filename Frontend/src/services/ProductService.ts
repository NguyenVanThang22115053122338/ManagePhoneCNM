import axiosClient from './AxiosClient';
import type { IProduct, ProductImage } from './Interface';
import { normalizeProduct } from "../adapter/normalizeProduct";

const productService = {
  getAllProducts: async (
    keyword?: string,
    categoryId?: string
  ): Promise<IProduct[]> => {
    try {
      const params = new URLSearchParams();

      if (keyword) params.set("keyword", keyword);
      if (categoryId) params.set("categoryId", categoryId);

      const response = await axiosClient.get(
        `/api/products?${params.toString()}`
      );

      // Laravel Resource Collection => { data: [...] }
      const raw = response.data?.data;

      if (!Array.isArray(raw)) {
        console.warn("Product API không trả array:", response.data);
        return [];
      }

      return raw.map(normalizeProduct);
    } catch (error) {
      console.error("getAllProducts failed", error);
      return [];
    }
  },



  async getProductById(id: number): Promise<IProduct> {
    const res = await axiosClient.get(`/api/products/${id}`);

    return normalizeProduct(res.data.data);
  },


  async createProduct(product: IProduct): Promise<IProduct> {
    const res = await axiosClient.post("/api/products", product);
    return normalizeProduct(res.data);
  },

  async updateProduct(id: number, product: IProduct): Promise<IProduct> {
    const res = await axiosClient.put(`/api/products/${id}`, product);
    return normalizeProduct(res.data);
  },

  async deleteProduct(id: number): Promise<void> {
    await axiosClient.delete(`/api/products/${id}`);
  },

  async uploadSingleImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("files", file);

    const res = await axiosClient.post(
      "/api/images/img-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  async uploadProductImages(
    productId: number,
    files: File[]
  ): Promise<ProductImage[]> {
    const formData = new FormData();

    files.forEach(file => {
      formData.append("files", file);
    });

    const res = await axiosClient.post(
      `/api/images/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  async addToCart(productId: number) {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      throw new Error("Chưa đăng nhập");
    }

    const cartRes = await axiosClient.post(
      "/api/carts",
      {
        userId: Number(userId),
        status: "ACTIVE",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cartId = cartRes.data.id;

    await axiosClient.post(
      "/api/cart-details",
      {
        cartId,
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  },
};

export default productService;