export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl = 'https://procell.app';
  private entries: SitemapEntry[] = [];

  constructor() {
    this.generateStaticPages();
    this.generateProductPages();
    this.generateCategoryPages();
  }

  private generateStaticPages() {
    const staticPages = [
      {
        url: '',
        changefreq: 'daily' as const,
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'offers',
        changefreq: 'hourly' as const,
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'partners',
        changefreq: 'weekly' as const,
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'maintenance',
        changefreq: 'monthly' as const,
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'trade-in',
        changefreq: 'weekly' as const,
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'purchase',
        changefreq: 'weekly' as const,
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'about',
        changefreq: 'monthly' as const,
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'contact',
        changefreq: 'monthly' as const,
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'faq',
        changefreq: 'weekly' as const,
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'terms',
        changefreq: 'yearly' as const,
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'privacy',
        changefreq: 'yearly' as const,
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        url: 'refund',
        changefreq: 'yearly' as const,
        priority: 0.4,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    staticPages.forEach(page => {
      this.entries.push({
        url: `${this.baseUrl}/${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: page.lastmod
      });
    });
  }

  private generateProductPages() {
    // Sample products - في التطبيق الحقيقي، ستجلب هذه من قاعدة البيانات
    const products = [
      {
        id: 'iphone-15-pro-max-256gb',
        name: 'iPhone 15 Pro Max 256GB',
        category: 'iphone',
        lastmod: '2024-01-15',
        priority: 0.9
      },
      {
        id: 'samsung-galaxy-s24-ultra',
        name: 'Samsung Galaxy S24 Ultra',
        category: 'samsung',
        lastmod: '2024-01-14',
        priority: 0.9
      },
      {
        id: 'xiaomi-redmi-note-13',
        name: 'Xiaomi Redmi Note 13',
        category: 'xiaomi',
        lastmod: '2024-01-13',
        priority: 0.8
      },
      {
        id: 'oppo-reno-11',
        name: 'OPPO Reno 11',
        category: 'oppo',
        lastmod: '2024-01-12',
        priority: 0.8
      },
      {
        id: 'realme-gt-5',
        name: 'Realme GT 5',
        category: 'realme',
        lastmod: '2024-01-11',
        priority: 0.8
      },
      {
        id: 'tecno-spark-20',
        name: 'TECNO Spark 20',
        category: 'tecno',
        lastmod: '2024-01-10',
        priority: 0.7
      },
      {
        id: 'infinix-hot-40',
        name: 'Infinix Hot 40',
        category: 'infinix',
        lastmod: '2024-01-09',
        priority: 0.7
      },
      {
        id: 'honor-x9b',
        name: 'Honor X9b',
        category: 'honor',
        lastmod: '2024-01-08',
        priority: 0.7
      },
      {
        id: 'airpods-pro-2nd-gen',
        name: 'AirPods Pro الجيل الثاني',
        category: 'accessories',
        lastmod: '2024-01-07',
        priority: 0.8
      },
      {
        id: 'apple-watch-series-9',
        name: 'Apple Watch Series 9',
        category: 'accessories',
        lastmod: '2024-01-06',
        priority: 0.8
      }
    ];

    products.forEach(product => {
      this.entries.push({
        url: `${this.baseUrl}/product/${product.id}`,
        changefreq: 'weekly',
        priority: product.priority,
        lastmod: product.lastmod
      });
    });
  }

  private generateCategoryPages() {
    const categories = [
      {
        slug: 'iphone',
        name: 'iPhone',
        priority: 0.9,
        changefreq: 'daily' as const
      },
      {
        slug: 'samsung',
        name: 'Samsung',
        priority: 0.9,
        changefreq: 'daily' as const
      },
      {
        slug: 'xiaomi',
        name: 'Xiaomi',
        priority: 0.8,
        changefreq: 'daily' as const
      },
      {
        slug: 'oppo',
        name: 'OPPO',
        priority: 0.8,
        changefreq: 'weekly' as const
      },
      {
        slug: 'realme',
        name: 'Realme',
        priority: 0.8,
        changefreq: 'weekly' as const
      },
      {
        slug: 'tecno',
        name: 'TECNO',
        priority: 0.7,
        changefreq: 'weekly' as const
      },
      {
        slug: 'infinix',
        name: 'Infinix',
        priority: 0.7,
        changefreq: 'weekly' as const
      },
      {
        slug: 'honor',
        name: 'Honor',
        priority: 0.7,
        changefreq: 'weekly' as const
      },
      {
        slug: 'accessories',
        name: 'الإكسسوارات',
        priority: 0.8,
        changefreq: 'daily' as const
      }
    ];

    categories.forEach(category => {
      this.entries.push({
        url: `${this.baseUrl}/category/${category.slug}`,
        changefreq: category.changefreq,
        priority: category.priority,
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
  }

  public generateXML(): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    this.entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${entry.url}</loc>\n`;
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      if (entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      if (entry.priority) {
        xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
      }
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  public generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block AI crawlers that don't respect robots.txt
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml

# Important pages
Allow: /offers
Allow: /partners
Allow: /products
Allow: /category/
Allow: /product/

# Block admin or sensitive areas (if any)
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*utm_*
Disallow: /*?*fbclid*
Disallow: /*?*gclid*

# Allow social media crawlers
User-agent: facebookexternalhit/1.1
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Cache directives
Cache-delay: 86400
`;
  }

  public downloadSitemap() {
    const xml = this.generateXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public downloadRobotsTxt() {
    const robots = this.generateRobotsTxt();
    const blob = new Blob([robots], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public getEntries(): SitemapEntry[] {
    return this.entries;
  }

  public getEntriesCount(): number {
    return this.entries.length;
  }
}

// إنشاء مثيل مُصدَّر للاستخدام العام
export const sitemapGenerator = new SitemapGenerator();