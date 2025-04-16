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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

// Blog post form schema
const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(150, "Excerpt must be at most 150 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  post?: any;
  onSuccess?: () => void;
}

const categories = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "CSS",
  "HTML",
  "TypeScript",
  "Web Development",
  "Mobile Development",
  "UI/UX",
  "DevOps",
  "Career",
];

const BlogForm = ({ post, onSuccess }: BlogFormProps) => {
  const { toast } = useToast();
  const isEditing = !!post;

  // Form setup
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      imageUrl: post?.imageUrl || "",
      category: post?.category || "",
    },
  });
  
  // Update form values when post changes (fixes edit mode)
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title || "",
        content: post.content || "",
        excerpt: post.excerpt || "",
        imageUrl: post.imageUrl || "",
        category: post.category || "",
      });
    }
  }, [post, form]);

  // Create/update blog post mutation
  const blogPostMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      if (isEditing) {
        const response = await apiRequest("PUT", `/api/blog-posts/${post.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/blog-posts", data);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `Blog post ${isEditing ? "updated" : "created"} successfully`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      if (onSuccess) onSuccess();
      if (!isEditing) form.reset();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} blog post`,
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    blogPostMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a compelling title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief summary of your post (shown in previews)" 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your blog post content here" 
                  rows={12}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={blogPostMutation.isPending}
        >
          {blogPostMutation.isPending
            ? isEditing ? "Updating..." : "Creating..."
            : isEditing ? "Update Blog Post" : "Create Blog Post"
          }
        </Button>
      </form>
    </Form>
  );
};

export default BlogForm;
