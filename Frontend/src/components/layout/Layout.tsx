import Sidebar from "../sidebar/Sidebar";
import Header from "../headerAdmin/Header";
import styles from "./style_frame.module.css";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className={styles["lo-main-wrapper"]} >
      <Sidebar />

      <div className={styles["lo-main-content"]}>
        <Header />

        <div className={styles["lo-container"]} >
          {/* 👇 ADMIN PAGE RENDER Ở ĐÂY */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
