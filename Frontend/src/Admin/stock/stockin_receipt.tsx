import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stockin_receipt.module.css";

/* ================= COMPONENT ================= */
const StockinReceipt = () => {
  const navigate = useNavigate();

  /* ===== FORM STATE ===== */
  const [idSanPham, setIdSanPham] = useState("");
  const [soLuong, setSoLuong] = useState<number>(1);
  const [donGia, setDonGia] = useState<number>(1);
  const [ngaySanXuat, setNgaySanXuat] = useState("");
  const [hanSuDung, setHanSuDung] = useState("");
  const [ghiChu, setGhiChu] = useState("");

  /* ===== SUBMIT ===== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      idSanPham,
      soLuong,
      donGia,
      ngaySanXuat,
      hanSuDung,
      ghiChu,
    };

    console.log("📦 Phiếu nhập kho:", payload);

    // TODO: axios.post("/QuanLyKho/ThemPhieuNhap", payload)

    alert("✅ Thêm phiếu nhập kho thành công!");
    navigate("/stock_management");
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* ===== HEADER ===== */}
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
        {/* ===== TABS ===== */}
        <div className={styles["tabs-container"]}>
          <div className={`${styles.tab} ${styles.active}`}>
            Nhập kho
          </div>
          <div
            className={styles.tab}
            onClick={() => navigate("/admin/stockout_receipt")}
            style={{ cursor: "pointer" }}
          >
            Xuất kho
          </div>
        </div>

        {/* ===== FORM ===== */}
        <form
          className={styles["form-container"]}
          onSubmit={handleSubmit}
        >
          {/* ROW 1 */}
          <div className={`${styles["form-row"]} ${styles["form-row-2-col"]}`}>
            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                ID Sản Phẩm
              </label>
              <input
                type="text"
                className={styles["form-input"]}
                value={idSanPham}
                onChange={e => setIdSanPham(e.target.value)}
                placeholder="Nhập ID sản phẩm"
                required
              />
            </div>

            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Số lượng nhập
              </label>
              <input
                type="number"
                className={styles["form-input"]}
                min={1}
                value={soLuong}
                onChange={e => setSoLuong(Number(e.target.value))}
                placeholder="Số lượng nhập"
                required
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div className={styles["form-row"]}>
            <label className={styles["form-row-label"]}>
              Đơn giá
            </label>
            <input
              type="number"
              className={styles["form-input"]}
              min={1}
              value={donGia}
              onChange={e => setDonGia(Number(e.target.value))}
              placeholder="Đơn giá"
              required
            />
          </div>

          {/* ROW 3 */}
          <div className={`${styles["form-row"]} ${styles["form-row-2-col"]}`}>
            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Ngày sản xuất (ngày)
              </label>
              <input
                type="date"
                className={styles["form-input"]}
                value={ngaySanXuat}
                onChange={e => setNgaySanXuat(e.target.value)}
              />
            </div>

            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Hạn sử dụng (ngày)
              </label>
              <input
                type="date"
                className={styles["form-input"]}
                value={hanSuDung}
                onChange={e => setHanSuDung(e.target.value)}
              />
            </div>
          </div>

          {/* ROW 4 */}
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

          {/* SUBMIT */}
          <button type="submit" className={styles["submit-button"]}>
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockinReceipt;
