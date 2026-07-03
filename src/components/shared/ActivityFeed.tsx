'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Award, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { SectionHeader } from './SectionHeader';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  type: 'follow' | 'endorse';
  id: string;
  actorName: string;
  actorUsername: string;
  actorGithubUsername: string;
  skill?: string;
  createdAt: string;
}

export function ActivityFeed({ userId }: { userId: string }) {
  const { navigate } = useAppStore();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getActivity(userId)
      .then((data) => setActivities(data.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <SectionHeader>Recent Activity</SectionHeader>
        <div className="space-y-3 mt-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="size-8 rounded-full bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-white/5" />
                <div className="h-2 w-1/4 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      <SectionHeader>Recent Activity</SectionHeader>
      <div className="mt-3 space-y-1 max-h-80 overflow-y-auto">
        {activities.slice(0, 10).map((item, idx) => {
          const avatarUrl = item.actorGithubUsername
            ? `https://github.com/${item.actorGithubUsername}.png`
            : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => navigate('public-profile', { username: item.actorUsername })}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <div className="relative">
                <Avatar className="size-8 border border-white/10 shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={item.actorUsername} />}
                  <AvatarFallback className="bg-green-500/20 text-green-400 text-[10px] font-semibold">
                    {item.actorUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border border-[#0a0a0a]">
                  {item.type === 'follow' ? (
                    <UserPlus className="size-2.5 text-blue-400" />
                  ) : (
                    <Award className="size-2.5 text-yellow-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300">
                  <span className="font-medium group-hover:text-green-400 transition-colors">{item.actorName}</span>
                  {item.type === 'follow' ? (
                    <> started following you</>
                  ) : (
                    <> endorsed your <span className="text-green-400 font-medium">{item.skill}</span> skill</>
                  )}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}