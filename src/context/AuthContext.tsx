import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { JobService } from '../services/jobService';

import { persistUserToDatabase } from '../lib/dbSync';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabase: boolean;
  dbSyncStatus: string | null;
  savedJobIds: string[];
  textScale: 'sm' | 'md' | 'lg';
  language: string;
  loginWithGoogle: () => Promise<void>;
  loginWithMobile: (phone: string, fullName?: string, category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS') => Promise<boolean>;
  loginWithDemo: (asAdmin?: boolean) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  toggleAdminRole: () => void;
  logout: () => void;
  toggleSaveJob: (jobId: string) => void;
  setTextScale: (scale: 'sm' | 'md' | 'lg') => void;
  setLanguage: (lang: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-aadhaar-verified-9821',
  email: 'candidate.portal@bharatcareer.gov.in',
  phoneNumber: '+91 98765 43210',
  otrNumber: 'BHARAT-OTR-2025-9821',
  fullName: 'Abhishek Bhardwaj',
  avatarUrl: '/assets/aistudio/abhi_pic-new_b1af521f.png',
  aadhaarVerified: true,
  digiLockerLinked: true,
  isAdmin: false,
  domicileState: 'Uttar Pradesh',
  highestQualification: "Bachelor's Degree (Engg)",
  category: 'General',
  savedJobIds: ['upsc-cse-2025', 'ssc-cgl-2025', 'rrb-alp-2025'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('bharat_career_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Seamlessly migrate any stale cached data from previous builds
        if (
          parsed.fullName === 'Abhishek Sharma' || 
          !parsed.avatarUrl || 
          parsed.avatarUrl.includes('googleusercontent') || 
          parsed.avatarUrl.includes('unsplash')
        ) {
          parsed.fullName = 'Abhishek Bhardwaj';
          parsed.avatarUrl = '/assets/aistudio/abhi_pic-new_b1af521f.png';
          localStorage.setItem('bharat_career_user', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    return JobService.getSavedJobIds();
  });

  const [textScale, setTextScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [language, setLanguage] = useState<string>('en');
  const [dbSyncStatus, setDbSyncStatus] = useState<string | null>(null);

  // Sync initial user with database on first mount
  useEffect(() => {
    if (user) {
      persistUserToDatabase(user).then((res) => {
        if (res.serverDbSynced || res.supabaseSynced) {
          setDbSyncStatus(res.timestamp);
        }
      });
    }
  }, []);

  // Sync Supabase Auth listener if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || 'user@example.com',
            phoneNumber: session.user.phone || undefined,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Abhishek Bhardwaj',
            avatarUrl: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatarUrl,
            aadhaarVerified: true,
            digiLockerLinked: true,
            isAdmin: session.user.email?.includes('admin') || user?.isAdmin || false,
            savedJobIds: savedJobIds,
            lastSavedToDbAt: new Date().toISOString(),
          };
          setUser(authUser);
          localStorage.setItem('bharat_career_user', JSON.stringify(authUser));
          persistUserToDatabase(authUser).then((res) => {
            setDbSyncStatus(res.timestamp);
          });
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || 'user@example.com',
            phoneNumber: session.user.phone || undefined,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Abhishek Bhardwaj',
            avatarUrl: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatarUrl,
            aadhaarVerified: true,
            digiLockerLinked: true,
            isAdmin: session.user.email?.includes('admin') || false,
            savedJobIds: savedJobIds,
            lastSavedToDbAt: new Date().toISOString(),
          };
          setUser(authUser);
          localStorage.setItem('bharat_career_user', JSON.stringify(authUser));
          persistUserToDatabase(authUser).then((res) => {
            setDbSyncStatus(res.timestamp);
          });
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } else {
      // Demo / Local Google Login with immediate DB Persistence
      const googleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        email: 'abhishek.hcst14@gmail.com',
        fullName: 'Abhishek Bhardwaj',
        avatarUrl: '/assets/aistudio/abhi_pic-new_b1af521f.png',
        aadhaarVerified: true,
        digiLockerLinked: true,
        isAdmin: false,
        domicileState: 'Uttar Pradesh',
        highestQualification: "Bachelor's Degree (Engg)",
        category: 'General',
        savedJobIds: savedJobIds.length > 0 ? savedJobIds : ['upsc-cse-2025', 'ssc-cgl-2025', 'rrb-alp-2025'],
        lastSavedToDbAt: new Date().toISOString(),
      };
      setUser(googleUser);
      localStorage.setItem('bharat_career_user', JSON.stringify(googleUser));
      const syncRes = await persistUserToDatabase(googleUser);
      setDbSyncStatus(syncRes.timestamp);
    }
  };

  const loginWithMobile = async (
    phone: string, 
    fullName?: string, 
    category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  ): Promise<boolean> => {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;
    const cleanDigits = phone.replace(/\D/g, '');
    const suffix = cleanDigits.slice(-4) || '2025';
    const candidateName = fullName?.trim() || 'Abhishek Bhardwaj';
    
    const candidateUser: UserProfile = {
      id: `usr-mobile-${cleanDigits.slice(-10) || Date.now()}`,
      phoneNumber: formattedPhone,
      email: `${cleanDigits.slice(-10)}@candidate.bharatcareer.gov.in`,
      fullName: candidateName,
      otrNumber: `BHARAT-OTR-2025-${suffix}`,
      avatarUrl: '/assets/aistudio/abhi_pic-new_b1af521f.png',
      aadhaarVerified: true,
      digiLockerLinked: true,
      isAdmin: false,
      domicileState: 'Uttar Pradesh',
      highestQualification: "Bachelor's Degree (Engg)",
      category: category || 'General',
      savedJobIds: savedJobIds.length > 0 ? savedJobIds : ['upsc-cse-2025', 'ssc-cgl-2025'],
      lastSavedToDbAt: new Date().toISOString(),
    };

    setUser(candidateUser);
    localStorage.setItem('bharat_career_user', JSON.stringify(candidateUser));
    
    // Explicitly persist to database
    const syncRes = await persistUserToDatabase(candidateUser);
    setDbSyncStatus(syncRes.timestamp);
    return true;
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated: UserProfile = {
      ...user,
      ...updates,
      lastSavedToDbAt: new Date().toISOString(),
    };
    setUser(updated);
    localStorage.setItem('bharat_career_user', JSON.stringify(updated));
    const syncRes = await persistUserToDatabase(updated);
    setDbSyncStatus(syncRes.timestamp);
    return true;
  };

  const loginWithDemo = async (asAdmin: boolean = false) => {
    const demoUser: UserProfile = {
      ...DEFAULT_USER,
      isAdmin: asAdmin,
      fullName: asAdmin ? 'Administrator (UPSC Desk)' : 'Abhishek Bhardwaj',
      avatarUrl: asAdmin 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : '/assets/aistudio/abhi_pic-new_b1af521f.png',
      email: asAdmin ? 'admin.deskv@nic.in' : 'abhishek.hcst14@gmail.com',
      lastSavedToDbAt: new Date().toISOString(),
    };
    setUser(demoUser);
    localStorage.setItem('bharat_career_user', JSON.stringify(demoUser));
    const syncRes = await persistUserToDatabase(demoUser);
    setDbSyncStatus(syncRes.timestamp);
  };

  const toggleAdminRole = async () => {
    setUser((prev) => {
      const updated: UserProfile = prev
        ? {
            ...prev,
            isAdmin: !prev.isAdmin,
            lastSavedToDbAt: new Date().toISOString(),
          }
        : {
            ...DEFAULT_USER,
            isAdmin: true,
            lastSavedToDbAt: new Date().toISOString(),
          };
      localStorage.setItem('bharat_career_user', JSON.stringify(updated));
      persistUserToDatabase(updated);
      return updated;
    });
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('bharat_career_user');
    setDbSyncStatus(null);
  };

  const toggleSaveJob = async (jobId: string) => {
    const updated = JobService.toggleSaveJob(jobId);
    setSavedJobIds(updated);
    if (user) {
      const updatedUser = { 
        ...user, 
        savedJobIds: updated,
        lastSavedToDbAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      localStorage.setItem('bharat_career_user', JSON.stringify(updatedUser));
      const syncRes = await persistUserToDatabase(updatedUser);
      setDbSyncStatus(syncRes.timestamp);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isSupabase: isSupabaseConfigured,
        dbSyncStatus,
        savedJobIds,
        textScale,
        language,
        loginWithGoogle,
        loginWithMobile,
        loginWithDemo,
        updateUserProfile,
        toggleAdminRole,
        logout,
        toggleSaveJob,
        setTextScale,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
