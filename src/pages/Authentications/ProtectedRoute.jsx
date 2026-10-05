import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};