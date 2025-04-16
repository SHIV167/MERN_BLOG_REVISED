import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { FaArrowRight } from "react-icons/fa";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPage = () => {
  // Fetch all blog posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Blog Header */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">Blog</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on web development, design, and technology.
            </p>
          </div>
          <div className="wave-divider"></div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 bg-light">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
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
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <h3 className="text-2xl text-red-500 mb-4">Error loading blog posts</h3>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-2xl text-gray-800 mb-4">No blog posts yet</h3>
                <p className="text-gray-600">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts?.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 box-shadow-custom"
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
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
