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

export default function CMSBannersManager() {
  const [contentList, setContentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", section_key: "banner", content_key: "", content_value: "", metadata: "", is_active: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cms/banners');
      setContentList(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setFormData({
        id: item.id,
        section_key: item.section_key,
        content_key: item.content_key,
        content_value: item.content_value,
        metadata: JSON.stringify(item.metadata || {}),
        is_active: item.is_active
      });
    } else {
      setFormData({ id: "", section_key: "banner", content_key: "", content_value: "", metadata: "{}", is_active: true });
    }
    setIsModalOpen(true);
  };

  const saveContent = async () => {
    setSubmitting(true);
    try {
      const payload = {
        section_key: formData.section_key,
        content_key: formData.content_key,
        content_value: formData.content_value,
        metadata: JSON.parse(formData.metadata || "{}"),
        is_active: formData.is_active
      };
      
      if (formData.id) {
        await api.put(`/cms/content/${formData.id}`, payload);
      } else {
        await api.post('/cms/content', payload);
      }
      setIsModalOpen(false);
      fetchContent();
    } catch (err) {
      console.error(err);
      alert("Failed to save content. Ensure metadata is valid JSON.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await api.delete(`/cms/content/${id}`);
      fetchContent();
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
            Banners Manager
          </h1>
          <p className="text-muted-foreground mt-1">Manage global alerts, promotional banners, and site-wide notifications.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/20">
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      <Card className="glass border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Banner ID (Key)</th>
                <th className="px-6 py-4">Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading banners...
                  </td>
                </tr>
              ) : contentList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No active banners found.
                  </td>
                </tr>
              ) : (
                contentList.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground/90">{item.content_key}</td>
                    <td className="px-6 py-4 truncate max-w-sm">{item.content_value}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={item.is_active ? 'text-emerald-400 border-emerald-400/30 bg-emerald-500/5' : 'text-amber-400 border-amber-400/30 bg-amber-500/5'}>
                        {item.is_active ? 'Active' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => openModal(item)} className="h-8 rounded-lg hover:bg-muted">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteContent(item.id)} className="h-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500">
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
        <DialogContent className="sm:max-w-[500px] glass border-border/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{formData.id ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Banner Identifier Key</Label>
              <Input value={formData.content_key} onChange={(e) => setFormData({...formData, content_key: e.target.value})} placeholder="e.g. hackathon_promo" className="rounded-xl bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Banner Message</Label>
              <Textarea value={formData.content_value} onChange={(e) => setFormData({...formData, content_value: e.target.value})} rows={3} placeholder="Get 50% off..." className="rounded-xl bg-background/50 resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Metadata (JSON - Colors, Links)</Label>
              <Textarea value={formData.metadata} onChange={(e) => setFormData({...formData, metadata: e.target.value})} rows={3} placeholder='{"link": "/pricing", "color": "bg-indigo-500"}' className="rounded-xl bg-background/50 font-mono text-xs" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="active-check-banner" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="rounded border-border bg-background" />
              <Label htmlFor="active-check-banner" className="cursor-pointer">Set as Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={saveContent} disabled={submitting} className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
