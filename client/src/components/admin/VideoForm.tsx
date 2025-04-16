import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// YouTube video form schema
const videoSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  videoUrl: z.string()
    .url("Must be a valid URL")
    .regex(/youtube\.com|youtu\.be/i, "Must be a YouTube URL"),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface VideoFormProps {
  video?: any;
  onSuccess?: () => void;
}

const VideoForm = ({ video, onSuccess }: VideoFormProps) => {
  const { toast } = useToast();
  const isEditing = !!video;

  // Form setup
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      thumbnailUrl: video?.thumbnailUrl || "",
      videoUrl: video?.videoUrl || "",
    },
  });

  // Update form values when video changes (fixes edit mode)
  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title || "",
        description: video.description || "",
        thumbnailUrl: video.thumbnailUrl || "",
        videoUrl: video.videoUrl || "",
      });
    }
  }, [video, form]);

  // Create/update YouTube video mutation
  const videoMutation = useMutation({
    mutationFn: async (data: VideoFormValues) => {
      if (isEditing) {
        const response = await apiRequest("PUT", `/api/youtube-videos/${video.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/youtube-videos", data);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `YouTube video ${isEditing ? "updated" : "created"} successfully`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/youtube-videos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      if (onSuccess) onSuccess();
      if (!isEditing) form.reset();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} YouTube video`,
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VideoFormValues) => {
    // Extract video ID from URL if thumbnail is not provided
    if (!data.thumbnailUrl) {
      const url = data.videoUrl;
      let videoId = "";
      
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      
      if (videoId) {
        data.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
    
    videoMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter video title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter video description" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Video URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/thumbnail.jpg" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">
                If not provided, we'll use the YouTube default thumbnail
              </p>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={videoMutation.isPending}
        >
          {videoMutation.isPending
            ? isEditing ? "Updating..." : "Creating..."
            : isEditing ? "Update Video" : "Add Video"
          }
        </Button>
      </form>
    </Form>
  );
};

export default VideoForm;
