'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Share2, Briefcase, Edit2, ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ProfileData } from '@/store/app-store';

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

const SKILL_COLORS = [
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
];

interface Props {
  profile: ProfileData;
  name: string;
  isOwn: boolean;
}

export function ProfileHeader({ profile, name, isOwn }: Props) {
  const { navigate, token, user } = useAppStore();
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const canFollow = token && user && user.id !== profile.userId;
  const avatarUrl = profile.githubUsername
    ? `https://github.com/${profile.githubUsername}.png`
    : null;

  const handleFollow = async () => {
    if (!canFollow) return;
    setLoading(true);
    try {
      if (following) {
        await api.unfollow(profile.userId);
        setFollowing(false);
        toast({ title: 'Unfollowed' });
      } else {
        await api.follow(profile.userId);
        setFollowing(true);
        toast({ title: 'Following!' });
      }
    } catch (err: unknown) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?u=${profile.username}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Profile link copied to clipboard!' });
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Avatar className="size-20 border-2 border-green-500/30 shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.username} />}
          <AvatarFallback className="bg-green-500/20 text-green-400 text-xl font-bold">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">{name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-sm">@{profile.username}</p>
                {profile.githubUsername && (
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <ExternalLink className="size-3" />
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-auto">
              {isOwn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('edit-profile')}
                  className="border-white/10 text-gray-300 hover:text-white"
                >
                  <Edit2 className="size-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              )}
              {canFollow && (
                <Button
                  size="sm"
                  variant={following ? 'outline' : 'default'}
                  disabled={loading}
                  onClick={handleFollow}
                  className={cn(
                    'min-w-[80px] transition-all duration-200',
                    following
                      ? 'border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20'
                  )}
                >
                  {loading ? (
                    <span className="inline-block size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : following ? (
                    'Following'
                  ) : (
                    'Follow'
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          {profile.bio && <p className="text-gray-300 mt-3 text-sm">{profile.bio}</p>}

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {profile.location && (
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="size-3.5" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
            <button
              onClick={() => navigate('following', { userId: profile.userId, type: 'followers', from: isOwn ? 'my-profile' : 'public-profile' })}
              className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors"
            >
              <Users className="size-3.5" />
              <span className="text-sm font-medium">{profile.followerCount}</span>
              <span className="text-sm">followers</span>
            </button>
            <button
              onClick={() => navigate('following', { userId: profile.userId, type: 'following', from: isOwn ? 'my-profile' : 'public-profile' })}
              className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors"
            >
              <Users className="size-3.5" />
              <span className="text-sm font-medium">{profile.followingCount}</span>
              <span className="text-sm">following</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {profile.skills.map((skill, i) => (
              <Badge
                key={skill}
                variant="outline"
                className={cn('text-xs border', SKILL_COLORS[i % SKILL_COLORS.length])}
              >
                {skill}
              </Badge>
            ))}
          </div>

          {profile.lookingFor && (
            <Badge
              variant="outline"
              className={cn(
                'mt-4 text-xs border',
                lookingForColors[profile.lookingFor] || 'bg-white/5 text-gray-400 border-white/10'
              )}
            >
              <Briefcase className="size-3 mr-1" />
              {lookingForLabels[profile.lookingFor] || profile.lookingFor}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}