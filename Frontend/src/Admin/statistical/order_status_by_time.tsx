import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import styles from "./order_status_by_time.module.css";

/* ===================== TYPES ===================== */
interface Props {
  danhSachNam: number[];
  namDuocChon?: number;
  thangDuocChon?: number;
  ngayDuocChon?: number;
  tongSoDon: number;
  donHoanThanh: number;
  donHuy: number;
}

/* ===================== COMPONENT ===================== */
const OrderStatusByTime: React.FC<Props> = ({
  danhSachNam,
  namDuocChon,
  thangDuocChon,
  ngayDuocChon,
  tongSoDon,
  donHoanThanh,
  donHuy
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  /* ===== Chart logic (giữ nguyên ý nghĩa script cũ) ===== */
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Đơn Hoàn Thành", "Đơn Đã Hủy"],
        datasets: [
          {
            label: "Số đơn",
            data: [donHoanThanh, donHuy],
            backgroundColor: ["#4CAF50", "#F44336"]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Tình trạng đơn hàng"
          }
        }
      }
    });
  }, [donHoanThanh, donHuy]);

  /* ===== Reload khi chọn filter (giữ y nguyên hành vi) ===== */
  useEffect(() => {
    const layLaiDuLieu = () => {
      const day =
        (document.getElementById("daySelect") as HTMLSelectElement)?.value || 0;
      const month =
        (document.getElementById("monthSelect") as HTMLSelectElement)?.value || 0;
      const year =
        (document.getElementById("yearSelect") as HTMLSelectElement)?.value || 0;

      window.location.href = `/ThongKe/ThongKeTrangThaiDonHangTheoThoiGian?ngay=${day}&thang=${month}&nam=${year}`;
    };

    const yearSelect = document.getElementById("yearSelect");
    const monthSelect = document.getElementById("monthSelect");
    const daySelect = document.getElementById("daySelect");

    yearSelect?.addEventListener("change", layLaiDuLieu);
    monthSelect?.addEventListener("change", layLaiDuLieu);
    daySelect?.addEventListener("change", layLaiDuLieu);

    return () => {
      yearSelect?.removeEventListener("change", layLaiDuLieu);
      monthSelect?.removeEventListener("change", layLaiDuLieu);
      daySelect?.removeEventListener("change", layLaiDuLieu);
    };
  }, []);

  return (
    <main className={styles["main-content"]}>
      <div className={styles["Title"]}>
        <h1>THỐNG KÊ</h1>
      </div>

      <div className={styles["filters"]}>
        <select id="yearSelect" defaultValue={namDuocChon ?? ""}>
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
          <option value="">-- Không chọn ngày --</option>
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

          <button role="tab" aria-selected="false" tabIndex={-1}>
            <a href="/ThongKe/ThongKeSoLuongSanPhamTheoNhaCungCap">
              Số lượng sản phẩm theo nhà cung cấp
            </a>
          </button>

          <button
            className={styles["active"]}
            role="tab"
            aria-selected="false"
            tabIndex={-1}
          >
            <a href="/ThongKe/ThongKeTrangThaiDonHangTheoThoiGian">
              Thống kê đơn hàng đã hủy/ đã hoàn thành
            </a>
          </button>
        </nav>

        <div className={styles["summary-stats"]}>
          <div className={styles["summary-item"]}>
            <h2>Tổng số đơn</h2>
            <p className={styles["red"]}>{tongSoDon} đơn</p>
          </div>

          <div className={styles["chart-container"]}>
            <div className={styles["chart-wrapper"]}>
              <canvas ref={chartRef} width={800} height={400} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderStatusByTime;
