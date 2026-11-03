// TypeScript definitions for Personal Profile & Professional Portfolio

export interface UserProfile {
  id?: string;
  name: string;
  nickname: string;
  profession: string;
  shortDescription: string;
  aboutDescription: string;
  profilePhoto: string;
  email: string;
  phone: string;
  address: string;
  cvUrl?: string;
  yearsExperience: string;
  projectsCount: string;
  clientsCount: string;
  satisfactionRate: string;
  codeSnippet: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startYear: string;
  endYear: string;
  description: string;
  order: number;
}

export interface Experience {
  id: string;
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

export type SkillCategory = 
  | 'Technical Skills' 
  | 'Programming Languages' 
  | 'Frameworks' 
  | 'Tools' 
  | 'Soft Skills' 
  | 'Professional Skills';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  percentage: number;
  icon: string; // Lucide icon name or image url
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  createdAt: string;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  status: 'published' | 'draft';
  publishedAt: string;
  readTime?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface SiteSettings {
  id?: string;
  siteTitle: string;
  logoText: string;
  themeAccent: string;
  seoTitle: string;
  seoDescription: string;
  footerCopyright: string;
  maintenanceMode: boolean;
  testimonialText: string;
  testimonialAuthor: string;
  testimonialRole: string;
  testimonialAvatar?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  createdAt?: string;
}
