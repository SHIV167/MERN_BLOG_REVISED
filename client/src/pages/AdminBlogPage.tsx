import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";

const AdminBlogPage = () => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog-posts/${id}`, {});
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsDeleteOpen(false);
      toast({
        title: "Blog post deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete blog post",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleView = (post: any) => {
    setSelectedPost(post);
    setIsViewOpen(true);
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsEditOpen(true);
  };

  const handleDelete = (post: any) => {
    setSelectedPost(post);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPost) {
      deletePostMutation.mutate(selectedPost.id);
    }
  };

  const handleFormSuccess = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  return (
    <AdminLayout title="Manage Blog Posts">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <FaPlus className="mr-2" /> Add Blog Post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {posts && posts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(post.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(post.updatedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleView(post)}
                        className="text-gray-500"
                      >
                        <FaEye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(post)}
                        className="text-blue-500"
                      >
                        <FaEdit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(post)}
                        className="text-red-500"
                      >
                        <FaTrash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No blog posts have been published yet</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <FaPlus className="mr-2" /> Write Your First Post
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add Blog Post Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write and publish a new blog post on your portfolio.
            </DialogDescription>
          </DialogHeader>
          <BlogForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Blog Post Dialog */}
      {selectedPost && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Update your blog post content and details.
              </DialogDescription>
            </DialogHeader>
            <BlogForm post={selectedPost} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      )}

      {/* View Blog Post Dialog */}
      {selectedPost && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <Badge className="mb-2 self-start">{selectedPost.category}</Badge>
              <DialogTitle className="text-2xl">{selectedPost.title}</DialogTitle>
              <DialogDescription>
                Published: {format(new Date(selectedPost.createdAt), 'MMMM d, yyyy')}
                {" | "}
                Updated: {format(new Date(selectedPost.updatedAt), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {selectedPost.imageUrl && (
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full rounded-md object-cover max-h-64"
                />
              )}
              <div className="prose prose-sm max-w-none">
                {selectedPost.content.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewOpen(false);
                handleEdit(selectedPost);
              }}>
                Edit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlogPage;
