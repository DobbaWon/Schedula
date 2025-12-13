import { Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import Holiday from "./pages/holiday/Holiday";
import TeamDepartmentManagement from "./pages/management/TeamDepartmentManagement";
import OrganisationSettings from "./pages/organisation/OrganisationSettings";
import ScheduleSubmit from "./pages/scheduleSubmit/ScheduleSubmit";
import NotFound from "./pages/notFound/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/holiday" element={<Holiday />} />
      <Route path="/team-department-management" element={<TeamDepartmentManagement />} />
      <Route path="/organisation-settings" element={<OrganisationSettings />} />
      <Route path="/schedule-submit" element={<ScheduleSubmit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
