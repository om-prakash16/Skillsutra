"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Flag, Plus, FileEdit, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { api } from "@/lib/api/api-client";

export default function AdminCMSDashboard() {
  const [pages, setPages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const pagesRes = await api.get('/cms/pages');
        const articlesRes = await api.get('/cms/articles');
        const bannersRes = await api.get('/cms/banners');
        setPages(pagesRes || []);
        setArticles(articlesRes || []);
        setBanners(bannersRes || []);
      } catch (err) {
        console.error("Failed to fetch CMS data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const cmsSections = [
    {
      title: "Pages & Blocks",
      description: "Manage landing pages, reusable blocks, and sections.",
      icon: LayoutDashboard,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      href: "/admin/cms/pages",
      items: pages.length ? pages.map(p => ({ name: p.content_key, status: p.is_active ? 'Published' : 'Draft', updated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "Recently" })) : [
        { name: "Home Page", status: "Published", updated: "2 hrs ago" },
        { name: "Talent Discovery", status: "Draft", updated: "1 day ago" },
      ]
    },
    {
      title: "Blog & Editorial",
      description: "Manage articles, authors, and SEO settings.",
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/cms/blog",
      items: articles.length ? articles.map(a => ({ name: a.title, status: a.is_published ? 'Published' : 'Draft', updated: a.updated_at ? new Date(a.updated_at).toLocaleDateString() : "Recently" })) : [
        { name: "10 Tips for React Devs", status: "Published", updated: "5 hrs ago" },
      ]
    },
    {
      title: "Banners & Announcements",
      description: "Control global alerts and promotional banners.",
      icon: Flag,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      href: "/admin/cms/banners",
      items: banners.length ? banners.map(b => ({ name: b.content_key, status: b.is_active ? 'Active' : 'Draft', updated: b.updated_at ? new Date(b.updated_at).toLocaleDateString() : "Recently" })) : [
        { name: "Summer Hackathon Promo", status: "Active", updated: "1 hr ago" },
      ]
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <Badge variant="outline" className="glass text-[10px] tracking-widest uppercase font-black mb-2 text-indigo-400 border-indigo-400/30">
            Content Orchestrator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-foreground">
            CMS Command Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Manage dynamic frontend content, reusable page blocks, and editorial articles.
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg" className="rounded-xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <Plus className="w-5 h-5 mr-2" /> Create Content
          </Button>
        </div>
      </div>

      {/* CMS Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cmsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass h-full border-border/50 hover:border-border transition-all duration-300 rounded-[2rem] shadow-xl overflow-hidden group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-2xl ${section.bg}`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <CardTitle className="text-xl font-black">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mt-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/30 hover:border-border/80 transition-colors group/item">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground/90">{item.name}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                          {item.updated}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`text-[9px] uppercase tracking-widest font-black ${
                          item.status === 'Published' || item.status === 'Active' ? 'text-emerald-400 border-emerald-400/30' :
                          item.status === 'Draft' || item.status === 'Scheduled' ? 'text-amber-400 border-amber-400/30' :
                          'text-indigo-400 border-indigo-400/30'
                        }`}>
                          {item.status}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><FileEdit className="w-3.5 h-3.5 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-rose-500/70" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {section.items.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground italic">No content found</div>
                  )}
                </div>
                <Link href={section.href}>
                  <Button variant="outline" className="w-full mt-6 rounded-xl border-dashed border-border/50 text-muted-foreground hover:text-foreground">
                    View All {section.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
