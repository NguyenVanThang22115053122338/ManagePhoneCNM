import React, { useEffect } from "react";
import styles from "./inventory_quantity.module.css";

/* ===================== TYPES ===================== */
interface SanPham {
  IDSanPham: number;
  TenSanPham: string;
  HinhAnh?: string;
  SoLuong: number;
}

interface NhaCungCap {
  TenNCC: string;
}

interface LoSanXuat {
  IDLo: number;
  HanSuDung?: string | null;
}

interface ThongKeTonKhoItem {
  sanPham: SanPham;
  nhaCungCap: NhaCungCap;
  loSanXuat: LoSanXuat;
}

interface Props {
  model: ThongKeTonKhoItem[];
  danhSachNam: number[];
  namDuocChon?: number;
  thangDuocChon?: number;
  ngayDuocChon?: number;
}

/* ===================== COMPONENT ===================== */
const InventoryQuantity: React.FC<Props> = ({
  model,
  danhSachNam,
  namDuocChon,
  thangDuocChon,
  ngayDuocChon
}) => {
  /* ===== JS logic giữ nguyên ===== */
  useEffect(() => {
    const redirectThongKe = () => {
      const year =
        (document.getElementById("yearSelect") as HTMLSelectElement)?.value ||
        0;
      const month =
        (document.getElementById("monthSelect") as HTMLSelectElement)?.value ||
        0;
      const day =
        (document.getElementById("daySelect") as HTMLSelectElement)?.value || 0;

      window.location.href = `/ThongKe/ThongKeSoLuongTonKho?nam=${year}&thang=${month}&ngay=${day}`;
    };

    const yearSelect = document.getElementById("yearSelect");
    const monthSelect = document.getElementById("monthSelect");
    const daySelect = document.getElementById("daySelect");

    yearSelect?.addEventListener("change", redirectThongKe);
    monthSelect?.addEventListener("change", redirectThongKe);
    daySelect?.addEventListener("change", redirectThongKe);

    return () => {
      yearSelect?.removeEventListener("change", redirectThongKe);
      monthSelect?.removeEventListener("change", redirectThongKe);
      daySelect?.removeEventListener("change", redirectThongKe);
    };
  }, []);

  return (
    <main className={styles["main-content"]}>
      <div className={styles["Title"]}>
        <h1>Thống kê</h1>
      </div>

      <div className={styles["filters"]}>
        <div className={styles["han-su-dung-filters"]}>Hạn sử dụng :</div>

        <select id="yearSelect" defaultValue={namDuocChon ?? ""}>
          <option value="">-- Không chọn năm --</option>
          {danhSachNam.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select id="monthSelect" defaultValue={thangDuocChon ?? ""}>
          <option value="">-- Không chọn tháng --</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <option key={m} value={m}>
              Tháng {m}
            </option>
          ))}
        </select>

        <select id="daySelect" defaultValue={ngayDuocChon ?? ""}>
          <option value="">-- Không chọn tháng --</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>
              Ngày {d}
            </option>
          ))}
        </select>
      </div>

      <div className={styles["stats-container"]}>
        <nav
          className={styles["stats-nav"]}
          role="tablist"
          aria-label="Chọn loại thống kê"
        >
          <button role="tab" aria-selected="true" tabIndex={0}>
            <a href="/ThongKe/ThongKeDoanhThuVaSoLuongDon">
              Thống kê số lượng đơn hàng và doanh thu
            </a>
          </button>

          <button
            className={styles["active"]}
            role="tab"
            aria-selected="false"
            tabIndex={-1}
          >
            <a href="/ThongKe/ThongKeSoLuongTonKho">
              Thống kê số lượng tồn kho
            </a>
          </button>

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeGiaTriSanPhamTheoThoiGian">
              Thống kê giá sản phẩm
            </a>
          </button>

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeSoLuongSanPhamTheoNhaCungCap">
              Số lượng sản phẩm theo nhà cung cấp
            </a>
          </button>

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeTrangThaiDonHangTheoThoiGian">
              Thống kê đơn hàng đã hủy/ đã hoàn thành
            </a>
          </button>
        </nav>

        <div className={styles["table-container"]}>
          <table>
            <thead>
              <tr>
                <th className={styles["stt"]}>Mã sản phẩm</th>
                <th className={styles["nha-cung-cap"]}>Nhà cung cấp</th>
                <th className={styles["ten-san-pham"]}>Tên sản phẩm</th>
                <th className={styles["hinh-anh"]}>Hình ảnh</th>
                <th className={styles["don-gia"]}>Số lượng tồn kho</th>
                <th className={styles["so-luong"]}>Lô</th>
                <th className={styles["han-su-dung"]}>Hạn sử dụng</th>
              </tr>
            </thead>

            <tbody>
              {model.map((item, index) => (
                <tr key={index}>
                  <td className={styles["ma-san-pham"]}>
                    {item.sanPham.IDSanPham}
                  </td>

                  <td className={styles["nha-cung-cap"]}>
                    {item.nhaCungCap.TenNCC}
                  </td>

                  <td className={styles["ten-san-pham"]}>
                    {item.sanPham.TenSanPham}
                  </td>

                  <td className={styles["hinh-anh"]}>
                    {item.sanPham.HinhAnh ? (
                      <img
                        src={item.sanPham.HinhAnh}
                        alt="Ảnh sản phẩm"
                        className={styles["rounded-img"]}
                        title={item.sanPham.TenSanPham}
                      />
                    ) : (
                      <img
                        src="/Uploads/placeholder.jpg"
                        alt="Không có ảnh"
                        className={styles["rounded-img"]}
                        title="Không có ảnh"
                      />
                    )}
                  </td>

                  <td className={styles["so-luong-ton-kho"]}>
                    {item.sanPham.SoLuong}
                  </td>

                  <td className={styles["lo"]}>{item.loSanXuat.IDLo}</td>

                  <td className={styles["han-su-dung"]}>
                    {item.loSanXuat.HanSuDung
                      ? new Date(item.loSanXuat.HanSuDung).toLocaleDateString(
                          "vi-VN"
                        )
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default InventoryQuantity;
