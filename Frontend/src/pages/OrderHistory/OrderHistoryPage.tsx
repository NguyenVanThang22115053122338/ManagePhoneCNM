import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { OrderFullResponse } from "../../services/Interface";
import orderService from "../../services/OrderService";
import "./OrderHistoryPage.css";

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");

  const userId = rawUser
    ? JSON.parse(rawUser).userId
    : null;

  const [orders, setOrders] = useState<OrderFullResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderFullResponse | null>(null);

  useEffect(() => {
    if (!userId) {
      console.warn("❌ userId không tồn tại");
      setLoading(false);
      return;
    }

    console.log("▶️ CALL API getByUser, userId =", userId);
    setLoading(true);

    orderService
      .getByUser(userId)
      .then(data => {
        setOrders(data);
      })

      .catch(err => {
        console.error("❌ LỖI CALL API:", err);
      })
      .finally(() => {
        console.log("⏹️ FINALLY - stop loading");
        setLoading(false);
      });
  }, [userId]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "Hoàn thành":
        return "#00c853";
      case "DELIVERED":
      case "Đã giao":
        return "#0066cc";
      case "PENDING":
      case "Đang xử lý":
        return "#ff9800";
      case "CANCELLED":
      case "Đã hủy":
        return "#d70018";
      default:
        return "#666";
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };

  const totalAmount = selectedOrder
    ? selectedOrder.products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    )
    : 0;

  return (
    <div className="order-history-page">
      <div className="order-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>

        <h1 className="page-title">Lịch sử đơn hàng</h1>

        {loading ? (
          <div className="order-loading">
            <div className="spinner" />
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : (
          <div className="orders-grid">
            {/* LEFT */}
            <div className="orders-list">
              {orders.map(order => (
                <div
                  key={order.orderID}
                  className={`order-card ${selectedOrder?.orderID === order.orderID ? "active" : ""
                    }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-header">
                    <div>
                      <div className="order-id">Đơn hàng #{order.orderID}</div>
                      <div className="order-date">
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                    <div
                      className="order-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </div>
                  </div>

                  {/* TEXT PREVIEW – KHÔNG MOCK */}
                  <div className="order-items-preview-text">
                    {order.products.length === 0
                      ? "Không có sản phẩm"
                      : order.products.length === 1
                        ? order.products[0].name
                        : `${order.products[0].name} và ${order.products.length - 1
                        } sản phẩm khác`}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="order-detail-panel">
              {selectedOrder ? (
                <>
                  <h2>Chi tiết đơn hàng #{selectedOrder.orderID}</h2>

                  <div className="detail-info">
                    <p>
                      <strong>Ngày đặt:</strong>{" "}
                      {formatDate(selectedOrder.orderDate)}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        style={{
                          color: getStatusColor(selectedOrder.status)
                        }}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                  </div>

                  <div className="detail-products">
                    {selectedOrder.products.map(p => (
                      <div key={p.productID} className="detail-item">
                        <img
                          src={p.imageUrl || "/placeholder.png"}
                          alt={p.name}
                          className="detail-product-image"
                        />

                        <div className="detail-item-info">
                          <h4>{p.name}</h4>
                          <p>Số lượng: {p.quantity}</p>
                        </div>

                        <div className="detail-price">
                          {(p.price * p.quantity).toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="detail-total">
                    <strong>Tổng thanh toán:</strong>
                    <span className="final-price">
                      {totalAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-order-selected">
                  <p>Chọn một đơn hàng để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
