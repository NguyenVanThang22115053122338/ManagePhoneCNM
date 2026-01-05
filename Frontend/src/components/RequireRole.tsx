import { Navigate } from "react-router-dom";
import React from "react";

interface RequireRoleProps {
  allow: number[];
  children: React.ReactNode;
}

const RequireRole = ({ allow, children }: RequireRoleProps) => {
  const roleId = Number(localStorage.getItem("role"));

  if (!roleId) {
    return (
      <Navigate
        to="/login"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
  }

  if (!allow.includes(roleId)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
