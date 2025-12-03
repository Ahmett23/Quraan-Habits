import { supabase } from '../lib/supabase';
import { User, AuthResponse } from '../types';

export const authService = {
  // 1. Signup
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("Signup failed");

    // Create profile entry
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, email, full_name: name }]);

    if (profileError) console.error("Error creating profile:", profileError);

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: name,
      joinedAt: new Date(data.user.created_at).getTime()
    };

    return { user, token: data.session?.access_token || '' };
  },

  // 2. Login
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Login failed");

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name || 'User',
      joinedAt: new Date(data.user.created_at).getTime()
    };

    return { user, token: data.session?.access_token || '' };
  },

  // 3. Logout
  async logout() {
    await supabase.auth.signOut();
  },

  // 4. Get Current User
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata.full_name || 'User',
      joinedAt: new Date(session.user.created_at).getTime()
    };
  },

  // 5. Reset Password
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/',
    });
    if (error) throw error;
  }
};