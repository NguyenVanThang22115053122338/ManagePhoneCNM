import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

import orderService from "../../services/OrderService";
import orderDetailService from "../../services/OrderDetailService";
import cartDetailService from "../../services/CartDetailService";

import { useAuth } from "../../context/AuthContext";
import { normalizeProduct } from "../../adapter/normalizeProduct";
import productService from "../../services/ProductService";

import type { IProduct, CartDetailResponse } from "../../services/Interface";


interface CartItem extends IProduct {
  quantity: number;
  cartDetailsIds: number[]; // ✅ ĐÚNG BẢN CHẤT
}

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const getImageUrl = (images?: any[]) => {
    if (!images || images.length === 0) return "/no-image.png";

    const url = images[0]?.url;
    if (!url || url.trim() === "") return "/no-image.png";

    return url; // Cloudinary → trả thẳng
  };


  // ================= LOAD CART =================
  useEffect(() => {
    const loadCart = async () => {
      const cartIdStr = localStorage.getItem("cartId");

      if (!cartIdStr) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const cartId = Number(cartIdStr);
      if (Number.isNaN(cartId)) {
        // localStorage.removeItem("cartId");
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const details: CartDetailResponse[] =
          await cartDetailService.getByCartId(cartId);

        const grouped = details.reduce((acc: any, detail: any) => {
          const pid =
            detail.product.productId ??
            detail.product.ProductID ??
            detail.product.productID ??
            detail.product.id;

          if (!pid) return acc;

          if (!acc[pid]) {
            acc[pid] = {
              productId: pid,
              quantity: 0,
              cartDetailsIds: [],
            };
          }

          acc[pid].quantity += 1;
          acc[pid].cartDetailsIds.push(detail.cartDetailsId);

          return acc;
        }, {});

        const items: CartItem[] = await Promise.all(
          Object.values(grouped).map(async (item: any) => {
            const fullProduct = await productService.getProductById(item.productId);

            return {
              ...fullProduct,              // có productImages (Cloudinary)
              quantity: item.quantity,
              cartDetailsIds: item.cartDetailsIds,
            } as CartItem;
          })
        );

        setCartItems(items);
        setLoading(false);
      } catch (err) {
        console.error("LOAD CART ERROR:", err);
        alert("Không thể tải giỏ hàng");
        setLoading(false);
      }

    };

    loadCart();
  }, []);

  // ================= UPDATE QUANTITY (FE ONLY) =================
  const updateQuantity = (productId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (item: CartItem) => {
    try {
      await Promise.all(
        item.cartDetailsIds.map(id =>
          cartDetailService.delete(id)
        )
      );

      setCartItems(prev =>
        prev.filter(p => p.productId !== item.productId)
      );
    } catch (err) {
      console.error(err);
      alert("Không thể xoá sản phẩm");
    }
  };



  // ================= CONFIRM ORDER =================
  const handleConfirmOrder = async () => {
    if (isPlacingOrder) return;

    try {
      setIsPlacingOrder(true);

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        alert("Vui lòng đăng nhập");
        navigate("/login");
        return;
      }

      const cartIdStr = localStorage.getItem("cartId");
      if (!cartIdStr) {
        alert("Không tìm thấy giỏ hàng");
        return;
      }

      const userObj = JSON.parse(userStr);
      const cartId = Number(cartIdStr);

      const order = await orderService.create({
  userID: userObj.userId,
  status: "PENDING",
  paymentStatus: "UNPAID",
});

// BÂY GIỜ TS OK
const orderId = order.orderId;

for (const item of cartItems) {
  if (!item.productId) {
    throw new Error("productId undefined");
  }

  await orderDetailService.create({
    orderID: orderId, // Laravel cần orderID
    productID: item.productId,
    quantity: item.quantity,
  });
}



      await cartDetailService.deleteByCartId(cartId);

      setCartItems([]);
      navigate(`/order/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Đặt hàng thất bại");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ================= TOTAL PRICE =================
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  if (loading) return <div className="loading">Đang tải giỏ hàng...</div>;

  // ================= RENDER =================
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-left">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Quay lại
            </button>
            <h1>Giỏ hàng</h1>
          </div>

          {cartItems.length === 0 && (
            <p className="empty-cart">Giỏ hàng trống</p>
          )}

          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">

              <img
                className="item-img"
                src={getImageUrl(item.productImages)}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/no-image.png";
                }}
              />


              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>

                <div className="quantity-and-price">
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity(item.productId!, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId!, 1)}>
                      +
                    </button>
                  </div>

                  <div className="price-wrapper">
                    <span className="current-price">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                    {item.quantity > 1 && (
                      <div className="total-for-item">
                        ={" "}
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="remove-item-btn fa-solid fa-trash"
                onClick={() => removeItem(item)}
                title="Xóa sản phẩm"
              />
            </div>
          ))}

          <div className="cart-total">
            <div className="total-row">
              <span>Tổng thanh toán:</span>
              <strong>{totalPrice.toLocaleString("vi-VN")} ₫</strong>
            </div>
          </div>
        </div>

        <div className="cart-right">
          <h2>Thông tin đặt hàng</h2>

          <form
            className="checkout-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Họ và tên *"
              defaultValue={user?.fullName}
              required
            />
            <input
              type="text"
              placeholder="Số điện thoại *"
              defaultValue={user?.sdt}
              required
            />
            <input
              type="email"
              placeholder="Email"
              defaultValue={user?.email}
            />

            <button
              type="button"
              className="btn-confirm"
              onClick={handleConfirmOrder}
            >
              XÁC NHẬN VÀ ĐẶT HÀNG
            </button>
          </form>
        </div>
      </div>

      {isPlacingOrder && (
        <div className="fullscreen-loading">
          <div className="loading-box">
            <div className="spinner-lg"></div>
            <p>Đang xử lý đơn hàng...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
