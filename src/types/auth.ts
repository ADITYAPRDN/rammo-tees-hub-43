
export interface AdminProfile {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  profile: AdminProfile | null;
}
