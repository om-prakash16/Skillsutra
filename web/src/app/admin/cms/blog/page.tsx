"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CMSBlogManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    id: "", title: "", slug: "", excerpt: "", content: "", category: "General", is_published: false 
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cms/articles');
      setArticles(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        is_published: item.is_published
      });
    } else {
      setFormData({ id: "", title: "", slug: "", excerpt: "", content: "", category: "General", is_published: false });
    }
    setIsModalOpen(true);
  };

  const saveArticle = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        is_published: formData.is_published
      };
      
      if (formData.id) {
        await api.put(`/cms/articles/${formData.id}`, payload);
      } else {
        await api.post('/cms/articles', payload);
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (err) {
      console.error(err);
      alert("Failed to save article.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/cms/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin/cms" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Link>
          <h1 className="text-3xl font-black font-heading tracking-tight text-foreground">
            Blog & Editorial Manager
          </h1>
          <p className="text-muted-foreground mt-1">Manage articles, thought leadership, and SEO content.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4 mr-2" /> Write Article
        </Button>
      </div>

      <Card className="glass border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading articles...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No articles found.
                  </td>
                </tr>
              ) : (
                articles.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground/90">{item.title}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4">{item.author_name || "Admin"}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={item.is_published ? 'text-emerald-400 border-emerald-400/30 bg-emerald-500/5' : 'text-amber-400 border-amber-400/30 bg-amber-500/5'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => openModal(item)} className="h-8 rounded-lg hover:bg-muted">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteArticle(item.id)} className="h-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500">
                          <Trash2 className="w-4 h-4 text-rose-500/70" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] glass border-border/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{formData.id ? "Edit Article" : "Write Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
            <div className="space-y-2">
              <Label>Article Title</Label>
              <Input value={formData.title} onChange={(e) => {
                const title = e.target.value;
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                setFormData({...formData, title, slug: formData.id ? formData.slug : slug});
              }} placeholder="Enter an engaging title..." className="rounded-xl bg-background/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="my-article-slug" className="rounded-xl bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Engineering, AI" className="rounded-xl bg-background/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt (Short Description)</Label>
              <Textarea value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} rows={2} placeholder="A short summary for the blog card..." className="rounded-xl bg-background/50 resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Main Content (Markdown/HTML)</Label>
              <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} placeholder="# Heading\n\nStart writing..." className="rounded-xl bg-background/50 font-mono text-xs" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="published-check" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="rounded border-border bg-background" />
              <Label htmlFor="published-check" className="cursor-pointer">Publish Immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={saveArticle} disabled={submitting} className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
