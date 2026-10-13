import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  UsersRound,
  UserCheck,
  Building2,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    sessionStorage.getItem("worknest_user") || "{}"
  );

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/employees");

      // Supports { employees: [...] } or direct array response
      const employeeList = Array.isArray(data)
        ? data
        : data.employees;

      setEmployees(
        Array.isArray(employeeList) ? employeeList : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load employee information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Dashboard statistics
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.isActive === true
  ).length;

  const totalDepartments = new Set(
    employees
      .map((employee) => employee.department?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const recentEmployees = [...employees]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: UsersRound,
      iconStyle: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      iconStyle: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-indigo-600">
            WORKSPACE OVERVIEW
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.name?.split(" ")[0] || "Admin"} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your team today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
          <CalendarDays size={17} className="text-indigo-600" />

          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-red-700">{error}</p>

          <button
            onClick={fetchEmployees}
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-700"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading your workspace...
            </p>
          </div>
        </div>
      ) : error ? null : (
        <>
          {/* STATISTICS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map(({ title, value, icon: Icon, iconStyle }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${iconStyle}`}>
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition group-hover:text-indigo-600"
                  />
                </div>

                <p className="mt-6 text-sm font-medium text-slate-500">
                  {title}
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {value}
                </h2>

                <p className="mt-3 text-xs text-slate-400">
                  Current workspace data
                </p>
              </div>
            ))}
          </div>

          {/* RECENT EMPLOYEES */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recently Added Employees
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest team members at a glance.
                </p>
              </div>

              <Link
                to="/admin/employees"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                View All Employees
                <ArrowRight size={17} />
              </Link>
            </div>

            {recentEmployees.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <div className="rounded-2xl bg-indigo-50 p-5 text-indigo-600">
                  <UsersRound size={28} />
                </div>

                <h3 className="mt-5 font-semibold text-slate-900">
                  No employees yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Start building your team by adding your first employee.
                </p>

                <Link
                  to="/admin/employees/add"
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Add Employee
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-160 text-left">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Designation</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentEmployees.map((employee) => (
                      <tr
                        key={employee._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                              {employee.name?.charAt(0)?.toUpperCase() || "E"}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {employee.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {employee.department || "—"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {employee.designation || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              employee.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;