/**
 * Data Initialization Routes for procell API
 * Handles sample data initialization and management
 */

import express from 'express';
import * as kv from '../lib/kv-store.js';
import { requireAdmin, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /init-data
 * Initialize sample data for the application
 */
router.post('/init-data', async (req, res) => {
  try {
    // Check if data already exists
    const existingProducts = await kv.getByPrefix('product:');
    
    if (existingProducts.length > 0) {
      return res.json({
        message: 'Sample data already exists',
        existingProductsCount: existingProducts.length
      });
    }

    // Sample products data
    const sampleProducts = [
      {
        id: 'product:iphone15pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'phone',
        price: 4500,
        originalPrice: 5000,
        currency: 'ILS',
        rating: 4.8,
        reviewsCount: 156,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&h=800&fit=crop&crop=center'
        ],
        badge: 'الأكثر مبيعاً',
        inStock: true,
        availability: 'متوفر',
        description: 'أحدث هاتف من Apple مع تقنيات متطورة ومعالج A17 Pro',
        specifications: {
          storage: '256GB',
          ram: '8GB', 
          screen: '6.1 inch',
          camera: '48MP + 12MP + 12MP',
          battery: '3274mAh'
        },
        features: [
          'معالج A17 Pro المتطور',
          'كاميرا ثلاثية 48 ميجابكسل',
          'شاشة Super Retina XDR',
          'مقاوم للماء IP68',
          'دعم 5G'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 234,
        salesCount: 45
      },
      {
        id: 'product:galaxys24',
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        category: 'phone',
        price: 3200,
        originalPrice: 3800,
        currency: 'ILS',
        rating: 4.7,
        reviewsCount: 89,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center'
        ],
        badge: 'عرض خاص',
        inStock: true,
        availability: 'متوفر',
        description: 'هاتف Samsung الرائد مع كاميرا متطورة وأداء استثنائي',
        specifications: {
          storage: '256GB',
          ram: '8GB',
          screen: '6.2 inch',
          camera: '50MP + 12MP + 10MP',
          battery: '4000mAh'
        },
        features: [
          'معالج Snapdragon 8 Gen 3',
          'كاميرا ثلاثية بدقة 50 ميجابكسل',
          'شاشة Dynamic AMOLED 2X',
          'شحن سريع 25W',
          'مقاوم للماء والغبار'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 187,
        salesCount: 32
      },
      {
        id: 'product:xiaomi14pro',
        name: 'Xiaomi 14 Pro',
        brand: 'Xiaomi',
        category: 'phone',
        price: 2100,
        originalPrice: 2500,
        currency: 'ILS',
        rating: 4.6,
        reviewsCount: 124,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&h=800&fit=crop&crop=center'
        ],
        badge: 'جديد',
        inStock: true,
        availability: 'متوفر',
        description: 'أداء قوي وسعر منافس من Xiaomi مع تصميم أنيق',
        specifications: {
          storage: '256GB',
          ram: '8GB',
          screen: '6.73 inch',
          camera: '50MP + 50MP + 50MP',
          battery: '4880mAh'
        },
        features: [
          'معالج Snapdragon 8 Gen 3',
          'كاميرا ثلاثية متطورة',
          'شاشة AMOLED منحنية',
          'شحن سريع 120W',
          'تصميم معدني فاخر'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 156,
        salesCount: 28
      },
      {
        id: 'product:realme12plus',
        name: 'Realme 12+ 5G',
        brand: 'Realme',
        category: 'phone',
        price: 1200,
        originalPrice: 1400,
        currency: 'ILS',
        rating: 4.4,
        reviewsCount: 67,
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop&crop=center',
        badge: 'قيمة ممتازة',
        inStock: true,
        availability: 'متوفر',
        description: 'هاتف متوسط الفئة بمواصفات قوية وسعر معقول',
        specifications: {
          storage: '128GB',
          ram: '8GB',
          screen: '6.67 inch',
          camera: '50MP + 8MP + 2MP',  
          battery: '5000mAh'
        },
        features: [
          'معالج MediaTek Dimensity 7050',
          'كاميرا رئيسية 50 ميجابكسل',
          'شاشة AMOLED 120Hz',
          'شحن سريع 67W',
          'بطارية كبيرة 5000mAh'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 98,
        salesCount: 15
      },
      {
        id: 'product:opporeno11',
        name: 'OPPO Reno11 5G',
        brand: 'OPPO',
        category: 'phone',
        price: 1800,
        originalPrice: 2100,
        currency: 'ILS',
        rating: 4.5,
        reviewsCount: 43,
        image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&crop=center',
        badge: 'كاميرا متميزة',
        inStock: true,
        availability: 'متوفر',
        description: 'هاتف OPPO مع تركيز على التصوير والتصميم الأنيق',
        specifications: {
          storage: '256GB',
          ram: '8GB',
          screen: '6.7 inch',
          camera: '50MP + 32MP + 8MP',
          battery: '4700mAh'
        },
        features: [
          'معالج MediaTek Dimensity 8050',
          'كاميرا سيلفي 32 ميجابكسل',
          'شاشة AMOLED منحنية',
          'شحن سريع 67W',
          'تصميم رفيع وأنيق'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 76,
        salesCount: 12
      },
      {
        id: 'product:infinixnote40',
        name: 'Infinix Note 40 Pro',
        brand: 'Infinix',
        category: 'phone',
        price: 950,
        originalPrice: 1200,
        currency: 'ILS',
        rating: 4.2,
        reviewsCount: 38,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop&crop=center',
        badge: 'سعر اقتصادي',
        inStock: true,
        availability: 'متوفر',
        description: 'هاتف اقتصادي بمواصفات جيدة ومناسب للاستخدام اليومي',
        specifications: {
          storage: '256GB',
          ram: '8GB',
          screen: '6.78 inch',
          camera: '108MP + 2MP + 2MP',
          battery: '5000mAh'
        },
        features: [
          'كاميرا رئيسية 108 ميجابكسل',
          'شاشة كبيرة 6.78 بوصة',
          'بطارية ضخمة 5000mAh',
          'ذاكرة تخزين كبيرة',
          'تصميم عصري'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 54,
        salesCount: 8
      }
    ];

    // Sample accessories
    const sampleAccessories = [
      {
        id: 'product:airpods-pro',
        name: 'AirPods Pro (الجيل الثاني)',
        brand: 'Apple',
        category: 'accessory',
        subcategory: 'headphones',
        price: 899,
        originalPrice: 999,
        currency: 'ILS',
        rating: 4.9,
        reviewsCount: 234,
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop&crop=center',
        badge: 'الأكثر طلباً',
        inStock: true,
        availability: 'متوفر',
        description: 'سماعات Apple اللاسلكية الأفضل على الإطلاق',
        features: [
          'إلغاء الضوضاء النشط',
          'جودة صوت استثنائية',
          'مقاوم للماء والعرق',
          'شحن لاسلكي',
          'تحكم باللمس'
        ],
        warranty: 'سنة واحدة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 189,
        salesCount: 67
      },
      {
        id: 'product:samsung-charger',
        name: 'شاحن Samsung 25W سريع',
        brand: 'Samsung',
        category: 'accessory',
        subcategory: 'charger',
        price: 89,
        originalPrice: 120,
        currency: 'ILS',
        rating: 4.6,
        reviewsCount: 145,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center',
        badge: 'ضروري',
        inStock: true,
        availability: 'متوفر',
        description: 'شاحن سريع أصلي من Samsung بقوة 25 واط',
        features: [
          'شحن سريع 25W',
          'متوافق مع جميع هواتف Samsung',
          'حماية من الشحن الزائد',
          'تصميم مضغوط',
          'كابل USB-C مضمن'
        ],
        warranty: '6 أشهر',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 156,
        salesCount: 89
      }
    ];

    // Combine all products
    const allProducts = [...sampleProducts, ...sampleAccessories];

    // Store all products
    for (const product of allProducts) {
      await kv.set(product.id, product);
    }

    res.json({
      message: 'Sample data initialized successfully',
      productsCreated: allProducts.length,
      categories: [...new Set(allProducts.map(p => p.category))],
      brands: [...new Set(allProducts.map(p => p.brand))]
    });
  } catch (error) {
    console.error('Init data error:', error);
    res.status(500).json({
      error: 'Failed to initialize sample data',
      code: 'INIT_DATA_ERROR'
    });
  }
});

/**
 * DELETE /clear-data
 * Clear all sample data (admin only)
 */
router.delete('/clear-data', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'DELETE_ALL_DATA') {
      return res.status(400).json({
        error: 'Confirmation required. Send { "confirm": "DELETE_ALL_DATA" }',
        code: 'CONFIRMATION_REQUIRED'
      });
    }

    // Get counts before deletion
    const products = await kv.getByPrefix('product:');
    const orders = await kv.getByPrefix('order:');
    const reviews = await kv.getByPrefix('review:');
    
    // Clear all data
    await kv.clearByPrefix('product:');
    await kv.clearByPrefix('order:');
    await kv.clearByPrefix('review:');
    await kv.clearByPrefix('trade-in:');
    await kv.clearByPrefix('repair:');
    await kv.clearByPrefix('partner-app:');

    res.json({
      message: 'All data cleared successfully',
      cleared: {
        products: products.length,
        orders: orders.length,
        reviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({
      error: 'Failed to clear data',
      code: 'CLEAR_DATA_ERROR'
    });
  }
});

/**
 * GET /stats
 * Get database statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      products: await kv.countByPrefix('product:'),
      orders: await kv.countByPrefix('order:'),
      reviews: await kv.countByPrefix('review:'),
      tradeIns: await kv.countByPrefix('trade-in:'),
      repairs: await kv.countByPrefix('repair:'),
      partnerApplications: await kv.countByPrefix('partner-app:'),
      users: await kv.countByPrefix('user:')
    };

    res.json({
      message: 'Database statistics',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      code: 'GET_STATS_ERROR'
    });
  }
});

export default router;