import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { apiFetch } from '../lib/api';
import { useToast } from '../hooks/use-toast';

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
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, targetId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/comments/${targetType}/${targetId}`);
      if (response.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: newComment.trim(),
          targetType,
          targetId,
        }),
      });

      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
        toast({
          title: "Success",
          description: "Comment posted successfully",
        });
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await apiFetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      });

      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId ? response.data : comment
          )
        );
        setEditingComment(null);
        setEditContent('');
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await apiFetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await apiFetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (response.success) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === commentId 
              ? { 
                  ...comment, 
                  likes: response.data.likes,
                  likedBy: response.data.isLiked 
                    ? [...comment.likedBy, currentUserId || '']
                    : comment.likedBy.filter(id => id !== currentUserId)
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

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
              <div key={comment._id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.author.avatarUrl} />
                  <AvatarFallback>
                    {comment.author.username?.charAt(0).toUpperCase() || 
                     comment.author.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {comment.author.username || comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <Badge variant="secondary" className="text-xs">
                            edited
                          </Badge>
                        )}
                      </div>
                      
                      {comment.author._id === currentUserId && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment._id);
                              setEditContent(comment.content);
                            }}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment._id)}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingComment === comment._id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                          placeholder="Edit your comment..."
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment._id)}
                            disabled={!editContent.trim()}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    )}
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment._id)}
                      className={`h-6 px-2 text-xs ${
                        comment.likedBy.includes(currentUserId || '')
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${
                        comment.likedBy.includes(currentUserId || '') ? 'fill-current' : ''
                      }`} />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmitComment();
                }
              }}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Press Ctrl+Enter to submit
          </p>
        </div>
      </div>
    </div>
  );
}
