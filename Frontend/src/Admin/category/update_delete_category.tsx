import React, { useEffect, useState } from "react";
import styles from "./update_delete_category.module.css";
import type { ICategory } from "../../services/Interface";
import categoryService from "../../services/CategoryService";
import { useNavigate, useParams } from "react-router-dom";

const DanhMucEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  /* ===== FETCH CATEGORY ===== */
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryService.getCategoryById(Number(id));
        setCategory(data);
        setName(data.categoryName);
        setDescription(data.description ?? "");
      } catch {
        alert("Không tìm thấy danh mục");
        navigate("/admin/category");
      }
    };

    if (id) fetchCategory();
  }, [id, navigate]);

  /* ===== UPDATE ===== */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    await categoryService.updateCategory(category.categoryId, {
      categoryName: name,
      description: description,
    });
    navigate("/admin/category");
  };

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    if (!category) return;

    setLoading(true);
    await categoryService.deleteCategory(category.categoryId);
    navigate("/admin/category");
  };

  if (!category) return <p className={styles.loading}>⏳ Đang tải dữ liệu...</p>;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Quản lý danh mục</h1>

      <form className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.formGroup}>
          <label>Tên danh mục</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Mô tả</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả danh mục..."
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" disabled={loading} className={styles.update}>
            {loading ? "Đang lưu..." : "Cập nhật"}
          </button>

          <button
            type="button"
            className={styles.delete}
            onClick={() => setShowDelete(true)}
          >
            Xóa
          </button>
        </div>
      </form>

      {/* ===== DELETE MODAL ===== */}
      {showDelete && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Xác nhận xóa</h2>
            <p>
              Bạn chắc chắn muốn xóa danh mục
              <strong> {name}</strong>?
            </p>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setShowDelete(false)}
              >
                Hủy
              </button>
              <button
                className={styles.confirmDelete}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DanhMucEdit;
