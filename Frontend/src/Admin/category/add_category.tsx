import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./add_category.module.css";
import categoryService from "../../services/CategoryService";
import type { ICategory } from "../../services/Interface";

const DanhMucForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      await categoryService.createCategory({
  categoryName: name.trim(),
  description: description.trim(),
});

      navigate("/admin/category");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className={styles["main-content"]}>
    <h1>Quản lí danh mục</h1>
  
  <div className={styles["form-section"]}>
    <form onSubmit={handleSubmit}>
      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Tên danh mục</label>
        <input
          className={styles["form-input"]}
          type="text"
          placeholder="Tên danh mục..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

        {/* Mô tả */}
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Mô tả</label>
            <textarea
              className={styles["form-input"]}
              placeholder="Mô tả danh mục..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

      {error && (
        <div className={styles["error-message"]}>
          {error}
        </div>
      )}

      <div className={styles["buttons"]}>
        <button
          type="submit"
          className={styles["add"]}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Thêm mới"}
        </button>
      </div>
    </form>
  </div>
  </main>

);
};

export default DanhMucForm;
