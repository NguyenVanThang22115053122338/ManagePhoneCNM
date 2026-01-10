import axios from "axios";
import type { IStockIn, IStockInRequest } from "./Interface";
import axiosClient from "./AxiosClient";

const StockInService = {

    async getStockIns(): Promise<IStockIn[]> {
        try {
            const response = await axiosClient.get("/api/stockin");

            if (response.data?.data && Array.isArray(response.data.data)) {
                return response.data.data as IStockIn[];
            }

            console.error("StockIn API không trả đúng format:", response.data);
            return [];
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
