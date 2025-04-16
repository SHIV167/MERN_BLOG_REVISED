import { useState } from "react";
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
import { X } from "lucide-react";

// Project form schema
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  projectUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, "Add at least one technology"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
}

const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const { toast } = useToast();
  const [newTechnology, setNewTechnology] = useState("");
  const isEditing = !!project;

  // Form setup
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      imageUrl: project?.imageUrl || "",
      projectUrl: project?.projectUrl || "",
      technologies: project?.technologies || [],
    },
  });

  // Create/update project mutation
  const projectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      if (isEditing) {
        const response = await apiRequest("PUT", `/api/projects/${project.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/projects", data);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: `Project ${isEditing ? "updated" : "created"} successfully`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      if (onSuccess) onSuccess();
      if (!isEditing) form.reset();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${isEditing ? "update" : "create"} project`,
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    projectMutation.mutate(data);
  };

  const handleAddTechnology = () => {
    if (!newTechnology.trim()) return;
    
    const currentTechnologies = form.getValues("technologies") || [];
    if (!currentTechnologies.includes(newTechnology)) {
      form.setValue("technologies", [...currentTechnologies, newTechnology]);
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    const currentTechnologies = form.getValues("technologies");
    form.setValue(
      "technologies", 
      currentTechnologies.filter(t => t !== tech)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g., E-commerce Website" {...field} />
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
                  placeholder="Enter project description" 
                  rows={5}
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
              <FormLabel>Image URL</FormLabel>
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

        <FormField
          control={form.control}
          name="projectUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://yourproject.com" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologies"
          render={() => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input 
                  placeholder="Add technology (e.g., React)" 
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechnology();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTechnology}
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {form.watch("technologies")?.map((tech, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{tech}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 text-primary hover:text-primary/80"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={projectMutation.isPending}
        >
          {projectMutation.isPending
            ? isEditing ? "Updating..." : "Creating..."
            : isEditing ? "Update Project" : "Create Project"
          }
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;
