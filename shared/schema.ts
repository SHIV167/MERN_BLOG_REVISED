import { z } from "zod";

// User schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  isAdmin: z.boolean().default(false),
});

export const InsertUserSchema = UserSchema.omit({ id: true });

// Project schema
export const ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().nullable(),
  projectUrl: z.string().nullable(),
  technologies: z.array(z.string()).nullable(),
});

export const InsertProjectSchema = ProjectSchema.omit({ id: true });

// Blog post schema
export const BlogPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().nullable(),
  category: z.string(),
});

export const InsertBlogPostSchema = BlogPostSchema.omit({ id: true });

// YouTube video schema
export const YoutubeVideoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  thumbnailUrl: z.string().nullable(),
});

export const InsertYoutubeVideoSchema = YoutubeVideoSchema.omit({ id: true });

// Skill schema
export const SkillSchema = z.object({
  id: z.number(),
  name: z.string(),
  percentage: z.number(),
  category: z.string(),
});

export const InsertSkillSchema = SkillSchema.omit({ id: true });

// Contact schema
export const ContactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  isRead: z.boolean().default(false),
});

export const InsertContactSchema = ContactSchema.omit({ id: true, isRead: true });

// Export types
export type User = z.infer<typeof UserSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type InsertProject = z.infer<typeof InsertProjectSchema>;

export type BlogPost = z.infer<typeof BlogPostSchema>;
export type InsertBlogPost = z.infer<typeof InsertBlogPostSchema>;

export type YoutubeVideo = z.infer<typeof YoutubeVideoSchema>;
export type InsertYoutubeVideo = z.infer<typeof InsertYoutubeVideoSchema>;

export type Skill = z.infer<typeof SkillSchema>;
export type InsertSkill = z.infer<typeof InsertSkillSchema>;

export type Contact = z.infer<typeof ContactSchema>;
export type InsertContact = z.infer<typeof InsertContactSchema>;