import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  FaHome,
  FaTachometerAlt,
  FaBriefcase,
  FaNewspaper,
  FaVideo,
  FaEnvelope,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

interface SidebarProps {
  collapse?: boolean;
}

const Sidebar = ({ collapse = false }: SidebarProps) => {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className={`bg-gray-100 ${collapse ? "w-16" : "w-64"} min-h-screen transition-all duration-300`}>
      <div className="p-4">
        <Link href="/" className="block">
          <h1 className={`font-poppins font-bold text-primary ${collapse ? "text-center text-sm" : "text-xl"}`}>
            {collapse ? "SJ" : "Admin Dashboard"}
          </h1>
        </Link>
      </div>
      
      <nav className="mt-8">
        <div className="space-y-2 px-4">
          <Link href="/">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-gray-700 hover:bg-gray-200 ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaHome className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Homepage</span>}
            </Button>
          </Link>
          
          <Link href="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaTachometerAlt className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Dashboard</span>}
            </Button>
          </Link>
          
          <Link href="/admin/projects">
            <Button 
              variant={isActive("/admin/projects") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin/projects") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaBriefcase className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Projects</span>}
            </Button>
          </Link>
          
          <Link href="/admin/blog">
            <Button 
              variant={isActive("/admin/blog") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin/blog") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaNewspaper className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Blog Posts</span>}
            </Button>
          </Link>
          
          <Link href="/admin/videos">
            <Button 
              variant={isActive("/admin/videos") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin/videos") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaVideo className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>YouTube Videos</span>}
            </Button>
          </Link>
          
          <Link href="/admin/messages">
            <Button 
              variant={isActive("/admin/messages") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin/messages") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaEnvelope className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Messages</span>}
            </Button>
          </Link>
          
          <Link href="/admin/settings">
            <Button 
              variant={isActive("/admin/settings") ? "default" : "ghost"} 
              className={`w-full justify-start ${isActive("/admin/settings") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-200"} ${collapse ? "justify-center px-2" : ""}`}
            >
              <FaCog className={`${collapse ? "mr-0" : "mr-2"}`} />
              {!collapse && <span>Settings</span>}
            </Button>
          </Link>
        </div>
        
        <div className="mt-auto pt-8 px-4">
          <Button 
            variant="ghost" 
            className={`w-full justify-start text-gray-700 hover:bg-gray-200 ${collapse ? "justify-center px-2" : ""}`}
            onClick={handleLogout}
          >
            <FaSignOutAlt className={`${collapse ? "mr-0" : "mr-2"}`} />
            {!collapse && <span>Logout</span>}
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
