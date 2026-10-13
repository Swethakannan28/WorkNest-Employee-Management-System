import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UsersRound,
  UserPlus,
  UserRound,
  LogOut,
  Layers3,
  ShieldCheck,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(
    sessionStorage.getItem("worknest_user") || "{}"
  );

  const isAdmin = user.role === "admin";

  const adminLinks = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      path: "/admin/employees",
      icon: UsersRound,
    },
    {
      name: "Add Employee",
      path: "/admin/employees/add",
      icon: UserPlus,
    },
  ];

  const employeeLinks = [
    {
      name: "Overview",
      path: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      path: "/employee/profile",
      icon: UserRound,
    },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  // Exact route matching - prevents two links becoming active
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("worknest_token");
    sessionStorage.removeItem("worknest_user");

    onClose?.();

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 flex-col bg-[#101B3C] text-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/employee/dashboard"}
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <Layers3 size={22} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              WorkNest<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* MAIN MENU */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <p className="mb-5 px-4 text-[11px] font-bold tracking-[0.18em] text-slate-500">
            MAIN MENU
          </p>

          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;

              const active = isLinkActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/20"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM SECTION */}
        <div className="space-y-4 border-t border-white/10 p-4">
          <div className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
            <div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-400">
              <ShieldCheck size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Secure Workspace
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Role-based access enabled
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;