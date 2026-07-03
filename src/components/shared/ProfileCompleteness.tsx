'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProfileData } from '@/store/app-store';

interface Props {
  profile: ProfileData;
}

function getCompleteness(profile: ProfileData): { percent: number; fields: string[] } {
  const checks = [
    { field: 'Bio', filled: !!profile.bio },
    { field: 'Location', filled: !!profile.location },
    { field: 'GitHub', filled: !!profile.githubUsername },
    { field: 'Skills', filled: profile.skills.length > 0 },
    { field: 'Looking For', filled: !!profile.lookingFor },
  ];
  const filled = checks.filter((c) => c.filled);
  return {
    percent: (filled.length / checks.length) * 100,
    fields: filled.map((c) => c.field),
  };
}

export function ProfileCompleteness({ profile }: Props) {
  const { percent, fields } = getCompleteness(profile);

  if (percent === 100) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-400">Profile Completeness</span>
        <span className="text-xs font-medium text-green-400">{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
        />
      </div>
      {percent < 100 && (
        <p className="text-[10px] text-gray-500 mt-1">
          Add {fields.length === 0 ? 'bio, location, GitHub, skills, and looking for' : `more details`} to complete your profile
        </p>
      )}
    </motion.div>
  );
}