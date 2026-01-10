import axios from "axios";
import type { IStockIn, IStockInRequest, LaravelPaginationResponse } from "./Interface";
import axiosClient from "./AxiosClient";

const StockInService = {

    async getStockIns(page: number, search: string): Promise<LaravelPaginationResponse<IStockIn>> {
        try {
            const response = await axiosClient.get("/api/stockin", { params: { page, search } });

            if (response.data?.data && Array.isArray(response.data.data)) {
                return response.data as LaravelPaginationResponse<IStockIn>;
            }

            console.error("StockIn API không trả đúng format:", response.data);
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
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách nhập hàng";
                throw new Error(message);
            }
            throw new Error("Không thể lấy danh sách nhập hàng");
        }
    },

    async createStockIn(payload: IStockInRequest): Promise<IStockInRequest> {
        try {
            const response = await axiosClient.post("/api/stockin", payload);
            return response.data.data as IStockInRequest;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể tạo phiếu nhập hàng";
                throw new Error(message);
            }
            throw new Error("Không thể tạo phiếu nhập hàng");
        }
    },
};

export default StockInService;
