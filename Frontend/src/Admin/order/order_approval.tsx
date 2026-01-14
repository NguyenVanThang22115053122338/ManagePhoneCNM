import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./order_approval.module.css";

import OrderService from "../../services/OrderService";
import type { OrderFullResponse } from "../../services/Interface";

/* ================= HELPERS ================= */
const formatDate = (d?: string | null) => {
  if (!d || typeof d !== "string") return "—";
  return d.slice(0, 10).split("-").reverse().join("/");
};

const formatVND = (n: number) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;

const mapTrangThai = (status: string) => {
  switch (status) {
    case "PENDING": return "Chưa duyệt";
    case "APPROVED": return "Đã duyệt";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return styles.statusPending;
    case "APPROVED": return styles.statusApproved;
    case "CANCELLED": return styles.statusCancelled;
    default: return "";
  }
};

/* ================= COMPONENT ================= */
const OrderApproval = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderFullResponse[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);

      // Cập nhật local state
      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại");
    }
  };

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
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Quản lý đơn hàng</h1>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Khách hàng</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedOrders.length > 0 ? (
                    pagedOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className={styles.orderId}>#{order.orderId}</td>
                        <td>{formatDate(order.orderDate)}</td>
                        <td className={styles.customerName}>{order.userName}</td>
                        <td className={styles.productName}>{order.products.map(p => p.name).join(", ")}</td>
                        <td className={styles.amount}>{order.products.map(p => p.quantity).join(", ")}</td>
                        {/* {order.products.map(p => p.quantity).reduce((a, b) => a + b)} */}
                        <td className={styles.price}>{order.products.map(p => formatVND(p.price)).join(", ")}</td>
                        <td>
                          <span className={`${styles.paymentBadge} ${order.paymentStatus === "PAID"
                            ? styles.paymentPaid
                            : styles.paymentUnpaid
                            }`}>
                            {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`${styles.statusSelect} ${getStatusColor(order.status)}`}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          >
                            <option value="PENDING">Chưa duyệt</option>
                            <option value="APPROVED">Đã duyệt</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className={styles.detailBtn}
                            onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className={styles.noData}>
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ===== PAGINATION ===== */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className={styles.paginationBtn}
                >
                  ◀ Trước
                </button>

                <span className={styles.paginationInfo}>
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className={styles.paginationBtn}
                >
                  Sau ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderApproval;