import { useLocation, useNavigate } from "react-router-dom";
import styles from "./StatBar.module.css";

const STAT_TABS = [
  {
    label: "Doanh thu & đơn",
    path: "/Admin/thongke/sales_and_quantity",
    icon: "ri-bar-chart-box-line"
  },
  // {
  //   label: "Giá trị SP",
  //   path: "/Admin/thongke/product_value_over_time",
  //   icon: "ri-line-chart-line"
  // },
  // {
  //   label: "Theo NCC",
  //   path: "/Admin/thongke/product_quantity_by_supplier",
  //   icon: "ri-pie-chart-2-line"
  // },
  {
    label: "Tồn kho",
    path: "/Admin/thongke/inventory_quantity",
    icon: "ri-database-2-line"
  },
  {
    label: "Trạng thái đơn",
    path: "/Admin/thongke/order_status_by_time",
    icon: "ri-bar-chart-grouped-line"
  }
];

const StatBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    // Giữ nguyên query (?nam, thang, ngay)
    navigate(`${path}${location.search}`);
  };

  return (
    <div className={styles.statBar}>
      {STAT_TABS.map(tab => {
        const active = location.pathname === tab.path;

        return (
          <button
            key={tab.path}
            className={`${styles.tab} ${active ? styles.active : ""}`}
            onClick={() => handleNavigate(tab.path)}
            type="button"
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StatBar;
