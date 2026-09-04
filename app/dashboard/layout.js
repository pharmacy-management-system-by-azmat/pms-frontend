import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-full bg-background">
      <DashboardSidebar />
      <div className="min-w-0 lg:ml-64">
        <DashboardNavbar />
        {children}
      </div>
    </div>
  );
}
