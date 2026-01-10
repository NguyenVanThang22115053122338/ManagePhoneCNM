import axios from "axios";
import type { IBatch, LaravelPaginationResponse } from "./Interface";
import axiosClient from "./AxiosClient";

const BatchService = {

    async getBatches(page: number = 1, search: string = ""): Promise<LaravelPaginationResponse<IBatch>> {
        try {
            const params: any = { page };
            if (search.trim()) {
                params.search = search;
            }

            const response = await axiosClient.get("/api/batch", { params });

            if (response.data) {
                return response.data;
            }

            console.error("Batch API không trả đúng format:", response.data);
            return {
                data: [],
                links: {
                    first: "",
                    last: "",
                    prev: null,
                    next: null
                },
                meta: {
                    current_page: 1,
                    from: 0,
                    last_page: 1,
                    links: [],
                    path: "",
                    per_page: 5,
                    to: 0,
                    total: 0
                }
            };
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
