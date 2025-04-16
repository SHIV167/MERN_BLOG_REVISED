import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  blogPosts, type BlogPost, type InsertBlogPost,
  youtubeVideos, type YoutubeVideo, type InsertYoutubeVideo,
  skills, type Skill, type InsertSkill,
  contacts, type Contact, type InsertContact
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // YouTube Videos
  getAllYoutubeVideos(): Promise<YoutubeVideo[]>;
  getYoutubeVideo(id: number): Promise<YoutubeVideo | undefined>;
  createYoutubeVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo>;
  updateYoutubeVideo(id: number, video: Partial<InsertYoutubeVideo>): Promise<YoutubeVideo | undefined>;
  deleteYoutubeVideo(id: number): Promise<boolean>;

  // Skills
  getAllSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  // Contacts
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContact(id: number): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    projectCount: number;
    blogPostCount: number;
    videoCount: number;
    unreadContactCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private blogPosts: Map<number, BlogPost>;
  private youtubeVideos: Map<number, YoutubeVideo>;
  private skills: Map<number, Skill>;
  private contacts: Map<number, Contact>;
  
  private currentUserId: number = 1;
  private currentProjectId: number = 1;
  private currentBlogPostId: number = 1;
  private currentYoutubeVideoId: number = 1;
  private currentSkillId: number = 1;
  private currentContactId: number = 1;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.blogPosts = new Map();
    this.youtubeVideos = new Map();
    this.skills = new Map();
    this.contacts = new Map();

    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      isAdmin: true
    });

    // Initialize some sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Sample skills
    const skillCategories = ["frontend", "backend", "additional"];
    const skillNames = {
      frontend: ["React", "JavaScript", "HTML/CSS", "Tailwind"],
      backend: ["Node.js", "Express", "MongoDB", "REST API"],
      additional: ["Git", "React Native", "TypeScript", "Responsive Design"]
    };

    // Create skills
    skillCategories.forEach(category => {
      skillNames[category as keyof typeof skillNames].forEach(name => {
        const percentage = Math.floor(Math.random() * 20) + 75; // 75-95
        this.createSkill({
          name,
          percentage,
          category
        });
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject = { 
      ...project, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;

    const updatedProject = { ...existingProject, ...project };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Blog Post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const now = new Date();
    const newPost = { 
      ...post, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;

    const updatedPost = { 
      ...existingPost, 
      ...post,
      updatedAt: new Date()
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // YouTube Video methods
  async getAllYoutubeVideos(): Promise<YoutubeVideo[]> {
    return Array.from(this.youtubeVideos.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getYoutubeVideo(id: number): Promise<YoutubeVideo | undefined> {
    return this.youtubeVideos.get(id);
  }

  async createYoutubeVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo> {
    const id = this.currentYoutubeVideoId++;
    const newVideo = { 
      ...video, 
      id, 
      createdAt: new Date() 
    };
    this.youtubeVideos.set(id, newVideo);
    return newVideo;
  }

  async updateYoutubeVideo(id: number, video: Partial<InsertYoutubeVideo>): Promise<YoutubeVideo | undefined> {
    const existingVideo = this.youtubeVideos.get(id);
    if (!existingVideo) return undefined;

    const updatedVideo = { ...existingVideo, ...video };
    this.youtubeVideos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteYoutubeVideo(id: number): Promise<boolean> {
    return this.youtubeVideos.delete(id);
  }

  // Skills methods
  async getAllSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.category === category);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const newSkill = { ...skill, id };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existingSkill = this.skills.get(id);
    if (!existingSkill) return undefined;

    const updatedSkill = { ...existingSkill, ...skill };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const newContact = { 
      ...contact, 
      id, 
      createdAt: new Date(),
      isRead: false
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async markContactAsRead(id: number): Promise<boolean> {
    const contact = this.contacts.get(id);
    if (!contact) return false;

    contact.isRead = true;
    this.contacts.set(id, contact);
    return true;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    projectCount: number;
    blogPostCount: number;
    videoCount: number;
    unreadContactCount: number;
  }> {
    const unreadContactCount = Array.from(this.contacts.values()).filter(
      contact => !contact.isRead
    ).length;

    return {
      projectCount: this.projects.size,
      blogPostCount: this.blogPosts.size,
      videoCount: this.youtubeVideos.size,
      unreadContactCount
    };
  }
}

export const storage = new MemStorage();
