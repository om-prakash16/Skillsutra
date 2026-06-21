import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { RenderEngine } from "@/app/superadmin/cms/builder/core/public-engine";

interface PageProps {
  params: {
    slug?: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Fetch the routing resolution from the FastAPI backend
async function resolveRoute(slugArray?: string[]) {
  const path = slugArray ? `/${slugArray.join("/")}` : "/";
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/delivery/resolve?path=${encodeURIComponent(path)}`, {
      cache: "no-store", // In production, change to 'force-cache' with ISR or Next.js tags
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch route. Status: ${res.status}`);
    }
    
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Delivery Engine Error:", error);
    return null;
  }
}

// Dynamically generate SEO metadata for Next.js
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await resolveRoute(params.slug);
  
  if (!data || data.action !== "render") {
    return { title: "Not Found" };
  }
  
  const seo = data.seo || {};
  
  return {
    title: seo.title || "Skillsutra",
    description: seo.description,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.og_title || seo.title,
      description: seo.description,
      images: seo.og_image ? [{ url: seo.og_image }] : [],
    }
  };
}

export default async function CatchAllPage({ params, searchParams }: PageProps) {
  const data = await resolveRoute(params.slug);
  
  if (!data) {
    notFound();
  }
  
  if (data.action === "redirect") {
    // Perform standard HTTP redirect
    redirect(data.destination);
  }
  
  if (data.action === "render") {
    const tree = data.component_tree;
    
    if (!tree) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-sm rounded-xl border border-gray-100 max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blank Template</h1>
            <p className="text-gray-500">This route exists, but has no layout assigned to it.</p>
          </div>
        </div>
      );
    }
    
    // Pass the JSON tree to the Visual Engine for rendering
    return <RenderEngine blocks={tree} />;
  }
  
  notFound();
}
