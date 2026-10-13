import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
  Layers3,
  LoaderCircle,
} from "lucide-react";

import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (!data.token || !["admin", "employee"].includes(data.user?.role)) {
        toast.error("Invalid login response");
        return;
      }

      sessionStorage.setItem("worknest_token", data.token);
      sessionStorage.setItem(
        "worknest_user",
        JSON.stringify(data.user)
      );

      toast.success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/employee/dashboard", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] lg:grid lg:grid-cols-2">

      {/* LEFT SECTION */}
      <div className="relative hidden min-h-screen overflow-hidden bg-[#101B3C] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">

        <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500">
            <Layers3 size={23} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            WorkNest<span className="text-indigo-400">.</span>
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-indigo-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Your workplace, simplified
          </div>

          <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
            A better way to
            <br />
            manage your
            <br />
            <span className="text-indigo-400">people.</span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
            Everything your team needs, all in one place.
            Manage employee information, stay organized,
            and make every workday more productive.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <Users className="mb-4 text-indigo-300" size={26} />

              <p className="font-medium">People first</p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your entire team in one organized workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <ShieldCheck className="mb-4 text-indigo-300" size={26} />

              <p className="font-medium">Secure access</p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                A dedicated experience for every role.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          © 2026 WorkNest. Employee Management System.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:justify-center lg:px-16 xl:px-24">

        {/* Mobile logo */}
        <div className="mb-16 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Layers3 size={22} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-[#101B3C]">
            WorkNest<span className="text-indigo-600">.</span>
          </span>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
              <LockKeyhole size={13} />
              SECURE SIGN IN
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#101B3C] sm:text-4xl">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to WorkNest
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-9 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Protected employee access
          </div>
        </div>

        <p className="mt-auto pt-12 text-center text-xs text-slate-400 lg:hidden">
          © 2026 WorkNest. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;