import axios from "axios";
import axiosClient from "./AxiosClient";
import type { IReview } from "./Interface";

const reviewService = {
    getByProductId(productId: number) {
        return axiosClient.get<IReview[]>(
            `/reviews/product/${productId}`
        );
    },

    createReview(formData: FormData) {
        return axiosClient.post<IReview>(
            "/reviews",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    },
};

export default reviewService;
