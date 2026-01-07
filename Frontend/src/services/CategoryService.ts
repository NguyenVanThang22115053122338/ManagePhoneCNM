import axios from "axios";
import type { CreateCategoryRequest, ICategory } from "./Interface";
import axiosClient from "./AxiosClient";
import create from "@ant-design/icons/lib/components/IconFont";

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
        const res = await axiosClient.get<ICategory>(`/api/categories/${id}`);
        return res.data;
    },

    async updateCategory(
        id: number,
        category: CreateCategoryRequest
    ): Promise<ICategory> {
        const res = await axiosClient.put<ICategory>(
            `/api/categories/${id}`,
            category
        );
        return res.data;
    },

    async deleteCategory(id: number): Promise<void> {
        await axiosClient.delete(`/api/categories/${id}`);
    }
};

export default CategoryService;
