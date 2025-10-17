/**
 * Authentication Middleware for procell API
 */

import { createClient } from '@supabase/supabase-js';
import * as kv from '../lib/kv-store.js';

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
 * Middleware to verify JWT token from Supabase
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Authentication service error',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to verify admin access
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${req.user.id}`);
    
    if (!userData || userData.userType !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }

    req.userData = userData;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(500).json({ 
      error: 'Authorization service error',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to verify user owns the resource
 */
export const requireOwnership = (resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const resourceId = req.params[resourceIdParam];
      
      // Check if user is admin (admins can access everything)
      const userData = await kv.get(`user:${req.user.id}`);
      if (userData && userData.userType === 'admin') {
        req.userData = userData;
        return next();
      }

      // For regular users, check ownership based on resource type
      const resourceType = req.route.path.split('/')[1]; // Extract resource type from path
      let resource = null;

      switch (resourceType) {
        case 'orders':
          resource = await kv.get(`order:${resourceId}`);
          break;
        case 'trade-in':
          resource = await kv.get(`trade-in:${resourceId}`);
          break;
        case 'repair':
          resource = await kv.get(`repair:${resourceId}`);
          break;
        default:
          return res.status(400).json({ 
            error: 'Invalid resource type',
            code: 'INVALID_RESOURCE'
          });
      }

      if (!resource) {
        return res.status(404).json({ 
          error: 'Resource not found',
          code: 'NOT_FOUND'
        });
      }

      if (resource.userId !== req.user.id) {
        return res.status(403).json({ 
          error: 'Access denied - not resource owner',
          code: 'ACCESS_DENIED'
        });
      }

      req.resource = resource;
      req.userData = userData;
      next();
    } catch (error) {
      console.error('Ownership verification error:', error);
      return res.status(500).json({ 
        error: 'Authorization service error',
        code: 'AUTH_ERROR'
      });
    }
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const supabase = getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        req.user = user;
        req.token = token;
        
        // Try to get additional user data
        try {
          const userData = await kv.get(`user:${user.id}`);
          req.userData = userData;
        } catch (kvError) {
          console.warn('Could not fetch user data from KV store:', kvError);
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Don't fail for optional auth, just continue without user
    next();
  }
};

export default {
  authenticateToken,
  requireAdmin,
  requireOwnership,
  optionalAuth
};