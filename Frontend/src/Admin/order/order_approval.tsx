import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./order_approval.module.css";

/* ================= TYPES ================= */
interface DonHang {
  idDon: number;
  ngayDat?: string;
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  trangThai: string;
}

/* ================= COMPONENT ================= */
const PendingOrders = () => {
  const navigate = useNavigate();

  /* ===== STATE ===== */
  const [orders, setOrders] = useState<DonHang[]>([]);
  const [search, setSearch] = useState("");
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);

  /* ===== MOCK DATA ===== */
  useEffect(() => {
    setOrders([
      {
        idDon: 101,
        ngayDat: "2024-09-01",
        tenNguoiNhan: "Nguyễn Văn A",
        sdtNguoiNhan: "0981234567",
        trangThai: "Chưa duyệt",
      },
      {
        idDon: 102,
        ngayDat: "2024-09-02",
        tenNguoiNhan: "Trần Thị B",
        sdtNguoiNhan: "0912345678",
        trangThai: "Đã duyệt",
      },
    ]);
  }, []);

  /* ===== CLICK OUTSIDE → CLOSE DROPDOWN ===== */
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenStatusId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ===== SEARCH FILTER ===== */
  const filteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    return orders.filter(o =>
      JSON.stringify(o).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, orders]);

  /* ===== UPDATE STATUS ===== */
  const updateTrangThai = (idDon: number, newStatus: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.idDon === idDon ? { ...o, trangThai: newStatus } : o
      )
    );
    setOpenStatusId(null);
    alert(`✅ Cập nhật trạng thái: ${newStatus}`);
  };

  const getStatusClass = (status: string) => {
  switch (status) {
    case "Chưa duyệt":
      return styles.pending;
    case "Đã duyệt":
      return styles.approved;
    case "Đang giao":
      return styles.shipping;
    case "Hoàn thành":
      return styles.completed;
    case "Đã hủy":
      return styles.cancelled;
    case "Đã từ chối":
      return styles.rejected;
    default:
      return styles.pending;
  }
};

  /* ================= RENDER ================= */
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* ===== HEADER ===== */}
        <div className={styles["content-header"]}>
          <h1 className={styles["content-title"]}>
            Danh sách đơn hàng chờ duyệt
          </h1>
        </div>

        {/* ===== SEARCH ===== */}
        <div className={styles["search-bar"]}>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Tìm kiếm đơn hàng"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <i className={`ri-search-line ${styles["search-icon"]}`}></i>
        </div>

        {/* ===== TABLE ===== */}
        <div className={styles["data-table"]}>
          <div className={styles["table-header"]}>
            <div>Mã đơn hàng</div>
            <div>Ngày đặt</div>
            <div>Người nhận</div>
            <div>SĐT</div>
            <div>Trạng thái</div>
            <div>Thao tác</div>
          </div>

          {filteredOrders.length > 0 ? (
            filteredOrders.map(don => (
              <div className={styles["table-row"]} key={don.idDon}>
                <div>#{don.idDon}</div>
                <div>
                  {don.ngayDat
                    ? new Date(don.ngayDat).toLocaleDateString("vi-VN")
                    : ""}
                </div>
                <div>{don.tenNguoiNhan}</div>
                <div>{don.sdtNguoiNhan}</div>

                {/* ===== STATUS ===== */}
                <div className={styles["status-cell"]}>
                        <span
                            className={`${styles.statusBadge} ${getStatusClass(don.trangThai)}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenStatusId(
                                    openStatusId === don.idDon ? null : don.idDon
                                );
                            }}
                        >
                            {don.trangThai}
                        </span>


                  {openStatusId === don.idDon && (
                    <div
                      className={styles["status-menu"]}
                      onClick={e => e.stopPropagation()}
                    >
                      <select
                        value={don.trangThai}
                        onChange={e =>
                          updateTrangThai(don.idDon, e.target.value)
                        }
                      >
                        <option>Chưa duyệt</option>
                        <option>Đã duyệt</option>
                        <option>Đang giao</option>
                        <option>Hoàn thành</option>
                        <option>Đã từ chối</option>
                        <option>Đã hủy</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* ===== ACTION ===== */}
                <div className={styles.action}>
                        <button
                            className={styles.viewDetailBtn}
                            onClick={() => navigate(`/orders/${don.idDon}`)}
                        >
                            <i className="ri-eye-line"></i>
                            Xem chi tiết
                        </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles["table-row"]}>
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                Không có đơn hàng nào chờ duyệt
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingOrders;
