import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./update_delete_supplier.module.css";
import supplierService from "../../services/supplierService";

const SupplierEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSupplier = async () => {
      try {
        const data = await supplierService.getSupplierById(Number(id));
        setSupplierName(data.supplierName);
      } catch (error) {
        console.error("Load supplier failed", error);
        alert("Không tìm thấy nhà cung cấp!");
        navigate("/admin/suppliers");
      }
    };

    fetchSupplier();
  }, [id, navigate]);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supplierName.trim()) {
      alert("Tên nhà cung cấp không được để trống");
      return;
    }

    try {
      setLoading(true);
      await supplierService.updateSupplier(Number(id), supplierName.trim());
      alert("Cập nhật thành công!");
      navigate("/admin/suppliers");
    } catch (error) {
      console.error("Update failed", error);
      alert("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhà cung cấp này?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await supplierService.deleteSupplier(Number(id));
      alert("Xóa thành công!");
      navigate("/admin/suppliers");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Xóa thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainContent}>
      <h1>Cập nhật nhà cung cấp</h1>

      <form className={styles.formSection} onSubmit={handleUpdate}>
        <div>
          <label>Tên nhà cung cấp</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.update} disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật"}
          </button>

          <button
            type="button"
            className={styles.delete}
            onClick={handleDelete}
            disabled={loading}
          >
            Xóa
          </button>
        </div>
      </form>
    </main>
  );
};

export default SupplierEdit;
