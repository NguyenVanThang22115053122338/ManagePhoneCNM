import { useState,useEffect,useRef } from "react";
import "./Register.css";
import { register,verifyMail,ResendMail } from "../../services/UserService";

type RegisterFormProps = {
    onSuccess: (sdt: string) => void;
};

type Step = "REGISTER" | "VERIFY";

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [step, setStep] = useState<Step>("REGISTER");

    const [formData, setFormData] = useState({
        sdt: "",
        hoVaTen: "",
        email: "",
        diaChi: "",
        matKhau: "",
    });
    const verifyEmailRef = useRef<string>("");
    const [verifyCode, setVerifyCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 phút
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }
    
        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
    
        return () => clearInterval(timer);
    }, [timeLeft]);

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await register(formData);

            alert(res.message);

            if (res.need_verify) {
                setStep("VERIFY");
                verifyEmailRef.current = formData.email;
                return;
            }

            onSuccess(formData.sdt);
        } catch (err: any) {
            alert(err.message || "Đăng ký thất bại");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await verifyMail(verifyEmailRef.current, verifyCode);
            
            alert(res.message);
            onSuccess(formData.sdt);
        } catch (error) {
            
        }
        
    };

    const handleResendCode = async () => {
        try {
            const res = await ResendMail(verifyEmailRef.current);
            setTimeLeft(120);
            setCanResend(false);
            alert(res.message);
        } catch(err: any) {
            console.error(err);
            alert(err.message || "Không thể gửi lại mã");
        }
    };

    return (
        <div className="register-container">
            {step === "REGISTER" && (
                <form onSubmit={handleRegister}>
                    <h2>Đăng ký tài khoản</h2>

                    <input name="sdt" placeholder="Số điện thoại" value={formData.sdt} onChange={handleChange} required />
                    <input name="hoVaTen" placeholder="Họ và tên" value={formData.hoVaTen} onChange={handleChange} required />
                    <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input name="diaChi" placeholder="Địa chỉ" value={formData.diaChi} onChange={handleChange} required />
                    <input name="matKhau" type="password" placeholder="Mật khẩu" value={formData.matKhau} onChange={handleChange} required />

                    <button type="submit" className="login-btn">
                        Tạo tài khoản
                    </button>

                    <div className="site-footer">
                        <p>
                            Qua việc đăng ký, bạn đồng ý với các
                            <a href="#"> quy định sử dụng</a> và
                            <a href="#"> chính sách bảo mật</a>
                        </p>
                    </div>
                </form>
            )}

            {step === "VERIFY" && (
                <form onSubmit={handleVerify} className="verify-form">
                <h2 className="verify-title">Xác thực email</h2>
            
                <p className="verify-desc">
                    Mã xác thực đã được gửi tới <b>{formData.email}</b>
                </p>
            
                <div className="verify-input-group">
                    <input
                        className="verify-input"
                        placeholder="Nhập mã xác thực"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        required
                    />
            
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className="verify-resend-btn"
                    >
                        Gửi lại
                    </button>
                </div>
            
                <small className="verify-timer">
                    {canResend
                        ? "Mã đã hết hạn"
                        : `Mã còn hiệu lực: ${Math.floor(timeLeft / 60)}:${String(
                              timeLeft % 60
                          ).padStart(2, "0")}`}
                </small>
            
                <button type="submit" className="login-btn verify-submit-btn">
                    Xác thực
                </button>
            </form>            

            )}
        </div>
    );
};

export default RegisterForm;
