import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Users, Clock, Target, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CompatibilityCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  receiverId: string;
  receiverName: string;
  onRequestSent: () => void;
}

interface CompatibilityData {
  score: number;
  label: string;
  breakdown: {
    skillOverlap: number;
    roleOverlap: number;
    interestOverlap: number;
    timeOverlap: number;
    workStyleCompatibility: number;
    pastCollabBonus: number;
  };
  reasons: string[];
  users: {
    requester: {
      id: string;
      username: string;
      name: string;
    };
    receiver: {
      id: string;
      username: string;
      name: string;
    };
  };
}

export default function CompatibilityCheckModal({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  receiverId,
  receiverName,
  onRequestSent
}: CompatibilityCheckModalProps) {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkCompatibility();
    }
  }, [isOpen, receiverId]);

  const checkCompatibility = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiFetch('/api/collaboration/compatibility/check', {
        method: 'POST',
        body: JSON.stringify({
          targetUserId: receiverId
        })
      });
      
      setCompatibility(response.data.compatibility);
    } catch (err: any) {
      setError(err.message || 'Failed to check compatibility');
    } finally {
      setLoading(false);
    }
  };

  const sendCollaborationRequest = async () => {
    if (!compatibility) return;
    
    setSending(true);
    setError('');
    
    try {
      await apiFetch('/api/collaboration/collab-request', {
        method: 'POST',
        body: JSON.stringify({
          ideaId,
          receiverId,
          compatibilityScore: compatibility.score,
          message: message.trim()
        })
      });
      
      toast({
        title: "Request sent!",
        description: "Your collaboration request has been sent successfully.",
      });
      
      onRequestSent();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send collaboration request');
    } finally {
      setSending(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Compatibility Check</h2>
              <p className="text-sm text-muted-foreground">
                Collaboration request for "{ideaTitle}"
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Checking compatibility...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {compatibility && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Compatibility Score */}
              <div className={`p-6 rounded-xl border ${getScoreBgColor(compatibility.score)}`}>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted-foreground/20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - compatibility.score / 100)}`}
                        className={getScoreColor(compatibility.score)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(compatibility.score)}`}>
                        {compatibility.score}%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{compatibility.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatibility with {receiverName}
                  </p>
                </div>
              </div>

              {/* Compatibility Breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Compatibility Breakdown</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Skills Match</span>
                      <span>{Math.round(compatibility.breakdown.skillOverlap * 100)}%</span>
                    </div>
                    <Progress value={compatibility.breakdown.skillOverlap * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Role Synergy</span>
                      <span>{Math.round(compatibility.breakdown.roleOverlap * 100)}%</span>
                    </div>
                    <Progress value={compatibility.breakdown.roleOverlap * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time Overlap</span>
                      <span>{Math.round(compatibility.breakdown.timeOverlap * 100)}%</span>
                    </div>
                    <Progress value={compatibility.breakdown.timeOverlap * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Work Style</span>
                      <span>{Math.round(compatibility.breakdown.workStyleCompatibility * 100)}%</span>
                    </div>
                    <Progress value={compatibility.breakdown.workStyleCompatibility * 100} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {compatibility.reasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3">Why you're a good match</h4>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.reasons.map((reason, index) => (
                      <Badge key={index} variant="teal" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Optional Message
                </label>
                <Textarea
                  placeholder="Hey, I'd love to build this project with you! I have experience with..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {message.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={sending}
                >
                  Cancel
                </Button>
                
                {compatibility.score >= 60 ? (
                  <Button
                    onClick={sendCollaborationRequest}
                    disabled={sending}
                    className="flex-1"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Send Collaboration Request
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex-1 p-3 bg-muted/50 rounded-lg text-center">
                    <XCircle className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Low compatibility — explore other ideas instead
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
