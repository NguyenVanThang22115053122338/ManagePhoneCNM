import { useEffect, useMemo, useState } from "react";
import styles from "./manage_stock.module.css";
import { useNavigate } from "react-router-dom";


/* ================= TYPES ================= */
interface NhapKho {
  idNhap: number;
  sdt: string;
  hoVaTen: string;
  tenSanPham: string;
  soLuongNhap: number;
  ngayNhap?: string;
  ghiChu?: string;
}

interface XuatKho {
  idXuat: number;
  sdt: string;
  hoVaTen: string;
  tenSanPham: string;
  soLuongXuat: number;
  ngayXuat?: string;
  ghiChu?: string;
}

type TabType = "nhap" | "xuat";

/* ================= COMPONENT ================= */
const StockManagement = () => {
  /* ===== STATE ===== */
  const [currentTab, setCurrentTab] = useState<TabType>("nhap");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  const [nhapData, setNhapData] = useState<NhapKho[]>([]);
  const [xuatData, setXuatData] = useState<XuatKho[]>([]);

  /* ===== MOCK DATA (thay API sau) ===== */
  useEffect(() => {
    setNhapData([
      {
        idNhap: 1,
        sdt: "0981111111",
        hoVaTen: "Nguyễn Văn A",
        tenSanPham: "iPhone 15",
        soLuongNhap: 10,
        ngayNhap: "2025-06-01",
        ghiChu: "",
      },
      {
        idNhap: 2,
        sdt: "0982222222",
        hoVaTen: "Trần Thị B",
        tenSanPham: "Samsung S24",
        soLuongNhap: 5,
        ngayNhap: "2025-06-02",
        ghiChu: "Nhập bổ sung",
      },
    ]);

    setXuatData([
      {
        idXuat: 101,
        sdt: "0912345678",
        hoVaTen: "Nguyễn Văn Thắng",
        tenSanPham: "iPhone 15",
        soLuongXuat: 2,
        ngayXuat: "2025-06-10",
        ghiChu: "",
      },
    ]);
  }, []);

  /* ===== FILTER + SEARCH ===== */
  const sourceData = currentTab === "nhap" ? nhapData : xuatData;

  const filteredData = useMemo(() => {
    if (!search.trim()) return sourceData;
    return sourceData.filter(item =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, sourceData]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, search]);

  /* ================= RENDER ================= */
  return (
    <div className={styles["main-content"]}>
      {/* HEADER */}
      <div className={styles["content-header"]}>
        <div className={styles["content-title-container"]}>
          <h1 className={`${styles["content-title"]} ${styles.active}`}>
            Quản lý kho
          </h1>
          <h1 className={`${styles["content-title"]} ${styles.active}`}>|</h1>
          <a href="/Admin/batches">
            <h1 className={styles["content-title"]}>Xem lô hàng</h1>
          </a>
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

      {/* FILTER TABS */}
      <div className={styles["filter-tabs"]}>
        <button
          className={`${styles["filter-tab"]} ${currentTab === "nhap" ? styles.active : ""
            }`}
          onClick={() => setCurrentTab("nhap")}
        >
          <i className="fas fa-arrow-down"></i>
          Phiếu nhập kho
          <span className={styles["tab-count"]}>{nhapData.length}</span>
        </button>

        <button
          className={`${styles["filter-tab"]} ${currentTab === "xuat" ? styles.active : ""
            }`}
          onClick={() => setCurrentTab("xuat")}
        >
          <i className="fas fa-arrow-up"></i>
          Phiếu xuất kho
          <span className={styles["tab-count"]}>{xuatData.length}</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.container}>
        <div className={styles["accounts-table"]}>
          <table>
            <thead>
              <tr>
                <th>{currentTab === "nhap" ? "ID Nhập" : "ID Xuất"}</th>
                <th>SDT</th>
                <th>Họ tên</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Ngày</th>
                <th>Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length > 0 ? (
                pageData.map((item: any) => (
                  <tr key={item.idNhap ?? item.idXuat}>
                    <td>
                      <span className={styles["id-badge"]}>
                        #{item.idNhap ?? item.idXuat}
                      </span>
                    </td>
                    <td>
                      <span className={styles["phone-badge"]}>{item.sdt}</span>
                    </td>
                    <td>
                      <span className={styles["name-badge"]}>
                        {item.hoVaTen}
                      </span>
                    </td>
                    <td>{item.tenSanPham}</td>
                    <td>
                      <span
                        className={`${styles["quantity-badge"]} ${currentTab === "nhap"
                            ? styles.import
                            : styles.export
                          }`}
                      >
                        {currentTab === "nhap"
                          ? item.soLuongNhap
                          : item.soLuongXuat}
                      </span>
                    </td>
                    <td>
                      {item.ngayNhap || item.ngayXuat
                        ? new Date(
                          item.ngayNhap ?? item.ngayXuat
                        ).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>{item.ghiChu ?? ""}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles["no-data"]}>
                    <i className="fas fa-inbox"></i>
                    <p>Không có dữ liệu</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles["pagination-container"]}>
          <div className={styles["page-info"]}>
            Hiển thị{" "}
            {filteredData.length === 0
              ? 0
              : (currentPage - 1) * recordsPerPage + 1}
            -
            {Math.min(currentPage * recordsPerPage, filteredData.length)} của{" "}
            {filteredData.length}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? styles.active : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <button
            className={styles["add-account-btn"]}
            onClick={() => {
              if (currentTab === "nhap") {
                navigate("/admin/stockin_receipt");
              } else {
                navigate("/admin/stockout_receipt");
              }
            }}
          >
            <i className="fas fa-plus"></i>
            {currentTab === "nhap"
              ? "Thêm phiếu nhập"
              : "Thêm phiếu xuất"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default StockManagement;
