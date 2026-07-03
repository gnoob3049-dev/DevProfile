'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function FollowingPage() {
  const { routeParams, navigate, token, user } = useAppStore();
  const { toast } = useToast();
  const type = routeParams.type || 'following';
  const userId = routeParams.userId || '';
  const isFollowers = type === 'followers';

  const [list, setList] = useState<Array<{
    id: string; name: string; email: string; username: string; githubUsername: string; bio: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = isFollowers
      ? `/api/follow/${userId}/followers`
      : `/api/follow/${userId}/following`;
    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        setList(data.users || data.following || data.followers || []);
        setFollowingSet(new Set((data.alreadyFollowing || []).map((u: { id: string }) => u.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, isFollowers]);

  const handleToggleFollow = async (targetId: string) => {
    if (!token) { navigate('login'); return; }
    const isFollowing = followingSet.has(targetId);
    setActionLoading(targetId);
    try {
      if (isFollowing) {
        await api.unfollow(targetId);
        setFollowingSet((prev) => { const n = new Set(prev); n.delete(targetId); return n; });
        toast({ title: 'Unfollowed' });
      } else {
        await api.follow(targetId);
        setFollowingSet((prev) => new Set(prev).add(targetId));
        toast({ title: 'Following!' });
      }
    } catch (err: unknown) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Users className="size-5 text-green-400" />
          <h1 className="text-xl font-bold text-white">
            {isFollowers ? 'Followers' : 'Following'}
          </h1>
          <span className="text-gray-500 text-sm">({list.length})</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-white/5" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400">
              {isFollowers ? 'No followers yet' : 'Not following anyone yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((person) => {
              const avatarUrl = person.githubUsername
                ? `https://github.com/${person.githubUsername}.png`
                : null;
              const isSelf = user?.id === person.id;
              const isFollowing = followingSet.has(person.id);

              return (
                <div
                  key={person.id}
                  onClick={() => navigate('public-profile', { username: person.username })}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.07] transition-colors"
                >
                  <Avatar className="size-10 border border-white/10 shrink-0">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={person.username} />}
                    <AvatarFallback className="bg-green-500/20 text-green-400 text-xs font-semibold">
                      {person.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{person.name}</p>
                    <p className="text-xs text-gray-400">@{person.username}</p>
                  </div>
                  {!isSelf && (
                    <Button
                      size="sm"
                      variant={isFollowing ? 'outline' : 'default'}
                      disabled={actionLoading === person.id}
                      onClick={(e) => { e.stopPropagation(); handleToggleFollow(person.id); }}
                      className={cn(
                        'h-8 text-xs',
                        isFollowing
                          ? 'border-white/10 text-gray-400 hover:text-red-400'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      )}
                    >
                      {actionLoading === person.id
                        ? '...'
                        : isFollowing
                        ? 'Following'
                        : 'Follow'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}