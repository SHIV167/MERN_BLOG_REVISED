import { User, InsertUser, Project, InsertProject, BlogPost, InsertBlogPost, YoutubeVideo, InsertYoutubeVideo, Skill, InsertSkill, Contact, InsertContact } from "@shared/schema";
import UserModel, { IUser } from "./models/User";
import ProjectModel, { IProject } from "./models/Project";
import BlogPostModel, { IBlogPost } from "./models/BlogPost";
import YoutubeVideoModel, { IYoutubeVideo } from "./models/YoutubeVideo";
import SkillModel, { ISkill } from "./models/Skill";
import ContactModel, { IContact } from "./models/Contact";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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

// Helper functions to convert MongoDB documents to schema types
const documentToUser = (doc: IUser): User => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
      console.log("Converted user ID:", doc._id, "to numeric ID:", id);
    }
  } catch (error) {
    console.error("Error converting user _id:", error);
  }
  
  return {
    id,
    username: doc.username,
    password: doc.password,
    isAdmin: doc.isAdmin
  };
};

const documentToProject = (doc: IProject): Project => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
    }
  } catch (error) {
    console.error("Error converting project _id:", error);
  }
  
  return {
    id,
    title: doc.title,
    description: doc.description,
    imageUrl: doc.imageUrl || null,
    projectUrl: doc.projectUrl || null,
    technologies: doc.technologies || null,
  };
};

const documentToBlogPost = (doc: IBlogPost): BlogPost => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
    }
  } catch (error) {
    console.error("Error converting blog post _id:", error);
  }
  
  return {
    id,
    title: doc.title,
    content: doc.content,
    excerpt: doc.excerpt,
    imageUrl: doc.imageUrl || null,
    category: doc.category,
  };
};

const documentToYoutubeVideo = (doc: IYoutubeVideo): YoutubeVideo => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
    }
  } catch (error) {
    console.error("Error converting video _id:", error);
  }
  
  return {
    id,
    title: doc.title,
    description: doc.description,
    videoUrl: doc.videoUrl,
    thumbnailUrl: doc.thumbnailUrl || null,
  };
};

const documentToSkill = (doc: ISkill): Skill => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
    }
  } catch (error) {
    console.error("Error converting skill _id:", error);
  }
  
  return {
    id,
    name: doc.name,
    percentage: doc.percentage,
    category: doc.category,
  };
};

const documentToContact = (doc: IContact): Contact => {
  let id = 0;
  try {
    if (doc._id) {
      const idStr = doc._id.toString();
      id = parseInt(idStr.substring(Math.max(0, idStr.length - 6)), 16) % 1000000;
    }
  } catch (error) {
    console.error("Error converting contact _id:", error);
  }
  
  return {
    id,
    name: doc.name,
    email: doc.email,
    message: doc.message,
    isRead: doc.isRead,
  };
};

export class MongoDBStorage implements IStorage {
  constructor() {
    this.initSampleData();
  }

