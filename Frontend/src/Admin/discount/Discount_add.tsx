import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscountService from "../../services/DiscountService";
import type { Discount } from "../../services/Interface";
import styles from "./discount_add.module.css";

const DiscountAdd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<Discount>({
    code: "",
    type: "PERCENT",
    value: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    startDate: null,
    endDate: null,
    active: true
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim()) {
      alert("Code không được để trống");
      return;
    }

    if (form.type === "PERCENT" && form.value > 100) {
      alert("Giảm % không được vượt quá 100");
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      alert("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    try {
      setSaving(true);
      await DiscountService.create(form);
      navigate("/admin/discounts");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.dcAdd__page}>
      <section className={styles.dcAdd__card}>
        <h1 className={styles.dcAdd__title}>Thêm Discount</h1>

        <form className={styles.dcAdd__form} onSubmit={handleSubmit}>
          {/* Code */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Code</label>
            <input
              className={styles.dcAdd__input}
              placeholder="VD: SALE10, TET2026"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
              required
            />
          </div>

          {/* Type */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Loại</label>
            <select
              className={styles.dcAdd__input}
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

          {/* Value */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Giá trị</label>
            <input
              type="number"
              min={0}
              className={styles.dcAdd__input}
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
              required
            />
          </div>

          {/* Max discount */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Giảm tối đa</label>
            <input
              type="number"
              className={styles.dcAdd__input}
              placeholder="Không giới hạn"
              disabled={form.type !== "PERCENT"}
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

          {/* Usage limit */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Số lượt dùng</label>
            <input
              type="number"
              className={styles.dcAdd__input}
              placeholder="Không giới hạn"
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

          {/* Start */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Bắt đầu</label>
            <input
              type="datetime-local"
              className={styles.dcAdd__input}
              value={form.startDate ?? ""}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value || null })
              }
            />
          </div>

          {/* End */}
          <div className={styles.dcAdd__field}>
            <label className={styles.dcAdd__label}>Kết thúc</label>
            <input
              type="datetime-local"
              className={styles.dcAdd__input}
              value={form.endDate ?? ""}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value || null })
              }
            />
          </div>
{/* ACTIVE */}
<div className={`${styles.dcAdd__checkboxRow} ${styles.dcAdd__full}`}>
  <label className={styles.dcAdd__checkboxLabel}>
    <input
      type="checkbox"
      checked={form.active}
      onChange={(e) =>
        setForm({ ...form, active: e.target.checked })
      }
    />
    <span>Kích hoạt</span>
  </label>
</div>


          {/* Actions */}
          <div className={`${styles.dcAdd__actions} ${styles.dcAdd__full}`}>
            <button
              type="submit"
              className={styles.dcAdd__submit}
              disabled={saving}
            >
              {saving ? "Đang lưu..." : "Tạo mới"}
            </button>
            <button
              type="button"
              className={styles.dcAdd__cancel}
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

export default DiscountAdd;
