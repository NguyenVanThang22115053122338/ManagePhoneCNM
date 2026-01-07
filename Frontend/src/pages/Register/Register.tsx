import { useState } from "react";
import "./Register.css";
import { register } from "../../services/UserService";

type RegisterFormProps = {
    onSuccess: (sdt: string) => void;
};


const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [formData, setFormData] = useState({
        sdt: "",
        hoVaTen: "",
        email: "",
        diaChi: "",
        matKhau: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await register({
                sdt: formData.sdt,
                hoVaTen: formData.hoVaTen,
                email: formData.email,
                diaChi: formData.diaChi,
                matKhau: formData.matKhau,
            });

            alert("Đăng ký thành công! Vui lòng đăng nhập");
            onSuccess(formData.sdt);
        } catch (err: any) {
            alert(err.message || "Đăng ký thất bại");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="sdt" placeholder="Số điện thoại" value={formData.sdt} onChange={handleChange} required />
            <input name="hoVaTen" placeholder="Họ và tên" value={formData.hoVaTen} onChange={handleChange} required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="diaChi" placeholder="Địa chỉ" value={formData.diaChi} onChange={handleChange} required />
            <input name="matKhau" type="password" placeholder="Mật khẩu" value={formData.matKhau} onChange={handleChange} required />

            <button type="submit" className="login-btn">Tạo tài khoản</button>

            <div className="site-footer">
                <p>
                    Qua việc đăng ký, bạn đồng ý với các
                    <a href="#"> quy định sử dụng</a> và
                    <a href="#"> chính sách bảo mật</a>
                </p>
                <p>Bản quyền © 2015 - 2025 CellPhoneS.com</p>
            </div>
        </form>
    );
};

export default RegisterForm;
