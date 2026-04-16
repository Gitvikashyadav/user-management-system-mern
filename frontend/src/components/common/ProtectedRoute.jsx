import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#080c14] gap-3 text-slate-500 text-sm">
    <span className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-sky-400 spinner inline-block" />
    Loading...
  </div>
);

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

export const RoleRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
