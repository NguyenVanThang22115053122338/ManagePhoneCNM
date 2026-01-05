import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./order_approval.module.css";

type TrangThai = "Chưa duyệt" | "Chờ duyệt" | "Đã duyệt" | "Đang giao" | "Hoàn thành" | "Đã từ chối" | "Đã hủy";

interface DonHang {
  idDon: number;
  ngayDat?: string; // ISO string
  tenNguoiNhan: string;
  sdtNguoiNhan: string;
  diaChiNhan: string;
  ghiChu?: string;
  trangThai: TrangThai | string;
}

interface ChiTietDonHang {
  tenSanPham: string;
  donGia: number;
  soLuong: number;
  thanhTien: number;
  hinhAnh?: string | null;
}

interface OrderDetailVM {
  donHang: DonHang;
  chiTietDonHang: ChiTietDonHang[];
  tongTien: number;
  phiVanChuyen: number;
  tienGiamGia: number;
  thanhTien: number;
  phuongThucThanhToan: string;
}

type ModalType = "approve" | "reject" | null;

const formatVND = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ===== STATE ===== */
  const [data, setData] = useState<OrderDetailVM | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalTitle, setModalTitle] = useState("Xác nhận");
  const [modalMessage, setModalMessage] = useState("Bạn có chắc chắn muốn thực hiện hành động này?");
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  /* ===== MOCK DATA (thay bằng API sau) ===== */
  useEffect(() => {
    const idDon = Number(id);

    const vm: OrderDetailVM = {
      donHang: {
        idDon,
        ngayDat: "2025-06-16",
        tenNguoiNhan: "Nguyễn Văn Thắng",
        sdtNguoiNhan: "0912345678",
        diaChiNhan: "Đà Nẵng",
        ghiChu: "",
        trangThai: "Chưa duyệt",
      },
      chiTietDonHang: [
        {
          tenSanPham: "iPhone 15 Pro Max",
          donGia: 32990000,
          soLuong: 1,
          thanhTien: 32990000,
          hinhAnh: "https://via.placeholder.com/100x100?text=No+Image",
        },
        {
          tenSanPham: "Ốp lưng MagSafe",
          donGia: 990000,
          soLuong: 2,
          thanhTien: 1980000,
          hinhAnh: null,
        },
      ],
      tongTien: 32990000 + 1980000,
      phiVanChuyen: 30000,
      tienGiamGia: 50000,
      thanhTien: (32990000 + 1980000) + 30000 - 50000,
      phuongThucThanhToan: "Thanh toán qua chuyển khoản ngân hàng",
    };

    setData(vm);
  }, [id]);

  /* ===== DERIVED ===== */
  const canApproveReject = useMemo(() => {
    const st = data?.donHang.trangThai;
    return st === "Chưa duyệt" || st === "Chờ duyệt";
  }, [data?.donHang.trangThai]);

  /* ===== MODAL CONTROL ===== */
  const openApproveModal = () => {
    if (!data) return;
    setModalType("approve");
    setModalTitle("Duyệt đơn hàng");
    setModalMessage(`Bạn có chắc chắn muốn duyệt đơn hàng #${data.donHang.idDon}?`);
    setShowModal(true);
  };

  const openRejectModal = () => {
    if (!data) return;
    setModalType("reject");
    setModalTitle("Từ chối đơn hàng");
    setModalMessage(`Bạn có chắc chắn muốn từ chối đơn hàng #${data.donHang.idDon}?`);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setLyDoTuChoi("");
  };

  const onConfirm = async () => {
    if (!data || !modalType) return;

    try {
      if (modalType === "approve") {
        // TODO: gọi API duyệt: POST /DuyetDonHang/Duyet/{idDon}
        alert(`✅ Đã duyệt đơn #${data.donHang.idDon}`);
      } else {
        // TODO: gọi API từ chối: POST /DuyetDonHang/TuChoi/{idDon} + body { lyDoTuChoi }
        alert(`❌ Đã từ chối đơn #${data.donHang.idDon}\nLý do: ${lyDoTuChoi || "(trống)"}`);
      }

      // Sau khi confirm thì quay lại list
      navigate("/orders"); // đổi route theo project của bạn
    } finally {
      closeModal();
    }
  };

  if (!data) return null;

  const { donHang, chiTietDonHang, tongTien, phiVanChuyen, tienGiamGia, thanhTien, phuongThucThanhToan } = data;

  return (
    <div className={styles.container}>
      {/* ===== Chi tiết đơn hàng ===== */}
      <div className={styles.page}>
        {/* HEADER */}
        <div className={styles["order-header"]}>
          <button
            type="button"
            className={styles["back-btn"]}
            onClick={() => navigate("/orders")} // đổi route theo list của bạn
          >
            <i className="ri-arrow-left-line" />
            Chi tiết đơn hàng
          </button>

          <div className={styles["approval-btns"]}>
            <h2>Duyệt đơn hàng:</h2>

            {canApproveReject && (
              <>
                <button
                  type="button"
                  className={styles["approve-btn"]}
                  onClick={openApproveModal}
                  aria-label="Duyệt đơn"
                >
                  <i className="ri-check-line" />
                </button>

                <button
                  type="button"
                  className={styles["reject-btn"]}
                  onClick={openRejectModal}
                  aria-label="Từ chối đơn"
                >
                  <i className="ri-close-line" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* BODY CONTAINER (giống Razor có 1 container bọc) */}
        <div className={styles.containerInner}>
          {/* ORDER INFO */}
          <div className={styles["order-info"]}>
            <Info label="Mã đơn hàng" value={`#${donHang.idDon}`} />
            <Info
              label="Ngày đặt hàng"
              value={donHang.ngayDat ? new Date(donHang.ngayDat).toLocaleDateString("vi-VN") : ""}
            />
            <Info label="Họ tên người nhận" value={donHang.tenNguoiNhan} />
            <Info label="Số điện thoại" value={donHang.sdtNguoiNhan} />
            <Info label="Địa chỉ nhận hàng" value={donHang.diaChiNhan} />
            <Info label="Ghi chú" value={donHang.ghiChu ?? ""} />
            <Info label="Trạng thái đơn hàng" value={donHang.trangThai} />
          </div>

          {/* PRODUCTS LIST */}
          <div className={styles["products-list"]}>
            {chiTietDonHang?.length > 0 &&
              chiTietDonHang.map((item, idx) => (
                <div className={styles["product-item"]} key={idx}>
                  <div className={styles["product-image"]}>
                    <img
                      src={
                        item.hinhAnh && item.hinhAnh.trim() !== ""
                          ? item.hinhAnh
                          : "https://via.placeholder.com/100x100?text=No+Image"
                      }
                      alt={item.tenSanPham}
                    />
                  </div>

                  <div className={styles["product-details"]}>
                    <div className={styles["product-name"]}>{item.tenSanPham}</div>
                    <div className={styles["product-price"]}>{formatVND(item.donGia)}</div>
                    <div className={styles["product-quantity"]}>Số lượng: x {item.soLuong}</div>
                  </div>

                  <div className={styles["product-total"]}>{formatVND(item.thanhTien)}</div>
                </div>
              ))}
          </div>

          {/* ORDER SUMMARY (PHẦN TIỀN RIÊNG - như Razor) */}
          <div className={styles["order-summary"]}>
            <div className={styles["summary-row"]}>
              <div>Tổng tiền hàng</div>
              <div>{formatVND(tongTien)}</div>
            </div>

            <div className={styles["summary-row"]}>
              <div>Phí vận chuyển</div>
              <div>{formatVND(phiVanChuyen)}</div>
            </div>

            <div className={styles["summary-row"]}>
              <div>Tiền giảm giá</div>
              <div>{formatVND(tienGiamGia)}</div>
            </div>

            <div className={styles["summary-row"]}>
              <div>Phương thức thanh toán</div>
              <div>{phuongThucThanhToan}</div>
            </div>

            <div className={`${styles["summary-row"]} ${styles["total-row"]}`}>
              <div>Thành tiền</div>
              <div>{formatVND(thanhTien)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal xác nhận ===== */}
      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            <p>{modalMessage}</p>

            {modalType === "reject" && (
              <div className={styles["reject-reason"]}>
                <label>Lý do từ chối:</label>
                <textarea
                  rows={3}
                  value={lyDoTuChoi}
                  onChange={(e) => setLyDoTuChoi(e.target.value)}
                  style={{ width: "100%", marginTop: 5 }}
                />
              </div>
            )}

            <div className={styles["modal-buttons"]}>
              <button type="button" className={`${styles.btn} ${styles["btn-primary"]}`} onClick={onConfirm}>
                Xác nhận
              </button>

              <button type="button" className={`${styles.btn} ${styles["btn-secondary"]}`} onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== components phụ: info item ===== */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles["info-item"]}>
      <div className={styles["info-label"]}>{label}</div>
      <div className={styles["info-value"]}>{value}</div>
    </div>
  );
}

export default OrderDetailPage;
