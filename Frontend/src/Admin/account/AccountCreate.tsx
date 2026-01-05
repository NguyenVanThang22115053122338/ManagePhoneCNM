import React, { useState } from "react";
import styles from "./account_create.module.css";
import { register } from "../../services/UserService";

type RegisterFormProps = {
  onSuccess?: (sdt: string) => void;
};

type RegisterFormData = {
  sdt: string;
  hoVaTen: string;
  email: string;
  diaChi: string;
  matKhau: string;
  role: string; // 👈 STRING
};

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    sdt: "",
    hoVaTen: "",
    email: "",
    diaChi: "",
    matKhau: "",
    role: "1", // 👈 mặc định user
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("SUBMIT DATA:", formData);
    console.log("ROLE TYPE:", typeof formData.role); // string
    console.log("ROLE VALUE:", formData.role);       // "1" hoặc "2"

    try {
      // 👇 ÉP KIỂU TẠI VIEW – TS IM LẶNG – PAYLOAD GIỮ STRING
      await register(formData as any);

      alert("Đăng ký thành công! Vui lòng đăng nhập");
      onSuccess?.(formData.sdt);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className={styles["account-create-container"]}>
      <h2 className={styles.title}>Tạo tài khoản</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="sdt" placeholder="Số điện thoại" value={formData.sdt} onChange={handleChange} required />
        <input name="hoVaTen" placeholder="Họ và tên" value={formData.hoVaTen} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="diaChi" placeholder="Địa chỉ" value={formData.diaChi} onChange={handleChange} required />
        <input name="matKhau" type="password" placeholder="Mật khẩu" value={formData.matKhau} onChange={handleChange} required />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="1">Người dùng</option>
          <option value="2">Admin</option>
        </select>

        <button type="submit" className={styles["submit-btn"]}>
          Tạo tài khoản
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
