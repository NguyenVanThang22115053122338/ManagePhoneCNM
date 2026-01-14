import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailProductPage.css";
import productService from "../../services/ProductService";
import type { IProduct, ProductImage } from "../../services/Interface";
import IP from "../../assets/img/ip.png";
import { useAuth } from "../../context/AuthContext";
import cartDetailService from "../../services/CartDetailService";
import orderService from "../../services/OrderService"; 
import reviewService from "../../services/ReviewService";
import ReviewSection from "../ReviewPage/ReviewSection";
import type { IReview } from "../../services/Interface";
import ProductReviewPage from "../ReviewPage/ProductReviewPage";
import {ShoppingCart} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState("1TB");
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        if (!data || !data.productId) {
          setProduct(null);
          return;
        }

        setProduct(data);

        if (data.productImages?.length) {
          const firstImg = data.productImages
            .slice()
            .sort((a, b) => a.img_index - b.img_index)[0]?.url;
          setSelectedImage(firstImg || "");
        }
      } catch (e) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleBuyNow = async () => {
    const hasToken = !!localStorage.getItem("accessToken");

    if (!user && !hasToken) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login", {
        state: { redirectTo: `/product-detail/${id}` },
      });
      return;
    }
    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      alert("Giỏ hàng chưa được khởi tạo, vui lòng thêm sản phẩm lại");
      return;
    }
    if (!product) return;

    try {
      await cartDetailService.addToCart({
        cartId: Number(cartId),
        ProductID: product.productId ?? 0,
      });

      alert("Đã thêm sản phẩm vào giỏ hàng");
      navigate("/cartShop");
    } catch (e) {
      console.error(e);
      alert("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  // ✅ HÀM MỞ MODAL - KIỂM TRA ĐÃ MUA CHƯA
  const handleOpenReviewModal = async () => {
    if (!user) {
        alert("Vui lòng đăng nhập để đánh giá sản phẩm");
        navigate("/login");
        return;
    }

    try {
        const res = await orderService.checkUserPurchased(user.userId, product?.productId!);
        console.log("Response từ API:", res.data);
        
        if (res.data.hasPurchased && res.data.orderId) {
            setOrderId(res.data.orderId);
            setIsReviewModalOpen(true);
        } else {
            alert("Bạn chưa mua sản phẩm này");
        }
    } catch (error) {
        console.error("Lỗi check order:", error);
        alert("Bạn chưa mua sản phẩm này");
    }
};

const handleReviewSuccess = () => {
  setReviewRefresh(prev => prev + 1); 
};

  const images: ProductImage[] = useMemo(() => {
    return product?.productImages
      ? product.productImages.slice().sort((a, b) => a.img_index - b.img_index)
      : [];
  }, [product?.productImages]);

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  const colors = [
    { name: "Titan Sa Mạc", price: product.price },
    { name: "Titan Đen", price: product.price },
    { name: "Titan Trắng", price: product.price },
    { name: "Titan Tự Nhiên", price: product.price },
  ];

  return (
    <div className="product-container-2">
      <h1 className="product-title">
        {product.name} | Chính hãng VN/A
      </h1>


      <div className="product-grid">
        <div className="image-box">
          <img
            src={selectedImage || IP}
            className="main-img"
            alt={product.name}
          />

          <div className="thumb-list">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                className="thumb"
                onClick={() => setSelectedImage(img.url)}
                alt="thumb"
              />
            ))}
          </div>
        </div>

        <div className="detail-box">
          <div className="price-block">
            <div className="price-main">
              {product.price.toLocaleString("vi-VN")}đ
            </div>
            <div className="price-old">{(product.price*1.1).toLocaleString("vi-VN")}</div>
          </div>

          <div className="section-title">Phiên bản</div>
          <div className="options-row">
            {["1TB", "512GB", "256GB"].map((ver) => (
              <button
                key={ver}
                className={`option-btn ${selectedVersion === ver ? "active" : ""}`}
                onClick={() => setSelectedVersion(ver)}
              >
                {ver}
              </button>
            ))}
          </div>

          <div className="section-title">Màu sắc</div>
          <div className="color-grid">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`color-btn ${selectedColor === color.name ? "active" : ""}`}
                onClick={() => setSelectedColor(color.name)}
              >
                <img src={IP} className="color-img" alt={color.name} />
                <div className="color-info">
                  <span>{color.name}</span>
                  <span className="color-price">
                    {color.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="action-row">
            <button className="btn blue">Trả góp 0%</button>
            
            <button className="btn red" onClick={handleBuyNow}>
              <ShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>
          </div>

          <button className="btn-outline">Liên hệ</button>
        </div>
      </div>

      <div className="feature-box">
        <div className="feature-title">TÍNH NĂNG NỔI BẬT</div>
        <ul className="feature-list">
          <li><strong>Battery:</strong> {product.specification?.battery}</li>
          <li><strong>Camera:</strong> {product.specification?.camera}</li>
          <li><strong>CPU:</strong> {product.specification?.cpu}</li>
          <li><strong>OS:</strong> {product.specification?.os}</li>
          <li><strong>RAM:</strong> {product.specification?.ram}</li>
          <li><strong>Screen:</strong> {product.specification?.screen}</li>
          <li><strong>Storage:</strong> {product.specification?.storage}</li>
        </ul>
      </div>

      <div className="review-section">
        <h2 className="review-title">Đánh giá sản phẩm</h2>

        {product !== null && product.productId !== undefined && (
          <ReviewSection 
            productId={product.productId} 
            refreshTrigger={reviewRefresh}
          />
        )}
        <button 
          className="write-review-btn" 
          onClick={handleOpenReviewModal}
        >
          <i className="fa-solid fa-pen"></i>
          Viết đánh giá
        </button>
      </div>

      {/* ✅ MODAL VỚI USER ID VÀ ORDER ID */}
      {product.productId && user && orderId && orderId > 0 && (
    <ProductReviewPage 
        isOpen={isReviewModalOpen}
        onClose={() => {
            setIsReviewModalOpen(false);
            setOrderId(null);
        }}
        productId={product.productId}
        userId={user.userId}
        orderId={orderId}  // ✅ Không dùng || 0 nữa
        onSubmitSuccess={handleReviewSuccess}
    />
)}
    </div>
  );
}