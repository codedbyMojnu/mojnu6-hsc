import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-[--primary-bg]">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
