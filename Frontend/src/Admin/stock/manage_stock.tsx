import { useEffect, useState } from "react";
import styles from "./manage_stock.module.css";
import { useNavigate } from "react-router-dom";
import StockInService from "../../services/StockInServices";
import type { IStockIn } from "../../services/Interface";
import StockOutService from "../../services/StockOutServices";
import type { IStockOut } from "../../services/Interface";

type TabType = "nhap" | "xuat";


const StockManagement = () => {

  const [currentTab, setCurrentTab] = useState<TabType>("nhap");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  const [nhapData, setNhapData] = useState<IStockIn[]>([]);
  const [xuatData, setXuatData] = useState<IStockOut[]>([]);


  const [nhapCurrentPage, setNhapCurrentPage] = useState(1);
  const [nhapLastPage, setNhapLastPage] = useState(1);
  const [nhapTotal, setNhapTotal] = useState(0);
  const [nhapFrom, setNhapFrom] = useState(0);
  const [nhapTo, setNhapTo] = useState(0);


  const [xuatCurrentPage, setXuatCurrentPage] = useState(1);
  const [xuatLastPage, setXuatLastPage] = useState(1);
  const [xuatTotal, setXuatTotal] = useState(0);
  const [xuatFrom, setXuatFrom] = useState(0);
  const [xuatTo, setXuatTo] = useState(0);


  useEffect(() => {
    if (currentTab === "nhap") {
      fetchStockin();
      fetchStockout();
    } else {
      fetchStockin();
      fetchStockout();
    }
  }, [currentTab, search, nhapCurrentPage, xuatCurrentPage]);

  const fetchStockin = async () => {
    try {
      const response = await StockInService.getStockIns(nhapCurrentPage, search);
      setNhapData(response.data || []);
      setNhapCurrentPage(response.meta.current_page || 1);
      setNhapLastPage(response.meta.last_page || 1);
      setNhapTotal(response.meta.total || 0);
      setNhapFrom(response.meta.from || 0);
      setNhapTo(response.meta.to || 0);
    } catch (error: any) {
      console.error("Fetch stockin error:", error);
      alert(`Lỗi khi tải dữ liệu: ${error.message}`);
      setNhapData([]);
    }
  };

  const fetchStockout = async () => {
    try {
      const response = await StockOutService.getStockOuts(xuatCurrentPage, search);
      setXuatData(response.data || []);
      setXuatCurrentPage(response.meta.current_page || 1);
      setXuatLastPage(response.meta.last_page || 1);
      setXuatTotal(response.meta.total || 0);
      setXuatFrom(response.meta.from || 0);
      setXuatTo(response.meta.to || 0);
    } catch (error: any) {
      console.error("Fetch stockout error:", error);
      alert(`Lỗi khi tải dữ liệu: ${error.message}`);
      setXuatData([]);
    }
  };


  const handleSearchChange = (value: string) => {
    setSearch(value);

    setNhapCurrentPage(1);
    setXuatCurrentPage(1);
  };


  const currentData = currentTab === "nhap" ? nhapData : xuatData;
  const currentPage = currentTab === "nhap" ? nhapCurrentPage : xuatCurrentPage;
  const lastPage = currentTab === "nhap" ? nhapLastPage : xuatLastPage;
  const total = currentTab === "nhap" ? nhapTotal : xuatTotal;
  const from = currentTab === "nhap" ? nhapFrom : xuatFrom;
  const to = currentTab === "nhap" ? nhapTo : xuatTo;

  const setCurrentPage = (page: number) => {
    if (currentTab === "nhap") {
      setNhapCurrentPage(page);
    } else {
      setXuatCurrentPage(page);
    }
  };


  return (
    <div className={styles["main-content"]}>

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
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
      </div>


      <div className={styles["filter-tabs"]}>
        <button
          className={`${styles["filter-tab"]} ${currentTab === "nhap" ? styles.active : ""
            }`}
          onClick={() => setCurrentTab("nhap")}
        >
          <i className="fas fa-arrow-down"></i>
          Phiếu nhập kho
          <span className={styles["tab-count"]}>{nhapTotal}</span>
        </button>

        <button
          className={`${styles["filter-tab"]} ${currentTab === "xuat" ? styles.active : ""
            }`}
          onClick={() => setCurrentTab("xuat")}
        >
          <i className="fas fa-arrow-up"></i>
          Phiếu xuất kho
          <span className={styles["tab-count"]}>{xuatTotal}</span>
        </button>
      </div>


      <div className={styles.container}>
        <div className={styles["accounts-table"]}>
          <table>
            <thead>
              <tr>
                <th>{currentTab === "nhap" ? "ID Nhập" : "ID Xuất"}</th>
                <th>ID Lô</th>
                <th>{currentTab === "nhap" ? "Người nhập" : "Người xuất"}</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Ngày</th>
                <th>Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item: any) => (
                  <tr key={item.stockInID ?? item.stockOutID}>
                    <td>
                      <span className={styles["id-badge"]}>
                        #{item.stockInID ?? item.stockOutID}
                      </span>
                    </td>
                    <td>
                      <span className={styles["phone-badge"]}>{item.batchID}</span>
                    </td>
                    <td>{item.userName ?? ""}</td>
                    <td>{item.name ?? ""}</td>
                    <td>
                      <span
                        className={`${styles["quantity-badge"]} ${currentTab === "nhap"
                          ? styles.import
                          : styles.export
                          }`}
                      >
                        {currentTab === "nhap"
                          ? item.quantity
                          : item.quantity}
                      </span>
                    </td>
                    <td>
                      {item.date
                        ? new Date(
                          item.date
                        ).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>{item.note ?? ""}</td>
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


        <div className={styles["pagination-container"]}>
          <div className={styles["page-info"]}>
            {total === 0
              ? "Không có dữ liệu"
              : `Hiển thị ${from} - ${to} của ${total} kết quả`}
          </div>

          <div className={styles["pagination-controls"]}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <span className={styles["page-number"]}>
              Trang {currentPage} / {lastPage}
            </span>

            <button
              disabled={currentPage >= lastPage || lastPage === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
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
