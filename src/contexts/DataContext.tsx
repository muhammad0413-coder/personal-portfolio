import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  getProfile,
  getSkills,
  getProjects,
  getBlogPosts,
  getMessages,
  getSocialLinks,
  getSettings,
  getEducation,
  getExperiences,
  updateProfile as updateProfileApi,
  saveSkill as saveSkillApi,
  deleteSkill as deleteSkillApi,
  saveProject as saveProjectApi,
  deleteProject as deleteProjectApi,
  saveBlogPost as saveBlogPostApi,
  deleteBlogPost as deleteBlogPostApi,
  sendContactMessage as sendContactMessageApi,
  markMessageRead as markMessageReadApi,
  deleteMessage as deleteMessageApi,
  saveSocialLink as saveSocialLinkApi,
  deleteSocialLink as deleteSocialLinkApi,
  updateSettings as updateSettingsApi,
  saveEducation as saveEducationApi,
  deleteEducation as deleteEducationApi,
  saveExperience as saveExperienceApi,
  deleteExperience as deleteExperienceApi,
  seedInitialDataToFirestore
} from '../services/firestore';
import {
  defaultProfile,
  defaultSkills,
  defaultProjects,
  defaultBlogPosts,
  defaultSocialLinks,
  defaultSettings,
  defaultEducation,
  defaultExperience
} from '../services/seedData';

interface DataContextType {
  profile: UserProfile;
  skills: Skill[];
  projects: Project[];
  blogPosts: BlogPost[];
  messages: ContactMessage[];
  socialLinks: SocialLink[];
  settings: SiteSettings;
  education: Education[];
  experiences: Experience[];
  loading: boolean;
  refreshAllData: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  saveSkillData: (skill: Omit<Skill, 'id'> & { id?: string }) => Promise<string>;
  deleteSkillData: (id: string) => Promise<void>;
  saveProjectData: (proj: Omit<Project, 'id'> & { id?: string }) => Promise<string>;
  deleteProjectData: (id: string) => Promise<void>;
  saveBlogData: (post: Omit<BlogPost, 'id'> & { id?: string }) => Promise<string>;
  deleteBlogData: (id: string) => Promise<void>;
  sendMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => Promise<string>;
  markMessageAsRead: (id: string, read?: boolean) => Promise<void>;
  deleteMessageData: (id: string) => Promise<void>;
  saveSocialData: (link: Omit<SocialLink, 'id'> & { id?: string }) => Promise<string>;
  deleteSocialData: (id: string) => Promise<void>;
  updateSettingsData: (data: Partial<SiteSettings>) => Promise<void>;
  saveEducationData: (edu: Omit<Education, 'id'> & { id?: string }) => Promise<string>;
  deleteEducationData: (id: string) => Promise<void>;
  saveExperienceData: (exp: Omit<Experience, 'id'> & { id?: string }) => Promise<string>;
  deleteExperienceData: (id: string) => Promise<void>;
  seedFirebaseDatabase: () => Promise<{ success: boolean; message: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [education, setEducation] = useState<Education[]>(defaultEducation);
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperience);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAllData = useCallback(async () => {
    try {
      const [
        p,
        sk,
        pr,
        bl,
        msg,
        soc,
        st,
        edu,
        exp
      ] = await Promise.all([
        getProfile(),
        getSkills(),
        getProjects(),
        getBlogPosts(),
        getMessages(),
        getSocialLinks(),
        getSettings(),
        getEducation(),
        getExperiences()
      ]);

      setProfile(p);
      setSkills(sk);
      setProjects(pr);
      setBlogPosts(bl);
      setMessages(msg);
      setSocialLinks(soc);
      setSettings(st);
      setEducation(edu);
      setExperiences(exp);
    } catch (error) {
      console.warn('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const updateProfileData = async (data: Partial<UserProfile>) => {
    await updateProfileApi(data);
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const saveSkillData = async (skill: Omit<Skill, 'id'> & { id?: string }) => {
    const id = await saveSkillApi(skill);
    await refreshAllData();
    return id;
  };

  const deleteSkillData = async (id: string) => {
    await deleteSkillApi(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const saveProjectData = async (proj: Omit<Project, 'id'> & { id?: string }) => {
    const id = await saveProjectApi(proj);
    await refreshAllData();
    return id;
  };

  const deleteProjectData = async (id: string) => {
    await deleteProjectApi(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const saveBlogData = async (post: Omit<BlogPost, 'id'> & { id?: string }) => {
    const id = await saveBlogPostApi(post);
    await refreshAllData();
    return id;
  };

  const deleteBlogData = async (id: string) => {
    await deleteBlogPostApi(id);
    setBlogPosts((prev) => prev.filter((b) => b.id !== id));
  };

  const sendMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const id = await sendContactMessageApi(msg);
    const updatedMessages = await getMessages();
    setMessages(updatedMessages);
    return id;
  };

  const markMessageAsRead = async (id: string, read = true) => {
    await markMessageReadApi(id, read);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: read } : m)));
  };

  const deleteMessageData = async (id: string) => {
    await deleteMessageApi(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const saveSocialData = async (link: Omit<SocialLink, 'id'> & { id?: string }) => {
    const id = await saveSocialLinkApi(link);
    await refreshAllData();
    return id;
  };

  const deleteSocialData = async (id: string) => {
    await deleteSocialLinkApi(id);
    setSocialLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const updateSettingsData = async (data: Partial<SiteSettings>) => {
    await updateSettingsApi(data);
    setSettings((prev) => ({ ...prev, ...data }));
  };

  const saveEducationData = async (edu: Omit<Education, 'id'> & { id?: string }) => {
    const id = await saveEducationApi(edu);
    await refreshAllData();
    return id;
  };

  const deleteEducationData = async (id: string) => {
    await deleteEducationApi(id);
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const saveExperienceData = async (exp: Omit<Experience, 'id'> & { id?: string }) => {
    const id = await saveExperienceApi(exp);
    await refreshAllData();
    return id;
  };

  const deleteExperienceData = async (id: string) => {
    await deleteExperienceApi(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const seedFirebaseDatabase = async () => {
    const res = await seedInitialDataToFirestore();
    if (res.success) {
      await refreshAllData();
    }
    return res;
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        skills,
        projects,
        blogPosts,
        messages,
        socialLinks,
        settings,
        education,
        experiences,
        loading,
        refreshAllData,
        updateProfileData,
        saveSkillData,
        deleteSkillData,
        saveProjectData,
        deleteProjectData,
        saveBlogData,
        deleteBlogData,
        sendMessage,
        markMessageAsRead,
        deleteMessageData,
        saveSocialData,
        deleteSocialData,
        updateSettingsData,
        saveEducationData,
        deleteEducationData,
        saveExperienceData,
        deleteExperienceData,
        seedFirebaseDatabase,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
