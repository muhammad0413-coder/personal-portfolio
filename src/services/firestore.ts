import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  UserProfile,
  Skill,
  Project,
  BlogPost,
  ContactMessage,
  SocialLink,
  SiteSettings,
  Education,
  Experience
} from '../types';
import {
  defaultProfile,
  defaultSkills,
  defaultProjects,
  defaultBlogPosts,
  defaultSocialLinks,
  defaultSettings,
  defaultEducation,
  defaultExperience
} from './seedData';

// Local storage fallback keys
const CACHE_KEYS = {
  PROFILE: 'cache_portfolio_profile',
  SKILLS: 'cache_portfolio_skills',
  PROJECTS: 'cache_portfolio_projects',
  BLOG: 'cache_portfolio_blog',
  MESSAGES: 'cache_portfolio_messages',
  SOCIAL: 'cache_portfolio_social',
  SETTINGS: 'cache_portfolio_settings',
  EDUCATION: 'cache_portfolio_education',
  EXPERIENCE: 'cache_portfolio_experience'
};

const getCached = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setCached = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
};

// ================= PROFILE =================
export const getProfile = async (): Promise<UserProfile> => {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'profile', 'main'));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setCached(CACHE_KEYS.PROFILE, data);
        return data;
      }
    } catch (err) {
      console.warn('Error reading profile from Firestore, using cache:', err);
    }
  }
  return getCached(CACHE_KEYS.PROFILE, defaultProfile);
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
  const current = await getProfile();
  const updated: UserProfile = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString()
  };
  setCached(CACHE_KEYS.PROFILE, updated);

  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'profile', 'main'), updated, { merge: true });
  }
};

// ================= SKILLS =================
export const getSkills = async (): Promise<Skill[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: Skill[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Skill));
        setCached(CACHE_KEYS.SKILLS, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading skills from Firestore:', err);
    }
  }
  return getCached(CACHE_KEYS.SKILLS, defaultSkills);
};

export const saveSkill = async (skill: Omit<Skill, 'id'> & { id?: string }): Promise<string> => {
  let skills = await getSkills();
  let id = skill.id;

  if (id) {
    skills = skills.map((s) => (s.id === id ? ({ ...s, ...skill } as Skill) : s));
  } else {
    id = `skill-${Date.now()}`;
    skills.push({ ...skill, id } as Skill);
  }
  setCached(CACHE_KEYS.SKILLS, skills);

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'skills', id);
    await setDoc(docRef, { ...skill, id }, { merge: true });
  }
  return id;
};

export const deleteSkill = async (id: string): Promise<void> => {
  const skills = (await getSkills()).filter((s) => s.id !== id);
  setCached(CACHE_KEYS.SKILLS, skills);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'skills', id));
  }
};

// ================= PROJECTS =================
export const getProjects = async (): Promise<Project[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: Project[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Project));
        setCached(CACHE_KEYS.PROJECTS, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading projects from Firestore:', err);
    }
  }
  return getCached(CACHE_KEYS.PROJECTS, defaultProjects);
};

export const saveProject = async (project: Omit<Project, 'id'> & { id?: string }): Promise<string> => {
  let projects = await getProjects();
  let id = project.id;

  if (id) {
    projects = projects.map((p) => (p.id === id ? ({ ...p, ...project } as Project) : p));
  } else {
    id = `proj-${Date.now()}`;
    projects.push({ ...project, id } as Project);
  }
  setCached(CACHE_KEYS.PROJECTS, projects);

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'projects', id);
    await setDoc(docRef, { ...project, id }, { merge: true });
  }
  return id;
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = (await getProjects()).filter((p) => p.id !== id);
  setCached(CACHE_KEYS.PROJECTS, projects);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'projects', id));
  }
};

// ================= BLOG =================
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'blog'), orderBy('publishedAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: BlogPost[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as BlogPost));
        setCached(CACHE_KEYS.BLOG, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading blog from Firestore:', err);
    }
  }
  return getCached(CACHE_KEYS.BLOG, defaultBlogPosts);
};

