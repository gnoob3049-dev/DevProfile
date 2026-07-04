'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Briefcase, Github, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

const SKILL_COLORS = [
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-red-500/20 text-red-400 border-red-500/30',
];

interface Props {
  profile: {
    username: string;
    bio: string;
    location: string;
    githubUsername: string;
    skills: string[];
    lookingFor: string;
    followerCount: number;
    followingCount: number;
    createdAt?: string;
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

  const visibleSkills = profile.skills?.slice(0, 3) || [];
  const remainingSkills = (profile.skills?.length || 0) - 3;

  const handleGitHubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://github.com/${profile.githubUsername}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => navigate('public-profile', { username: profile.username })}
      className="relative group backdrop-blur-xl bg-white/5 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:bg-white/[0.07] border border-white/10 hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-12 border border-white/10 shrink-0">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.username} />}
          <AvatarFallback className="bg-green-500/20 text-green-400 text-sm font-semibold">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{name || profile.username}</h3>
            {profile.githubUsername && (
              <button
                onClick={handleGitHubClick}
                className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                aria-label={`View ${profile.githubUsername} on GitHub`}
              >
                <Github className="size-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400">@{profile.username}</p>
            {profile.createdAt && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-600">
                <Clock className="size-2.5" />
                {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <p className="text-xs text-gray-400 mt-3 line-clamp-2">{profile.bio}</p>
      )}

      {/* Skills chips */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {visibleSkills.map((skill, i) => (
            <Badge
              key={skill}
              variant="outline"
              className={cn(
                'text-[10px] px-2 py-0 border leading-4',
                SKILL_COLORS[i % SKILL_COLORS.length]
              )}
            >
              {skill}
            </Badge>
          ))}
          {remainingSkills > 0 && (
            <span className="text-[10px] text-gray-500">+{remainingSkills} more</span>
          )}
        </div>
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