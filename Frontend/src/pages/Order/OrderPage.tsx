import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

interface OrderSummary {
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
}

interface OrderData {
  orderID: number;
  orderDate: string;
  status: string;
  paymentStatus?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  userID?: number;
}

const OrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();

  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);

  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [discountCode, setDiscountCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDER ================= */
  useEffect(() => {
    if (!orderId) return;

    const loadOrder = async () => {
      try {
        setLoading(true);

        // 1️⃣ Lấy order snapshot
        const orderData = await orderService.getById(Number(orderId));
        setOrder(orderData);

        // Khởi tạo delivery info từ order
        setDeliveryPhone(orderData.deliveryPhone || "");
        setDeliveryAddress(orderData.deliveryAddress || "");

        // 2️⃣ Lấy order details + product
        const details = await orderDetailService.getByOrderId(Number(orderId));

        const items: OrderDetailItem[] = await Promise.all(
          details.map(async (d: any) => {
            const product = await productService.getProductById(d.productId);
            return {
              id: d.id,
              quantity: d.quantity,
              product,
            };
          })
        );

        setOrderDetails(items);

        // 3️⃣ Trigger backend tính tiền (KHÔNG mã)
        const summary = await orderService.applyDiscount(
          Number(orderId),
          null
        );

        setOrderSummary({
          subTotal: summary.subTotal,
          discountAmount: summary.discountAmount,
          totalAmount: summary.totalAmount,
        });

      } catch (err) {
        console.error(err);
        alert("Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  /* ================= APPLY DISCOUNT ================= */
  const applyDiscount = async () => {
    if (!orderId) return;

    try {
      setApplying(true);

      const res = await orderService.applyDiscount(
        Number(orderId),
        discountCode || null
      );

      setOrderSummary({
        subTotal: res.subTotal,
        discountAmount: res.discountAmount,
        totalAmount: res.totalAmount,
      });
    } catch (err) {
      console.error(err);
      alert("Không áp dụng được mã giảm giá");
    } finally {
      setApplying(false);
    }
  };

  /* ================= UPDATE DELIVERY INFO ================= */
  const updateDeliveryInfo = async () => {
    if (!orderId) return;

    try {
      setIsUpdating(true);

      await orderService.update(Number(orderId), {
        deliveryPhone,
        deliveryAddress,
      });

      alert("Cập nhật thông tin giao hàng thành công!");
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật thông tin giao hàng");
    } finally {
      setIsUpdating(false);
    }
  };

  /* ================= PAYPAL ================= */
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

  if (loading || !orderSummary) {
    return <div className="loading">Đang tải đơn hàng...</div>;
  }

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

          <div className="delivery-info">
            <div className="info-label">Số điện thoại nhận hàng:</div>
            <input
              type="text"
              className="delivery-input"
              value={deliveryPhone}
              onChange={(e) => setDeliveryPhone(e.target.value)}
              placeholder="Nhập số điện thoại nhận hàng"
            />
          </div>

          <div className="delivery-info">
            <div className="info-label">Địa chỉ giao hàng:</div>
            <input
              type="text"
              className="delivery-input"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Nhập địa chỉ giao hàng"
            />
          </div>

          <button
            className="update-delivery-btn"
            onClick={updateDeliveryInfo}
            disabled={isUpdating || !deliveryPhone || !deliveryAddress}
          >
            {isUpdating ? "Đang cập nhật..." : "Cập nhật thông tin giao hàng"}
          </button>

          <div className="email-label">EMAIL</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>

      {/* ===== NHẬP MÃ GIẢM GIÁ ===== */}
      <div className="discount-box">
        <input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <button
          disabled={!discountCode || applying}
          onClick={applyDiscount}
        >
          {applying ? "Đang áp dụng..." : "Áp dụng"}
        </button>
      </div>

      {/* ===== TỔNG TIỀN ===== */}
      <div className="price-summary-full">
        <div className="summary-row">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(orderSummary.subTotal)}</span>
        </div>

        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free-shipping">Miễn phí</span>
        </div>

        <div className="summary-row discount">
          <span>Giảm giá</span>
          <span>-{formatPrice(orderSummary.discountAmount)}</span>
        </div>

        <div className="total-row">
          <span>Tổng tiền</span>
          <span className="total-amount">
            {formatPrice(orderSummary.totalAmount)}
          </span>
        </div>

        <div className="final-action">
          <div className="final-total">
            <span>Tổng tiền tạm tính:</span>
            <span className="final-amount">
              {formatPrice(orderSummary.totalAmount)}
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
