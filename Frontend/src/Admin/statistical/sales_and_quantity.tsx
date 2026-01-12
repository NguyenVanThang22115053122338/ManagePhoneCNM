import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Chart from "chart.js/auto";
import styles from "./sales_and_quantity.module.css";

import type { MonthlyOrderStatistic, SalesAndQuantityResponse } from "../../services/Interface";
import { StatisticService } from "../../services/StatisticService";

const Sales_And_Quantity = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

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

  /* ===== FILTER STATE ===== */
  const [year, setYear] = useState<number>(() => {
    const q = Number(searchParams.get("nam"));
    return Number.isFinite(q) && q > 0 ? q : new Date().getFullYear();
  });

  const [month, setMonth] = useState<number | "">(() => {
    const q = searchParams.get("thang");
    return q ? Number(q) : "";
  });

  const [day, setDay] = useState<number | "">(() => {
    const q = searchParams.get("ngay");
    return q ? Number(q) : "";
  });

  /* ===== DATA ===== */
  const [data, setData] = useState<MonthlyOrderStatistic[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongDonHang, setTongDonHang] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ===== SYNC QUERY ===== */
  useEffect(() => {
    const params: Record<string, string> = { nam: String(year) };
    if (month) params.thang = String(month);
    if (day) params.ngay = String(day);

    setSearchParams(params, { replace: true });
  }, [year, month, day, setSearchParams]);

  /* ===== FETCH ===== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = (await StatisticService.getSalesAndQuantity({
          year,
          month: month || undefined,
          day: day || undefined
        })) as unknown as SalesAndQuantityResponse | { data: SalesAndQuantityResponse };

        const payload: SalesAndQuantityResponse =
          (res as any)?.data?.data !== undefined ? (res as any).data : (res as any);

        setData(Array.isArray(payload.data) ? payload.data : []);
        setTongDoanhThu(payload.tongDoanhThu ?? 0);
        setTongDonHang(payload.tongDonHang ?? 0);
        setYears(payload.years ?? []);
      } catch (e) {
        console.error(e);
        setData([]);
        setTongDoanhThu(0);
        setTongDonHang(0);
        setYears([]);
        alert("Không tải được dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month, day]);

  /* ===== NORMALIZE 12 MONTHS ===== */
  const fullMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const found = data.find(d => d.thang === i + 1);
      return {
        thang: i + 1,
        soLuong: found?.soLuong ?? 0,
        doanhThu: found?.doanhThu ?? 0
      };
    });
  }, [data]);

  const labels = fullMonths.map(m => `Tháng ${m.thang}`);
  const soLuongData = fullMonths.map(m => m.soLuong);
  const doanhThuData = fullMonths.map(m => m.doanhThu);

  const isEmpty = fullMonths.every(m => m.soLuong === 0 && m.doanhThu === 0);

  /* ===== CHART ===== */
  useEffect(() => {
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
            backgroundColor: "rgba(37,99,235,0.7)",
            borderRadius: 8,
            maxBarThickness: 42
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
                  `Doanh thu: ${doanhThuData[i].toLocaleString("vi-VN")} VNĐ`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => `${Number(v).toLocaleString("vi-VN")} đơn`
            }
          }
        }
      }
    });

    return () => chartInstance.current?.destroy();
  }, [labels, soLuongData, doanhThuData]);

  const fmtVND = (v: number) => v.toLocaleString("vi-VN") + " VNĐ";

  /* ===== RENDER ===== */
  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Thống kê doanh thu & đơn hàng</h1>
        </div>

      </header>

      {/* CONTENT */}
      <section className={styles.grid}>
        {/* FILTER */}
        <aside className={styles.filtersCard}>
          <label>
            Năm
            <select value={year} onChange={e => setYear(+e.target.value)}>
              {(years.length ? years : [new Date().getFullYear()]).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>

          <label>
            Tháng
            <select value={month} onChange={e => setMonth(+e.target.value || "")}>
              <option value="">Tất cả</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          </label>

          <label>
            Ngày
            <select value={day} onChange={e => setDay(+e.target.value || "")}>
              <option value="">Tất cả</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>
              ))}
            </select>
          </label>
        </aside>

        {/* MAIN */}
        <section className={styles.mainCard}>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span>Tổng doanh thu</span>
              <strong>{fmtVND(tongDoanhThu)}</strong>
            </div>
            <div className={styles.stat}>
              <span>Tổng số đơn</span>
              <strong>{tongDonHang} đơn</strong>
            </div>
          </div>

          <div className={styles.chartWrap}>
            {loading ? (
              <p>Đang tải dữ liệu…</p>
            ) : isEmpty ? (
              <div className={styles.empty}>Không có dữ liệu</div>
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