  private async initSampleData() {
    // Create admin user if none exists
    const adminExists = await UserModel.findOne({ username: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await UserModel.create({
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
    }

    // Add sample skills if none exist
    const skillsExist = await SkillModel.countDocuments();
    if (skillsExist === 0) {
      await SkillModel.insertMany([
        { name: "React", percentage: 85, category: "frontend" },
        { name: "TypeScript", percentage: 80, category: "frontend" },
        { name: "Node.js", percentage: 75, category: "backend" },
        { name: "MongoDB", percentage: 70, category: "backend" },
        { name: "CSS/SCSS", percentage: 90, category: "frontend" },
        { name: "Docker", percentage: 65, category: "devops" },
        { name: "AWS", percentage: 60, category: "devops" },
        { name: "Python", percentage: 75, category: "backend" },
      ]);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      // Try to find by MongoDB _id first (in case it's a direct MongoDB ID)
      try {
        const userById = await UserModel.findById(id);
        if (userById) {
          console.log(`Found user by direct _id lookup: ${id}`);
          return documentToUser(userById);
        }
      } catch (err) {
        // Ignore errors with direct _id lookup
      }
      
      // If that fails, find by the numeric id we generated
      const users = await UserModel.find();
      
      for (const user of users) {
        const userId = parseInt(user._id.toString().substring(Math.max(0, user._id.toString().length - 6)), 16) % 1000000;
        if (userId === id) {
          console.log(`Found user by numeric id match: ${id}`);
          return documentToUser(user);
        }
      }
      
      console.log(`No user found with id: ${id}`);
      return undefined;
    } catch (error) {
      console.error('Error in getUser:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      return user ? documentToUser(user) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user = await UserModel.create({
      username: insertUser.username,
      password: hashedPassword,
      isAdmin: insertUser.isAdmin || false
    });
    return documentToUser(user);
  }

  async getAllProjects(): Promise<Project[]> {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    return projects.map(documentToProject);
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      // Try to find by MongoDB _id first (in case it's a direct MongoDB ID)
      try {
        const projectById = await ProjectModel.findById(id);
        if (projectById) {
          console.log(`Found project by direct _id lookup: ${id}`);
          return documentToProject(projectById);
        }
      } catch (err) {
        // Ignore errors with direct _id lookup
      }
      
      // If that fails, find by the numeric id we generated
      const projects = await ProjectModel.find();
      
      for (const project of projects) {
        const projectId = parseInt(project._id.toString().substring(Math.max(0, project._id.toString().length - 6)), 16) % 1000000;
        if (projectId === id) {
          console.log(`Found project by numeric id match: ${id}`);
          return documentToProject(project);
        }
      }
      
      console.log(`No project found with id: ${id}`);
      return undefined;
    } catch (error) {
      console.error('Error in getProject:', error);
      return undefined;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    const newProject = await ProjectModel.create(project);
    return documentToProject(newProject);
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const updatedProject = await ProjectModel.findByIdAndUpdate(
        id,
        { $set: project },
        { new: true }
      );
      return updatedProject ? documentToProject(updatedProject) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      await ProjectModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await BlogPostModel.find().sort({ createdAt: -1 });
    return posts.map(documentToBlogPost);
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    try {
      // Try to find by MongoDB _id first (in case it's a direct MongoDB ID)
      try {
        const postById = await BlogPostModel.findById(id);
        if (postById) {
          console.log(`Found blog post by direct _id lookup: ${id}`);
          return documentToBlogPost(postById);
        }
      } catch (err) {
        // Ignore errors with direct _id lookup
      }
      
      // If that fails, find by the numeric id we generated
      const posts = await BlogPostModel.find();
      
      for (const post of posts) {
        const postId = parseInt(post._id.toString().substring(Math.max(0, post._id.toString().length - 6)), 16) % 1000000;
        if (postId === id) {
          console.log(`Found blog post by numeric id match: ${id}`);
          return documentToBlogPost(post);
        }
      }
      
      console.log(`No blog post found with id: ${id}`);
      return undefined;
    } catch (error) {
      console.error('Error in getBlogPost:', error);
      return undefined;
    }
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const newPost = await BlogPostModel.create(post);
    return documentToBlogPost(newPost);
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    try {
      const updatedPost = await BlogPostModel.findByIdAndUpdate(
        id,
        { $set: post },
        { new: true }
      );
      return updatedPost ? documentToBlogPost(updatedPost) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      await BlogPostModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllYoutubeVideos(): Promise<YoutubeVideo[]> {
    const videos = await YoutubeVideoModel.find().sort({ createdAt: -1 });
    return videos.map(documentToYoutubeVideo);
  }

  async getYoutubeVideo(id: number): Promise<YoutubeVideo | undefined> {
    try {
      // Try to find by MongoDB _id first (in case it's a direct MongoDB ID)
      try {
        const videoById = await YoutubeVideoModel.findById(id);
        if (videoById) {
          console.log(`Found video by direct _id lookup: ${id}`);
          return documentToYoutubeVideo(videoById);
        }
      } catch (err) {
        // Ignore errors with direct _id lookup
      }
      
      // If that fails, find by the numeric id we generated
      const videos = await YoutubeVideoModel.find();
      
      for (const video of videos) {
        const videoId = parseInt(video._id.toString().substring(Math.max(0, video._id.toString().length - 6)), 16) % 1000000;
        if (videoId === id) {
          console.log(`Found video by numeric id match: ${id}`);
          return documentToYoutubeVideo(video);
        }
      }
      
      console.log(`No video found with id: ${id}`);
      return undefined;
    } catch (error) {
      console.error('Error in getYoutubeVideo:', error);
      return undefined;
    }
  }

  async createYoutubeVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo> {
    const newVideo = await YoutubeVideoModel.create(video);
    return documentToYoutubeVideo(newVideo);
  }

  async updateYoutubeVideo(id: number, video: Partial<InsertYoutubeVideo>): Promise<YoutubeVideo | undefined> {
    try {
      const updatedVideo = await YoutubeVideoModel.findByIdAndUpdate(
        id,
        { $set: video },
        { new: true }
      );
      return updatedVideo ? documentToYoutubeVideo(updatedVideo) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async deleteYoutubeVideo(id: number): Promise<boolean> {
    try {
      await YoutubeVideoModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllSkills(): Promise<Skill[]> {
    const skills = await SkillModel.find();
    console.log("SKILLS FOUND:", skills);
    return skills.map(skill => {
      console.log("SKILL DOC:", JSON.stringify(skill));
      return documentToSkill(skill);
    });
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    const skills = await SkillModel.find({ category });
    return skills.map(documentToSkill);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const newSkill = await SkillModel.create(skill);
    return documentToSkill(newSkill);
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    try {
      const updatedSkill = await SkillModel.findByIdAndUpdate(
        id,
        { $set: skill },
        { new: true }
      );
      return updatedSkill ? documentToSkill(updatedSkill) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  async deleteSkill(id: number): Promise<boolean> {
    try {
      await SkillModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAllContacts(): Promise<Contact[]> {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    return contacts.map(documentToContact);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact = await ContactModel.create(contact);
    return documentToContact(newContact);
  }

  async markContactAsRead(id: number): Promise<boolean> {
    try {
      await ContactModel.findByIdAndUpdate(id, { isRead: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteContact(id: number): Promise<boolean> {
    try {
      await ContactModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getDashboardStats(): Promise<{
    projectCount: number;
    blogPostCount: number;
    videoCount: number;
    unreadContactCount: number;
  }> {
    const [projectCount, blogPostCount, videoCount, unreadContactCount] = await Promise.all([
      ProjectModel.countDocuments(),
      BlogPostModel.countDocuments(),
      YoutubeVideoModel.countDocuments(),
      ContactModel.countDocuments({ isRead: false }),
    ]);

    return {
      projectCount,
      blogPostCount,
      videoCount,
      unreadContactCount,
    };
  }
}

export const storage = new MongoDBStorage();