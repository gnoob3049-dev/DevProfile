'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Briefcase, Link as LinkIcon } from 'lucide-react';
import type { ProfileData } from '@/store/app-store';
import { SectionHeader } from './SectionHeader';
import { format } from 'date-fns';

interface Props {
  profile: ProfileData;
}

const lookingForLabels: Record<string, string> = {
  job: 'Looking for a Job',
  collaboration: 'Open to Collaboration',
  freelance: 'Available for Freelance',
  'open-source': 'Open Source Contributor',
};

export function QuickInfoSidebar({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-5 lg:sticky lg:top-24"
    >
      {/* Stats */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <SectionHeader>Quick Stats</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-lg font-bold text-green-400">{profile.followerCount}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-lg font-bold text-emerald-400">{profile.followingCount}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Following</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-lg font-bold text-cyan-400">{profile.skills.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Skills</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-white/5">
            <p className="text-lg font-bold text-purple-400">
              {profile.endorsements.reduce((sum, e) => sum + e.count, 0)}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Endorsements</p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <SectionHeader>Info</SectionHeader>
        <div className="space-y-3">
          {profile.location && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="size-3.5 text-gray-500 shrink-0" />
              <span className="text-xs">{profile.location}</span>
            </div>
          )}
          {profile.githubUsername && (
            <a
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              <LinkIcon className="size-3.5 text-gray-500 shrink-0" />
              <span className="text-xs">github.com/{profile.githubUsername}</span>
            </a>
          )}
          {profile.lookingFor && (
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase className="size-3.5 text-gray-500 shrink-0" />
              <span className="text-xs">{lookingForLabels[profile.lookingFor] || profile.lookingFor}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="size-3.5 text-gray-500 shrink-0" />
            <span className="text-xs">Joined {format(new Date(profile.createdAt), 'MMM yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Top Endorsements */}
      {profile.endorsements.length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <SectionHeader>Top Skills</SectionHeader>
          <div className="space-y-2">
            {profile.endorsements.slice(0, 5).map((e) => (
              <div key={e.skill} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{e.skill}</span>
                <span className="text-[10px] text-gray-500">×{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}