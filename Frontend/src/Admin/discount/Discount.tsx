import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscountService from "../../services/DiscountService";
import type { Discount } from "../../services/Interface";
import styles from "./discount.module.css";

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const res = await DiscountService.getAll();
    setDiscounts(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Quản lý mã giảm giá</h1>
          <p>Tổng cộng {discounts.length} mã</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/discounts/add")}
        >
          + Thêm mã giảm giá
        </button>
      </div>

      {/* TABLE */}
      <section className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đã dùng</th>
              <th>Giới hạn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Chưa có mã giảm giá
                </td>
              </tr>
            ) : (
                discounts.map((d) => {
                  const used = d.usedCount ?? 0;
                  const limit = d.usageLimit ?? Infinity;
                  const isOut = used >= limit;

                  return (
                    <tr
                      key={d.id}
                      className={isOut ? styles.rowDisabled : ""}
                    >
                    <td className={styles.code}>{d.code}</td>

                    <td>
                      <span className={styles.badge}>
                        {d.type}
                      </span>
                    </td>

                    <td className={styles.value}>
                      {d.type === "PERCENT"
                        ? `${d.value}%`
                        : `${d.value.toLocaleString()} ₫`}
                    </td>

                    <td>{d.usedCount ?? 0}</td>

                    <td>{d.usageLimit ?? "∞"}</td>

                    <td>
                      {d.active && !isOut ? (
                        <span className={styles.active}>Hoạt động</span>
                      ) : (
                        <span className={styles.inactive}>Ngừng</span>
                      )}
                    </td>

                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          navigate(`/admin/discounts/${d.id}/update`)
                        }
                      >
                        ✏
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={async () => {
                          if (!confirm("Xóa mã giảm giá này?")) return;
                          await DiscountService.delete(d.id!);
                          loadData();
                        }}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default DiscountPage;
