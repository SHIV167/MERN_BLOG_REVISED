import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { FaArrowRight } from "react-icons/fa";

const BlogSection = () => {
  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-poppins font-bold text-primary text-center mb-12">Latest Blog Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-light rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-dark relative">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Blog post cards
            posts?.slice(0, 3).map((post) => (
              <div 
                key={post.id} 
                className="bg-light rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 box-shadow-custom"
              >
                <div className="h-48 bg-dark relative">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 gradient-overlay"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <div className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-2">
                      {post.category}
                    </div>
                    <h3 className="text-white text-xl font-poppins font-semibold">{post.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </span>
                    <Link 
                      href={`/blog/${post.id}`} 
                      className="text-primary hover:text-primary/80 font-medium flex items-center"
                    >
                      <span>Read More</span>
                      <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/blog" 
            className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
