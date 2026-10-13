import { Bell, Menu, Search, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
    const location = useLocation();

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/employees": "Employees",
  "/admin/employees/add": "Add Employee",
  "/employee/dashboard": "Dashboard",
  "/employee/profile": "My Profile",
};

const currentPage =
  pageTitles[location.pathname] ||
  (location.pathname.endsWith("/edit")
    ? "Edit Employee"
    : location.pathname.startsWith("/admin/employees/")
      ? "Employee Details"
      : "Workspace");
  const user = JSON.parse(
    sessionStorage.getItem("worknest_user") || "{}"
  );

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <p className="text-xs font-medium text-slate-400">
            WORKSPACE / OVERVIEW
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-400 md:flex">
          <Search size={17} />
          <span className="pr-12 text-sm">Manage your workspace</span>
        </div>

        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
            {user.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user.name || "Administrator"}
            </p>
            <p className="text-xs capitalize text-slate-400">
              {user.role || "Admin"}
            </p>
          </div>

          <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;