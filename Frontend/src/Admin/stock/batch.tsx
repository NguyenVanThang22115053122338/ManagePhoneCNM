import { useEffect, useMemo, useState } from "react";
import styles from "./batch.module.css";
import BatchService from "../../services/BatchService";
import type { IBatch } from "../../services/Interface";

/* ================= COMPONENT ================= */
const Batch = () => {
  /* ===== DATA ===== */
  const [data, setData] = useState<IBatch[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ===== FETCH DATA FROM API ===== */
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const batches = await BatchService.getBatches();
      setData(batches);
    } catch (error: any) {
      console.error("Fetch batches error:", error);
      alert(`Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ===== SEARCH FILTER ===== */
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const searchLower = search.toLowerCase();
    return data.filter(item =>
      item.productID.toString().includes(searchLower) ||
      item.batchID.toString().includes(searchLower) ||
      item.quantity.toString().includes(searchLower)
    );
  }, [search, data]);

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
            onChange={e => setSearch(e.target.value)}
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
                {pageData.length > 0 ? (
                  pageData.map(item => (
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
            {filteredData.length === 0
              ? "Trang 0/0"
              : `Trang ${currentPage}/${totalPages}`}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              className={styles["pagination-button"]}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <button
              className={styles["pagination-button"]}
              disabled={currentPage >= totalPages || totalPages === 0}
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
