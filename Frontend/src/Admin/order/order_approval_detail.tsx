import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./order_approval_detail.module.css";

import OrderService from "../../services/OrderService";
import type { OrderFullResponse } from "../../services/Interface";

/* ================= HELPERS ================= */
const formatVND = (n: number) =>
  `${Number(n || 0).toLocaleString("vi-VN")}đ`;

const formatDate = (d?: string | null) => {
  if (!d || typeof d !== "string") return "—";
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapTrangThai = (status: string) => {
  switch (status) {
    case "PENDING": return "Chưa duyệt";
    case "APPROVED": return "Đã duyệt";
    case "SHIPPING": return "Đang giao";
    case "COMPLETED": return "Hoàn thành";
    case "REJECTED": return "Đã từ chối";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "PENDING": return styles.statusPending;
    case "APPROVED": return styles.statusApproved;
    case "SHIPPING": return styles.statusShipping;
    case "COMPLETED": return styles.statusCompleted;
    case "REJECTED": return styles.statusRejected;
    case "CANCELLED": return styles.statusCancelled;
    default: return "";
  }
};

/* ================= COMPONENT ================= */
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderFullResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await OrderService.getById(Number(id));
        setOrder(data);
      } catch (e) {
        console.error(e);
        alert("Không tải được chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      await OrderService.updateStatus(order.orderId, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : prev);
      alert("Cập nhật trạng thái thành công!");
    } catch {
      alert("Cập nhật trạng thái thất bại");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  /* ================= RENDER ================= */
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <button className={styles.backBtn} onClick={() => navigate("/admin/order_approval")}>
          ← Quay lại danh sách
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Đơn hàng #{order.orderId}</h2>
          <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
            {mapTrangThai(order.status)}
          </div>
        </div>

        {/* INFO GRID */}
        <div className={styles.infoSection}>
          <h3 className={styles.sectionTitle}>Thông tin đơn hàng</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Ngày đặt</div>
              <div className={styles.infoValue}>{formatDate(order.orderDate)}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Trạng thái thanh toán</div>
              <div className={styles.infoValue}>
                <span className={`${styles.paymentBadge} ${order.paymentStatus === "PAID"
                  ? styles.paymentPaid
                  : styles.paymentUnpaid
                  }`}>
                  {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Khách hàng</div>
              <div className={styles.infoValue}>{order.userName}</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>{order.userEmail}</div>
            </div>
          </div>
        </div>



        {/* PRODUCT LIST */}
        <div className={styles.productSection}>
          <h3 className={styles.sectionTitle}>Chi tiết sản phẩm</h3>

          {order.products && order.products.length > 0 ? (
            <div className={styles.productList}>
              {order.products.map((p, i) => (
                <div key={i} className={styles.productItem}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className={styles.productImg} />
                  ) : (
                    <div className={styles.productImgPlaceholder}>📱</div>
                  )}

                  <div className={styles.productInfo}>
                    <div className={styles.productName}>
                      {p.name || `Sản phẩm #${p.productID}`}
                    </div>
                    <div className={styles.productMeta}>
                      {p.price > 0 ? formatVND(p.price) : "Chưa có giá"} × {p.quantity}
                    </div>
                  </div>

                  <div className={styles.productTotal}>
                    {p.price > 0 ? formatVND(p.price * p.quantity) : "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProducts}>
              Đơn hàng chưa có sản phẩm
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className={styles.summary}>
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Tổng tiền hàng:</span>
              <span>{formatVND(order.subTotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Giảm giá:</span>
              <span className={styles.discount}>- {formatVND(order.discountAmount)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Tổng thanh toán:</span>
              <span className={styles.totalAmount}>{formatVND(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;