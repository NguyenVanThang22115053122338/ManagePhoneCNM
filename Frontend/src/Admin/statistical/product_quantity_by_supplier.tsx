import React from "react";
import styles from "./product_quantity_by_supplier.module.css";

/* ===================== TYPES ===================== */
interface NhaCungCap {
  TenNCC: string;
}

interface SanPham {
  TenSanPham: string;
  HinhAnh?: string;
  DonGia: number;
  SoLuong: number;
}

interface LoSanXuat {
  HanSuDung?: string | null;
}

interface ThongKeItem {
  nhaCungCap: NhaCungCap;
  SanPhams: SanPham;
  LoSanXuat: LoSanXuat;
}

interface Props {
  model: ThongKeItem[];
}

/* ===================== COMPONENT ===================== */
const ProductQuantityBySupplier: React.FC<Props> = ({ model }) => {
  return (
    <main className={styles["main-content"]}>
      <div className={styles["Title"]}>
        <h1>Thống kê</h1>
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

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeSoLuongTonKho">
              Thống kê số lượng tồn kho
            </a>
          </button>

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeGiaTriSanPhamTheoThoiGian">
              Thống kê giá sản phẩm
            </a>
          </button>

          <button
            className={styles["active"]}
            role="tab"
            aria-selected="false"
            tabIndex={-1}
          >
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
                <th className={styles["stt"]}>STT</th>
                <th className={styles["nha-cung-cap"]}>Nhà cung cấp</th>
                <th className={styles["ten-san-pham"]}>Tên sản phẩm</th>
                <th className={styles["hinh-anh"]}>Hình ảnh</th>
                <th className={styles["don-gia"]}>Đơn giá</th>
                <th className={styles["so-luong"]}>Số lượng</th>
                <th className={styles["han-su-dung"]}>Hạn sử dụng</th>
              </tr>
            </thead>

            <tbody>
              {model.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td className={styles["nha-cung-cap"]}>
                    {item.nhaCungCap.TenNCC}
                  </td>

                  <td className={styles["ten-san-pham"]}>
                    {item.SanPhams.TenSanPham}
                  </td>

                  <td className={styles["hinh-anh"]}>
                    {item.SanPhams.HinhAnh ? (
                      <img
                        src={item.SanPhams.HinhAnh}
                        alt="Ảnh sản phẩm"
                        className={styles["rounded-img"]}
                        title={item.SanPhams.TenSanPham}
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

                  <td className={styles["don-gia"]}>
                    {item.SanPhams.DonGia} VND
                  </td>

                  <td className={styles["so-luong"]}>
                    {item.SanPhams.SoLuong}
                  </td>

                  <td className={styles["han-su-dung"]}>
                    {item.LoSanXuat.HanSuDung
                      ? new Date(item.LoSanXuat.HanSuDung).toLocaleDateString(
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

export default ProductQuantityBySupplier;
