import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// User registration
app.post('/make-server-225dbdeb/auth/signup', async (c) => {
  try {
    const { email, password, name, userType } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType },
      email_confirm: true,  // Force email confirmation bypass
      phone_confirm: true   // Also bypass phone confirmation if needed
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Store additional user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      userType,
      createdAt: new Date().toISOString()
    })

    return c.json({ user: data.user })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// Get user profile
app.get('/make-server-225dbdeb/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = await kv.get(`user:${user.id}`)
    return c.json({ user: userData || user })
  } catch (error) {
    console.log('Profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Get products
app.get('/make-server-225dbdeb/products', async (c) => {
  try {
    const category = c.req.query('category')
    const brand = c.req.query('brand')
    
    let products = await kv.getByPrefix('product:')
    
    // Filter by category and brand if specified
    if (category) {
      products = products.filter(p => p.category === category)
    }
    if (brand) {
      products = products.filter(p => p.brand === brand)
    }

    return c.json({ products })
  } catch (error) {
    console.log('Get products error:', error)
    return c.json({ error: 'Failed to get products' }, 500)
  }
})

// Add product (admin only)
app.post('/make-server-225dbdeb/products', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = await kv.get(`user:${user.id}`)
    if (userData?.userType !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    const product = await c.req.json()
    const productId = `product:${Date.now()}`
    
    const productData = {
      ...product,
      id: productId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await kv.set(productId, productData)
    return c.json({ product: productData })
  } catch (error) {
    console.log('Add product error:', error)
    return c.json({ error: 'Failed to add product' }, 500)
  }
})

// Create order
app.post('/make-server-225dbdeb/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const orderData = await c.req.json()
    const orderId = `order:${Date.now()}`
    
    const order = {
      ...orderData,
      id: orderId,
      userId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await kv.set(orderId, order)
    return c.json({ order })
  } catch (error) {
    console.log('Create order error:', error)
    return c.json({ error: 'Failed to create order' }, 500)
  }
})

// Get user orders
app.get('/make-server-225dbdeb/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const allOrders = await kv.getByPrefix('order:')
    const userOrders = allOrders.filter(order => order.userId === user.id)
    
    return c.json({ orders: userOrders })
  } catch (error) {
    console.log('Get orders error:', error)
    return c.json({ error: 'Failed to get orders' }, 500)
  }
})

// Trade-in valuation
app.post('/make-server-225dbdeb/trade-in/valuate', async (c) => {
  try {
    const { brand, model, condition, storage, age } = await c.req.json()
    
    // Simple valuation algorithm (in production, this would be more sophisticated)
    let baseValue = 1000 // Base value in ILS
    
    // Brand multiplier
    const brandMultipliers = {
      'Apple': 1.5,
      'Samsung': 1.3,
      'Xiaomi': 1.0,
      'Realme': 0.8,
      'Oppo': 0.9,
      'Infinix': 0.7
    }
    
    baseValue *= brandMultipliers[brand] || 0.8
    
    // Condition multiplier
    const conditionMultipliers = {
      'excellent': 0.9,
      'good': 0.7,
      'fair': 0.5,
      'poor': 0.3
    }
    
    baseValue *= conditionMultipliers[condition] || 0.5
    
    // Storage multiplier
    if (storage >= 256) baseValue *= 1.2
    else if (storage >= 128) baseValue *= 1.1
    
    // Age depreciation
    const ageMultiplier = Math.max(0.2, 1 - (age * 0.15))
    baseValue *= ageMultiplier
    
    const estimatedValue = Math.round(baseValue)
    
    return c.json({ estimatedValue, currency: 'ILS' })
  } catch (error) {
    console.log('Trade-in valuation error:', error)
    return c.json({ error: 'Failed to calculate trade-in value' }, 500)
  }
})

// Submit trade-in request
app.post('/make-server-225dbdeb/trade-in/submit', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const tradeInData = await c.req.json()
    const tradeInId = `trade-in:${Date.now()}`
    
    const tradeIn = {
      ...tradeInData,
      id: tradeInId,
      userId: user.id,
      status: 'pending_evaluation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await kv.set(tradeInId, tradeIn)
    return c.json({ tradeIn })
  } catch (error) {
    console.log('Submit trade-in error:', error)
    return c.json({ error: 'Failed to submit trade-in request' }, 500)
  }
})

// Book repair service
app.post('/make-server-225dbdeb/repair/book', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const repairData = await c.req.json()
    const repairId = `repair:${Date.now()}`
    
    const repair = {
      ...repairData,
      id: repairId,
      userId: user.id,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await kv.set(repairId, repair)
    return c.json({ repair })
  } catch (error) {
    console.log('Book repair error:', error)
    return c.json({ error: 'Failed to book repair service' }, 500)
  }
})

// Submit partner application
app.post('/make-server-225dbdeb/partners/apply', async (c) => {
  try {
    const partnerData = await c.req.json()
    const applicationId = `partner-app:${Date.now()}`
    
    const application = {
      ...partnerData,
      id: applicationId,
      status: 'pending_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await kv.set(applicationId, application)
    
    // In production, you would send email/telegram notifications here
    console.log(`New partner application received: ${application.storeName} - ${application.ownerName}`)
    
    return c.json({ application: { id: applicationId, status: 'pending_review' } })
  } catch (error) {
    console.log('Partner application error:', error)
    return c.json({ error: 'Failed to submit partner application' }, 500)
  }
})

// Get partner applications (admin only)
app.get('/make-server-225dbdeb/partners/applications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401)
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userData = await kv.get(`user:${user.id}`)
    if (userData?.userType !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403)
    }

    const applications = await kv.getByPrefix('partner-app:')
    return c.json({ applications })
  } catch (error) {
    console.log('Get partner applications error:', error)
    return c.json({ error: 'Failed to get partner applications' }, 500)
  }
})

// Initialize some sample data
app.post('/make-server-225dbdeb/init-data', async (c) => {
  try {
    // Sample products
    const sampleProducts = [
      {
        id: 'product:iphone15pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'phone',
        price: 4500,
        originalPrice: 5000,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center',
        badge: 'الأكثر مبيعاً',
        inStock: true,
        description: 'أحدث هاتف من Apple مع تقنيات متطورة',
        storage: 256,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'product:galaxys24',
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        category: 'phone',
        price: 3200,
        originalPrice: 3800,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center',
        badge: 'عرض خاص',
        inStock: true,
        description: 'هاتف Samsung الرائد مع كاميرا متطورة',
        storage: 256,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'product:xiaomi14pro',
        name: 'Xiaomi 14 Pro',
        brand: 'Xiaomi',
        category: 'phone',
        price: 2100,
        originalPrice: 2500,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        badge: 'جديد',
        inStock: true,
        description: 'أداء قوي وسعر منافس من Xiaomi',
        storage: 128,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    for (const product of sampleProducts) {
      await kv.set(product.id, product)
    }

    return c.json({ message: 'Sample data initialized successfully' })
  } catch (error) {
    console.log('Init data error:', error)
    return c.json({ error: 'Failed to initialize data' }, 500)
  }
})

Deno.serve(app.fetch)