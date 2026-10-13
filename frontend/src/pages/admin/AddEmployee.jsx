import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  UserPlus,
  UserRound,
  Mail,
  LockKeyhole,
  Building2,
  BriefcaseBusiness,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

import api from "../../services/api";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      department: form.department.trim(),
      designation: form.designation.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (payload.password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    try {
      setSaving(true);

      await api.post("/admin/employees", payload);

      toast.success("Employee created successfully!");

      navigate("/admin/employees", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to create employee. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="mx-auto max-w-4xl space-y-7">

      {/* BACK */}
      <Link
        to="/admin/employees"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={17} />
        Back to Employees
      </Link>

      {/* HEADER */}
      <div>
        <p className="text-xs font-bold tracking-[0.16em] text-indigo-600">
          PEOPLE MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Add New Employee
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create a new employee account for your workspace.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* FORM HEADING */}
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 sm:p-8">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <UserPlus size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Employee Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the details to set up an employee account.
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">

          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Full Name <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Arun Kumar"
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@company.com"
                autoComplete="off"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* DEPARTMENT */}
          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Department <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="department"
                name="department"
                type="text"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Engineering"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* DESIGNATION */}
          <div>
            <label
              htmlFor="designation"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Designation <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <BriefcaseBusiness
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="designation"
                name="designation"
                type="text"
                value={form.designation}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Initial Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className={`${inputClass} pr-12`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              The employee will use this password to sign in to WorkNest.
            </p>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 bg-slate-50/60 p-6 sm:flex-row sm:px-8">
          <Link
            to="/admin/employees"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating Employee...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;