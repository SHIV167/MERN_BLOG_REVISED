import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import VideoForm from "@/components/admin/VideoForm";
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
import { Card, CardContent } from "@/components/ui/card";
import { FaEdit, FaTrash, FaPlus, FaExternalLinkAlt } from "react-icons/fa";

const AdminVideosPage = () => {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  // Fetch videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/youtube-videos'],
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/youtube-videos/${id}`, {});
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube-videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsDeleteOpen(false);
      toast({
        title: "Video deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete video",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (video: any) => {
    setSelectedVideo(video);
    setIsEditOpen(true);
  };

  const handleDelete = (video: any) => {
    setSelectedVideo(video);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedVideo) {
      deleteVideoMutation.mutate(selectedVideo.id);
    }
  };

  const handleFormSuccess = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  return (
    <AdminLayout title="Manage YouTube Videos">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">YouTube Videos</h2>
        <Button onClick={() => setIsAddOpen(true)}>
          <FaPlus className="mr-2" /> Add Video
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white p-2 rounded-full"
                      >
                        <FaExternalLinkAlt />
                      </a>
                      <Button 
                        size="icon" 
                        variant="secondary"
                        onClick={() => handleEdit(video)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive"
                        onClick={() => handleDelete(video)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Added: {format(new Date(video.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-gray-600 mt-2 line-clamp-2">{video.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No YouTube videos have been added yet</p>
          <Button onClick={() => setIsAddOpen(true)}>
            <FaPlus className="mr-2" /> Add Your First Video
          </Button>
        </div>
      )}

      {/* Table view for larger screens */}
      {videos && videos.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow overflow-hidden hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell className="truncate max-w-[300px]">
                    <a 
                      href={video.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      {video.videoUrl}
                      <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>{format(new Date(video.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(video)}
                      className="text-blue-500"
                    >
                      <FaEdit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(video)}
                      className="text-red-500"
                    >
                      <FaTrash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Video Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add YouTube Video</DialogTitle>
            <DialogDescription>
              Add a YouTube video to showcase on your portfolio.
            </DialogDescription>
          </DialogHeader>
          <VideoForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Video Dialog */}
      {selectedVideo && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit YouTube Video</DialogTitle>
              <DialogDescription>
                Update the details of your YouTube video.
              </DialogDescription>
            </DialogHeader>
            <VideoForm video={selectedVideo} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete YouTube Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
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

export default AdminVideosPage;
