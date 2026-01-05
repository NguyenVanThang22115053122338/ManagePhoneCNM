import React, { useState, useEffect } from 'react';
import type { IProduct } from '../../services/Interface';
import ProductCard from '../../components/ProductCard/ProductCard';
import './WishlistPage.css';

// Mock data sản phẩm yêu thích (bạn sẽ thay bằng API thật sau)
const mockWishlist: IProduct[] = [
  {
    productID: 1,
    name: "Tủ lạnh LG Inverter 519 lít GR-B209BL",
    price: 11900000,
    stock_quantity: 25,
    image_url: "https://via.placeholder.com/300x300/4CAF50/white?text=Tủ+Lạnh+LG",
    description: "Công nghệ Inverter tiết kiệm điện, làm lạnh đa chiều",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-10").toISOString(),
  },
  {
    productID: 2,
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: 32,
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    description: "Hình ảnh sắc nét 4K, kết nối thông minh, HDR10+",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-12").toISOString(),
  },
  {
    productID: 3,
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: 32,
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    description: "Hình ảnh sắc nét 4K, kết nối thông minh, HDR10+",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-12").toISOString(),
  },
  {
    productID: 4,
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: 32,
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    description: "Hình ảnh sắc nét 4K, kết nối thông minh, HDR10+",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-12").toISOString(),
  },
    {
    productID: 5,
    name: "Tivi Samsung 55 inch 4K Crystal UHD",
    price: 12990000,
    stock_quantity: 32,
    image_url: "https://via.placeholder.com/300x300/F44336/white?text=TV+Samsung",
    description: "Hình ảnh sắc nét 4K, kết nối thông minh, HDR10+",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-12").toISOString(),
  },
  {
    productID: 6,
    name: "Máy lạnh Daikin Inverter 1.5 HP FTKC35UAVMV",
    price: 14200000,
    stock_quantity: 5,
    image_url: "https://via.placeholder.com/300x300/FF9800/white?text=Máy+Lạnh+Daikin",
    description: "Làm lạnh nhanh, lọc không khí, tiết kiệm điện",
    created_at: new Date().toISOString(),
    updated_at: new Date("2025-11-05").toISOString(),
  },
];

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API lấy danh sách yêu thích
    setTimeout(() => {
      setWishlist(mockWishlist);
      setLoading(false);
    }, 800);

    // Thực tế bạn sẽ gọi:
    // axios.get('/api/wishlist').then(res => setWishlist(res.data))
  }, []);

  const removeFromWishlist = (productID: number) => {
    setWishlist(prev => prev.filter(item => item.productID !== productID));
    // Gọi API DELETE /wishlist/:productID ở đây
  };

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">
            Giỏ hàng 
            <span className="wishlist-count">({wishlist.length})</span>
          </h1>
          {wishlist.length > 0 && (
            <button className="clear-all-btn" onClick={() => setWishlist([])}>
              Xóa tất cả
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Đang tải giỏ hàng...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">...</div>
            <h3>Chưa có sản phẩm nào trong giỏ hàng</h3>
            <p>Hãy thêm những sản phẩm bạn thích vào giỏ hàng để theo dõi giá và mua sau nhé!</p>
            <a href="/home" className="btn-go-shopping">
              Tiếp tục mua sắm
            </a>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div key={product.productID} className="wishlist-item-wrapper">
                <button
                  className="remove-wishlist-btn"
                  onClick={() => removeFromWishlist(product.productID)}
                  title="Xóa khỏi yêu thích"
                >
                  Remove
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;