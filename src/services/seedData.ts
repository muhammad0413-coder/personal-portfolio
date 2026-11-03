import {
  UserProfile,
  Skill,
  Project,
  BlogPost,
  SocialLink,
  SiteSettings,
  Education,
  Experience
} from '../types';

export const defaultProfile: UserProfile = {
  name: "Alex",
  nickname: "Alex",
  profession: "I'M A WEB DEVELOPER",
  shortDescription: "I'm a passionate web developer specializing in building exceptional digital experiences with modern technologies.",
  aboutDescription: "With 4+ years of experience in web development, I help businesses and individuals bring their ideas to life through clean, efficient, and user-friendly code. Passionate about solving complex problems, building scalable cloud architectures, and crafting intuitive pixel-perfect interfaces.",
  profilePhoto: "/profile-alex.png",
  email: "hello@alexdev.com",
  phone: "+1 (555) 123-4567",
  address: "San Francisco, CA & Remote Worldwide",
  cvUrl: "#",
  yearsExperience: "4+",
  projectsCount: "50+",
  clientsCount: "30+",
  satisfactionRate: "100%",
  codeSnippet: `const developer = {
  name: "Alex",
  skills: ["HTML", "CSS", "JavaScript", "React"],
  passion: "Building things for the web"
};`,
  updatedAt: new Date().toISOString()
};

export const defaultSkills: Skill[] = [
  { id: 'skill-1', name: 'HTML', category: 'Programming Languages', percentage: 95, icon: 'Code', order: 1 },
  { id: 'skill-2', name: 'CSS', category: 'Programming Languages', percentage: 90, icon: 'Palette', order: 2 },
  { id: 'skill-3', name: 'JavaScript', category: 'Programming Languages', percentage: 90, icon: 'FileCode', order: 3 },
  { id: 'skill-4', name: 'React.js', category: 'Frameworks', percentage: 85, icon: 'Layers', order: 4 },
  { id: 'skill-5', name: 'Next.js', category: 'Frameworks', percentage: 80, icon: 'Globe', order: 5 },
  { id: 'skill-6', name: 'TypeScript', category: 'Programming Languages', percentage: 85, icon: 'FileCode2', order: 6 },
  { id: 'skill-7', name: 'Node.js', category: 'Frameworks', percentage: 80, icon: 'Server', order: 7 },
  { id: 'skill-8', name: 'Tailwind CSS', category: 'Tools', percentage: 90, icon: 'Sparkles', order: 8 },
  { id: 'skill-9', name: 'Git', category: 'Tools', percentage: 85, icon: 'GitBranch', order: 9 },
  { id: 'skill-10', name: 'Firebase & Cloud', category: 'Tools', percentage: 88, icon: 'Database', order: 10 },
  { id: 'skill-11', name: 'UI/UX Design', category: 'Technical Skills', percentage: 82, icon: 'Layout', order: 11 },
  { id: 'skill-12', name: 'Problem Solving', category: 'Soft Skills', percentage: 95, icon: 'Cpu', order: 12 },
];

