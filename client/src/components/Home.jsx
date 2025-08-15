import { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import GuestHome from "../components/GuestHome";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 sm:ml-60 px-4 py-6 sm:px-8 sm:py-10 w-full flex items-center justify-center bg-gray-900 text-white">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
  <GuestHome />
  );
}
