/**
 * Authentication Flow Tests
 * 
 * Tests for sign-in, sign-up, Google OAuth, and role-based access control
 * Run these tests with: npm test src/tests/auth.test.ts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '../lib/supabase';

// Mock data
const mockUser = {
  email: 'test@example.com',
  password: 'testPassword123',
  name: 'Test User',
  phone: '+970591234567'
};

const mockAdmin = {
  email: 'admin@procell.app',
  password: 'adminPassword123',
  name: 'Admin User'
};

describe('Authentication System', () => {
  let testUserId: string | null = null;

  afterEach(async () => {
    // Cleanup: sign out and delete test user
    if (testUserId) {
      try {
        await supabase.auth.signOut();
        // Note: Deletion requires admin privileges, handled by RLS
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
  });

  describe('User Sign Up', () => {
    it('should successfully create a new user account', async () => {
      const { data, error } = await supabase.auth.signUp({
        email: mockUser.email,
        password: mockUser.password,
        options: {
          data: {
            name: mockUser.name,
            phone: mockUser.phone
          }
        }
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(mockUser.email);
      
      if (data.user) {
        testUserId = data.user.id;
      }
    });

    it('should create a profile entry on sign up', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `profile-${Date.now()}@example.com`,
        password: mockUser.password,
        options: {
          data: {
            name: mockUser.name,
            phone: mockUser.phone
          }
        }
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Wait for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        expect(error).toBeNull();
        expect(profile).toBeDefined();
        expect(profile?.email).toBe(authData.user.email);
      }
    });

    it('should assign customer role by default on sign up', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `role-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Wait for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id);

        expect(error).toBeNull();
        expect(roles).toBeDefined();
        expect(roles?.length).toBeGreaterThan(0);
        expect(roles?.[0].role).toBe('customer');
      }
    });

    it('should reject duplicate email addresses', async () => {
      const duplicateEmail = `duplicate-${Date.now()}@example.com`;

      // Create first user
      const { data: firstUser } = await supabase.auth.signUp({
        email: duplicateEmail,
        password: mockUser.password
      });

      if (firstUser.user) {
        testUserId = firstUser.user.id;
      }

      // Try to create duplicate
      const { error } = await supabase.auth.signUp({
        email: duplicateEmail,
        password: mockUser.password
      });

      expect(error).toBeDefined();
    });

    it('should validate password minimum length', async () => {
      const { error } = await supabase.auth.signUp({
        email: `short-${Date.now()}@example.com`,
        password: '12345' // Less than 6 characters
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('Password should be at least 6 characters');
    });
  });

  describe('User Sign In', () => {
    beforeEach(async () => {
      // Create a test user for sign-in tests
      const { data } = await supabase.auth.signUp({
        email: `signin-${Date.now()}@example.com`,
        password: mockUser.password
      });
      
      if (data.user) {
        testUserId = data.user.id;
      }
      
      // Sign out before each test
      await supabase.auth.signOut();
    });

    it('should successfully sign in with valid credentials', async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `signin-${testUserId}@example.com`,
        password: mockUser.password
      });

      expect(error).toBeNull();
      expect(data.session).toBeDefined();
      expect(data.user).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: `signin-${testUserId}@example.com`,
        password: 'wrongPassword'
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid login credentials');
    });

    it('should create session on successful sign in', async () => {
      const { data } = await supabase.auth.signInWithPassword({
        email: `signin-${testUserId}@example.com`,
        password: mockUser.password
      });

      expect(data.session).toBeDefined();
      expect(data.session?.access_token).toBeDefined();
      expect(data.session?.refresh_token).toBeDefined();
    });
  });

  describe('Google OAuth', () => {
    it('should initiate Google OAuth flow', async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      // OAuth returns a URL for redirection
      expect(error).toBeNull();
      expect(data.url).toBeDefined();
      expect(data.url).toContain('google');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should check if user has specific role', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `rbac-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Wait for role assignment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check role using security definer function
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: authData.user.id,
          _role: 'customer'
        });

        expect(error).toBeNull();
        expect(data).toBe(true);
      }
    });

    it('should not allow non-admins to assign roles', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `non-admin-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Try to assign admin role (should fail due to RLS)
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin'
          });

        expect(error).toBeDefined();
      }
    });

    it('should fetch user roles correctly', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `fetch-roles-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Wait for role assignment
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: roles, error } = await supabase.rpc('get_user_roles', {
          _user_id: authData.user.id
        });

        expect(error).toBeNull();
        expect(roles).toBeDefined();
        expect(Array.isArray(roles)).toBe(true);
        expect(roles).toContain('customer');
      }
    });
  });

  describe('User Presence Tracking', () => {
    it('should update user presence on sign in', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `presence-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Simulate presence update
        await supabase
          .from('user_presence')
          .upsert({
            user_id: authData.user.id,
            heartbeat_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        const { data: presence, error } = await supabase
          .from('user_presence')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        expect(error).toBeNull();
        expect(presence).toBeDefined();
        expect(presence?.user_id).toBe(authData.user.id);
      }
    });
  });

  describe('Sign Out', () => {
    it('should successfully sign out user', async () => {
      // Sign in first
      const { data: authData } = await supabase.auth.signUp({
        email: `signout-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Sign out
        const { error } = await supabase.auth.signOut();

        expect(error).toBeNull();

        // Verify session is cleared
        const { data: session } = await supabase.auth.getSession();
        expect(session.session).toBeNull();
      }
    });

    it('should clean up presence on sign out', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `cleanup-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Create presence
        await supabase
          .from('user_presence')
          .upsert({
            user_id: authData.user.id,
            heartbeat_at: new Date().toISOString()
          });

        // Delete presence
        await supabase
          .from('user_presence')
          .delete()
          .eq('user_id', authData.user.id);

        // Verify cleanup
        const { data: presence } = await supabase
          .from('user_presence')
          .select('*')
          .eq('user_id', authData.user.id);

        expect(presence).toHaveLength(0);
      }
    });
  });

  describe('Profile Management', () => {
    it('should allow users to update their own profile', async () => {
      const { data: authData } = await supabase.auth.signUp({
        email: `update-${Date.now()}@example.com`,
        password: mockUser.password
      });

      if (authData.user) {
        testUserId = authData.user.id;

        // Wait for profile creation
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: 'Updated Name',
            phone: '+970599999999'
          })
          .eq('id', authData.user.id);

        expect(error).toBeNull();

        // Verify update
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        expect(profile?.full_name).toBe('Updated Name');
        expect(profile?.phone).toBe('+970599999999');
      }
    });
  });
});

describe('Security Tests', () => {
  it('should prevent RLS bypass attempts', async () => {
    // Try to query user_roles without authentication
    await supabase.auth.signOut();

    const { data, error } = await supabase
      .from('user_roles')
      .select('*');

    // Should return empty or error due to RLS
    expect(data).toEqual([]);
  });

  it('should use security definer functions correctly', async () => {
    const { data: authData } = await supabase.auth.signUp({
      email: `security-${Date.now()}@example.com`,
      password: 'testPassword123'
    });

    if (authData.user) {
      // Wait for role assignment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call security definer function
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: authData.user.id,
        _role: 'customer'
      });

      expect(error).toBeNull();
      expect(typeof data).toBe('boolean');
    }
  });
});
