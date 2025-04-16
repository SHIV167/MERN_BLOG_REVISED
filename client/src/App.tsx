import { Route, Switch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// Pages
import HomePage from "@/pages/HomePage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminProjectsPage from "@/pages/AdminProjectsPage";
import AdminBlogPage from "@/pages/AdminBlogPage";
import AdminVideosPage from "@/pages/AdminVideosPage";
import NotFound from "@/pages/not-found";

function App() {
  // Check user authentication status on app load
  const { data: user } = useQuery({ 
    queryKey: ['/api/auth/me'],
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
  
  // Log auth status in dev mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (user) {
        console.log('Logged in as:', user.username);
      } else {
        console.log('Not authenticated');
      }
    }
  }, [user]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:id" component={BlogPostPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/projects" component={AdminProjectsPage} />
      <Route path="/admin/blog" component={AdminBlogPage} />
      <Route path="/admin/videos" component={AdminVideosPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
