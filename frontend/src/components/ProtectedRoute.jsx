import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const ProtectedRoute = ({ allowedRole }) => {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const verifyUser = async () => {
      const token = sessionStorage.getItem("worknest_token");

      if (!token) {
        if (active) setStatus("unauthorized");
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        if (!active) return;

        if (data.user?.role === allowedRole) {
          setStatus("authorized");
        } else {
          setStatus("forbidden");
        }
      } catch {
        if (active) {
          sessionStorage.removeItem("worknest_token");
          sessionStorage.removeItem("worknest_user");
          setStatus("unauthorized");
        }
      }
    };

    verifyUser();

    return () => {
      active = false;
    };
  }, [allowedRole]);

  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F7F8FC] px-6 text-center">
        <h1 className="text-4xl font-bold text-slate-900">403</h1>
        <p className="text-slate-500">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;