import axiosClient from "./AxiosClient";
import type { SalesAndQuantityResponse } from "./Interface";
import type { OrderStatusStatistic } from "./Interface";
import type { InventoryStatisticResponse } from "./Interface";

export const StatisticService = {
  async getSalesAndQuantity(params: {
    year: number;
    month?: number;
    day?: number;
  }): Promise<SalesAndQuantityResponse> {
    const res = await axiosClient.get<SalesAndQuantityResponse>(
      "/api/order/doanh-thu",
      {
        params: {
          year: params.year,
          month: params.month,
          day: params.day
        }
      }
    );

    return res.data;
  },

  async getOrderStatusByTime(params: {
    year?: number;
    month?: number;
    day?: number;
  }): Promise<OrderStatusStatistic> {
    const res = await axiosClient.get<OrderStatusStatistic>(
      "/api/order/statistic/order-status",
      {
        params: {
          year: params.year,
          month: params.month,
          day: params.day
        }
      }
    );

    return res.data;
  },

  async getInventoryStatistic(params: {
    year?: number;
    month?: number;
    day?: number;
  }): Promise<InventoryStatisticResponse> {
    const res = await axiosClient.get<InventoryStatisticResponse>(
      "/api/batch/statistic/inventory",
      {
        params: {
          year: params.year,
          month: params.month,
          day: params.day
        }
      }
    );

    return res.data;
  }
};
