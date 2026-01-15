import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailProductPage.css";
import productService from "../../services/ProductService";
import type { IProduct, ProductImage } from "../../services/Interface";
import IP from "../../assets/img/ip.png";
import { useAuth } from "../../context/AuthContext";
import cartDetailService from "../../services/CartDetailService";
import orderService from "../../services/OrderService"; 
import ReviewSection from "../ReviewPage/ReviewSection";
import ProductReviewPage from "../ReviewPage/ProductReviewPage";
import { ShoppingCart, Minus, Plus } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  
  // States cho magnifier
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

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
          setSelectedImageIndex(0);
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

    if (quantity > product.stockQuantity) {
      alert(`Số lượng trong kho chỉ còn ${product.stockQuantity} sản phẩm`);
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await cartDetailService.addToCart({
          cartId: Number(cartId),
          ProductID: product.productId ?? 0,
        });
      }

      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      navigate("/cartShop");
    } catch (e) {
      console.error(e);
      alert("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleOpenReviewModal = async () => {
    if (!user) {
        alert("Vui lòng đăng nhập để đánh giá sản phẩm");
        navigate("/login");
        return;
    }

    try {
        const res = await orderService.checkUserPurchased(user.userId, product?.productId!);
        
        if (res.data.hasPurchased && res.data.orderId) {
            setOrderId(res.data.orderId);
            setIsReviewModalOpen(true);
        } else {
            alert("Bạn chưa mua sản phẩm này");
        }
    } catch (error) {
        alert("Bạn chưa mua sản phẩm này");
    }
  };

  const handleReviewSuccess = () => {
    setReviewRefresh(prev => prev + 1); 
  };

  const handleImageSelect = (index: number) => {
    if (images[index]) {
      setSelectedImage(images[index].url);
      setSelectedImageIndex(index);
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      if (quantity < (product?.stockQuantity || 99)) {
        setQuantity(prev => prev + 1);
      } else {
        alert(`Chỉ còn ${product?.stockQuantity} sản phẩm trong kho`);
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  const handleQuantityInput = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1) {
      if (num <= (product?.stockQuantity || 99)) {
        setQuantity(num);
      } else {
        setQuantity(product?.stockQuantity || 99);
        alert(`Chỉ còn ${product?.stockQuantity} sản phẩm trong kho`);
      }
    } else if (value === '') {
      setQuantity(1);
    }
  };

  // Handlers cho magnifier
  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { width, height } = img.getBoundingClientRect();
    setImgSize({ width, height });
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { top, left } = img.getBoundingClientRect();
    
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setMagnifierPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const images: ProductImage[] = useMemo(() => {
    return product?.productImages
      ? product.productImages.slice().sort((a, b) => a.img_index - b.img_index)
      : [];
  }, [product?.productImages]);

  const storageOptions = useMemo(() => {
    if (!product?.specification?.storage) return [];
    
    const storage = product.specification.storage;
    if (storage.includes(',')) {
      return storage.split(',').map(s => s.trim());
    }
    
    return [storage, '256GB', '512GB', '1TB'].filter((v, i, a) => a.indexOf(v) === i);
  }, [product?.specification?.storage]);

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (!product) return <div className="error">Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-container-2">
      <h1 className="product-title">
        {product.name} | Chính hãng VN/A
      </h1>

      <div className="product-grid">
        <div className="image-box">
          <div className="main-img-container">
            <img
              src={selectedImage || IP}
              className="main-img"
              alt={product.name}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            
            {showMagnifier && (
              <div
                className="magnifier"
                style={{
                  left: `${magnifierPosition.x - 125}px`,
                  top: `${magnifierPosition.y - 125}px`,
                  backgroundImage: `url('${selectedImage || IP}')`,
                  backgroundPosition: `${-magnifierPosition.x * 3 + 125}px ${-magnifierPosition.y * 3 + 125}px`,
                  backgroundSize: `${imgSize.width * 3}px ${imgSize.height * 3}px`
                }}
              />
            )}
          </div>

          <div className="thumb-list">
            {images.map((img, index) => (
              <img
                key={img.id}
                src={img.url}
                className={`thumb ${selectedImageIndex === index ? 'active-thumb' : ''}`}
                onClick={() => handleImageSelect(index)}
                alt={`${product.name} - Ảnh ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="detail-box">
          <div className="price-block">
            <div className="price-main">
              {product.price.toLocaleString("vi-VN")}đ
            </div>
            <div className="price-old">
              {(product.price * 1.1).toLocaleString("vi-VN")}đ
              <span className="discount-badge">-10%</span>
            </div>
          </div>

          {storageOptions.length > 0 && (
            <>
              <div className="section-title">Dung lượng</div>
              <div className="options-row">
                {storageOptions.map((storage) => (
                  <button
                    key={storage}
                    className={`option-btn ${product.specification?.storage === storage ? "active" : ""}`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="section-title">Số lượng</div>
          <div className="quantity-section-inline">
            <div className="quantity-wrapper-inline">
              <button 
                className="qty-btn-inline" 
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <input 
                type="number" 
                className="qty-input-inline" 
                value={quantity}
                onChange={(e) => handleQuantityInput(e.target.value)}
                min="1"
                max={product.stockQuantity}
              />
              <button 
                className="qty-btn-inline" 
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus size={18} />
              </button>
            </div>
            <span className="stock-badge-inline">
              Còn {product.stockQuantity} sản phẩm
            </span>
          </div>

          <div className="action-row">
            <button className="btn red" onClick={handleBuyNow}>
              <ShoppingCart size={20} />
              Thêm vào giỏ hàng
            </button>
          </div>

          <button className="btn-outline">
            Liên hệ tư vấn
          </button>
        </div>
      </div>

      <div className="feature-box">
        <div className="feature-title">THÔNG SỐ KỸ THUẬT</div>
        <ul className="feature-list">
          {product.specification?.battery && (
            <li><strong>Pin:</strong> {product.specification.battery}</li>
          )}
          {product.specification?.camera && (
            <li><strong>Camera:</strong> {product.specification.camera}</li>
          )}
          {product.specification?.cpu && (
            <li><strong>CPU:</strong> {product.specification.cpu}</li>
          )}
          {product.specification?.os && (
            <li><strong>Hệ điều hành:</strong> {product.specification.os}</li>
          )}
          {product.specification?.ram && (
            <li><strong>RAM:</strong> {product.specification.ram}</li>
          )}
          {product.specification?.screen && (
            <li><strong>Màn hình:</strong> {product.specification.screen}</li>
          )}
          {product.specification?.storage && (
            <li><strong>Bộ nhớ:</strong> {product.specification.storage}</li>
          )}
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

      {product.productId && user && orderId && orderId > 0 && (
        <ProductReviewPage 
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setOrderId(null);
          }}
          productId={product.productId}
          userId={user.userId}
          orderId={orderId}
          onSubmitSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}