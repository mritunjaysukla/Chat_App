import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
