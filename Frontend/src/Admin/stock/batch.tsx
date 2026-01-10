import { useEffect, useState } from "react";
import styles from "./batch.module.css";
import BatchService from "../../services/BatchService";
import type { IBatch } from "../../services/Interface";

/* ================= COMPONENT ================= */
const Batch = () => {
  /* ===== DATA ===== */
  const [data, setData] = useState<IBatch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== PAGINATION FROM BACKEND ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  /* ===== FETCH DATA FROM API ===== */
  useEffect(() => {
    fetchBatches();
  }, [currentPage, search]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await BatchService.getBatches(currentPage, search);

      setData(response.data || []);
      setCurrentPage(response.meta.current_page || 1);
      setLastPage(response.meta.last_page || 1);
      setTotal(response.meta.total || 0);
      setFrom(response.meta.from || 0);
      setTo(response.meta.to || 0);
    } catch (error: any) {
      console.error("Fetch batches error:", error);
      alert(`Lỗi khi tải dữ liệu: ${error.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===== SEARCH HANDLER ===== */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* ===== HEADER ===== */}
      <div className={styles["content-header"]}>
        <div className={styles["content-title-container"]}>
          <a href="/Admin/stock_management">
            <h1 className={styles["content-title"]}>Quản lý kho</h1>
          </a>
          <h1 className={`${styles["content-title"]} ${styles.active}`}>|</h1>
          <h1 className={`${styles["content-title"]} ${styles.active}`}>
            Xem lô hàng
          </h1>
        </div>

        <div className={styles["search-bar"]}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className={styles.container}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>⏳ Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className={styles["accounts-table"]}>
            <table>
              <thead>
                <tr>
                  <th>ID Lô</th>
                  <th>ID Sản Phẩm</th>
                  <th>Giá nhập</th>
                  <th>Ngày sản xuất</th>
                  <th>Hạn sử dụng</th>
                  <th>Số lượng</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((item: IBatch) => (
                    <tr key={item.batchID}>
                      <td>{item.batchID}</td>
                      <td>{item.productID}</td>
                      <td>
                        {item.priceIn.toLocaleString("vi-VN")} đ
                      </td>
                      <td>
                        {new Date(item.productionDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        {new Date(item.expiry).toLocaleDateString("vi-VN")}
                      </td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr className={styles["no-data-row"]}>
                    <td colSpan={6} className={styles["no-data"]}>
                      Không tìm thấy dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== PAGINATION ===== */}
        <div className={styles["pagination-container"]}>
          <div className={styles["page-info"]}>
            {total === 0
              ? "Không có dữ liệu"
              : `Hiển thị ${from} - ${to} của ${total} kết quả`}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              className={styles["pagination-button"]}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <span className={styles["page-number"]}>
              Trang {currentPage} / {lastPage}
            </span>

            <button
              className={styles["pagination-button"]}
              disabled={currentPage >= lastPage || lastPage === 0}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batch;
