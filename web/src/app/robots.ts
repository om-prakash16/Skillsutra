import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    // In a production implementation, this hits `/api/v1/delivery/robots`
    // which queries the `RobotsRule` table to return the dynamically configured robots txt.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/delivery/robots`, {
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return {
          rules: json.data.rules || {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'],
          },
          sitemap: `${baseUrl}/sitemap.xml`,
        };
      }
    }
    
    // Fallback
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  } catch (error) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
}
