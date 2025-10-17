import { useEffect } from 'react';
import type { PageType } from '../App';

interface SEOProps {
  page: PageType;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  productId?: string;
  category?: string;
  brand?: string;
}

export function SEOHead({
  page,
  title,
  description,
  keywords,
  image,
  price,
  originalPrice,
  rating = 4.9,
  reviewCount = 127,
  availability = 'InStock',
  productId,
  category,
  brand
}: SEOProps) {
  
  const baseUrl = 'https://procell.app';
  const currentUrl = `${baseUrl}/${page === 'home' ? '' : page}`;
  
  // Page-specific SEO data
  const seoData = {
    home: {
      title: 'procell - أفضل العروض على الهواتف الذكية والإكسسوارات في فلسطين | جودة عالية وأسعار تنافسية',
      description: 'procell - متجرك الموثوق للهواتف الذكية والإكسسوارات في فلسطين. أفضل الأسعار، توصيل سريع، ضمان شامل، وخدمة عملاء ممتازة. iPhone, Samsung, Xiaomi وأكثر.',
      keywords: 'هواتف ذكية فلسطين, آيفون فلسطين, سامسونج فلسطين, شاومي فلسطين, إكسسوارات هواتف, توصيل سريع فلسطين, procell, smartphones Palestine, iPhone Palestine, Samsung Palestine',
      image: `${baseUrl}/og-home.jpg`
    },
    offers: {
      title: 'أفضل العروض والتخفيضات على الهواتف الذكية - procell',
      description: 'اكتشف أحدث العروض والتخفيضات على الهواتف الذكية والإكسسوارات. خصومات تصل إلى 30% على أفضل الماركات العالمية في فلسطين.',
      keywords: 'عروض هواتف فلسطين, تخفيضات آيفون, عروض سامسونج, خصومات هواتف ذكية, عروض ProCell',
      image: `${baseUrl}/og-offers.jpg`
    },
    partners: {
      title: 'برنامج شراكة النجاح - اربح حتى 15% عمولة مع procell',
      description: 'انضم لبرنامج شراكة النجاح مع ProCell واربح عمولة تصل إلى 15% من كل عملية بيع. دعم مستمر، أدوات تسويقية متقدمة، ومتابعة شخصية.',
      keywords: 'شراكة النجاح فلسطين, التسويق بالعمولة, ربح من الإنترنت فلسطين, عمولة 15%, شريك ProCell',
      image: `${baseUrl}/og-partners.jpg`
    },
    product: {
      title: title || 'تفاصيل المنتج - procell',
      description: description || 'تسوق أفضل الهواتف الذكية والإكسسوارات بأفضل الأسعار في فلسطين',
      keywords: keywords || 'هواتف ذكية, إكسسوارات, procell',
      image: image || `${baseUrl}/og-product.jpg`
    },
    maintenance: {
      title: 'خدمات الصيانة المتخصصة للهواتف الذكية - procell',
      description: 'خدمات صيانة احترافية للهواتف الذكية في فلسطين. فريق متخصص، قطع غيار أصلية، ضمان على الصيانة، وخدمة سريعة وموثوقة.',
      keywords: 'صيانة هواتف فلسطين, إصلاح آيفون, صيانة سامسونج, قطع غيار أصلية, خدمة صيانة ProCell',
      image: `${baseUrl}/og-maintenance.jpg`
    },
    'trade-in': {
      title: 'استبدال الهاتف القديم بآخر جديد - procell',
      description: 'استبدل هاتفك القديم بآخر جديد وتمتع بأفضل الأسعار. تقييم فوري، عملية سهلة وسريعة، وضمان على الجهاز الجديد.',
      keywords: 'استبدال هاتف فلسطين, بيع هاتف مستعمل, تقييم هاتف, ترقية هاتف, ProCell استبدال',
      image: `${baseUrl}/og-tradein.jpg`
    },
    purchase: {
      title: 'خدمة الشراء المتخصصة - نشتري هاتفك بأفضل سعر - procell',
      description: 'نشتري هاتفك المستعمل بأفضل سعر في السوق. تقييم عادل، دفع فوري، وعملية شراء آمنة وموثوقة مع ضمان الرضا.',
      keywords: 'بيع هاتف مستعمل فلسطين, شراء هواتف مستعملة, أفضل سعر هاتف, تقييم فوري, ProCell شراء',
      image: `${baseUrl}/og-purchase.jpg`
    },
    about: {
      title: 'من نحن - قصة procell وشركاؤنا الموثوقون',
      description: 'تعرف على procell وشركائنا الموثوقين: SOLOTECH, SUPERLINK, ICELLPEX, CELLAVENUE. رحلتنا في تقديم أفضل الهواتف الذكية والخدمات في فلسطين.',
      keywords: 'procell, SOLOTECH, SUPERLINK, ICELLPEX, CELLAVENUE, من نحن, تاريخ الشركة',
      image: `${baseUrl}/og-about.jpg`
    },
    contact: {
      title: 'التواصل معنا - خدمة عملاء متميزة - procell',
      description: 'تواصل مع فريق خدمة العملاء المتخصص في procell. دعم فني، استشارات مجانية، وخدمة عملاء على مدار الساعة لضمان رضاكم.',
      keywords: 'خدمة عملاء فلسطين, دعم فني هواتف, استشارة مجانية, تواصل ProCell, خدمة 24/7',
      image: `${baseUrl}/og-contact.jpg`
    },
    faq: {
      title: 'الأسئلة الشائعة - مركز المساعدة - procell',
      description: 'إجابات شاملة على أكثر الأسئلة شيوعاً حول منتجاتنا، خدماتنا، الضمان، الشحن، وسياسات الإرجاع في procell.',
      keywords: 'أسئلة شائعة فلسطين, مساعدة ProCell, دليل المستخدم, سياسات الضمان, الشحن والتوصيل',
      image: `${baseUrl}/og-faq.jpg`
    },
    terms: {
      title: 'شروط الخدمة - القوانين والأنظمة - procell',
      description: 'اطلع على شروط وأحكام الخدمة في procell. حقوقك وواجباتك، سياسات الاستخدام، وضمانات الخدمة.',
      keywords: 'شروط الخدمة, أحكام الاستخدام, قوانين ProCell, حقوق العملاء فلسطين',
      image: `${baseUrl}/og-terms.jpg`
    },
    privacy: {
      title: 'سياسة الخصوصية - حماية بياناتك - procell',
      description: 'تعرف على كيفية حماية procell لخصوصيتك وبياناتك الشخصية. أمان متقدم وشفافية كاملة في التعامل مع معلوماتك.',
      keywords: 'سياسة الخصوصية, حماية البيانات, أمان المعلومات, خصوصية العملاء فلسطين',
      image: `${baseUrl}/og-privacy.jpg`
    },
    refund: {
      title: 'سياسة الإرجاع والاستبدال - ضمان رضاكم - procell',
      description: 'سياسة إرجاع مرنة وعادلة مع procell. شروط الإرجاع، مدة الضمان، وعملية الاستبدال السهلة لضمان رضا عملائنا.',
      keywords: 'سياسة الإرجاع, استبدال المنتجات, ضمان الرضا, إرجاع مجاني فلسطين, ProCell ضمان',
      image: `${baseUrl}/og-refund.jpg`
    }
  };

  const currentSEO = seoData[page] || seoData.home;
  const finalTitle = title || currentSEO.title;
  const finalDescription = description || currentSEO.description;
  const finalKeywords = keywords || currentSEO.keywords;
  const finalImage = image || currentSEO.image;

  useEffect(() => {
    // Set document title
    document.title = finalTitle;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Basic meta tags
    const metaTags = [
      { name: 'description', content: finalDescription },
      { name: 'keywords', content: finalKeywords },
      { name: 'author', content: 'procell' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'language', content: 'ar' },
      { name: 'geo.region', content: 'PS' },
      { name: 'geo.country', content: 'Palestine' },
      { name: 'geo.placename', content: 'West Bank, Palestine' },
      
      // Mobile optimization
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'theme-color', content: '#0f172a' },
      { name: 'msapplication-TileColor', content: '#0f172a' },
      
      // Open Graph
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: finalDescription },
      { property: 'og:image', content: finalImage },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: page === 'product' ? 'product' : 'website' },
      { property: 'og:site_name', content: 'procell' },
      { property: 'og:locale', content: 'ar_PS' },
      { property: 'og:locale:alternate', content: 'en_US' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: finalDescription },
      { name: 'twitter:image', content: finalImage },
      { name: 'twitter:site', content: '@procellpalestine' },
      { name: 'twitter:creator', content: '@procellpalestine' },
      
      // Additional SEO
      { name: 'application-name', content: 'procell' },
      { name: 'msapplication-tooltip', content: 'أفضل متجر هواتف ذكية في فلسطين' },
      { name: 'format-detection', content: 'telephone=yes' },
      
      // Canonical URL
      { rel: 'canonical', href: currentUrl }
    ];

    // Add meta tags to head
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.entries(tag).forEach(([key, value]) => {
        if (key === 'rel' && tag.rel === 'canonical') {
          const link = document.createElement('link');
          link.rel = 'canonical';
          link.href = value as string;
          link.setAttribute('data-seo', 'true');
          document.head.appendChild(link);
          return;
        }
        meta.setAttribute(key, value as string);
      });
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Add structured data for products
    if (page === 'product' && price && productId) {
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title || "منتج procell",
        "description": description || "منتج عالي الجودة من procell",
        "image": image || finalImage,
        "brand": {
          "@type": "Brand",
          "name": brand || "procell"
        },
        "category": category || "Electronics > Mobile Phones",
        "sku": productId,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "ILS",
          "availability": `https://schema.org/${availability}`,
          "seller": {
            "@type": "Organization",
            "name": "procell",
            "url": baseUrl
          },
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "reviewCount": reviewCount,
          "bestRating": 5,
          "worstRating": 1
        }
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(productSchema);
      script.setAttribute('data-seo', 'true');
      document.head.appendChild(script);
    }

    // Add business structured data for home page
    if (page === 'home') {
      const businessSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "procell",
        "description": "أفضل متجر للهواتف الذكية والإكسسوارات في فلسطين",
        "url": baseUrl,
        "telephone": "+972-598-366-822",
        "email": "info@procell.app",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PS",
          "addressRegion": "West Bank",
          "addressLocality": "Palestine"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "31.9",
          "longitude": "35.2"
        },
        "openingHours": [
          "Mo-Sa 09:00-18:00",
          "Su 10:00-16:00"
        ],
        "priceRange": "₪₪",
        "currenciesAccepted": "ILS",
        "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": 4.9,
          "reviewCount": 500,
          "bestRating": 5
        },
        "sameAs": [
          "https://facebook.com/procellpalestine",
          "https://instagram.com/procellpalestine",
          "https://tiktok.com/@procellpalestine",
          "https://youtube.com/@procellpalestine"
        ]
      };

      const businessScript = document.createElement('script');
      businessScript.type = 'application/ld+json';
      businessScript.textContent = JSON.stringify(businessSchema);
      businessScript.setAttribute('data-seo', 'true');
      document.head.appendChild(businessScript);

      // Website schema
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "procell",
        "alternateName": "ProCell فلسطين",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/offers?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

      const websiteScript = document.createElement('script');
      websiteScript.type = 'application/ld+json';
      websiteScript.textContent = JSON.stringify(websiteSchema);
      websiteScript.setAttribute('data-seo', 'true');
      document.head.appendChild(websiteScript);
    }

    // Cleanup function
    return () => {
      const seoElements = document.querySelectorAll('[data-seo="true"]');
      seoElements.forEach(element => element.remove());
    };
  }, [page, finalTitle, finalDescription, finalKeywords, finalImage, currentUrl, price, originalPrice, rating, reviewCount, availability, productId, category, brand]);

  // This component doesn't render anything
  return null;
}