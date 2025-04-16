import { Link } from "wouter";
import { 
  FaLinkedinIn, 
  FaGithub, 
  FaTwitter, 
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaPaperPlane
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="wave-divider transform rotate-180"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">SHIV JHA</h3>
            <p className="text-white/80 mb-4">Full Stack Developer & Tech Enthusiast specializing in modern web technologies.</p>
            <div className="flex space-x-3">
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
          
          <div>
            <h3 className="text-lg font-poppins font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>Mumbai, Maharashtra, India</span>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>contact@shivjha.com</span>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                <span>+91 98765 43210</span>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-poppins font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <p><Link href="/" className="hover:text-secondary transition-colors">Home</Link></p>
              <p><a href="/#about" className="hover:text-secondary transition-colors">About</a></p>
              <p><a href="/#projects" className="hover:text-secondary transition-colors">Projects</a></p>
              <p><Link href="/blog" className="hover:text-secondary transition-colors">Blog</Link></p>
              <p><a href="/#contact" className="hover:text-secondary transition-colors">Contact</a></p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-poppins font-semibold mb-4">Newsletter</h3>
            <p className="text-white/80 mb-4">Subscribe to get updates on my latest projects, blog posts, and tech insights.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="rounded-l-lg rounded-r-none text-gray-800 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-white rounded-l-none rounded-r-lg px-4"
              >
                <FaPaperPlane />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Shiv Jha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
