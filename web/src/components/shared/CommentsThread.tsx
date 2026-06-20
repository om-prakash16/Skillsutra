"use client";

import { useState, useEffect } from "react";
import { fetchWrapper } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Clock, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface CommentsThreadProps {
  entityType: string;
  entityId: string;
}

export function CommentsThread({ entityType, entityId }: CommentsThreadProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [entityType, entityId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await fetchWrapper(`/collaboration/threads/${entityType}/${entityId}`);
      if (res.success) {
        setComments(res.data);
      }
    } catch (e) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const res = await fetchWrapper(`/collaboration/threads/${entityType}/${entityId}`, {
        method: "POST",
        body: JSON.stringify({ content: newComment })
      });
      
      if (res.success) {
        setNewComment("");
        loadComments();
      }
    } catch (e) {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse text-sm text-muted-foreground p-4">Loading discussion...</div>;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-2 border-b pb-2">
        <MessageSquare className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-bold text-lg">Discussion</h3>
        <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full ml-auto">
          {comments.length} comments
        </span>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {comment.author_id ? comment.author_id.substring(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">User {comment.author_id?.substring(0, 4)}</span>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" /> Just now
                  </div>
                </div>
                <p className="text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
                  {comment.content}
                </p>
                <div className="flex gap-2 pt-1">
                  <button className="text-xs text-muted-foreground hover:text-primary flex items-center font-medium">
                    <ThumbsUp className="w-3 h-3 mr-1" /> Like
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-primary font-medium">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">ME</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] text-sm resize-none"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handlePost} disabled={submitting || !newComment.trim()}>
              {submitting ? 'Posting...' : <><Send className="w-3 h-3 mr-2" /> Post Comment</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
