import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./category.module.css";

import categoryService from "../../services/CategoryService";
import type { ICategory } from "../../services/Interface";

const DanhMucPage: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(""); 
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    const fetchDanhMucs = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategory(data);
      } catch (err : any) {
        console.error("Fetch error:", err);
        setError(err.message || "Không thể tải danh sách danh mục.");
      } finally {
        setLoading(false);
      }
    };

    fetchDanhMucs();
  }, []);

  const filteredDanhMucs = useMemo(
    () =>
      category.filter((dm) =>
        dm.categoryName
          .toLowerCase()
          .includes(search.toLowerCase().trim())
      ),
    [search, category]
  );

  const handleRowClick = (id: number) => {
    navigate(`/admin/category/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate("/admin/category/create");
  };

  if (loading) {
    return (
      <p style={{ padding: "20px" }}>
        ⏳ Đang tải dữ liệu danh mục...
      </p>
    );
  }

  return (
    <main className={styles["main-content"]}>
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
        <h1>QUẢN LÝ DANH MỤC</h1>
      </div>

      <div className={styles["add-button"]}>
        <button className={styles["filter-btn"]}>
          Tất cả ({filteredDanhMucs.length})
        </button>
        <button className={styles.add} onClick={handleAddNew}>
          Thêm mới &nbsp;&nbsp;&nbsp;
          <span className={styles["plus-sign"]}>+</span>
        </button>
      </div>

      {error && <div className={styles["alert-danger"]}>{error}</div>}

      <section className={styles["table-container"]}>
        <table className={styles["product-table"]}>
          <thead>
            <tr>
              <th>Mã danh mục</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {filteredDanhMucs.map((dm) => (
              <tr
                key={dm.categoryId}
                onClick={() => handleRowClick(dm.categoryId)}
              >
                <td>{dm.categoryId}</td>
                <td>{dm.categoryName}</td>
                <td>{dm.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default DanhMucPage;
