import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import { insertUserSchema, insertProjectSchema, insertBlogPostSchema, insertYoutubeVideoSchema, insertSkillSchema, insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  const SessionStore = MemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "portfolio-secret-key", 
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000 // Clear expired sessions every 24h
      })
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Admin middleware
  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };

  // Error handler for zod validation
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ message: validationError.message });
        }
        return res.status(400).json({ message: "Invalid request data" });
      }
    };
  };

  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) { // In real app, use password hashing
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      return res.json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  });

  // Project Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      return res.json(projects);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json(project);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAdmin, validateRequest(insertProjectSchema), async (req, res) => {
    try {
      const project = await storage.createProject(req.body);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const updatedProject = await storage.updateProject(id, req.body);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json(updatedProject);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      return res.json({ message: "Project deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Blog Post Routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog-posts", requireAdmin, validateRequest(insertBlogPostSchema), async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/blog-posts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const updatedPost = await storage.updateBlogPost(id, req.body);
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json(updatedPost);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog-posts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid blog post ID" });
      }
      
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      return res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // YouTube Video Routes
  app.get("/api/youtube-videos", async (req, res) => {
    try {
      const videos = await storage.getAllYoutubeVideos();
      return res.json(videos);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch YouTube videos" });
    }
  });

  app.get("/api/youtube-videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid YouTube video ID" });
      }
      
      const video = await storage.getYoutubeVideo(id);
      if (!video) {
        return res.status(404).json({ message: "YouTube video not found" });
      }
      
      return res.json(video);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch YouTube video" });
    }
  });

  app.post("/api/youtube-videos", requireAdmin, validateRequest(insertYoutubeVideoSchema), async (req, res) => {
    try {
      const video = await storage.createYoutubeVideo(req.body);
      return res.status(201).json(video);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create YouTube video" });
    }
  });

  app.put("/api/youtube-videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid YouTube video ID" });
      }
      
      const updatedVideo = await storage.updateYoutubeVideo(id, req.body);
      if (!updatedVideo) {
        return res.status(404).json({ message: "YouTube video not found" });
      }
      
      return res.json(updatedVideo);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update YouTube video" });
    }
  });

  app.delete("/api/youtube-videos/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid YouTube video ID" });
      }
      
      const deleted = await storage.deleteYoutubeVideo(id);
      if (!deleted) {
        return res.status(404).json({ message: "YouTube video not found" });
      }
      
      return res.json({ message: "YouTube video deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete YouTube video" });
    }
  });

  // Skills Routes
  app.get("/api/skills", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const skills = await storage.getSkillsByCategory(category);
        return res.json(skills);
      } else {
        const skills = await storage.getAllSkills();
        return res.json(skills);
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", requireAdmin, validateRequest(insertSkillSchema), async (req, res) => {
    try {
      const skill = await storage.createSkill(req.body);
      return res.status(201).json(skill);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put("/api/skills/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const updatedSkill = await storage.updateSkill(id, req.body);
      if (!updatedSkill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      return res.json(updatedSkill);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      const deleted = await storage.deleteSkill(id);
      if (!deleted) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      return res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Contact Routes
  app.post("/api/contacts", validateRequest(insertContactSchema), async (req, res) => {
    try {
      const contact = await storage.createContact(req.body);
      return res.status(201).json(contact);
    } catch (error) {
      return res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      return res.json(contacts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.put("/api/contacts/:id/read", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      const marked = await storage.markContactAsRead(id);
      if (!marked) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      return res.json({ message: "Contact marked as read" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to mark contact as read" });
    }
  });

  app.delete("/api/contacts/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      const deleted = await storage.deleteContact(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      return res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Dashboard Stats Route
  app.get("/api/dashboard/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
