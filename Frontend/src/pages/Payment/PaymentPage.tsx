import React from 'react';
import './PaymentPage.css';
import { createPortal } from "react-dom";


const PaymentPage: React.FC = () => {
  // Fake data để test (sau này thay bằng dữ liệu từ API hoặc context)
  const orderSummary = {
    quantity: 2,
    subtotal: 458000,
    shippingFee: 0, // Miễn phí
    directDiscount: 218000,
    total: 240000,
  };

  const customer = {
    fullName: "Tân Quang Huy",
    membershipBadge: "S-NULL",
    phone: "0896444505",
    email: "tanquanghuy.2302@gmail.com",
    address: "241 Lê Văn Việt, P. Hiệp Phú, Q.9, TP. HCM",
    note: "tôi chỉ test",
  };

  const [isPaying, setIsPaying] = React.useState(false);

  const handlePay = async () => {
    if (isPaying) return;

    try {
      setIsPaying(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Thanh toán thành công!");

    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    } finally {
      setIsPaying(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="payment-page">
      {/* Phần mã giảm giá */}
      <div className="voucher-section">
        <input
          type="text"
          placeholder="Nhập mã giảm giá (chỉ áp dụng 1 lần)"
          className="voucher-input"
        />
        <button className="apply-btn">Áp dụng</button>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="summary-section">
        <div className="summary-row">
          <span>Số lượng sản phẩm</span>
          <span>{orderSummary.quantity}</span>
        </div>
        <div className="summary-row">
          <span>Tổng tiền hàng</span>
          <span>{formatPrice(orderSummary.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Phí vận chuyển</span>
          <span className="free-shipping">Miễn phí</span>
        </div>
        <div className="summary-row discount">
          <span>Giảm giá trực tiếp</span>
          <span>-{formatPrice(orderSummary.directDiscount)}</span>
        </div>
        <div className="total-row">
          <span>Tổng tiền</span>
          <span className="total-amount">{formatPrice(orderSummary.total)}</span>
        </div>
        <div className="vat-note">Đã gồm VAT nếu được làm tròn</div>
      </div>

      {/* Thông tin thanh toán */}
      <div className="section">
        <h2 className="section-title">THÔNG TIN THANH TOÁN</h2>
        <div className="payment-options">
          <div className="option">
            <img src="https://via.placeholder.com/32x20/FFB400/FFFFFF?text=$$" alt="Payment" />
            <span>Chọn phương thức thanh toán</span>
            <span className="arrow">›</span>
          </div>
          <div className="option">
            <img src="https://via.placeholder.com/32x20/007BFF/FFFFFF?text=%" alt="Voucher" />
            <span>Nhận thêm nhiều ưu đãi tại cổng</span>
            <span className="arrow">›</span>
          </div>
        </div>
      </div>

      {/* Thông tin nhận hàng */}
      <div className="section">
        <h2 className="section-title">THÔNG TIN NHẬN HÀNG</h2>
        <div className="delivery-info">
          <div className="info-row">
            <span>Khách hàng</span>
            <div className="customer-name">
              <span className="badge">S-NULL</span>
              <span>{customer.fullName}</span>
            </div>
          </div>
          <div className="info-row">
            <span>Số điện thoại</span>
            <span>{customer.phone}</span>
          </div>
          <div className="info-row">
            <span>Email</span>
            <span>{customer.email}</span>
          </div>
          <div className="info-row">
            <span>Nhận hàng tại</span>
            <span>{customer.address}</span>
          </div>
          <div className="info-row note">
            <span>Ghi chú</span>
            <span>{customer.note}</span>
          </div>
          <div className="terms">
            <input type="checkbox" id="terms" defaultChecked />
            <label htmlFor="terms">
              Bằng việc Đặt hàng, bạn đồng ý với Điều khoản sử dụng của CellphoneS.
            </label>
          </div>
          <div className="terms-note">
            Với các giao dịch từ 10 triệu trở lên, CellphoneS xin phép kiểm tra thẻ cổng và CCCD của
            chủ thẻ trước khi tiến hành giao hàng nhằm hạn chế các trường hợp gian lận.
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="final-total">
          <span>Tổng tiền tạm tính:</span>
          <span className="final-amount">{formatPrice(orderSummary.total)}</span>
        </div>
        <button
          className="pay-button"
          onClick={handlePay}
          disabled={isPaying}
        >
          Thanh toán
        </button>
      </div>

      <div className="product-check">
        Kiểm tra danh sách sản phẩm (2)
      </div>
      {isPaying &&
        createPortal(
          <div className="fullscreen-loading">
            <div className="loading-box">
              <div className="spinner-lg"></div>
              <p>Đang xác nhận thanh toán...</p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PaymentPage;