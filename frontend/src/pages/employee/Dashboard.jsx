import { Link } from "react-router-dom";
import { UserRound, ArrowRight, ShieldCheck } from "lucide-react";

const Dashboard = () => {
  const user = JSON.parse(
    sessionStorage.getItem("worknest_user") || "{}"
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-indigo-600">
          MY WORKSPACE
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user.name || "Employee"} 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Here's your personal WorkNest workspace.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <UserRound size={25} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            My Profile
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            View and update your personal information.
          </p>

          <Link
            to="/employee/profile"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
          >
            View Profile
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <ShieldCheck size={25} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Secure Workspace
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your employee account is protected with role-based access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;