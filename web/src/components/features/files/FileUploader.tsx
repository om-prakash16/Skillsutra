'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  category: 'avatar' | 'resume' | 'portfolio' | 'certificate';
  onUploadComplete?: (url: string) => void;
  maxSize?: number; // in MB
}

export function FileUploader({ category, onUploadComplete, maxSize = 5 }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024,
    accept: category === 'resume' 
      ? { 'application/pdf': ['.pdf'] }
      : { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
  });

  const upload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    // Simulating progress for demo
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Mock API Call to /api/v1/files/upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(interval);
    setProgress(100);
    setIsUploading(false);
    onUploadComplete?.('https://supabase-cdn-placeholder.url/mock-file.pdf');
  };

  return (
    <div className="w-full space-y-4">
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 bg-card/10",
          file ? "border-indigo-500/50" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {category === 'resume' ? (
              <FileText className="w-12 h-12 text-indigo-400 mb-2" />
            ) : (
              <ImageIcon className="w-12 h-12 text-primary mb-2" />
            )}
            <p className="font-bold text-lg">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">Click or drag to upload {category}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                MAX {maxSize}MB • {category === 'resume' ? 'PDF' : 'JPG, PNG, WEBP'}
              </p>
            </div>
          </>
        )}
      </div>

      {file && (
        <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex-1">
             {isUploading && (
               <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span>uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
               </div>
             )}
          </div>
          <Button 
            disabled={isUploading} 
            onClick={upload}
            className="bg-indigo-600 hover:bg-indigo-700 font-bold"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            Confirm Upload
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            disabled={isUploading}
            onClick={() => { setFile(null); setProgress(0); }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
