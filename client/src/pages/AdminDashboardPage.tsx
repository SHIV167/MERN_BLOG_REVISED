import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import ContactList from "@/components/admin/ContactList";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboardPage = () => {
  // Fetch recent blog posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  // Fetch recent projects
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  return (
    <AdminLayout title="Dashboard">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Blog Posts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.slice(0, 5).map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4 text-gray-500">No blog posts found</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Projects */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Technologies</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.slice(0, 5).map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {project.technologies?.join(", ")}
                      </TableCell>
                      <TableCell>{format(new Date(project.createdAt), 'MMM d, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4 text-gray-500">No projects found</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Contact Messages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactList />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
