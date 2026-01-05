import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./brand_create.module.css";
import { brandService } from "../../services/BrandService";
import type { BrandCreateRequest } from "../../services/Interface";

const BrandEditView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const brandId = Number(id);

  const [form, setForm] = useState<BrandCreateRequest>({
    name: "",
    country: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD BRAND ================= */
  useEffect(() => {
    if (!id || Number.isNaN(brandId)) {
      setError("ID thương hiệu không hợp lệ");
      setLoading(false);
      return;
    }

    const loadBrand = async () => {
      try {
        setLoading(true);
        setError("");

        const brand = await brandService.getById(brandId);

        setForm({
          name: brand.name,
          country: brand.country,
          description: brand.description ?? "",
        });
      } catch (err: any) {
        console.error("Load brand failed", err);
        setError(
          err?.response?.data?.message ||
            "Không tải được thông tin thương hiệu"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBrand();
  }, [id, brandId]);

  /* ================= UPDATE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await brandService.update(brandId, form);
      alert("Cập nhật thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (err: any) {
      console.error("Update brand failed", err);
      setError(
        err?.response?.data?.message ||
          "Cập nhật thất bại (403 thì kiểm tra quyền ADMIN)"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Đang tải dữ liệu...</h1>
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Lỗi</h1>
          <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
          <div className={styles.actions}>
            <button onClick={() => navigate("/admin/brands")}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Cập nhật thương hiệu</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Tên thương hiệu"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Quốc gia"
            value={form.country}
            onChange={e => setForm({ ...form, country: e.target.value })}
            required
          />

          <textarea
            placeholder="Mô tả"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {error && (
            <div
              style={{
                color: "#dc2626",
                fontWeight: 600,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              type="button"
              className={styles.cancel}
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandEditView;
