'use client';

import { motion } from 'framer-motion';
import { GitFork, Star, Users, BookOpen } from 'lucide-react';
import type { GitHubData } from '@/store/app-store';

interface Props {
  data: GitHubData;
}

const stats = [
  { key: 'public_repos' as const, label: 'Public Repos', icon: BookOpen, color: 'text-blue-400' },
  { key: 'followers' as const, label: 'Followers', icon: Users, color: 'text-green-400' },
  { key: 'following' as const, label: 'Following', icon: Users, color: 'text-purple-400' },
  { key: 'total_stars' as const, label: 'Total Stars', icon: Star, color: 'text-yellow-400' },
];

export function GitHubStatsCard({ data }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
        >
          <div className={`${stat.color} bg-white/5 p-2 rounded-xl`}>
            <stat.icon className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{data[stat.key].toLocaleString()}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}