import { useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import styles from "./product_value_over_time.module.css";

/* ===================== TYPES ===================== */
interface SanPham {
  IDSanPham: number;
  TenSanPham: string;
  SoLuong: number;
  DonGia: number;
  HinhAnh?: string;
}

interface SanPhamItem {
  SanPham: SanPham;
}

interface GiaTheoThoiGian {
  NgaySanXuat: string;
  Gia: number;
}

/* ===================== MOCK DATA ===================== */
const MOCK_DANH_SACH_SAN_PHAM: SanPhamItem[] = [
  {
    SanPham: {
      IDSanPham: 1,
      TenSanPham: "iPhone 15 Pro Max",
      SoLuong: 20,
      DonGia: 32990000,
      HinhAnh: "https://via.placeholder.com/48"
    }
  },
  {
    SanPham: {
      IDSanPham: 2,
      TenSanPham: "Samsung Galaxy S24 Ultra",
      SoLuong: 15,
      DonGia: 28990000,
      HinhAnh: "https://via.placeholder.com/48"
    }
  },
  {
    SanPham: {
      IDSanPham: 3,
      TenSanPham: "Xiaomi 14 Pro",
      SoLuong: 30,
      DonGia: 21990000
    }
  }
];

const MOCK_GIA_THEO_THOI_GIAN: GiaTheoThoiGian[] = [
  { NgaySanXuat: "2023-01-01", Gia: 25000000 },
  { NgaySanXuat: "2023-04-01", Gia: 27000000 },
  { NgaySanXuat: "2023-08-01", Gia: 30000000 },
  { NgaySanXuat: "2023-12-01", Gia: 32000000 },
  { NgaySanXuat: "2024-03-01", Gia: 32990000 }
];

/* ===================== COMPONENT ===================== */
const ProductValueOverTime = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showChart, setShowChart] = useState(false);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  /* ===== CHỈ CHỌN 1 CHECKBOX ===== */
  const handleCheckboxChange = (id: number) => {
    setSelectedProductId(prev => (prev === id ? null : id));
  };

  /* ===== XEM THỐNG KÊ (MOCK) ===== */
  const handleThongKe = () => {
    if (!selectedProductId) {
      alert("Hãy chọn ít nhất một sản phẩm để xem thống kê!");
      return;
    }

    const labels = MOCK_GIA_THEO_THOI_GIAN.map(
      i => new Date(i.NgaySanXuat)
    );
    const prices = MOCK_GIA_THEO_THOI_GIAN.map(i => i.Gia);

    setShowChart(true);

    setTimeout(() => {
      if (!chartRef.current) return;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Giá theo thời gian (VNĐ)",
              data: prices,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: "Biểu đồ giá sản phẩm theo thời gian"
            }
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
                displayFormats: {
                  month: "MMM yyyy"
                }
              },
              title: {
                display: true,
                text: "Ngày sản xuất"
              }
            },
            y: {
              ticks: {
                callback: value =>
                  Number(value).toLocaleString("vi-VN") + "₫"
              },
              title: {
                display: true,
                text: "Giá (VNĐ)"
              }
            }
          }
        }
      });
    }, 0);
  };

  return (
    <main className={styles["main-content"]}>
      <div className={styles["Title"]}>
        <h1>Thống kê</h1>
      </div>

      <div className={styles["stats-container"]}>
        {/* ===== NAV ===== */}
        <nav className={styles["stats-nav"]}>
          <button>
            <a href="/ThongKe/ThongKeDoanhThuVaSoLuongDon">
              Thống kê số lượng đơn hàng và doanh thu
            </a>
          </button>
          <button>
            <a href="/ThongKe/ThongKeSoLuongTonKho">
              Thống kê số lượng tồn kho
            </a>
          </button>
          <button className={styles["active"]}>
            <a href="/ThongKe/ThongKeGiaTriSanPhamTheoThoiGian">
              Thống kê giá sản phẩm
            </a>
          </button>
          <button>
            <a href="/ThongKe/ThongKeSoLuongSanPhamTheoNhaCungCap">
              Số lượng sản phẩm theo nhà cung cấp
            </a>
          </button>
          <button>
            <a href="/ThongKe/ThongKeTrangThaiDonHangTheoThoiGian">
              Thống kê đơn hàng đã hủy/ đã hoàn thành
            </a>
          </button>
        </nav>

        {/* ===== BUTTON ===== */}
        {!showChart && (
          <div className={styles["view-thongke"]}>
            <button
              type="button"
              className={styles["btn-thongke"]}
              onClick={handleThongKe}
            >
              Xem thống kê
            </button>
          </div>
        )}

        {/* ===== TABLE ===== */}
        {!showChart && (
          <section className={styles["table-container"]}>
            <table className={styles["product-table"]}>
              <thead>
                <tr>
                  <th></th>
                  <th>Mã</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DANH_SACH_SAN_PHAM.map(item => (
                  <tr key={item.SanPham.IDSanPham}>
                    <td>
                      <input
                        type="checkbox"
                        checked={
                          selectedProductId === item.SanPham.IDSanPham
                        }
                        onChange={() =>
                          handleCheckboxChange(item.SanPham.IDSanPham)
                        }
                      />
                    </td>
                    <td>{item.SanPham.IDSanPham}</td>
                    <td>
                      <img
                        src={
                          item.SanPham.HinhAnh ??
                          "/Uploads/placeholder.jpg"
                        }
                        alt="Ảnh sản phẩm"
                        className={styles["rounded-img"]}
                      />
                    </td>
                    <td>{item.SanPham.TenSanPham}</td>
                    <td>{item.SanPham.SoLuong}</td>
                    <td>{item.SanPham.DonGia.toLocaleString("vi-VN")}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ===== CHART ===== */}
        {showChart && (
          <>
            <div className={styles["chart-container"]}>
              <canvas ref={chartRef} />
            </div>

            <div className={styles["back-button-container"]}>
              <button
                className={styles["btn-back"]}
                onClick={() => {
                  setShowChart(false);
                  setSelectedProductId(null);
                }}
              >
                Quay lại bảng
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ProductValueOverTime;
