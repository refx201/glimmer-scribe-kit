/**
 * procell - Key-Value Store Module
 * Simple key-value interface for storing data using Supabase
 */

import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

// Initialize Supabase client
const getClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

/**
 * Set stores a key-value pair in the database.
 * @param {string} key - The key to store
 * @param {any} value - The value to store
 * @returns {Promise<void>}
 */
export const set = async (key, value) => {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('kv_store_225dbdeb')
      .upsert({
        key,
        value
      });
    
    if (error) {
      throw new Error(`KV Store Set Error: ${error.message}`);
    }
  } catch (error) {
    console.error('KV Store Set Error:', error);
    throw error;
  }
};

/**
 * Get retrieves a key-value pair from the database.
 * @param {string} key - The key to retrieve
 * @returns {Promise<any>} The stored value or null if not found
 */
export const get = async (key) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('kv_store_225dbdeb')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      throw new Error(`KV Store Get Error: ${error.message}`);
    }
    
    return data?.value || null;
  } catch (error) {
    console.error('KV Store Get Error:', error);
    throw error;
  }
};

/**
 * Delete deletes a key-value pair from the database.
 * @param {string} key - The key to delete
 * @returns {Promise<void>}
 */
export const del = async (key) => {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('kv_store_225dbdeb')
      .delete()
      .eq('key', key);
    
    if (error) {
      throw new Error(`KV Store Delete Error: ${error.message}`);
    }
  } catch (error) {
    console.error('KV Store Delete Error:', error);
    throw error;
  }
};

/**
 * Sets multiple key-value pairs in the database.
 * @param {string[]} keys - Array of keys
 * @param {any[]} values - Array of values
 * @returns {Promise<void>}
 */
export const mset = async (keys, values) => {
  try {
    if (keys.length !== values.length) {
      throw new Error('Keys and values arrays must have the same length');
    }
    
    const supabase = getClient();
    const records = keys.map((key, index) => ({
      key,
      value: values[index]
    }));
    
    const { error } = await supabase
      .from('kv_store_225dbdeb')
      .upsert(records);
    
    if (error) {
      throw new Error(`KV Store MSet Error: ${error.message}`);
    }
  } catch (error) {
    console.error('KV Store MSet Error:', error);
    throw error;
  }
};

/**
 * Gets multiple key-value pairs from the database.
 * @param {string[]} keys - Array of keys to retrieve
 * @returns {Promise<any[]>} Array of values
 */
export const mget = async (keys) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('kv_store_225dbdeb')
      .select('value')
      .in('key', keys);
    
    if (error) {
      throw new Error(`KV Store MGet Error: ${error.message}`);
    }
    
    return data?.map(d => d.value) || [];
  } catch (error) {
    console.error('KV Store MGet Error:', error);
    throw error;
  }
};

/**
 * Deletes multiple key-value pairs from the database.
 * @param {string[]} keys - Array of keys to delete
 * @returns {Promise<void>}
 */
export const mdel = async (keys) => {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('kv_store_225dbdeb')
      .delete()
      .in('key', keys);
    
    if (error) {
      throw new Error(`KV Store MDelete Error: ${error.message}`);
    }
  } catch (error) {
    console.error('KV Store MDelete Error:', error);
    throw error;
  }
};

/**
 * Search for key-value pairs by prefix.
 * @param {string} prefix - The prefix to search for
 * @returns {Promise<any[]>} Array of matching values
 */
export const getByPrefix = async (prefix) => {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('kv_store_225dbdeb')
      .select('key, value')
      .like('key', `${prefix}%`);
    
    if (error) {
      throw new Error(`KV Store GetByPrefix Error: ${error.message}`);
    }
    
    return data?.map(d => d.value) || [];
  } catch (error) {
    console.error('KV Store GetByPrefix Error:', error);
    throw error;
  }
};

/**
 * Clear all keys with a specific prefix (useful for testing)
 * @param {string} prefix - The prefix to clear
 * @returns {Promise<void>}
 */
export const clearByPrefix = async (prefix) => {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('kv_store_225dbdeb')
      .delete()
      .like('key', `${prefix}%`);
    
    if (error) {
      throw new Error(`KV Store ClearByPrefix Error: ${error.message}`);
    }
  } catch (error) {
    console.error('KV Store ClearByPrefix Error:', error);
    throw error;
  }
};

/**
 * Count keys with a specific prefix
 * @param {string} prefix - The prefix to count
 * @returns {Promise<number>} Number of matching keys
 */
export const countByPrefix = async (prefix) => {
  try {
    const supabase = getClient();
    const { count, error } = await supabase
      .from('kv_store_225dbdeb')
      .select('*', { count: 'exact', head: true })
      .like('key', `${prefix}%`);
    
    if (error) {
      throw new Error(`KV Store CountByPrefix Error: ${error.message}`);
    }
    
    return count || 0;
  } catch (error) {
    console.error('KV Store CountByPrefix Error:', error);
    throw error;
  }
};

export default {
  set,
  get,
  del,
  mset,
  mget,
  mdel,
  getByPrefix,
  clearByPrefix,
  countByPrefix
};