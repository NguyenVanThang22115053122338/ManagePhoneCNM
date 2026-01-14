import axios from "axios";
import type { CreateCategoryRequest, ICategory,Brand } from "./Interface";
import axiosClient from "./AxiosClient";

const CategoryService = {
    async getCategories(): Promise<ICategory[]> {
        try {
            const response = await axiosClient.get("/api/categories");

            // Laravel Resource Collection => { data: [...] }
            if (Array.isArray(response.data?.data)) {
                return response.data.data as ICategory[];
            }

            console.error("Category API không trả array:", response.data);
            return [];
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy thông tin Category";
                throw new Error(message);
            }
            throw new Error("Không thể lấy thông tin Category");
        }
    },
    async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
        try {
            const res = await axiosClient.get(`/api/categories/${categoryId}/brands`);
            
            if (Array.isArray(res.data)) {
                return res.data as Brand[];
            }
            
            if (Array.isArray(res.data?.data)) {
                return res.data.data as Brand[];
            }
            
            console.error("Brands API không trả array:", res.data);
            return [];
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy brands";
                throw new Error(message);
            }
            throw new Error("Không thể lấy brands");
        }
    },

    async createCategory(
        category: CreateCategoryRequest
    ): Promise<ICategory> {
        const res = await axiosClient.post<ICategory>(
            "/api/categories",
            category
        );
        return res.data;
    },

    async getCategoryById(id: number): Promise<ICategory> {
        try {
            const res = await axiosClient.get(`/api/categories/${id}`);

            // Laravel Resource có thể trả về { data: {...} }
            if (res.data?.data) {
                return res.data.data as ICategory;
            }

            return res.data as ICategory;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy thông tin danh mục";
                throw new Error(message);
            }
            throw new Error("Không thể lấy thông tin danh mục");
        }
    },

    async updateCategory(
        id: number,
        category: CreateCategoryRequest
    ): Promise<ICategory> {
        try {
            const res = await axiosClient.put(
                `/api/categories/${id}`,
                category
            );

            // Laravel Resource có thể trả về { data: {...} }
            if (res.data?.data) {
                return res.data.data as ICategory;
            }

            return res.data as ICategory;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể cập nhật danh mục";
                throw new Error(message);
            }
            throw new Error("Không thể cập nhật danh mục");
        }
    },

    async deleteCategory(id: number): Promise<void> {
        try {
            await axiosClient.delete(`/api/categories/${id}`);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể xóa danh mục";
                throw new Error(message);
            }
            throw new Error("Không thể xóa danh mục");
        }
    }
};

export default CategoryService;