export const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with modern UI/UX, real-time inventory management, stripe checkout, and customer analytics dashboard.',
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1000&q=80',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Stripe'],
    demoUrl: 'https://example.com/demo/ecommerce',
    githubUrl: 'https://github.com/example/ecommerce-platform',
    category: 'Full Stack',
    featured: true,
    createdAt: '2024-01-15',
    order: 1
  },
  {
    id: 'proj-2',
    title: 'Task Management App',
    description: 'Collaborative task management application featuring drag-and-drop kanban boards, real-time updates, notifications, and team analytics.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    technologies: ['React', 'Next.js', 'Firestore', 'Tailwind CSS'],
    demoUrl: 'https://example.com/demo/taskmanager',
    githubUrl: 'https://github.com/example/task-manager',
    category: 'Web Application',
    featured: true,
    createdAt: '2024-03-20',
    order: 2
  },
  {
    id: 'proj-3',
    title: 'Crypto Dashboard',
    description: 'Real-time cryptocurrency tracking dashboard with interactive trading charts, currency conversions, price alerts, and wallet monitoring.',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'CoinGecko API'],
    demoUrl: 'https://example.com/demo/crypto',
    githubUrl: 'https://github.com/example/crypto-dashboard',
    category: 'Dashboard',
    featured: true,
    createdAt: '2024-05-10',
    order: 3
  }
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Building Modern Web Apps with React, Vite & Tailwind CSS',
    slug: 'building-modern-web-apps-react-vite-tailwind',
    excerpt: 'Discover why Vite and Tailwind CSS provide the fastest and most delightful developer experience for crafting responsive modern web applications.',
    content: `## Why Vite & Tailwind are the Ultimate Modern Stack

Modern web development has evolved dramatically over the past few years. Gone are the days of sluggish bundling speeds and heavy CSS configurations. Today, speed, responsiveness, and developer delight are at the core of creating exceptional user experiences.

### 1. Instant Server Start
With native ES modules, Vite starts your development server in milliseconds without bundling everything upfront. Changes reflect instantaneously through Hot Module Replacement (HMR).

### 2. Utility-First Tailwind CSS
Tailwind CSS eliminates the hassle of switching between CSS files and HTML. With Tailwind v4, you get incredible performance, effortless dark mode support, and seamless responsiveness straight out of the box.

### 3. Clean Cloud Architecture
Pairing this frontend with Firebase Cloud Firestore and Vercel edge deployment ensures your web apps scale globally with minimal maintenance overhead.`,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    category: 'Development',
    status: 'published',
    publishedAt: '2024-06-01',
    readTime: '5 min read'
  },
  {
    id: 'blog-2',
    title: 'Mastering Full-Stack Security with Firebase Security Rules',
    slug: 'mastering-firebase-security-rules',
    excerpt: 'Step-by-step guide on securing your Cloud Firestore and Firebase Storage collections with granular, role-based security rules.',
    content: `## Secure Your Firebase Application

When deploying serverless applications, database security is paramount. Firebase Security Rules are your first and strongest line of defense against unauthorized access.

### Core Principles
1. **Never use \`allow read, write: if true\` in production.**
2. Authenticate all requests using \`request.auth != null\`.
3. Protect admin resources by verifying administrative role claims or verified admin IDs.
4. Validate incoming data fields and size constraints before committing writes to Firestore or Storage.`,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80',
    category: 'Security',
    status: 'published',
    publishedAt: '2024-07-15',
    readTime: '6 min read'
  }
];

export const defaultSocialLinks: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', url: 'https://github.com', icon: 'Github', order: 1 },
  { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', order: 2 },
  { id: 'soc-3', platform: 'Twitter', url: 'https://twitter.com', icon: 'Twitter', order: 3 },
  { id: 'soc-4', platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', order: 4 }
];

export const defaultSettings: SiteSettings = {
  siteTitle: 'CodeCraft — Alex | Senior Web Developer & Software Engineer',
  logoText: 'CodeCraft',
  themeAccent: '#7C3AED',
  seoTitle: 'Alex — Senior Web Developer & Full-Stack Specialist',
  seoDescription: 'Personal portfolio and profile of Alex, a passionate web developer specializing in building modern web apps, sleek UI/UX, and scalable cloud systems.',
  footerCopyright: '© 2024 Alex Developer. All rights reserved.',
  maintenanceMode: false,
  testimonialText: 'Alex is an exceptional developer who delivers high-quality work on time. His attention to detail and problem-solving skills are outstanding.',
  testimonialAuthor: 'Sarah Johnson',
  testimonialRole: 'CEO, TechStart',
  testimonialAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
};

export const defaultEducation: Education[] = [
  {
    id: 'edu-1',
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    major: 'Computer Science & Software Engineering',
    startYear: '2016',
    endYear: '2020',
    description: 'Graduated with honors. Focused on algorithms, cloud architecture, and modern human-computer interaction.',
    order: 1
  }
];

export const defaultExperience: Experience[] = [
  {
    id: 'exp-1',
    position: 'Senior Web Developer',
    organization: 'Apex Digital Solutions',
    startDate: '2022',
    endDate: 'Present',
    description: 'Leading front-end architecture, building performant web applications with React, TypeScript, and cloud serverless APIs.',
    order: 1
  },
  {
    id: 'exp-2',
    position: 'Full-Stack Developer',
    organization: 'Nova Software Studio',
    startDate: '2020',
    endDate: '2022',
    description: 'Developed scalable customer dashboards, e-commerce integrations, and RESTful APIs serving 100k+ active users.',
    order: 2
  }
];
