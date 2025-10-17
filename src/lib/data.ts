// ===================================
// STATIC DATA - SEPARATED FOR PERFORMANCE
// ===================================

export const HERO_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max - 256GB',
    price: 3999,
    originalPrice: 4499,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=300&h=300&fit=crop&crop=center',
    badge: 'الأكثر مبيعاً',
    badgeColor: 'bg-blue-600',
    rating: 4.9,
    reviewsCount: 127,
    stockCount: 8
  },
  {
    id: 2,
    name: 'AirPods Pro - الجيل الثاني',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop&crop=center',
    badge: 'عرض خاص',
    badgeColor: 'bg-red-600',
    rating: 4.9,
    reviewsCount: 203,
    stockCount: 15
  },
  {
    id: 3,
    name: 'Apple Watch Series 9 - 45mm',
    price: 1699,
    originalPrice: 1899,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop&crop=center',
    badge: 'جديد',
    badgeColor: 'bg-green-600',
    rating: 4.8,
    reviewsCount: 156,
    stockCount: 12
  },
  {
    id: 4,
    name: 'شاحن لاسلكي سريع 20 واط',
    price: 299,
    originalPrice: 349,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1609792858446-86356ae75eb5?w=300&h=300&fit=crop&crop=center',
    badge: 'جديد',
    badgeColor: 'bg-purple-600',
    rating: 4.7,
    reviewsCount: 89,
    stockCount: 25
  }
];

export const LIGHTNING_DEALS = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    description: 'وفر 20% على آخر قطعة متوفرة',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    stock: 1,
    image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'خصم 15% على عدد محدود',
    price: 3599,
    originalPrice: 4299,
    discount: 15,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'iPhone 14 Pro',
    description: 'عرض خاص لفترة محدودة',
    price: 2999,
    originalPrice: 3499,
    discount: 14,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center'
  }
];

export const ACCESSORY_BUNDLES = [
  {
    id: 1,
    name: 'الباقة الأساسية',
    items: ['شاحن سريع', 'غطاء حماية', 'سماعات'],
    price: 299,
    originalPrice: 450,
    savings: 151,
    popular: false
  },
  {
    id: 2,
    name: 'الباقة المتكاملة',
    items: ['شاحن لاسلكي', 'غطاء حماية', 'سماعات', 'حامل سيارة'],
    price: 499,
    originalPrice: 699,
    savings: 200,
    popular: true
  },
  {
    id: 3,
    name: 'الباقة المميزة',
    items: ['شاحن لاسلكي سريع', 'غطاء حماية', 'سماعات بلوتوث', 'حامل', 'شاشة حماية'],
    price: 799,
    originalPrice: 1099,
    savings: 300,
    popular: false
  }
];

