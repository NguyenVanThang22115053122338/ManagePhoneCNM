import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./product.module.css";

import productService  from "../../services/ProductService";
import type { IProduct } from "../../services/Interface";

const SanPhamPage: React.FC = () => {
  const navigate = useNavigate();
  const [sanPhams, setSanPhams] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts(); // Dùng đúng hàm đã có
        setSanPhams(data);
      } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm", error);
        setSanPhams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRows = useMemo(() => {
    const lower = search.toLowerCase();
    return sanPhams.filter((sp) =>
      sp.name.toLowerCase().includes(lower)
    );
  }, [sanPhams, search]);

  const handleEdit = (id: number) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAdd = () => {
    navigate("/admin/products/create");
  };

  // Lấy ảnh đầu tiên (ưu tiên img_index = 0) hoặc placeholder
  const getProductImage = (images?: IProduct["productImages"]) => {
    if (!images || images.length === 0) {
      return "/uploads/placeholder.jpg";
    }
    const primary = images.find(img => img.img_index === 0) || images[0];
    return primary.url;
  };

  if (loading) {
    return (
      <main className={styles["main-content"]}>
        <div>Đang tải sản phẩm...</div>
      </main>
    );
  }

  return (
    <main className={styles["main-content"]}>
      {/* Search */}
      <div className={styles["search-bar"]}>
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.Title}>
        <h1>QUẢN LÝ SẢN PHẨM</h1>
      </div>

      {/* Filter + Add */}
      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredRows.length})
        </button>
        <button className={styles.add} onClick={handleAdd}>
          Thêm mới &nbsp;&nbsp;&nbsp;<span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {/* Table */}
      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item) => (
              <tr
                key={item.productId}
                onClick={() => handleEdit(item.productId!)}
                style={{ cursor: "pointer" }}
              >
                <td>{item.productId}</td>
                <td>
                  <img
                    src={getProductImage(item.productImages)}
                    alt={item.name}
                    className={styles["rounded-img"]}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/uploads/placeholder.jpg";
                    }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.stockQuantity}</td>
                <td>{item.price.toLocaleString("vi-VN")} ₫</td>
                <td>{item.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default SanPhamPage;