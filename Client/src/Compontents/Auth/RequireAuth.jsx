
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
    const { isLoggedIn, role } = useSelector((state) => state.auth);
    const location = useLocation();

    const userRole = role ? String(role).toUpperCase() : "";
    const allowed = Array.isArray(allowedRoles) && allowedRoles.some(r => String(r).toUpperCase() === userRole);

    if (isLoggedIn && allowed) return <Outlet />;

    if (isLoggedIn) return <Navigate to="/" state={{ from: location }} replace />;

    return <Navigate to="/login" state={{ from: location }} replace />;
}
export default RequireAuth;