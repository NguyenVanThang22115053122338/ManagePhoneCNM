import axios from "axios";
import type { IStockOut } from "./Interface";
import axiosClient from "./AxiosClient";

const StockOutService = {

    async getStockOuts(): Promise<IStockOut[]> {
        try {
            const response = await axiosClient.get("/api/stockout");

            if (response.data?.data && Array.isArray(response.data.data)) {
                return response.data.data as IStockOut[];
            }

            console.error("Stockout API không trả đúng format:", response.data);
            return [];
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Không thể lấy danh sách xuất hàng";
                throw new Error(message);
            }
            throw new Error("Không thể lấy danh sách xuất hàng");
        }
    },
};

export default StockOutService;
