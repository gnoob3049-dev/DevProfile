'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Briefcase } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const lookingForLabels: Record<string, string> = {
  job: 'Looking for a Job',
  collaboration: 'Open to Collaboration',
  freelance: 'Available for Freelance',
  'open-source': 'Open Source Contributor',
};

const lookingForColors: Record<string, string> = {
  job: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  collaboration: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  freelance: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'open-source': 'bg-green-500/20 text-green-400 border-green-500/30',
};

interface Props {
  profile: {
    username: string;
    bio: string;
    location: string;
    githubUsername: string;
    lookingFor: string;
    followerCount: number;
    followingCount: number;
  };
  userId: string;
  name?: string;
  showActions?: boolean;
}

export function DeveloperCard({ profile, userId, name, showActions = true }: Props) {
  const { navigate, token, user } = useAppStore();
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatarUrl = profile.githubUsername
    ? `https://github.com/${profile.githubUsername}.png`
    : null;

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      navigate('login');
      return;
    }
    setLoading(true);
    try {
      if (following) {
        await api.unfollow(userId);
        setFollowing(false);
        toast({ title: 'Unfollowed' });
      } else {
        await api.follow(userId);
        setFollowing(true);
        toast({ title: 'Following!' });
      }
    } catch (err: unknown) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate('public-profile', { username: profile.username })}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/[0.07] transition-colors"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12 border border-white/10 shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.username} />}
          <AvatarFallback className="bg-green-500/20 text-green-400 text-sm font-semibold">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{name || profile.username}</h3>
          <p className="text-xs text-gray-400">@{profile.username}</p>
        </div>
      </div>

      {profile.bio && (
        <p className="text-xs text-gray-400 mt-3 line-clamp-2">{profile.bio}</p>
      )}

      {profile.location && (
        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <MapPin className="size-3" />
          <span className="text-xs">{profile.location}</span>
        </div>
      )}

      {profile.lookingFor && (
        <Badge
          variant="outline"
          className={cn('mt-3 text-[10px] border', lookingForColors[profile.lookingFor] || 'bg-white/5 text-gray-400 border-white/10')}
        >
          <Briefcase className="size-2.5 mr-1" />
          {lookingForLabels[profile.lookingFor] || profile.lookingFor}
        </Badge>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1 text-gray-500">
          <Users className="size-3" />
          <span className="text-xs">{profile.followerCount} followers</span>
        </div>
        {showActions && user?.id !== userId && (
          <Button
            size="sm"
            variant={following ? 'outline' : 'default'}
            disabled={loading}
            onClick={handleFollow}
            className={cn(
              'h-7 text-xs',
              following
                ? 'border-white/10 text-gray-400 hover:text-red-400'
                : 'bg-green-500 hover:bg-green-600 text-white'
            )}
          >
            {following ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}