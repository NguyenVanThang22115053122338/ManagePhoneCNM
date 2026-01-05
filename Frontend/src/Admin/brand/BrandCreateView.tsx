import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./brand_create.module.css";
import { brandService } from "../../services/BrandService";

const BrandCreateView = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await brandService.create({
        name,
        country,
        description,
      });

      alert("Thêm thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (err: any) {
      console.error("Create brand failed", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Thêm thương hiệu thất bại (403 thì kiểm tra token/role ADMIN)";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Thêm thương hiệu mới</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Tên thương hiệu"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <input
            placeholder="Quốc gia"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          />

          <textarea
            placeholder="Mô tả"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {error && (
            <div style={{ color: "#dc2626", fontWeight: 600, marginBottom: 10 }}>
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              type="button"
              className={styles.cancel}
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandCreateView;
