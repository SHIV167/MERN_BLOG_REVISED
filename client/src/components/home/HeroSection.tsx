import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="bg-primary text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute right-0 top-10 opacity-20">
        <div className="w-32 h-32 bg-white/10 rounded-full"></div>
      </div>
      <div className="absolute left-10 bottom-10 opacity-20">
        <div className="w-20 h-20 bg-white/10 rounded-full"></div>
      </div>
      <div className="absolute right-40 top-40 opacity-10">
        <div className="grid grid-cols-4 grid-rows-4 gap-1">
          {[...Array(16)].map((_, index) => (
            <div key={index} className="w-2 h-2 bg-white rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">SHIV JHA</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">Full Stack Developer & Tech Enthusiast</p>
          <p className="text-lg opacity-80 mb-8 max-w-lg">
            Specialized in building modern web applications with React, Node.js, and MongoDB. 
            Passionate about creating clean, efficient, and user-friendly interfaces.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#contact" 
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Me
            </a>
            <a 
              href="#projects" 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Projects
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80" 
            alt="Developer working on computer" 
            className="w-full max-w-md rounded-lg object-cover opacity-80" 
            style={{ clipPath: "polygon(10% 0, 100% 0%, 90% 100%, 0% 100%)" }}
          />
        </div>
      </div>
      
      <div className="wave-divider"></div>
    </section>
  );
};

export default HeroSection;
