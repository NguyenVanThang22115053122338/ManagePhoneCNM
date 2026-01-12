import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./account_create.module.css";
import { createUser } from "../../services/UserService";

const AccountCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    sdt: "",
    hoVaTen: "",
    email: "",
    diaChi: "",
    roleId: 1, // Mặc định là user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error khi user sửa
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate SĐT
    if (!formData.sdt.trim()) {
      newErrors.sdt = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.sdt)) {
      newErrors.sdt = "Số điện thoại phải có 10 chữ số";
    }

    // Validate họ tên
    if (!formData.hoVaTen.trim()) {
      newErrors.hoVaTen = "Vui lòng nhập họ tên";
    } else if (formData.hoVaTen.trim().length < 2) {
      newErrors.hoVaTen = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Địa chỉ không bắt buộc

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await createUser(formData);

      alert(result.message || "Tạo tài khoản thành công! Mật khẩu mặc định: 123456");
      navigate("/admin/manage_account");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Tạo tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const hasData = Object.values(formData).some(val => 
      typeof val === 'string' ? val.trim() !== "" : val !== 1
    );

    if (hasData) {
      const confirmed = window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?");
      if (!confirmed) return;
    }

    navigate("/admin/manage_account");
  };

  return (
    <div className={styles["account-create-container"]}>
      <h2 className={styles.title}>Tạo tài khoản mới</h2>
      
      <div className={styles.infoBox}>
        <p>ℹ️ Tài khoản được tạo sẽ có mật khẩu mặc định là: <strong>123456</strong></p>
        <p>Người dùng có thể đổi mật khẩu sau khi đăng nhập.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Số điện thoại */}
        <div className={styles.formGroup}>
          <label>
            Số điện thoại <span className={styles.required}>*</span>
          </label>
          <input
            name="sdt"
            type="tel"
            placeholder="Nhập số điện thoại (10 chữ số)"
            value={formData.sdt}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.sdt ? styles.error : ""}
          />
          {errors.sdt && <span className={styles.errorText}>{errors.sdt}</span>}
        </div>

        {/* Họ và tên */}
        <div className={styles.formGroup}>
          <label>
            Họ và tên <span className={styles.required}>*</span>
          </label>
          <input
            name="hoVaTen"
            type="text"
            placeholder="Nhập họ và tên"
            value={formData.hoVaTen}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.hoVaTen ? styles.error : ""}
          />
          {errors.hoVaTen && <span className={styles.errorText}>{errors.hoVaTen}</span>}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label>
            Email <span className={styles.required}>*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.email ? styles.error : ""}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Địa chỉ */}
        <div className={styles.formGroup}>
          <label>Địa chỉ</label>
          <input
            name="diaChi"
            type="text"
            placeholder="Nhập địa chỉ (không bắt buộc)"
            value={formData.diaChi}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {/* Quyền hạn */}
        <div className={styles.formGroup}>
          <label>
            Quyền hạn <span className={styles.required}>*</span>
          </label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value={1}>Người dùng</option>
            <option value={2}>Admin</option>
          </select>
        </div>

        {/* Buttons */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles["submit-btn"]}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
          <button
            type="button"
            className={styles["cancel-btn"]}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountCreate;