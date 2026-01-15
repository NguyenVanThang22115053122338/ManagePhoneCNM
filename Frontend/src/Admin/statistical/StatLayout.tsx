import { Outlet } from "react-router-dom";
import StatBar from "./StatBar";
import styles from "./StatLayout.module.css";

const StatLayout = () => {
  return (
    <div className={styles.statLayout}>
      <StatBar />
      <section className={styles.content}>
        <Outlet />
      </section>
    </div>
  );
};

export default StatLayout;
