import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./OrderPage.css";
import orderService from "../../services/OrderService";
import orderDetailService from "../../services/OrderDetailService";
import productService from "../../services/ProductService";
import { useAuth } from "../../context/AuthContext";
import paymentService from "../../services/PaymentService";
import type { IProduct } from "../../services/Interface";

interface OrderDetailItem {
  id: number;
  quantity: number;
  product: IProduct;
}

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();

  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        const details = await orderDetailService.getByOrderId(Number(orderId));

        const items: OrderDetailItem[] = await Promise.all(
          details.map(async (d) => {
            const product = await productService.getProductById(d.productId);

            return {
              id: d.id,
              quantity: d.quantity,
              product
            };
          })
        );

        setOrderDetails(items);
      } catch (err) {
        console.error(err);
        alert("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handlePayPalPayment = async () => {
    if (!orderId) return;

    try {
      const res = await paymentService.createPayPalPayment(Number(orderId));

      if (res.approvalUrl) {
        window.location.href = res.approvalUrl;
      } else {
        alert("Không lấy được link PayPal");
      }
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    }
  };

  const summary = useMemo(() => {
    const subtotal = orderDetails.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const discount = subtotal > 500000 ? 218000 : 0;

    return {
      quantity: orderDetails.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      discount,
      shipping: 0,
      total: subtotal - discount,
    };
  }, [orderDetails]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  if (loading) return <div className="loading">Đang tải đơn hàng...</div>;

  return (
    <div className="order-page">
      {/* ===== SẢN PHẨM ===== */}
      {orderDetails.map((item) => (
        <div key={item.id} className="product-section">
          <img
            src={item.product.productImages?.[0]?.url}
            alt={item.product.name}
            className="product-image"
          />
          <div className="product-info">
            <h3 className="product-title">{item.product.name}</h3>
            <div className="product-price">
              <span className="discounted-price">
                {formatPrice(item.product.price)}
              </span>
            </div>
            <div className="quantity">Số lượng: {item.quantity}</div>
          </div>
        </div>
      ))}

      {/* ===== THÔNG TIN KHÁCH HÀNG ===== */}
      <div className="customer-section">
        <h2 className="section-title">THÔNG TIN KHÁCH HÀNG</h2>
        <div className="customer-info">
          <div className="customer-name-row">
            <span className="customer-name">{user?.fullName}</span>
            <span className="phone">{user?.sdt}</span>
          </div>
          <div className="email-label">EMAIL</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>

      {/* ===== TỔNG TIỀN ===== */}
      <div className="price-summary-full">
        <div className="summary-row">
          <span>Số lượng sản phẩm</span>
          <span>{summary.quantity}</span>
        </div>
        <div className="summary-row">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free-shipping">Miễn phí</span>
        </div>
        <div className="summary-row discount">
          <span>Giảm giá trực tiếp</span>
          <span>-{formatPrice(summary.discount)}</span>
        </div>
        <div className="total-row">
          <span>Tổng tiền</span>
          <span className="total-amount">
            {formatPrice(summary.total)}
          </span>
        </div>

        <div className="final-action">
          <div className="final-total">
            <span>Tổng tiền tạm tính:</span>
            <span className="final-amount">
              {formatPrice(summary.total)}
            </span>
          </div>
          <button
            className="continue-button"
            onClick={handlePayPalPayment}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
