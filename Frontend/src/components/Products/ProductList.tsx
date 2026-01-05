import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../ProductCard/ProductCard";
import productService from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";
import "./ProductList.css";
import { useLocation } from "react-router-dom";


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("");

  const location = useLocation();

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      keyword: params.get("keyword") || "",
      categoryId:
        params.get("categoryId") || params.get("category_id") || "",
    };
  }, [location.search]);


  const fetchProducts = async (keyword?: string, categoryId?: string) => {
    console.log("QUERY PARAM:", query);
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getAllProducts(keyword, categoryId);

      const safeProducts = data.filter(
        (p) => p && typeof p.productId === "number"
      );

      setProducts(safeProducts);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(query.keyword, query.categoryId);
  }, [query.keyword, query.categoryId]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);

    const sorted = [...products];

    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        break;
    }

    setProducts(sorted);
  };

  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (error) return <div className="error">{error}</div>;
  return (
    <div className="product-list-page">
      <div className="product-container">
<div className="page-header">
  <h1 className="page-title">Tất cả sản phẩm</h1>
  <span className="product-count">{products.length} sản phẩm</span>
</div>


        <div className="filter-bar">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="" disabled>
              Sắp xếp theo
            </option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

        <div className="product-grid-inner">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">Không có sản phẩm</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
