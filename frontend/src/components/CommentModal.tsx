import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { apiFetch } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { CommentComponent } from './CommentComponent';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  likes: number;
  likedBy: string[];
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  repliesCount?: number;
  targetType: string;
  targetId: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'idea' | 'project';
  targetId: string;
  targetTitle: string;
  currentUserId?: string;
}

export function CommentModal({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  targetTitle, 
  currentUserId 
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/comments/${targetType}/${targetId}`);
      if (response.success) {
        setComments(response.data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: newComment.trim(),
          targetType,
          targetId
        })
      });

      if (response.success) {
        setNewComment('');
        fetchComments();
        toast({
          title: "Success",
          description: "Comment posted successfully",
        });
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, targetId, targetType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comments on {targetTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentComponent
                key={comment._id}
                comment={comment}
                currentUserId={currentUserId}
                onUpdate={fetchComments}
              />
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 min-h-[60px]"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="self-end"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}