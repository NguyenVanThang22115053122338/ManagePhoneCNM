// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/payment",
  "/payment-success",
  "/payment-return",
  "/checkout/success",
  "/order-success",
];

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const pathname = location.pathname;

  const hasToken = !!localStorage.getItem("accessToken");

  if (PUBLIC_ROUTES.some(p => pathname.startsWith(p))) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div style={centerStyle}>
        Đang xác thực người dùng...
      </div>
    );
  }

  if (!user && hasToken) {
    return <Outlet />;
  }

  if (!user && !hasToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
}

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
};
