import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  FaLinkedinIn, 
  FaGithub, 
  FaTwitter, 
  FaYoutube 
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: user } = useQuery({ 
    queryKey: ['/api/auth/me'],
  });

  const isActive = (path: string) => {
    return location === path;
  };

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-white font-poppins font-bold text-2xl">
            <Link href="/" className="flex items-center">
              <span>SHIV JHA</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-white">
            <Link href="/" className={`font-medium hover:text-secondary transition-colors ${isActive("/") ? "text-secondary" : ""}`}>
              Home
            </Link>
            <a href="/#about" className="font-medium hover:text-secondary transition-colors">
              About
            </a>
            <a href="/#skills" className="font-medium hover:text-secondary transition-colors">
              Skills
            </a>
            <a href="/#projects" className="font-medium hover:text-secondary transition-colors">
              Projects
            </a>
            <Link href="/blog" className={`font-medium hover:text-secondary transition-colors ${isActive("/blog") ? "text-secondary" : ""}`}>
              Blog
            </Link>
            <a href="/#contact" className="font-medium hover:text-secondary transition-colors">
              Contact
            </a>
            {user?.isAdmin && (
              <Link href="/admin" className={`font-medium hover:text-secondary transition-colors ${location.startsWith("/admin") ? "text-secondary" : ""}`}>
                Admin
              </Link>
            )}
          </nav>
          
          <div className="hidden md:flex space-x-3 text-white">
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaLinkedinIn className="text-sm" />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaGithub className="text-sm" />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaTwitter className="text-sm" />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaYoutube className="text-sm" />
            </a>
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-secondary hover:bg-white/10"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
          
          <button 
            className="md:hidden text-white" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <HiX className="text-xl" />
            ) : (
              <HiMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 py-4 px-4">
          <div className="flex flex-col space-y-3 text-white">
            <Link href="/" className="py-2 px-4 hover:bg-white/10 rounded transition-colors">Home</Link>
            <a href="/#about" className="py-2 px-4 hover:bg-white/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="/#skills" className="py-2 px-4 hover:bg-white/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Skills</a>
            <a href="/#projects" className="py-2 px-4 hover:bg-white/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Projects</a>
            <Link href="/blog" className="py-2 px-4 hover:bg-white/10 rounded transition-colors">Blog</Link>
            <a href="/#contact" className="py-2 px-4 hover:bg-white/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
            {user?.isAdmin && (
              <Link href="/admin" className="py-2 px-4 hover:bg-white/10 rounded transition-colors">
                Admin
              </Link>
            )}
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 justify-start pl-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaLinkedinIn />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaGithub />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <FaYoutube />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
