import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  _id: string;
  type: string;
  message: string;
  relatedId: string;
  seen: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationDropdown({ onNotificationClick }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAsSeen, setMarkingAsSeen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getNotificationMessage = (type: string, data: any) => {
    switch (type) {
      case 'collaboration_request':
        if (data?.projectTitle) {
          return `${data?.requesterName || 'Someone'} wants to collaborate on your project: ${data.projectTitle}`;
        } else if (data?.ideaTitle) {
          return `${data?.requesterName || 'Someone'} wants to collaborate on your idea: ${data.ideaTitle}`;
        } else {
          return `${data?.requesterName || 'Someone'} wants to collaborate with you`;
        }
      case 'collaboration_accepted':
        return `Your collaboration request has been accepted!`;
      case 'collaboration_rejected':
        return `Your collaboration request was not accepted`;
      default:
        return 'New notification';
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/notifications');
      // Transform the backend notification format to match frontend expectations
      const transformedNotifications = response.data.items.map((notif: any) => ({
        _id: notif._id,
        type: notif.type,
        message: getNotificationMessage(notif.type, notif.data),
        relatedId: notif.data?.ideaId || notif.data?.projectId || notif.data?.collaborationId || notif._id,
        seen: notif.read,
        createdAt: notif.createdAt
      }));
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (notificationId: string) => {
    setMarkingAsSeen(notificationId);
    try {
      await apiFetch('/api/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ ids: [notificationId] })
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, seen: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as seen:', error);
    } finally {
      setMarkingAsSeen(null);
    }
  };

  const markAllAsSeen = async () => {
    try {
      await apiFetch('/api/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ ids: [] }) // Empty array marks all as read
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, seen: true }))
      );
      
      toast({
        title: "All notifications marked as seen",
      });
    } catch (error) {
      console.error('Failed to mark all notifications as seen:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.seen) {
      markAsSeen(notification._id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'collaboration_request':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'collaboration_accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'collaboration_rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const unseenCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unseenCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
          >
            {unseenCount > 9 ? '9+' : unseenCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                {unseenCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsSeen}
                    className="text-xs"
                  >
                    Mark all seen
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-accent/50 cursor-pointer transition-colors ${
                        !notification.seen ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.seen && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
