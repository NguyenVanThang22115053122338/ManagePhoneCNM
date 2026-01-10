import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stockout_receipt.module.css";

const StockoutReceipt = () => {
  const navigate = useNavigate();

  /* ===== FORM STATE ===== */
  const [idLo, setIdLo] = useState("");
  const [soLuong, setSoLuong] = useState<number>(1);
  const [ghiChu, setGhiChu] = useState("");

  /* ===== SUBMIT ===== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idLo,
      soLuong,
      ghiChu,
    };

    console.log("Phiếu xuất kho:", payload);

    // TODO: call API
    // axios.post("/QuanLyKho/ThemPhieuXuat", payload)

    alert("✅ Thêm phiếu xuất kho thành công");
    navigate("/admin/stock_management");
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* HEADER */}
      <div className={styles["content-header"]}>
        <div
          className={styles["content-header"]}
          onClick={() => navigate("/admin/stock_management")}
          style={{ cursor: "pointer" }}
        >
          <div className={styles["back-button"]}>
            <i className="fas fa-chevron-left"></i>
          </div>
          <h1 className={styles["content-title"]}>Quản lý kho</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* TABS */}
        <div className={styles["tabs-container"]}>
          <div
            className={styles.tab}
            onClick={() => navigate("/admin/stockin_receipt")}
          >
            Nhập kho
          </div>
          <div className={`${styles.tab} ${styles.active}`}>
            Xuất kho
          </div>
        </div>

        {/* FORM */}
        <div className={styles["form-container"]}>
          <form onSubmit={handleSubmit}>
            <div className={`${styles["form-row"]} ${styles["form-row-2-col"]}`}>
              <div className={styles["form-col"]}>
                <label className={styles["form-row-label"]}>
                  ID Lô
                </label>
                <input
                  type="text"
                  className={styles["form-input"]}
                  value={idLo}
                  onChange={e => setIdLo(e.target.value)}
                  required
                />
              </div>

              <div className={styles["form-col"]}>
                <label className={styles["form-row-label"]}>
                  Số lượng xuất
                </label>
                <input
                  type="number"
                  className={styles["form-input"]}
                  min={1}
                  value={soLuong}
                  onChange={e => setSoLuong(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className={styles["form-row"]}>
              <label className={styles["form-row-label"]}>
                Ghi chú khác (nếu cần)
              </label>
              <textarea
                className={styles["form-textarea"]}
                value={ghiChu}
                onChange={e => setGhiChu(e.target.value)}
              />
            </div>

            <button type="submit" className={styles["submit-button"]}>
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default StockoutReceipt;
