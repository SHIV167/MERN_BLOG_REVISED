import { useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useQuery } from "@tanstack/react-query";
import { useIsAdmin } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [, navigate] = useLocation();
  const isAdmin = useIsAdmin();
  
  // Check if user is authenticated and admin
  const { data: user, isLoading } = useQuery({ 
    queryKey: ['/api/auth/me'],
  });

  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!isLoading && (!user || !user.isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isLoading, navigate]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-light">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not admin, don't render anything (will redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader title={title} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
