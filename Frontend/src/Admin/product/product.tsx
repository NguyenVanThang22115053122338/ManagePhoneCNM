import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";

import productService from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";

const PAGE_SIZE = 10;

const SanPhamPage: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= SEARCH ================= */
  const filteredProducts = useMemo(() => {
    const lower = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lower)
    );
  }, [products, search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  /* ================= HANDLERS ================= */
  const handleEdit = (id: number) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/admin/products/create");
  };

  const getProductImage = (images?: IProduct["productImages"]) => {
    if (!images || images.length === 0) {
      return "/uploads/placeholder.jpg";
    }
    const primary = images.find(img => img.img_index === 0) || images[0];
    return primary.url;
  };

  /* ================= STATES ================= */
  if (loading) {
    return (
      <main className={styles["productPage-root"]}>
        <section className={styles["productPage-content"]}>
          <h1>Quản lý sản phẩm</h1>
          <p>Đang tải dữ liệu...</p>
        </section>
      </main>
    );
  }

  /* ================= RENDER ================= */
  return (
    <main className={styles["productPage-root"]}>
      <section className={styles["productPage-content"]}>
        {/* HEADER */}
        <header className={styles["productPage-header"]}>
          <h1 className={styles["productPage-title"]}>
            Quản lý sản phẩm
          </h1>

          <div className={styles["productPage-actionsTop"]}>
            {/* SEARCH */}
            <div className={styles["productPage-search"]}>
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* ADD */}
            <button
              className={styles["productPage-addBtn"]}
              onClick={handleAdd}
            >
              <i className="fa fa-plus"></i>
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </header>

        {/* TABLE */}
        <table className={styles["productPage-table"]}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Mô tả</th>
            </tr>
          </thead>

          <tbody>
            {pagedProducts.length > 0 ? (
              pagedProducts.map(item => (
                <tr
                  key={item.productId}
                  onClick={() => handleEdit(item.productId!)}
                >
                  <td>{item.productId}</td>
                  <td>
                    <img
                      src={getProductImage(item.productImages)}
                      alt={item.name}
                      className={styles["productPage-img"]}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/uploads/placeholder.jpg";
                      }}
                    />
                  </td>
                  <td className={styles["productPage-name"]}>
                    {item.name}
                  </td>
                  <td>{item.stockQuantity}</td>
                  <td>
                    {item.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className={styles["productPage-desc"]}>
                    {item.description || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles["productPage-empty"]}>
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className={styles["productPage-pagination"]}>
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <i className="fa fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={
                  page === i + 1
                    ? styles["productPage-pageActive"]
                    : ""
                }
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </nav>
        )}
      </section>
    </main>
  );
};

export default SanPhamPage;
