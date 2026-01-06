import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import Register from "../Register/Register";
import { login, loginWithGoogle } from "../../services/UserService";
import { useAuth } from "../../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    const { setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const clientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(phone, password);

            if (!data?.token) {
                throw new Error("Token không hợp lệ");
            }

            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("cartId", data.cartId.toString());
            localStorage.setItem("role", data.role.toString());

            const { token, ...userInfo } = data;
            localStorage.setItem("user", JSON.stringify(userInfo));

            setUser(userInfo);

            const redirectTo =
                location.state?.redirectTo ||
                (data.role === 2 ? "/Admin/category" : "/");

            navigate(redirectTo, { replace: true });

        } catch (err: any) {
            console.error("Lỗi đăng nhập:", err);
            alert(err.message || "Đăng nhập thất bại");
        }
    };
    const onGoogleSuccess = async (credentialResponse: any) => {
        try {
            const idToken = credentialResponse.credential;
            console.log("Đang gửi token lên server...",idToken);
    
            const data = await loginWithGoogle(idToken); 
    
            if (!data?.token) throw new Error("Backend không trả về token");
    
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("cartId", data.cartId.toString());
            localStorage.setItem("role", data.role.toString());
            
            const { token, ...userInfo } = data;
            localStorage.setItem("user", JSON.stringify(userInfo));
            
            setUser(userInfo);
    
            const redirectTo = location.state?.redirectTo || (data.role === 2 ? "/Admin/category" : "/");
            navigate(redirectTo, { replace: true });
    
            alert("Đăng nhập Google thành công!");
    
        } catch (err: any) {
            console.error("Lỗi xác thực Google:", err);
            alert("Server không xác nhận được tài khoản Google này.");
        }
    };

    const handleRegisterSuccess = (registeredPhone: string) => {
        setActiveTab("login");
        setPhone(registeredPhone);
        setPassword("");
    };

    return (
        <div className="login-wrapper">
            <div className="login-form">
                <div className="login-tabs">
                    <span
                        className={activeTab === "login" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("login")}
                    >
                        Đăng nhập
                    </span>
                    <span
                        className={activeTab === "register" ? "active-tab" : "inactive-tab"}
                        onClick={() => setActiveTab("register")}
                    >
                        Đăng ký tài khoản
                    </span>
                </div>

                {activeTab === "login" ? (
                    <div>
                        <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-btn">
                            Đăng nhập
                        </button>
                        </form>
                        <div className="google-login-container">
                            <GoogleOAuthProvider clientId={clientId}>
                                <GoogleLogin
                                    onSuccess={onGoogleSuccess}
                                    onError={() => alert('Đăng nhập Google thất bại')}
                                    useOneTap 
                                />
                            </GoogleOAuthProvider>
                        </div>
                    </div>
                ) : (
                    <Register onSuccess={handleRegisterSuccess} />
                )}
            </div>
        </div>
    );
};
  

export default LoginPage;
