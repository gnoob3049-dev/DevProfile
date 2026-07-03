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
  const { routeParams, navigate, token, user, profile } = useAppStore();
  const { toast } = useToast();
  const type = routeParams.type || 'following';
  const fromPage = routeParams.from || 'landing';
  const userId = routeParams.userId || '';
  const isFollowers = type === 'followers';

  const [list, setList] = useState<Array<{
    id: string; name: string; email: string; username: string; githubUsername: string; bio: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchFn = isFollowers ? api.getFollowers : api.getFollowing;
    fetchFn(userId)
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

  const handleBack = () => {
    // Navigate back to the profile page we came from
    const isOwn = user?.id === userId;
    if (isOwn) {
      navigate('my-profile');
    } else if (fromPage === 'explore') {
      navigate('explore');
    } else if (list.length > 0) {
      // Try to find the username of the profile we were viewing
      navigate(fromPage === 'my-profile' ? 'my-profile' : 'landing');
    } else {
      navigate('landing');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Users className="size-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isFollowers ? 'Followers' : 'Following'}
            </h1>
            <p className="text-sm text-gray-500">{list.length} {isFollowers ? 'follower' : (list.length === 1 ? 'person' : 'people')}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3 p-4 rounded-xl">
                  <Skeleton className="size-10 rounded-full bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded bg-white/5" />
                    <Skeleton className="h-3 w-20 rounded bg-white/5" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg bg-white/5" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Users className="size-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {isFollowers ? 'No followers yet' : 'Not following anyone yet'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {isFollowers
                ? 'Share your profile to start building your audience and connect with the community.'
                : 'Explore developers and start following people to build your network.'}
            </p>
            {!isFollowers && (
              <Button
                onClick={() => navigate('explore')}
                variant="outline"
                className="mt-6 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300"
              >
                Explore Developers
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-2">
            {list.map((person, idx) => {
              const avatarUrl = person.githubUsername
                ? `https://github.com/${person.githubUsername}.png`
                : null;
              const isSelf = user?.id === person.id;
              const isFollowing = followingSet.has(person.id);

              return (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => navigate('public-profile', { username: person.username, from: 'following' })}
                  className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200"
                >
                  <Avatar className="size-10 border border-white/10 shrink-0 ring-2 ring-transparent group-hover:ring-green-500/20 transition-all">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={person.username} />}
                    <AvatarFallback className="bg-green-500/20 text-green-400 text-xs font-semibold">
                      {person.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">{person.name}</p>
                    <p className="text-xs text-gray-400">@{person.username}</p>
                  </div>
                  {person.bio && (
                    <p className="hidden md:block text-xs text-gray-500 max-w-[200px] truncate">{person.bio}</p>
                  )}
                  {!isSelf && (
                    <Button
                      size="sm"
                      variant={isFollowing ? 'outline' : 'default'}
                      disabled={actionLoading === person.id}
                      onClick={(e) => { e.stopPropagation(); handleToggleFollow(person.id); }}
                      className={cn(
                        'h-8 text-xs shrink-0',
                        isFollowing
                          ? 'border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      )}
                    >
                      {actionLoading === person.id
                        ? <span className="inline-block size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        : isFollowing
                        ? 'Following'
                        : 'Follow'}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}