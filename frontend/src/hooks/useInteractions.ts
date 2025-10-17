import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface InteractionStatus {
  targetType: string;
  targetId: string;
  isLiked: boolean;
  isSaved: boolean;
  likeCount?: number;
}

interface UseInteractionsProps {
  targetType: 'project' | 'idea' | 'comment' | 'prompt';
  targetId: string;
  initialLikeCount?: number;
}

export function useInteractions({ targetType, targetId, initialLikeCount = 0 }: UseInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [saveCount, setSaveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial interaction status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('peve_token');
        if (!token) {
          return; // Skip if not authenticated
        }

        const response = await apiFetch('/api/interactions/status', {
          method: 'POST',
          body: JSON.stringify({
            items: [{ targetType, targetId }]
          })
        });
        
        if (response.success && response.data.length > 0) {
          const status = response.data[0];
          setIsLiked(status.isLiked);
          setIsSaved(status.isSaved);
        }
      } catch (error) {
        // Only log error if it's not an auth error
        if (!error.message?.includes('Authentication failed') && !error.message?.includes('Invalid token')) {
          console.error('Failed to check interaction status:', error);
        }
      }
    };

    checkStatus();
  }, [targetType, targetId]);

  const toggleLike = async () => {
    if (isLoading) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('peve_token');
    if (!token) {
      alert('Please log in to like items');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiFetch(`/api/interactions/like/${targetType}/${targetId}`, {
        method: 'POST'
      });
      
      if (response.success) {
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed') || error.message?.includes('Invalid token')) {
        alert('Please log in to like items');
        localStorage.removeItem('peve_token');
        window.location.href = '/login';
      } else {
        console.error('Failed to toggle like:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = async () => {
    if (isLoading) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('peve_token');
    if (!token) {
      alert('Please log in to save items');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiFetch(`/api/interactions/save/${targetType}/${targetId}`, {
        method: 'POST'
      });
      
      if (response.success) {
        setIsSaved(response.data.isSaved);
        if (response.data.saveCount !== undefined) {
          setSaveCount(response.data.saveCount);
        }
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed') || error.message?.includes('Invalid token')) {
        alert('Please log in to save items');
        localStorage.removeItem('peve_token');
        window.location.href = '/login';
      } else {
        console.error('Failed to toggle save:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const share = async () => {
    try {
      const shareData = {
        title: 'Check this out on Peve!',
        text: 'Look at this interesting content I found on Peve',
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return {
    isLiked,
    isSaved,
    likeCount,
    saveCount,
    isLoading,
    toggleLike,
    toggleSave,
    share
  };
}
