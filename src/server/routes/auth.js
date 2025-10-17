/**
 * Authentication Routes for procell API
 */

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import * as kv from '../lib/kv-store.js';
import { validateUserRegistration } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

let supabaseClient = null;

const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

/**
 * POST /auth/signup
 * User registration endpoint
 */
router.post('/signup', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, name, userType = 'customer' } = req.body;
    
    const supabase = getSupabaseClient();
    
    console.log('Backend signup attempt - forcing email confirmation bypass');
    
    // Create user with Supabase Auth and bypass email confirmation
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType },
      email_confirm: true // Force email confirmation bypass
    });

    if (error) {
      console.error('Signup error:', error);
      return res.status(400).json({ 
        error: error.message,
        code: 'SIGNUP_ERROR'
      });
    }

    // Store additional user data in KV store
    const userData = {
      id: data.user.id,
      email,
      name,
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        avatar: null,
        phone: null,
        address: null,
        preferences: {
          notifications: true,
          marketing: false
        }
      }
    };

    await kv.set(`user:${data.user.id}`, userData);

    // Return user data (without sensitive information)
    const { user } = data;
    const responseData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      userType: user.user_metadata.userType,
      createdAt: user.created_at
    };

    res.status(201).json({ 
      message: 'User created successfully',
      user: responseData 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/signin
 * User login endpoint (handled by Supabase client-side, but we can add server-side logic here)
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const supabase = getSupabaseClient();
    
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Signin error:', error);
      return res.status(401).json({ 
        error: error.message,
        code: 'SIGNIN_ERROR'
      });
    }

    // Get additional user data from KV store
    let userData = null;
    try {
      userData = await kv.get(`user:${data.user.id}`);
    } catch (kvError) {
      console.warn('Could not fetch user data from KV store:', kvError);
    }

    const responseData = {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        userType: data.user.user_metadata.userType || userData?.userType || 'customer',
        createdAt: data.user.created_at
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    };

    res.json({ 
      message: 'Signed in successfully',
      ...responseData 
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      error: 'Failed to sign in',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /auth/profile
 * Get user profile
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data from KV store
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      // If no data in KV store, create from Supabase auth data
      const basicUserData = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.name || 'User',
        userType: req.user.user_metadata?.userType || 'customer',
        createdAt: req.user.created_at,
        updatedAt: new Date().toISOString(),
        profile: {
          avatar: null,
          phone: null,
          address: null,
          preferences: {
            notifications: true,
            marketing: false
          }
        }
      };
      
      await kv.set(`user:${userId}`, basicUserData);
      return res.json({ user: basicUserData });
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      error: 'Failed to get profile',
      code: 'PROFILE_ERROR'
    });
  }
});

/**
 * PUT /auth/profile
 * Update user profile
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, avatar, preferences } = req.body;
    
    // Get current user data
    const currentUserData = await kv.get(`user:${userId}`);
    
    if (!currentUserData) {
      return res.status(404).json({ 
        error: 'User profile not found',
        code: 'PROFILE_NOT_FOUND'
      });
    }

    // Update user data
    const updatedUserData = {
      ...currentUserData,
      updatedAt: new Date().toISOString()
    };

    if (name) updatedUserData.name = name;
    if (phone) updatedUserData.profile.phone = phone;
    if (address) updatedUserData.profile.address = address;
    if (avatar) updatedUserData.profile.avatar = avatar;
    if (preferences) updatedUserData.profile.preferences = { ...updatedUserData.profile.preferences, ...preferences };

    await kv.set(`user:${userId}`, updatedUserData);

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUserData 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      code: 'PROFILE_UPDATE_ERROR'
    });
  }
});

/**
 * POST /auth/signout
 * User logout endpoint
 */
router.post('/signout', authenticateToken, async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Sign out from Supabase (this invalidates the refresh token)
    const { error } = await supabase.auth.admin.signOut(req.token);
    
    if (error) {
      console.error('Signout error:', error);
      return res.status(500).json({ 
        error: 'Failed to sign out',
        code: 'SIGNOUT_ERROR'
      });
    }

    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ 
      error: 'Failed to sign out',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    const supabase = getSupabaseClient();
    
    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({ 
        error: error.message,
        code: 'REFRESH_ERROR'
      });
    }

    res.json({
      message: 'Token refreshed successfully',
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      error: 'Failed to refresh token',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;