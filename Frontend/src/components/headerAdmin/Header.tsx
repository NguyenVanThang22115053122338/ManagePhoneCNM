import styles from "./Header.module.css";
import React, { useState } from "react";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  return (
  <div className={styles["lo-header"]}>
    <div
      className={`${styles["lo-user-info"]} ${styles["lo-dropdown"]}`}
      onClick={toggleDropdown}
    >
      <div className={styles["lo-user-avatar"]}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      </div>

      <div className={styles["lo-user-details"]}>
        <div className={styles["lo-user-name"]}>Admin</div>
        <div className={styles["lo-user-role"]}>Quản trị viên</div>
      </div>

      {open && (
        <div className={styles["lo-dropdown-content"]}>
          <a href="#" className={styles["lo-dropdown-item"]}>
            <i className="fas fa-user-circle"></i> Thông tin cá nhân
          </a>
          <a href="#" className={styles["lo-dropdown-item"]}>
            <i className="fas fa-cog"></i> Cài đặt tài khoản
          </a>
          <div className={styles["lo-dropdown-divider"]}></div>
          <a href="/login" className={`${styles["lo-dropdown-item"]} ${styles["lo-logout-item"]}`}>
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </a>
        </div>
      )}
    </div>
  </div>
  );
};

export default Header;
