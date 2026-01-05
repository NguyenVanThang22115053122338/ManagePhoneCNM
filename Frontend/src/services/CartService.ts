import axiosClient from "./AxiosClient";
import type { CartDTO } from "../services/Interface";

const cartService = {
    getCartByUser(userId: number): Promise<CartDTO> {
        return axiosClient.get<CartDTO>(`/api/carts/${userId}`)
            .then(res => res.data);
    }
};

export default cartService;
