import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Search,
  UserPlus,
  UsersRound,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Mail,
  Building2,
  BriefcaseBusiness,
  X,
  AlertTriangle,
} from "lucide-react";

import api from "../../services/api";

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/employees");

      const list = Array.isArray(data)
        ? data
        : data.employees;

      setEmployees(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load employees. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // SEARCH
  const filteredEmployees = employees.filter((employee) => {
    const keyword = search.trim().toLowerCase();

    return (
      employee.name?.toLowerCase().includes(keyword) ||
      employee.email?.toLowerCase().includes(keyword)
    );
  });

  // DELETE
  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;

    try {
      setDeleting(true);

      await api.delete(`/admin/employees/${deleteTarget._id}`);

      setEmployees((previous) =>
        previous.filter(
          (employee) => employee._id !== deleteTarget._id
        )
      );

      toast.success("Employee deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-indigo-600">
            PEOPLE MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Employees
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your team members in one organized workspace.
          </p>
        </div>

        <Link
          to="/admin/employees/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700"
        >
          <UserPlus size={18} />
          Add Employee
        </Link>
      </div>

      {/* MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOOLBAR */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Employee Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {employees.length} team members
            </p>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <button
              type="button"
              onClick={fetchEmployees}
              disabled={loading}
              title="Refresh employees"
              aria-label="Refresh employees"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <p className="text-sm text-slate-500">
              Loading employees...
            </p>
          </div>
        ) : error ? (
          /* ERROR */
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-5 text-center">
            <AlertTriangle size={30} className="text-red-500" />

            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={fetchEmployees}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredEmployees.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="rounded-2xl bg-indigo-50 p-5 text-indigo-600">
              <UsersRound size={30} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              {search ? "No matching employees" : "No employees yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {search
                ? "Try searching with a different name or email."
                : "Start building your team by adding your first employee."}
            </p>

            {!search && (
              <Link
                to="/admin/employees/add"
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Add Employee
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-190 text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Designation</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      {/* NAME */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                            {employee.name?.charAt(0)?.toUpperCase() || "E"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
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

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/employees/${employee._id}`)
                            }
                            title="View employee"
                            aria-label={`View ${employee.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/employees/${employee._id}/edit`)
                            }
                            title="Edit employee"
                            aria-label={`Edit ${employee.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(employee)}
                            title="Delete employee"
                            aria-label={`Delete ${employee.name}`}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredEmployees.map((employee) => (
                <div key={employee._id} className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                      {employee.name?.charAt(0)?.toUpperCase() || "E"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {employee.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 break-all text-xs text-slate-500">
                        <Mail size={13} className="shrink-0" />
                        {employee.email}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        employee.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {employee.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2">
                      <Building2 size={15} className="text-slate-400" />
                      {employee.department || "—"}
                    </p>

                    <p className="flex items-center gap-2">
                      <BriefcaseBusiness
                        size={15}
                        className="text-slate-400"
                      />
                      {employee.designation || "—"}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() =>
                        navigate(`/admin/employees/${employee._id}`)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2.5 text-xs font-semibold text-indigo-700"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/employees/${employee._id}/edit`)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-50 py-2.5 text-xs font-semibold text-amber-700"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(employee)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-xs font-semibold text-red-600"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          </>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          role="presentation"
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <AlertTriangle size={24} />
              </div>

              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id="delete-title"
              className="mt-5 text-xl font-bold text-slate-900"
            >
              Delete Employee?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;