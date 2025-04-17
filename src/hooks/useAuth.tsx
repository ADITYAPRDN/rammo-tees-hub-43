
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, AdminProfile } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false,
    isSuperAdmin: false,
    profile: null,
  });

  async function fetchAdminProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setAuthState(prev => ({
          ...prev,
          isAdmin: true,
          isSuperAdmin: data.is_super_admin,
          profile: data as AdminProfile,
        }));
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  }

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, isAuthenticated: true }));
        fetchAdminProfile(session.user.id);
      }
      setAuthState(prev => ({ ...prev, isLoading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthState(prev => ({ ...prev, isAuthenticated: true }));
        fetchAdminProfile(session.user.id);
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          isAdmin: false,
          isSuperAdmin: false,
          profile: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: error.message || "Terjadi kesalahan saat login",
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout gagal",
        description: error.message || "Terjadi kesalahan saat logout",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
