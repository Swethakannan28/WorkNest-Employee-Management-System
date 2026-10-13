import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeDetails from "./pages/admin/EmployeeDetails";
import EditEmployee from "./pages/admin/EditEmployee";

// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyProfile from "./pages/employee/MyProfile";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/employees"
              element={<Employees />}
            />

            <Route
              path="/admin/employees/add"
              element={<AddEmployee />}
            />

            <Route
  path="/admin/employees/:id/edit"
  element={<EditEmployee />}
/>

<Route
  path="/admin/employees/:id"
  element={<EmployeeDetails />}
/>
          </Route>
        </Route>

        {/* EMPLOYEE PROTECTED ROUTES */}
        <Route element={<ProtectedRoute allowedRole="employee" />}>
          <Route element={<EmployeeLayout />}>
            <Route
              path="/employee/dashboard"
              element={<EmployeeDashboard />}
            />

            <Route
              path="/employee/profile"
              element={<MyProfile />}
            />
          </Route>
        </Route>

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-5 text-center">
              <h1 className="text-5xl font-bold text-slate-900">
                404
              </h1>

              <p className="text-slate-500">
                Page not found
              </p>

              <a
                href="/login"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
              >
                Back to Login
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;