export const FEATURES = [
  {
    icon: 'Truck',
    title: 'توصيل سريع',
    description: 'توصيل خلال 24 ساعة لجميع أنحاء فلسطين',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: 'Shield',
    title: 'ضمان لمدة سنة',
    description: 'ضمان شامل على جميع المنتجات',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: 'Package',
    title: 'إرجاع مجاني',
    description: 'إرجاع مجاني ضمن سياسة الإرجاع الخاصة بنا',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: 'Phone',
    title: 'دعم فني مختص',
    description: 'الدعم الفني متاح للعملاء بعد الشراء',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

export const PARTNERSHIP_STATS = [
  {
    icon: 'Users',
    number: '500+',
    label: 'شراكة نشطة',
    color: 'text-green-400'
  },
  {
    icon: 'Percent',
    number: '15%',
    label: 'عمولة قصوى',
    color: 'text-yellow-400'
  },
  {
    icon: 'TrendingUp',
    number: '2,500+',
    label: 'متوسط الربح',
    color: 'text-green-400'
  },
  {
    icon: 'Headphones',
    number: '24/7',
    label: 'دعم مستمر',
    color: 'text-blue-400'
  }
];

export const DETAILED_PRODUCT = {
  id: 1,
  name: 'iPhone 15 Pro Max - 256GB',
  brand: 'Apple',
  model: 'A3108',
  price: 3999,
  originalPrice: 4499,
  discount: 11,
  rating: 4.9,
  reviewsCount: 127,
  stockCount: 8,
  availability: 'متوفر',
  sku: 'IPH15PM256',
  warranty: 'سنة كاملة',
  condition: 'جديد',
  colors: [
    { name: 'تيتانيوم طبيعي', value: '#8D8D93', available: true },
    { name: 'تيتانيوم أبيض', value: '#F2F2F7', available: true },
    { name: 'تيتانيوم أسود', value: '#1D1D1F', available: false },
    { name: 'تيتانيوم أزرق', value: '#395B64', available: true }
  ],
  storage: [
    { size: '256GB', price: 3999, available: true },
    { size: '512GB', price: 4499, available: true },
    { size: '1TB', price: 4999, available: false }
  ],
  images: [
    'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop&crop=center'
  ],
  description: 'iPhone 15 Pro Max الجديد بشريحة A17 Pro القوية يقدم أداءً استثنائياً وكاميرا متطورة. مصنوع من التيتانيوم خفيف الوزن وقوي التحمل مع تصميم أنيق ومميز.',
  keyFeatures: [
    'شريحة A17 Pro بتقنية 3 نانومتر',
    'كاميرا ثلاثية 48 ميجابكسل',
    'شاشة Super Retina XDR مقاس 6.7 بوصة',
    'بطارية تدوم طوال اليوم',
    'مقاوم للماء IP68',
    'منفذ USB-C',
    'شريحة 5G فائقة السرعة'
  ],
  specifications: {
    'الشاشة': '6.7 بوصة Super Retina XDR OLED',
    'المعالج': 'Apple A17 Pro (3nm)',
    'الذاكرة': '8GB RAM',
    'التخزين': '256GB/512GB/1TB',
    'الكاميرا الخلفية': '48MP ثلاثية + LiDAR',
    'الكاميرا الأمامية': '12MP TrueDepth',
    'البطارية': '4441 mAh',
    'الشحن': '27W سلكي، 15W لاسلكي',
    'المقاومة': 'IP68',
    'الوزن': '221 جرام',
    'النظام': 'iOS 17',
    'الشبكة': '5G, 4G LTE'
  },
  whatsIncluded: [
    'iPhone 15 Pro Max',
    'كابل USB-C للشحن',
    'دليل الاستخدام',
    'أداة إخراج SIM',
    'ملصق Apple'
  ],
  tags: ['الأكثر مبيعاً', 'جديد', 'مميز', '5G'],
  category: 'هواتف ذكية',
  subcategory: 'iPhone'
};

export const SAMPLE_REVIEWS = [
  {
    id: 1,
    productId: 1,
    rating: 5,
    customerName: 'أحمد محمد',
    customerType: 'عميل موثق',
    date: '2024-01-15',
    comment: 'منتج ممتاز! الجودة عالية جداً والأداء سريع. خدمة التوصيل كانت في الوقت المحدد والتعامل راقي.',
    verified: true,
    helpfulCount: 12,
    images: ['https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=100&h=100&fit=crop']
  },
  {
    id: 2,
    productId: 1,
    rating: 4,
    customerName: 'فاطمة العلي',
    customerType: 'عميل موثق',
    date: '2024-01-12',
    comment: 'جهاز رائع بمواصفات ممتازة. الكاميرا جودتها عالية والبطارية تدوم طويل. أنصح بالشراء.',
    verified: true,
    helpfulCount: 8,
    images: []
  },
  {
    id: 3,
    productId: 1,
    rating: 5,
    customerName: 'محمد خالد',
    customerType: 'عميل موثق',
    date: '2024-01-10',
    comment: 'أفضل استثمار! السعر ممتاز مقارنة بالمحلات التانية وخدمة العملاء محترمة. شكراً ProCell 👍',
    verified: true,
    helpfulCount: 15,
    images: []
  },
  {
    id: 4,
    productId: 1,
    rating: 4,
    customerName: 'سارة أحمد',
    customerType: 'عميل موثق',
    date: '2024-01-08',
    comment: 'جهاز حديث ومتطور. التطبيقات تشتغل بسلاسة والتصميم أنيق. التوصيل كان سريع.',
    verified: true,
    helpfulCount: 6,
    images: []
  },
  {
    id: 5,
    productId: 1,
    rating: 5,
    customerName: 'عمر يوسف',
    customerType: 'عميل موثق',
    date: '2024-01-05',
    comment: 'ما شاء الله! الجهاز يستاهل كل قرش. الشاشة واضحة والألوان زاهية. خدمة ما بعد البيع ممتازة.',
    verified: true,
    helpfulCount: 10,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop']
  }
];