"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchWrapper } from "@/lib/fetch";
import { Image as ImageIcon, Upload, File, Folder } from "lucide-react";
import { toast } from "sonner";

interface MediaLibraryModalProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

export function MediaLibraryModal({ onSelect, trigger }: MediaLibraryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetchWrapper("/media/assets");
      if (res.success) {
        setAssets(res.data);
      }
    } catch (e) {
      toast.error("Failed to load media assets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading...");
    
    try {
      const res = await fetch(`/api/v1/media/upload`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Uploaded successfully", { id: toastId });
        loadAssets(); // Refresh list
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm"><ImageIcon className="w-4 h-4 mr-2" /> Browse Media</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm"><Folder className="w-4 h-4 mr-2" /> Folders</Button>
          </div>
          <div>
            <input type="file" id="media-upload" className="hidden" onChange={handleUpload} />
            <label htmlFor="media-upload">
              <Button size="sm" asChild>
                <span><Upload className="w-4 h-4 mr-2" /> Upload File</span>
              </Button>
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading assets...</div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
              <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
              <p>No media files found. Upload one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {assets.map(asset => (
                <div 
                  key={asset.id} 
                  className="relative group border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-all aspect-square bg-muted/30"
                  onClick={() => {
                    onSelect(asset.url);
                    setIsOpen(false);
                  }}
                >
                  {asset.mime_type.startsWith('image/') ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                      <File className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-[10px] text-center truncate w-full px-1">{asset.name}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button size="sm" variant="secondary">Select</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
