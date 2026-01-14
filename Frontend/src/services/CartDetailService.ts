import axiosClient from "./AxiosClient";
import type { CartDetailResponse, AddToCartRequest } from "../services/Interface";

const cartDetailService = {
    getByCartId(cartId: number) {
        return axiosClient
            .get(`/api/cart-details/cart/${cartId}`)
            .then(res => res.data.data); // 🔥 LẤY data
    },

    addToCart(data: AddToCartRequest): Promise<CartDetailResponse> {
        return axiosClient
            .post<CartDetailResponse>("/api/cart-details", {
                cartId: data.cartId,
                ProductID: data.ProductID,
            })
            .then(res => res.data);
    },


    delete(cartDetailsId: number): Promise<void> {
        return axiosClient.delete(`/api/cart-details/${cartDetailsId}`);
    },

    deleteByCartId(cartId: number): Promise<void> {
        return axiosClient.delete(`/api/cart-details/cart/${cartId}`);
    },
};

export default cartDetailService;
