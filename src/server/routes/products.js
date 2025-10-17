/**
 * Products Routes for procell API
 */

import express from 'express';
import * as kv from '../lib/kv-store.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /products
 * Get all products with optional filtering
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, brand, search, limit, offset } = req.query;
    
    // Get all products
    let products = await kv.getByPrefix('product:');
    
    // Apply filters
    if (category) {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    
    if (brand) {
      products = products.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(p => 
        p.name?.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.brand?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by creation date (newest first)
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const totalCount = products.length;
    const limitNumber = parseInt(limit) || 20;
    const offsetNumber = parseInt(offset) || 0;
    
    if (limit || offset) {
      products = products.slice(offsetNumber, offsetNumber + limitNumber);
    }
    
    res.json({
      products,
      pagination: {
        total: totalCount,
        limit: limitNumber,
        offset: offsetNumber,
        hasMore: offsetNumber + limitNumber < totalCount
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Failed to get products',
      code: 'GET_PRODUCTS_ERROR'
    });
  }
});

/**
 * GET /products/:id
 * Get a specific product by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const productKey = id.startsWith('product:') ? id : `product:${id}`;
    
    const product = await kv.get(productKey);
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    // Track product view (optional analytics)
    if (req.user) {
      try {
        const viewKey = `view:${req.user.id}:${product.id}:${new Date().toDateString()}`;
        await kv.set(viewKey, {
          userId: req.user.id,
          productId: product.id,
          timestamp: new Date().toISOString()
        });
      } catch (viewError) {
        console.warn('Failed to track product view:', viewError);
      }
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: 'Failed to get product',
      code: 'GET_PRODUCT_ERROR'
    });
  }
});

/**
 * POST /products
 * Create a new product (admin only)
 */
router.post('/', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const productData = req.body;
    const productId = `product:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const product = {
      ...productData,
      id: productId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.id,
      // Default values
      rating: productData.rating || 0,
      reviewsCount: productData.reviewsCount || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      availability: productData.availability || 'متوفر',
      viewsCount: 0,
      salesCount: 0
    };
    
    await kv.set(productId, product);
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Failed to create product',
      code: 'CREATE_PRODUCT_ERROR'
    });
  }
});

/**
 * PUT /products/:id
 * Update a product (admin only)
 */
router.put('/:id', authenticateToken, requireAdmin, validateProduct, async (req, res) => {
  try {
    const { id } = req.params;
    const productKey = id.startsWith('product:') ? id : `product:${id}`;
    const updateData = req.body;
    
    const existingProduct = await kv.get(productKey);
    
    if (!existingProduct) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    const updatedProduct = {
      ...existingProduct,
      ...updateData,
      id: existingProduct.id, // Keep original ID
      createdAt: existingProduct.createdAt, // Keep original creation date
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.id
    };
    
    await kv.set(productKey, updatedProduct);
    
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Failed to update product',
      code: 'UPDATE_PRODUCT_ERROR'
    });
  }
});

/**
 * DELETE /products/:id
 * Delete a product (admin only)
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const productKey = id.startsWith('product:') ? id : `product:${id}`;
    
    const existingProduct = await kv.get(productKey);
    
    if (!existingProduct) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    await kv.del(productKey);
    
    res.json({
      message: 'Product deleted successfully',
      productId: id
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      code: 'DELETE_PRODUCT_ERROR'
    });
  }
});

/**
 * GET /products/categories
 * Get all available product categories
 */
router.get('/meta/categories', async (req, res) => {
  try {
    const products = await kv.getByPrefix('product:');
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      error: 'Failed to get categories',
      code: 'GET_CATEGORIES_ERROR'
    });
  }
});

/**
 * GET /products/brands
 * Get all available product brands
 */
router.get('/meta/brands', async (req, res) => {
  try {
    const products = await kv.getByPrefix('product:');
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    
    res.json({ brands });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      error: 'Failed to get brands',
      code: 'GET_BRANDS_ERROR'
    });
  }
});

/**
 * POST /products/:id/review
 * Add a review to a product
 */
router.post('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, name } = req.body;
    const productKey = id.startsWith('product:') ? id : `product:${id}`;
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
        code: 'INVALID_RATING'
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: 'Name is required',
        code: 'NAME_REQUIRED'
      });
    }
    
    const product = await kv.get(productKey);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    // Create review (anonymous reviews allowed)
    const reviewId = `review:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const review = {
      id: reviewId,
      productId: product.id,
      userName: name.trim(),
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date().toISOString(),
      isAnonymous: true
    };
    
    // Store the review
    await kv.set(reviewId, review);
    
    // Update product rating
    const currentRating = product.rating || 0;
    const currentCount = product.reviewsCount || 0;
    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + rating) / newCount;
    
    const updatedProduct = {
      ...product,
      rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
      reviewsCount: newCount,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(productKey, updatedProduct);
    
    res.status(201).json({
      message: 'Review added successfully',
      review,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      error: 'Failed to add review',
      code: 'ADD_REVIEW_ERROR'
    });
  }
});

/**
 * GET /products/:id/reviews
 * Get reviews for a product
 */
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit, offset } = req.query;
    const productKey = id.startsWith('product:') ? id : `product:${id}`;
    
    const product = await kv.get(productKey);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }
    
    // Get all reviews for this product
    const allReviews = await kv.getByPrefix('review:');
    let productReviews = allReviews.filter(review => 
      review.productId === product.id && review.id.startsWith('review:')
    );
    
    // Sort by creation date (newest first)
    productReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const totalCount = productReviews.length;
    const limitNumber = parseInt(limit) || 10;
    const offsetNumber = parseInt(offset) || 0;
    
    if (limit || offset) {
      productReviews = productReviews.slice(offsetNumber, offsetNumber + limitNumber);
    }
    
    res.json({
      reviews: productReviews,
      pagination: {
        total: totalCount,
        limit: limitNumber,
        offset: offsetNumber,
        hasMore: offsetNumber + limitNumber < totalCount
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      error: 'Failed to get reviews',
      code: 'GET_REVIEWS_ERROR'  
    });
  }
});

export default router;