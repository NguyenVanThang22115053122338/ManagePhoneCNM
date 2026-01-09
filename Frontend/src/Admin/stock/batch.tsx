import { useEffect, useMemo, useState } from "react";
import styles from "./batch.module.css";

/* ================= TYPES ================= */
interface SanPham {
  idSanPham: number;
  tenSanPham: string;
  donGia: number;
}

interface LoHang {
  idLo: number;
  idSanPham: number;
  sanPham: SanPham;
  ngaySanXuat?: string;
  hanSuDung?: string;
  soLuong: number;
}

/* ================= COMPONENT ================= */
const Batch = () => {
  /* ===== DATA ===== */
  const [data, setData] = useState<LoHang[]>([]);
  const [search, setSearch] = useState("");

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ===== MOCK DATA (thay API sau) ===== */
  useEffect(() => {
    setData([
      {
        idLo: 1,
        idSanPham: 101,
        sanPham: { idSanPham: 101, tenSanPham: "iPhone 15", donGia: 32990000 },
        ngaySanXuat: "2024-01-01",
        hanSuDung: "2026-01-01",
        soLuong: 50,
      },
      {
        idLo: 2,
        idSanPham: 102,
        sanPham: { idSanPham: 102, tenSanPham: "Samsung S24", donGia: 25990000 },
        ngaySanXuat: "2024-02-10",
        hanSuDung: "2026-02-10",
        soLuong: 30,
      },
    ]);
  }, []);

  /* ===== SEARCH FILTER (GIỐNG JS GỐC – chỉ tìm tên SP) ===== */
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(item =>
      item.sanPham.tenSanPham
        .toLowerCase()
        .includes(search.toLowerCase())
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
        <div className={styles["accounts-table"]}>
          <table>
            <thead>
              <tr>
                <th>ID Lô</th>
                <th>ID Sản Phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Ngày sản xuất</th>
                <th>Hạn sử dụng</th>
                <th>Số lượng</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length > 0 ? (
                pageData.map(item => (
                  <tr key={item.idLo}>
                    <td>{item.idLo}</td>
                    <td>{item.idSanPham}</td>
                    <td>{item.sanPham.tenSanPham}</td>
                    <td>
                      {item.sanPham.donGia.toLocaleString("vi-VN")}
                    </td>
                    <td>
                      {item.ngaySanXuat
                        ? new Date(item.ngaySanXuat).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td>
                      {item.hanSuDung
                        ? new Date(item.hanSuDung).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td>{item.soLuong}</td>
                  </tr>
                ))
              ) : (
                <tr className={styles["no-data-row"]}>
                  <td colSpan={7} className={styles["no-data"]}>
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
