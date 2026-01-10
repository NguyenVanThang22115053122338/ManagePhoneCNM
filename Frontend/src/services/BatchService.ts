import axios from "axios";
import type { IBatch } from "./Interface";
import axiosClient from "./AxiosClient";

const BatchService = {

    async getBatches(): Promise<IBatch[]> {
        try {
            const response = await axiosClient.get("/api/batch");

            if (response.data?.data && Array.isArray(response.data.data)) {
                return response.data.data as IBatch[];
            }

            console.error("Batch API không trả đúng format:", response.data);
            return [];
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách lô hàng";
                throw new Error(message);
            }
            throw new Error("Không thể lấy danh sách lô hàng");
        }
    },

};

export default BatchService;
