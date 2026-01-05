import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./brand_page.module.css";
import { brandService } from "../../services/BrandService";
import type { Brand } from "../../services/Interface";

const BrandsTableView = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= GET ALL BRANDS ================= */
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await brandService.getAll();
        setBrands(data);
      } catch (err: any) {
        console.error("Load brands failed", err);
        setError(
          err?.response?.data?.message ||
            "Không tải được danh sách thương hiệu"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm("Xóa thương hiệu này?")) return;

    try {
      await brandService.delete(id);
      setBrands(prev => prev.filter(b => b.brandId !== id));
    } catch (err: any) {
      console.error("Delete brand failed", err);
      alert(
        err?.response?.data?.message ||
          "Xóa thất bại (403 thì kiểm tra quyền ADMIN)"
      );
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className={styles.container}>
        <h2>Đang tải dữ liệu...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 style={{ color: "#dc2626" }}>{error}</h2>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Danh sách thương hiệu</h1>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/brands/create")}
        >
          Thêm mới
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thương hiệu</th>
            <th>Quốc gia</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {brands.length > 0 ? (
            brands.map(b => (
              <tr key={b.brandId}>
                <td>{b.brandId}</td>
                <td>{b.name}</td>
                <td>{b.country}</td>
                <td>{b.description}</td>
                <td className={styles.actions}>
                    <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/admin/brands/edit/${b.brandId}`)}
                        >
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(b.brandId)}
                        >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Không có thương hiệu nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BrandsTableView;
