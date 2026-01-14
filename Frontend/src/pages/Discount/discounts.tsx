// pages/Discount/discounts.tsx
import { useEffect, useMemo, useState } from "react";
import DiscountService from "../../services/DiscountService";
import type { Discount } from "../../services/Interface";
import "./discounts.css";

type DiscountStatus =
  | "ACTIVE"
  | "UPCOMING"
  | "EXPIRED"
  | "USED_UP"
  | "INACTIVE";

const toDate = (v?: string | null) => (v ? new Date(v) : null);


const getStatus = (d: Discount, now: Date): DiscountStatus => {
  if (d.active === false) return "INACTIVE";

  const start = toDate(d.startDate);
  const end = toDate(d.endDate);



  if (start && now < start) return "UPCOMING";
  if (end && now > end) return "EXPIRED";

  if (d.usageLimit != null && (d.usedCount ?? 0) >= d.usageLimit) {
    return "USED_UP";
  }

  return "ACTIVE";
};

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [keyword, setKeyword] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    DiscountService.getAll().then(setDiscounts);
  }, []);

  const now = useMemo(() => new Date(), []);

  const activeCount = discounts.filter(
    (d) => getStatus(d, now) === "ACTIVE"
  ).length;

  return (
    <section className="user-discount-page">
      <header className="user-discount-header">
        <h1 className="user-discount-title">Mã giảm giá</h1>
        <p className="user-discount-subtitle">
          Có <b>{activeCount}</b> / <b>{discounts.length}</b> mã đang sử dụng được
        </p>

        <input
          className="user-discount-search"
          placeholder="Tìm mã giảm giá..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </header>

      <div className="user-discount-grid">
        {discounts.map((d) => {
          const status = getStatus(d, now);
          const disabled = status !== "ACTIVE";

          return (
            <article
              key={d.id}
              className={`user-discount-card ${disabled ? "user-discount-card--disabled" : ""
                }`}
            >
              <div className="user-discount-card-header">
                <span className="user-discount-code">{d.code}</span>
                <span
                  className={`user-discount-badge user-discount-badge--${status.toLowerCase()}`}
                >
                  {status === "ACTIVE" ? "Đang dùng" : "Không khả dụng"}
                </span>
              </div>

              <div className="user-discount-value">
                {d.type === "PERCENT" ? `${d.value}%` : d.value.toLocaleString()}
              </div>

              <div className="user-discount-meta">
                <div>
                  <strong>Thời gian:</strong>
                  <span>
                    {new Date(d.startDate!).toLocaleString()} →{" "}
                    {new Date(d.endDate!).toLocaleString()}
                  </span>
                </div>
                <div>
                  <strong>Lượt dùng:</strong>
                  <span>
                    {d.usedCount ?? 0} / {d.usageLimit ?? "∞"}
                  </span>
                </div>
              </div>

              <button
                className={`user-discount-copy-btn ${copiedCode === d.code ? "copied" : ""
                  }`}
                disabled={disabled}
                onClick={async () => {
                  await navigator.clipboard.writeText(d.code);
                  setCopiedCode(d.code);

                  setTimeout(() => {
                    setCopiedCode(null);
                  }, 1800);
                }}
              >
                {copiedCode === d.code ? "Đã copy" : "Copy mã"}
              </button>

              {disabled && (
                <div className="user-discount-hint">
                  Mã không còn khả dụng
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default DiscountsPage;