import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./stockin_receipt.module.css";
import type { IStockInRequest } from "../../services/Interface";
import StockInService from "../../services/StockInServices";

/* ================= COMPONENT ================= */
const StockinReceipt = () => {
  const navigate = useNavigate();

  /* ===== FORM STATE ===== */
  const [productId, setProductId] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [priceIn, setPriceIn] = useState<number>(1);
  const [expiry, setExpiry] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: IStockInRequest = {
      productId: Number(productId),
      productionDate,
      quantity,
      priceIn,
      expiry,
      note,
    };

    console.log("📦 Phiếu nhập kho:", payload);

    setIsLoading(true);
    try {
      await StockInService.createStockIn(payload);
      alert("✅ Thêm phiếu nhập kho thành công!");
      navigate("/Admin/stock_management");
    } catch (error: any) {
      console.error("Error creating stock in:", error);
      alert(`❌ Lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
                value={productId}
                onChange={e => setProductId(e.target.value)}
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
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
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
              value={priceIn}
              onChange={e => setPriceIn(Number(e.target.value))}
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
                value={productionDate}
                onChange={e => setProductionDate(e.target.value)}
              />
            </div>

            <div className={styles["form-col"]}>
              <label className={styles["form-row-label"]}>
                Hạn sử dụng (ngày)
              </label>
              <input
                type="date"
                className={styles["form-input"]}
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
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
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className={styles["submit-button"]}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockinReceipt;
