import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "./sales_and_quantity.module.css";

/* ===== TYPES ===== */
interface ThongKeItem {
  thang: number;
  soLuong: number;
  doanhThu: number;
}

interface Props {
  data: ThongKeItem[];
  danhSachNam: number[];
  tongDoanhThu: number;
  tongDonHang: number;
}

/* ================================================= */
const Sales_And_Quantity: React.FC<Props> = ({
  data,
  danhSachNam,
  tongDoanhThu,
  tongDonHang,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  /* ===== FILTER PARAMS ===== */
  const [year, setYear] = useState<number | "">(
    searchParams.get("nam") ? Number(searchParams.get("nam")) : ""
  );
  const [month, setMonth] = useState<number | "">(
    searchParams.get("thang") ? Number(searchParams.get("thang")) : ""
  );
  const [day, setDay] = useState<number | "">(
    searchParams.get("ngay") ? Number(searchParams.get("ngay")) : ""
  );

  /* ===== CHART DATA ===== */
  const labels = useMemo(
    () => data.map(item => `Tháng ${item.thang}`),
    [data]
  );

  const soLuongData = useMemo(
    () => data.map(item => item.soLuong),
    [data]
  );

  const doanhThuData = useMemo(
    () => data.map(item => item.doanhThu),
    [data]
  );

  /* ===== REDIRECT ON FILTER CHANGE ===== */
  useEffect(() => {
    if (!year) return;

    const params = new URLSearchParams();
    params.set("nam", String(year));
    if (month) params.set("thang", String(month));
    if (day) params.set("ngay", String(day));

    navigate(`/thongke/doanhthu-donhang?${params.toString()}`);
  }, [year, month, day, navigate]);

  /* ===== INIT CHART ===== */
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số lượng đơn",
            data: soLuongData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Thống kê số lượng đơn & doanh thu theo tháng",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                return [
                  `Số lượng: ${soLuongData[index]} đơn`,
                  `Doanh thu: ${doanhThuData[index].toLocaleString(
                    "vi-VN"
                  )} VNĐ`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              callback: (value) =>
                `${Number(value).toLocaleString("vi-VN")} đơn`,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [labels, soLuongData, doanhThuData]);

  /* ================= RENDER ================= */
  return (
    <main className={styles["main-content"]}>
      <div className={styles.Title}>
        <h1>THỐNG KÊ</h1>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {danhSachNam.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select value={month} onChange={e => setMonth(Number(e.target.value) || "")}>
          <option value="">-- Không chọn tháng --</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select value={day} onChange={e => setDay(Number(e.target.value) || "")}>
          <option value="">-- Không chọn ngày --</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Ngày {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className={styles["stats-container"]}>
        <nav className={styles["stats-nav"]}>
          <button className={styles.active}>
            Thống kê số lượng đơn hàng và doanh thu
          </button>
          <button onClick={() => navigate("/inventory_quantity")}>
            Thống kê số lượng tồn kho
          </button>
          <button onClick={() => navigate("/product_value_over_time")}>
            Thống kê giá sản phẩm
          </button>
          <button onClick={() => navigate("/product_quantity_by_supplier")}>
            Số lượng sản phẩm theo nhà cung cấp
          </button>
          <button onClick={() => navigate("/order_status_by_time")}>
            Đơn hàng đã hủy / hoàn thành
          </button>
        </nav>

        <div className={styles["summary-stats"]}>
          <div className={styles["summary-item"]}>
            <h2>Tổng doanh thu</h2>
            <p className={styles.green}>
              {tongDoanhThu.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className={styles["summary-item"]}>
            <h2>Tổng số đơn</h2>
            <p className={styles.red}>
              {tongDonHang.toLocaleString("vi-VN")} đơn
            </p>
          </div>
        </div>

        <p className={styles["unit-text"]}>Đơn vị tính: Đơn</p>

        <div className={styles["chart-container"]}>
          <div className={styles["chart-wrapper"]}>
            <canvas ref={chartRef} width={800} height={400}></canvas>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Sales_And_Quantity;
