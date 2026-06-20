import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    // In a production implementation, this would hit `/api/v1/delivery/sitemap`
    // which queries the `Route` and `SitemapConfig` tables to return all active public paths.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/delivery/sitemap`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data.map((route: any) => ({
          url: `${baseUrl}${route.path}`,
          lastModified: new Date(route.updated_at || new Date()),
          changeFrequency: 'daily',
          priority: route.path === '/' ? 1 : 0.8,
        }));
      }
    }
    
    // Fallback if API fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  } catch (error) {
    console.error("Failed to generate sitemap", error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      }
    ];
  }
}
