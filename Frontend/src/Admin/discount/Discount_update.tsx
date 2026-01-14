// pages/Admin/Discount/discount_update.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DiscountService from "../../services/DiscountService";
import type { Discount } from "../../services/Interface";
import styles from "./discount_update.module.css";

const DiscountUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Discount | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    DiscountService.getById(Number(id))
      .then((res) => setForm(res))
      .catch(() => {
        alert("Không tìm thấy discount");
        navigate("/admin/discounts");
      });
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      setSaving(true);
      await DiscountService.update(Number(id), form);
      navigate("/admin/discounts");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return <div className={styles.dcUpd__loading}>Đang tải dữ liệu…</div>;
  }

  return (
    <main className={styles.dcUpd__page}>
      <section className={styles.dcUpd__card}>
        <h1 className={styles.dcUpd__title}>Cập nhật Discount</h1>

        <form className={styles.dcUpd__form} onSubmit={handleSubmit}>
          {/* CODE */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Code</label>
            <input
              className={styles.dcUpd__input}
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
              required
            />
          </div>

          {/* TYPE */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Loại</label>
            <select
              className={styles.dcUpd__input}
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as "PERCENT" | "FIXED"
                })
              }
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Giá cố định</option>
            </select>
          </div>

          {/* VALUE */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Giá trị</label>
            <input
              type="number"
              className={styles.dcUpd__input}
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* MAX DISCOUNT */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Giảm tối đa</label>
            <input
              type="number"
              className={styles.dcUpd__input}
              value={form.maxDiscountAmount ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxDiscountAmount: e.target.value
                    ? Number(e.target.value)
                    : null
                })
              }
            />
          </div>

          {/* USAGE LIMIT */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Số lượt dùng</label>
            <input
              type="number"
              className={styles.dcUpd__input}
              value={form.usageLimit ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  usageLimit: e.target.value
                    ? Number(e.target.value)
                    : null
                })
              }
            />
          </div>

          {/* START */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Bắt đầu</label>
            <input
              type="datetime-local"
              className={styles.dcUpd__input}
              value={form.startDate ?? ""}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value || null })
              }
            />
          </div>

          {/* END */}
          <div className={styles.dcUpd__field}>
            <label className={styles.dcUpd__label}>Kết thúc</label>
            <input
              type="datetime-local"
              className={styles.dcUpd__input}
              value={form.endDate ?? ""}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value || null })
              }
            />
          </div>

          {/* ACTIVE */}
          <div className={`${styles.dcUpd__checkboxRow} ${styles.dcUpd__full}`}>
            <label className={styles.dcUpd__checkboxLabel}>
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
              <span>Kích hoạt</span>
            </label>
          </div>

          {/* ACTIONS */}
          <div className={`${styles.dcUpd__actions} ${styles.dcUpd__full}`}>
            <button
              type="submit"
              className={styles.dcUpd__submit}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Cập nhật"}
            </button>
            <button
              type="button"
              className={styles.dcUpd__cancel}
              onClick={() => navigate("/admin/discounts")}
            >
              Hủy
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default DiscountUpdate;
// services/DiscountService.ts