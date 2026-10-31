import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { JobService } from '../services/jobService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSupabase: boolean;
  savedJobIds: string[];
  textScale: 'sm' | 'md' | 'lg';
  language: string;
  loginWithGoogle: () => Promise<void>;
  loginWithMobile: (phone: string, fullName?: string, category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS') => Promise<boolean>;
  loginWithDemo: (asAdmin?: boolean) => void;
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

  // Sync Supabase Auth listener if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || 'user@example.com',
            phoneNumber: session.user.phone || undefined,
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Candidate',
            avatarUrl: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatarUrl,
            aadhaarVerified: true,
            digiLockerLinked: true,
            isAdmin: session.user.email?.includes('admin') || user?.isAdmin || false,
            savedJobIds: savedJobIds,
          };
          setUser(authUser);
          localStorage.setItem('bharat_career_user', JSON.stringify(authUser));
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
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Candidate',
            avatarUrl: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatarUrl,
            aadhaarVerified: true,
            digiLockerLinked: true,
            isAdmin: session.user.email?.includes('admin') || false,
            savedJobIds: savedJobIds,
          };
          setUser(authUser);
          localStorage.setItem('bharat_career_user', JSON.stringify(authUser));
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
      // Demo Mode login
      loginWithDemo(false);
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
    const candidateName = fullName?.trim() || `Candidate (${cleanDigits.slice(-4)})`;
    
    const candidateUser: UserProfile = {
      id: `usr-mobile-${Date.now()}`,
      phoneNumber: formattedPhone,
      email: `${cleanDigits.slice(-10)}@candidate.bharatcareer.gov.in`,
      fullName: candidateName,
      otrNumber: `BHARAT-OTR-2025-${suffix}`,
      avatarUrl: '/assets/aistudio/abhi_pic-new_b1af521f.png',
      aadhaarVerified: true,
      digiLockerLinked: true,
      isAdmin: false,
      domicileState: 'Delhi (NCT)',
      highestQualification: "Bachelor's Degree",
      category: category || 'General',
      savedJobIds: savedJobIds.length > 0 ? savedJobIds : ['upsc-cse-2025', 'ssc-cgl-2025'],
    };

    setUser(candidateUser);
    localStorage.setItem('bharat_career_user', JSON.stringify(candidateUser));
    return true;
  };

  const loginWithDemo = (asAdmin: boolean = false) => {
    const demoUser: UserProfile = {
      ...DEFAULT_USER,
      isAdmin: asAdmin,
      fullName: asAdmin ? 'Administrator (UPSC Desk)' : 'Abhishek Bhardwaj (Candidate)',
      avatarUrl: asAdmin 
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : '/assets/aistudio/abhi_pic-new_b1af521f.png',
      email: asAdmin ? 'admin.deskv@nic.in' : 'abhishek.bhardwaj@bharatcareer.gov.in',
    };
    setUser(demoUser);
    localStorage.setItem('bharat_career_user', JSON.stringify(demoUser));
  };

  const toggleAdminRole = () => {
    setUser((prev) => {
      const updated: UserProfile = prev
        ? {
            ...prev,
            isAdmin: !prev.isAdmin,
          }
        : {
            ...DEFAULT_USER,
            isAdmin: true,
          };
      localStorage.setItem('bharat_career_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('bharat_career_user');
  };

  const toggleSaveJob = (jobId: string) => {
    const updated = JobService.toggleSaveJob(jobId);
    setSavedJobIds(updated);
    if (user) {
      const updatedUser = { ...user, savedJobIds: updated };
      setUser(updatedUser);
      localStorage.setItem('bharat_career_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        isSupabase: isSupabaseConfigured,
        savedJobIds,
        textScale,
        language,
        loginWithGoogle,
        loginWithMobile,
        loginWithDemo,
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
