import axiosClient from "./AxiosClient";
import type { CartDTO, ResourceResponse} from "../services/Interface";

const cartService = {
    getCartByUser(userId: number): Promise<ResourceResponse<CartDTO>> {
  return axiosClient
    .get(`/api/carts/${userId}`)
    .then(res => res.data);
}

};

export default cartService;
