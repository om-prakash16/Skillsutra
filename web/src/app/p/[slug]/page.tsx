import { notFound } from "next/navigation";
import { PublicRenderer } from "@/components/builder/PublicRenderer";
import type { Metadata } from 'next';

async function getPageBySlug(slug: string) {
  try {
    // We fetch from the local API route or direct backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/v1/builder/pages/slug/${slug}`, {
      next: { revalidate: 60 } // Next.js ISR: Re-fetch every 60 seconds
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  
  if (!page) {
    return { title: 'Page Not Found' };
  }

  return {
    title: page.meta_title || page.name,
    description: page.meta_description || "",
    openGraph: {
      images: page.og_image ? [page.og_image] : [],
    },
  };
}

export default async function PublicSlugPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  
  if (!page) {
    notFound();
  }

  const { elements, rootElements } = page.component_tree || {};

  return (
    <main className="public-render-wrapper">
      <PublicRenderer elements={elements} rootElements={rootElements} />
    </main>
  );
}
