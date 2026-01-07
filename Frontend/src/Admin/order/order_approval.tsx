import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./order_approval.module.css";

import OrderService from "../../services/OrderService";
import StatusService from "../../services/StatusService";
import OrderDetailService from "../../services/OrderDetailService";
import ProductService from "../../services/ProductService";

import type {
  OrderResponse,
  IUser,
} from "../../services/Interface";

/* ================= HELPERS ================= */
const mapTrangThai = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chưa duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const formatDate = (d?: string | null) => {
  if (!d || typeof d !== "string") return "—";
  return d.slice(0, 10).split("-").reverse().join("/");
};

/* ================= VIEW MODEL ================= */
interface OrderRowVM {
  orderId: number;
  orderDate?: string | null;
  status: string;
  customerName: string;
  productName: string;
}

/* ================= COMPONENT ================= */
const OrderApproval = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRowVM[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        // 1️⃣ lấy tất cả order
        const rawOrders: OrderResponse[] = await OrderService.getAll();

        // chỉ lấy đơn chưa duyệt
        const pendingOrders = rawOrders.filter(
          o => o.status === "PENDING"
        );

        // 2️⃣ build view model (NHẸ – có guard chống 404)
        const rows: OrderRowVM[] = await Promise.all(
          pendingOrders.map(async (order) => {
            /* ===== USER ===== */
            let customerName = "—";
            if (order.userID) {
              try {
                const user: IUser = await StatusService.getUserById(order.userID);
                customerName = user.fullName ?? "—";
              } catch {}
            }

            /* ===== PRODUCT (lấy sản phẩm đầu tiên) ===== */
            let productName = "—";
            try {
              const details = await OrderDetailService.getByOrderId(order.orderID);
              if (details.length > 0 && details[0].productId) {
                const product = await ProductService.getProductById(details[0].productId);
                productName = product.name ?? "—";
              }
            } catch {}

            return {
              orderId: order.orderID,
              orderDate: order.orderDate ?? null,
              status: order.status,
              customerName,
              productName,
            };
          })
        );

        setOrders(rows);
      } catch (err) {
        console.error(err);
        alert("Không tải được danh sách đơn cần duyệt");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ================= PAGED DATA ================= */
  const totalPages = Math.ceil(orders.length / pageSize);

  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [orders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách đơn cần duyệt</h1>

      {loading ? (
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {pagedOrders.length > 0 ? (
                pagedOrders.map((o) => (
                  <tr
                    key={o.orderId}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/admin/orders/${o.orderId}`)
                    }
                  >
                    <td>#{o.orderId}</td>
                    <td>{formatDate(o.orderDate)}</td>
                    <td>{o.customerName}</td>
                    <td>{o.productName}</td>
                    <td>{mapTrangThai(o.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    Không có đơn cần duyệt
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ===== PAGINATION ===== */}
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ◀
            </button>

            <span>
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderApproval;