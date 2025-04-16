import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const ProjectsSection = () => {
  // Fetch projects from API
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  return (
    <section id="projects" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-poppins font-bold text-primary text-center mb-6">Projects (Brands)</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Check out some of my recent projects where I've built modern web applications with React, Node.js, and MongoDB.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden shadow-lg">
                <div className="h-48 bg-gray-200">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Project cards
            projects?.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 box-shadow-custom"
              >
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src={project.imageUrl || "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={project.projectUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-primary px-4 py-2 rounded-full font-medium"
                    >
                      View Project
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-poppins font-semibold mb-2 text-primary">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, index) => (
                      <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/projects" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
