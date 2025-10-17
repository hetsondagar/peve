import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, Users, MessageCircle, Calendar } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CollaborationRequest {
  _id: string;
  ideaId: {
    _id: string;
    title: string;
    mode: string;
  };
  requesterId?: {
    _id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  receiverId?: {
    _id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  compatibilityScore: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface MyRequestsProps {
  onRequestAction?: (requestId: string, action: 'accept' | 'reject') => void;
}

export default function MyRequests({ onRequestAction }: MyRequestsProps) {
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<CollaborationRequest[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/collaboration/my-requests');
      setSentRequests(response.data.sent || []);
      setReceivedRequests(response.data.received || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collaboration requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      await apiFetch(`/api/collaboration/requests/${requestId}/accept`, {
        method: 'PATCH'
      });
      
      toast({
        title: "Request accepted",
        description: "Collaboration request has been accepted",
      });
      
      await fetchRequests();
      if (onRequestAction) {
        onRequestAction(requestId, 'accept');
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      toast({
        title: "Error",
        description: "Failed to accept collaboration request",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      await apiFetch(`/api/collaboration/requests/${requestId}/reject`, {
        method: 'PATCH'
      });
      
      toast({
        title: "Request declined",
        description: "Collaboration request has been declined",
      });
      
      await fetchRequests();
      if (onRequestAction) {
        onRequestAction(requestId, 'reject');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast({
        title: "Error",
        description: "Failed to decline collaboration request",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderRequestCard = (request: CollaborationRequest, isReceived: boolean = false) => (
    <motion.div
      key={request._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Card className="glass border-border hover:border-primary/20 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm text-foreground">
                  {request.ideaId.title}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {request.ideaId.mode === 'want_to_build' ? 'Want to Build' : 'Brainstorm'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span>
                  {isReceived 
                    ? `From @${request.requesterId?.username}` 
                    : `To @${request.receiverId?.username}`
                  }
                </span>
                <span>•</span>
                <span className={getScoreColor(request.compatibilityScore)}>
                  {request.compatibilityScore}% match
                </span>
              </div>
              
              {request.message && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="line-clamp-2">{request.message}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Sent {formatDate(request.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
              </Badge>
              
              {isReceived && request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAcceptRequest(request._id)}
                    disabled={processing === request._id}
                    className="text-xs px-2 py-1 h-6"
                  >
                    {processing === request._id ? (
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectRequest(request._id)}
                    disabled={processing === request._id}
                    className="text-xs px-2 py-1 h-6 text-red-500 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          <span className="gradient-text">My Requests</span>
        </h2>
        <p className="text-muted-foreground">
          Manage your collaboration requests and see your collaboration history
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Received ({receivedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Sent ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No received requests</h3>
              <p className="text-muted-foreground">
                You haven't received any collaboration requests yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map(request => renderRequestCard(request, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sent requests</h3>
              <p className="text-muted-foreground">
                You haven't sent any collaboration requests yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sentRequests.map(request => renderRequestCard(request, false))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
