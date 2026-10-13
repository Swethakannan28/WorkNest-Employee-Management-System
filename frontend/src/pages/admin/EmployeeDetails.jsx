import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, Building2, BriefcaseBusiness } from "lucide-react";
import api from "../../services/api";

const EmployeeDetails = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/admin/employees/${id}`);
        setEmployee(data.employee || data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <p className="p-8 text-slate-500">Loading employee details...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <Link
        to="/admin/employees"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={17} /> Back to Employees
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-indigo-600">
            EMPLOYEE PROFILE
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Employee Details
          </h1>
        </div>

        <Link
          to={`/admin/employees/${id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Pencil size={17} /> Edit Employee
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#101B3C] p-7 sm:p-9">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-3xl font-bold text-white">
              {employee.name?.charAt(0)?.toUpperCase() || "E"}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold text-white">
                {employee.name}
              </h2>
              <p className="mt-2 break-all text-sm text-slate-300">
                {employee.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-7 sm:grid-cols-2 sm:p-9">
          {[
            { label: "Email Address", value: employee.email, icon: Mail },
            { label: "Department", value: employee.department, icon: Building2 },
            { label: "Designation", value: employee.designation, icon: BriefcaseBusiness },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Icon size={17} /> {label}
              </div>
              <p className="mt-3 font-semibold text-slate-900">
                {value || "Not provided"}
              </p>
            </div>
          ))}

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Account Status</p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                employee.isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;