export const saveBlogPost = async (post: Omit<BlogPost, 'id'> & { id?: string }): Promise<string> => {
  let posts = await getBlogPosts();
  let id = post.id;

  if (id) {
    posts = posts.map((b) => (b.id === id ? ({ ...b, ...post } as BlogPost) : b));
  } else {
    id = `blog-${Date.now()}`;
    posts.unshift({ ...post, id } as BlogPost);
  }
  setCached(CACHE_KEYS.BLOG, posts);

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'blog', id);
    await setDoc(docRef, { ...post, id }, { merge: true });
  }
  return id;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const posts = (await getBlogPosts()).filter((b) => b.id !== id);
  setCached(CACHE_KEYS.BLOG, posts);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'blog', id));
  }
};

// ================= MESSAGES (CONTACT) =================
export const getMessages = async (): Promise<ContactMessage[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list: ContactMessage[] = [];
      snap.forEach((d) => list.push({ ...d.data(), id: d.id } as ContactMessage));
      setCached(CACHE_KEYS.MESSAGES, list);
      return list;
    } catch (err) {
      console.warn('Error reading messages from Firestore:', err);
    }
  }
  return getCached(CACHE_KEYS.MESSAGES, [
    {
      id: 'msg-sample-1',
      name: 'Sarah Johnson',
      email: 'sarah@techstart.io',
      subject: 'Inquiry for Next.js Web App Project',
      message: 'Hi Alex, I love your portfolio and work. We have an upcoming web application project and would like to discuss a potential partnership.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      isRead: false
    }
  ]);
};

export const sendContactMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): Promise<string> => {
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  const list = await getMessages();
  list.unshift(newMsg);
  setCached(CACHE_KEYS.MESSAGES, list);

  if (isFirebaseConfigured() && db) {
    const docRef = await addDoc(collection(db, 'messages'), {
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      createdAt: new Date().toISOString(),
      isRead: false
    });
    return docRef.id;
  }
  return newMsg.id;
};

export const markMessageRead = async (id: string, isRead = true): Promise<void> => {
  const list = (await getMessages()).map((m) => (m.id === id ? { ...m, isRead } : m));
  setCached(CACHE_KEYS.MESSAGES, list);

  if (isFirebaseConfigured() && db) {
    await updateDoc(doc(db, 'messages', id), { isRead });
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  const list = (await getMessages()).filter((m) => m.id !== id);
  setCached(CACHE_KEYS.MESSAGES, list);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'messages', id));
  }
};

// ================= SOCIAL LINKS =================
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'socialLinks'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: SocialLink[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as SocialLink));
        setCached(CACHE_KEYS.SOCIAL, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading social links:', err);
    }
  }
  return getCached(CACHE_KEYS.SOCIAL, defaultSocialLinks);
};

export const saveSocialLink = async (link: Omit<SocialLink, 'id'> & { id?: string }): Promise<string> => {
  let list = await getSocialLinks();
  let id = link.id;

  if (id) {
    list = list.map((l) => (l.id === id ? ({ ...l, ...link } as SocialLink) : l));
  } else {
    id = `soc-${Date.now()}`;
    list.push({ ...link, id } as SocialLink);
  }
  setCached(CACHE_KEYS.SOCIAL, list);

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'socialLinks', id);
    await setDoc(docRef, { ...link, id }, { merge: true });
  }
  return id;
};

export const deleteSocialLink = async (id: string): Promise<void> => {
  const list = (await getSocialLinks()).filter((l) => l.id !== id);
  setCached(CACHE_KEYS.SOCIAL, list);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'socialLinks', id));
  }
};

// ================= SETTINGS =================
export const getSettings = async (): Promise<SiteSettings> => {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'main'));
      if (snap.exists()) {
        const data = snap.data() as SiteSettings;
        setCached(CACHE_KEYS.SETTINGS, data);
        return data;
      }
    } catch (err) {
      console.warn('Error reading settings:', err);
    }
  }
  return getCached(CACHE_KEYS.SETTINGS, defaultSettings);
};

export const updateSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const current = await getSettings();
  const updated = { ...current, ...data };
  setCached(CACHE_KEYS.SETTINGS, updated);

  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'settings', 'main'), updated, { merge: true });
  }
};

