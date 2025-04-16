import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { FaArrowLeft } from "react-icons/fa";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostPage = () => {
  // Get post ID from URL
  const [match, params] = useRoute("/blog/:id");
  const postId = params?.id ? parseInt(params.id) : undefined;

  // Fetch specific blog post
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts', postId],
    enabled: !!postId,
  });

  // Fetch related posts (all posts for simplicity, would filter in real app)
  const { data: allPosts } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  // Get related posts (excluding current post)
  const relatedPosts = allPosts?.filter(p => p.id !== postId).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {isLoading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-64 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl text-red-500 mb-4">Failed to load blog post</h2>
            <p className="mb-6">There was an error loading this blog post. It may not exist or there was a technical problem.</p>
            <Link href="/blog" className="text-primary hover:text-primary/80">
              &larr; Back to all posts
            </Link>
          </div>
        ) : post ? (
          <>
            {/* Blog Post Header */}
            <section className="bg-primary text-white py-16">
              <div className="container mx-auto px-4">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-white/80 hover:text-white mb-6"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to all posts
                </Link>
                <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4">
                  <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-white/80">
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="wave-divider"></div>
            </section>

            {/* Blog Post Content */}
            <section className="py-16 bg-light">
              <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-80 object-cover"
                    />
                  )}
                  <div className="p-8">
                    <div className="prose prose-lg max-w-none">
                      {post.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                  <div className="mt-16">
                    <h2 className="text-2xl font-poppins font-semibold text-primary mb-8">Related Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                          <div className="bg-white rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 box-shadow-custom">
                            <div className="h-40 bg-dark relative">
                              <img 
                                src={relatedPost.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"} 
                                alt={relatedPost.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 gradient-overlay"></div>
                              <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h3 className="text-white text-lg font-poppins font-semibold">{relatedPost.title}</h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl text-red-500 mb-4">Blog post not found</h2>
            <p className="mb-6">The blog post you are looking for doesn't exist or has been removed.</p>
            <Link href="/blog" className="text-primary hover:text-primary/80">
              &larr; Back to all posts
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
