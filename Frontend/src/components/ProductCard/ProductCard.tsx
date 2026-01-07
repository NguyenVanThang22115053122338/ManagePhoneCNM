import React, { useState } from "react";
import "./ProductCard.css";
import type { IProduct } from "../../services/Interface";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMG = "/placeholder-image.jpg";

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const stock = Number(product.stockQuantity ?? 20);
  console.log(product.stockQuantity);
  const price = Number(product.price ?? 0);
  const name = product.name ?? "Không tên";

  const isOutOfStock = stock <= 0;

  const handleViewDetail = () => {
    if (!product.productId) return;
    navigate(`/product-detail/${product.productId}`);
  };

  const increaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, stock || 1));
  };

  const decreaseQty = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const getProductImage = (): string => {
    if (!Array.isArray(product.productImages) || product.productImages.length === 0) {
      return PLACEHOLDER_IMG;
    }

    return (
      product.productImages
        .slice()
        .sort((a, b) => (a.img_index ?? 0) - (b.img_index ?? 0))[0]
        ?.url || PLACEHOLDER_IMG
    );
  };

  return (
    <div
      className={`product-card-wrapper ${isOutOfStock ? "out-of-stock" : ""}`}
      onClick={handleViewDetail}
      role="button"
      tabIndex={0}
      aria-disabled={isOutOfStock}
    >
      <div className="product-card">
        <div className="product-thumb">
          <img
            src={getProductImage()}
            alt={name}
            className="product-img"
            loading="lazy"
          />

          {isOutOfStock && (
            <span className="sold-out-badge">Hết hàng</span>
          )}
        </div>

        <div className="product-body">
          <div className="product-name" title={name}>
            {name}
          </div>

          {product.description && (
            <p className="product-desc">{product.description}</p>
          )}

          <div className="product-info">
            <p className="product-stock">
              Còn lại: <span>{stock}</span>
            </p>
          </div>

          <div className="product-price">
            {price.toLocaleString("vi-VN")} ₫
          </div>

          {!isOutOfStock && (
            <div className="quantity-box">
              <button onClick={decreaseQty}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn-buy"
              disabled={isOutOfStock}
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
            >
              Mua ngay
            </button>

            <button
              className="btn-detail"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetail();
              }}
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