// ================= EDUCATION =================
export const getEducation = async (): Promise<Education[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'education'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: Education[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Education));
        setCached(CACHE_KEYS.EDUCATION, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading education:', err);
    }
  }
  return getCached(CACHE_KEYS.EDUCATION, defaultEducation);
};

export const saveEducation = async (edu: Omit<Education, 'id'> & { id?: string }): Promise<string> => {
  let list = await getEducation();
  let id = edu.id;
  if (id) {
    list = list.map((e) => (e.id === id ? ({ ...e, ...edu } as Education) : e));
  } else {
    id = `edu-${Date.now()}`;
    list.push({ ...edu, id } as Education);
  }
  setCached(CACHE_KEYS.EDUCATION, list);

  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'education', id), { ...edu, id }, { merge: true });
  }
  return id;
};

export const deleteEducation = async (id: string): Promise<void> => {
  const list = (await getEducation()).filter((e) => e.id !== id);
  setCached(CACHE_KEYS.EDUCATION, list);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'education', id));
  }
};

// ================= EXPERIENCE =================
export const getExperiences = async (): Promise<Experience[]> => {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(collection(db, 'experiences'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: Experience[] = [];
        snap.forEach((d) => list.push({ ...d.data(), id: d.id } as Experience));
        setCached(CACHE_KEYS.EXPERIENCE, list);
        return list;
      }
    } catch (err) {
      console.warn('Error reading experiences:', err);
    }
  }
  return getCached(CACHE_KEYS.EXPERIENCE, defaultExperience);
};

export const saveExperience = async (exp: Omit<Experience, 'id'> & { id?: string }): Promise<string> => {
  let list = await getExperiences();
  let id = exp.id;
  if (id) {
    list = list.map((e) => (e.id === id ? ({ ...e, ...exp } as Experience) : e));
  } else {
    id = `exp-${Date.now()}`;
    list.push({ ...exp, id } as Experience);
  }
  setCached(CACHE_KEYS.EXPERIENCE, list);

  if (isFirebaseConfigured() && db) {
    await setDoc(doc(db, 'experiences', id), { ...exp, id }, { merge: true });
  }
  return id;
};

export const deleteExperience = async (id: string): Promise<void> => {
  const list = (await getExperiences()).filter((e) => e.id !== id);
  setCached(CACHE_KEYS.EXPERIENCE, list);

  if (isFirebaseConfigured() && db) {
    await deleteDoc(doc(db, 'experiences', id));
  }
};

// ================= SEED ALL INITIAL DATA TO FIRESTORE =================
export const seedInitialDataToFirestore = async (): Promise<{ success: boolean; message: string }> => {
  if (!isFirebaseConfigured() || !db) {
    return {
      success: false,
      message: 'Firebase belum terkonfigurasi. Masukkan kredensial Firebase di .env terlebih dahulu.'
    };
  }

  try {
    // 1. Profile
    await setDoc(doc(db, 'profile', 'main'), defaultProfile, { merge: true });

    // 2. Settings
    await setDoc(doc(db, 'settings', 'main'), defaultSettings, { merge: true });

    // 3. Skills
    for (const skill of defaultSkills) {
      await setDoc(doc(db, 'skills', skill.id), skill, { merge: true });
    }

    // 4. Projects
    for (const proj of defaultProjects) {
      await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
    }

    // 5. Blog
    for (const blog of defaultBlogPosts) {
      await setDoc(doc(db, 'blog', blog.id), blog, { merge: true });
    }

    // 6. Social Links
    for (const soc of defaultSocialLinks) {
      await setDoc(doc(db, 'socialLinks', soc.id), soc, { merge: true });
    }

    // 7. Education
    for (const edu of defaultEducation) {
      await setDoc(doc(db, 'education', edu.id), edu, { merge: true });
    }

    // 8. Experience
    for (const exp of defaultExperience) {
      await setDoc(doc(db, 'experiences', exp.id), exp, { merge: true });
    }

    return {
      success: true,
      message: 'Semua data default (Alex - CodeCraft) berhasil disuntikkan ke Cloud Firestore!'
    };
  } catch (error: any) {
    console.error('Error seeding data to Firestore:', error);
    return {
      success: false,
      message: `Gagal menyuntikkan data: ${error?.message || 'Error tidak diketahui'}`
    };
  }
};
