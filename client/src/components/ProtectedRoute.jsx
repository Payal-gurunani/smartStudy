import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="text-white text-center mt-20">Checking authentication...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children;
}
