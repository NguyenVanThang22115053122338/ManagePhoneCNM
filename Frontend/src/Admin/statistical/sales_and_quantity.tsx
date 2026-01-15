import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "./sales_and_quantity.module.css";

import StatisticService from "../../services/StatisticService";
import type { SalesAndQuantityResponse } from "../../services/Interface";

type Mode = "YEAR" | "MONTH" | "DAY";

// data item theo YEAR
type YearItem = {
  month: number;
  totalOrders: number;
  revenue: number;
};

// data item theo MONTH
type MonthItem = {
  day: number;
  totalOrders: number;
  revenue: number;
};

const Sales_And_Quantity = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [mode, setMode] = useState<Mode>("YEAR");

  /* ===== SEO ===== */
  useEffect(() => {
    document.title = "Thống kê doanh thu & đơn hàng | Admin";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Trang thống kê doanh thu và số lượng đơn hàng theo năm, tháng, ngày trong hệ thống quản trị."
      );
    }
  }, []);

  /* ===== FILTER STATE (from query) ===== */
  const [year, setYear] = useState<number>(() => {
    const q = Number(searchParams.get("year"));
    return Number.isFinite(q) && q > 0 ? q : new Date().getFullYear();
  });

  const [month, setMonth] = useState<number | "">(() => {
    const q = searchParams.get("month");
    return q ? Number(q) : "";
  });

  const [day, setDay] = useState<number | "">(() => {
    const q = searchParams.get("day");
    return q ? Number(q) : "";
  });

  /* ===== DATA ===== */
  const [data, setData] = useState<Array<YearItem | MonthItem>>([]);
  const [years, setYears] = useState<number[]>([]);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongDonHang, setTongDonHang] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ===== helpers ===== */
  const fmtVND = (v: number) => v.toLocaleString("vi-VN") + " VNĐ";

  const daysInSelectedMonth = useMemo(() => {
    if (!month) return 31;
    // JS: tháng bắt đầu từ 0 -> month là 1..12 => dùng (month, 0) để lấy ngày cuối tháng
    return new Date(year, month, 0).getDate();
  }, [year, month]);

  const canPickDay = !!month; // chỉ cho chọn ngày khi đã chọn tháng

  /* ===== keep query in sync ===== */
  useEffect(() => {
    const params: Record<string, string> = { year: String(year) };

    if (month) params.month = String(month);
    if (month && day) params.day = String(day);

    setSearchParams(params, { replace: true });
  }, [year, month, day, setSearchParams]);

  /* ===== enforce logic: day requires month ===== */
  useEffect(() => {
    // nếu bỏ chọn tháng => reset ngày
    if (!month && day) setDay("");
  }, [month, day]);

  useEffect(() => {
    // nếu chọn day > số ngày trong tháng => reset
    if (month && day && day > daysInSelectedMonth) setDay("");
  }, [month, day, daysInSelectedMonth]);

  /* ===== FETCH ===== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const payload: SalesAndQuantityResponse =
          await StatisticService.getSalesAndQuantity({
            year,
            month: month || undefined,
            day: month && day ? (day as number) : undefined
          });

        // mode từ backend
        setMode(payload.mode as Mode);

        // data
        setData((payload.data ?? []) as Array<YearItem | MonthItem>);

        // tổng
        // - YEAR/MONTH: tongDoanhThu, tongDonHang
        // - DAY: có thể backend trả revenue/totalOrders riêng => fallback
        setTongDoanhThu(
          (payload.tongDoanhThu ?? payload.revenue ?? 0) as number
        );
        setTongDonHang(
          (payload.tongDonHang ?? payload.totalOrders ?? 0) as number
        );

        // years chỉ có ở mode YEAR (hoặc backend có trả thì set)
        if (payload.years && payload.years.length) {
          setYears(payload.years);
        }
      } catch (e) {
        console.error(e);
        setData([]);
        setTongDoanhThu(0);
        setTongDonHang(0);
        // đừng wipe years ở đây để dropdown vẫn dùng được nếu đã có
        alert("Không tải được dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, day]);

  /* ===== NORMALIZE DATA FOR CHART ===== */
  const chartData = useMemo(() => {
    if (!data?.length) return [];

    if (mode === "YEAR") {
      const items = data as YearItem[];
      return Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        const found = items.find(d => d.month === m);
        return {
          label: `Tháng ${m}`,
          orders: found?.totalOrders ?? 0,
          revenue: found?.revenue ?? 0
        };
      });
    }

    if (mode === "MONTH") {
      const items = data as MonthItem[];
      return items.map(d => ({
        label: `Ngày ${d.day}`,
        orders: d.totalOrders ?? 0,
        revenue: d.revenue ?? 0
      }));
    }

    // DAY: không vẽ chart
    return [];
  }, [data, mode]);

  const labels = chartData.map(d => d.label);
  const soLuongData = chartData.map(d => d.orders);
  const doanhThuData = chartData.map(d => d.revenue);

  const isEmpty =
    mode === "DAY"
      ? tongDonHang === 0 && tongDoanhThu === 0
      : chartData.every(d => d.orders === 0 && d.revenue === 0);

  /* ===== CHART ===== */
  useEffect(() => {
    // DAY => không tạo chart
    if (mode === "DAY") {
      chartInstance.current?.destroy();
      chartInstance.current = null;
      return;
    }

    if (!chartRef.current) return;

    chartInstance.current?.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số lượng đơn",
            data: soLuongData,
            backgroundColor: "rgba(37,99,235,0.75)",
            borderRadius: 10,
            maxBarThickness: 38
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const i = ctx.dataIndex;
                return [
                  `Số đơn: ${soLuongData[i]} đơn`,
                  `Doanh thu: ${Number(doanhThuData[i] ?? 0).toLocaleString("vi-VN")} VNĐ`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: v => `${Number(v).toLocaleString("vi-VN")} đơn`
            }
          }
        }
      }
    });

    return () => {
      chartInstance.current?.destroy();
      chartInstance.current = null;
    };
  }, [mode, labels, soLuongData, doanhThuData]);

  /* ===== RENDER ===== */
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Thống kê doanh thu & đơn hàng</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Chế độ:{" "}
          <strong>
            {mode === "YEAR" ? "Theo năm" : mode === "MONTH" ? "Theo tháng" : "Theo ngày"}
          </strong>
        </p>
      </header>

      <section className={styles.grid}>
        <aside className={styles.filtersCard}>
          <label>
            Năm
            <select
              value={year}
              onChange={e => {
                const y = +e.target.value;
                setYear(y);
                setMonth("");
                setDay("");
              }}
            >
              {(years.length ? years : [new Date().getFullYear()]).map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label>
            Tháng
            <select
              value={month}
              onChange={e => {
                const m = +e.target.value || "";
                setMonth(m);
                setDay(""); // đổi tháng thì reset ngày
              }}
            >
              <option value="">Tất cả</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ngày
            <select
              value={day}
              disabled={!canPickDay}
              onChange={e => setDay(+e.target.value || "")}
              title={!canPickDay ? "Chọn tháng trước khi chọn ngày" : ""}
            >
              <option value="">Tất cả</option>
              {Array.from({ length: canPickDay ? daysInSelectedMonth : 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Ngày {i + 1}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section className={styles.mainCard}>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span>
                {mode === "DAY" ? "Doanh thu ngày" : "Tổng doanh thu"}
              </span>
              <strong>{fmtVND(tongDoanhThu)}</strong>
            </div>
            <div className={styles.stat}>
              <span>
                {mode === "DAY" ? "Số đơn ngày" : "Tổng số đơn"}
              </span>
              <strong>{tongDonHang} đơn</strong>
            </div>
          </div>

          <div className={styles.chartWrap}>
            {loading ? (
              <p>Đang tải dữ liệu…</p>
            ) : isEmpty ? (
              <div className={styles.empty}>Không có dữ liệu</div>
            ) : mode === "DAY" ? (
              <div className={styles.empty}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  {month && day
                    ? `Ngày ${day}/${month}/${year}`
                    : `Ngày (chọn tháng + ngày để xem)`}
                </div>
                <div style={{ opacity: 0.85 }}>
                  Đây là chế độ theo ngày nên không vẽ biểu đồ.
                </div>
              </div>
            ) : (
              <div className={styles.canvasBox}>
                <canvas ref={chartRef} />
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Sales_And_Quantity;
