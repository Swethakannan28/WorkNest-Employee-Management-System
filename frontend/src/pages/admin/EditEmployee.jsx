import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    department: "",
    designation: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/admin/employees/${id}`);
        const employee = data.employee || data;

        setForm({
          name: employee.name || "",
          department: employee.department || "",
          designation: employee.designation || "",
          isActive: employee.isActive ?? true,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/admin/employees/${id}`, {
        name: form.name.trim(),
        department: form.department.trim(),
        designation: form.designation.trim(),
        isActive: form.isActive,
      });

      toast.success("Employee updated successfully");
      navigate(`/admin/employees/${id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to update employee"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-8 text-slate-500">Loading employee...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link
        to="/admin/employees"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} /> Back to Employees
      </Link>

      <div>
        <p className="text-xs font-bold tracking-widest text-indigo-600">
          PEOPLE MANAGEMENT
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Edit Employee
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update employee information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {[
          { name: "name", label: "Full Name" },
          { name: "department", label: "Department" },
          { name: "designation", label: "Designation" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              {label}
            </label>

            <input
              id={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="isActive"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Account Status
          </label>

          <select
            id="isActive"
            name="isActive"
            value={String(form.isActive)}
            onChange={handleChange}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            to={`/admin/employees/${id}`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;