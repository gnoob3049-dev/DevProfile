'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Check } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './SectionHeader';
import type { ProfileData } from '@/store/app-store';

interface Props {
  endorsements: ProfileData['endorsements'];
  profileUserId: string;
}

export function EndorsementsSection({ endorsements, profileUserId }: Props) {
  const { user, token } = useAppStore();
  const { toast } = useToast();
  const [items, setItems] = useState(endorsements);
  const [animatingSkill, setAnimatingSkill] = useState<string | null>(null);

  const isOwn = user?.id === profileUserId;

  const handleEndorse = async (skill: string) => {
    if (!token || isOwn) return;
    try {
      setAnimatingSkill(skill);
      await api.endorse(profileUserId, skill);
      setItems((prev) =>
        prev.map((e) =>
          e.skill === skill
            ? { ...e, count: e.count + 1, endorsedByMe: true }
            : e
        )
      );
      toast({ title: `You endorsed ${skill}!` });
    } catch (err: unknown) {
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setTimeout(() => setAnimatingSkill(null), 600);
    }
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      <SectionHeader>Endorsements</SectionHeader>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const canEndorse = token && !isOwn && !item.endorsedByMe;
          return (
            <motion.button
              key={item.skill}
              whileTap={canEndorse ? { scale: 0.95 } : undefined}
              animate={animatingSkill === item.skill ? { scale: [1, 1.15, 1] } : {}}
              onClick={() => handleEndorse(item.skill)}
              disabled={!canEndorse}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                item.endorsedByMe
                  ? 'bg-green-500/20 border-green-500/30 text-green-400'
                  : canEndorse
                  ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              {item.endorsedByMe ? (
                <Check className="size-3" />
              ) : canEndorse ? (
                <ThumbsUp className="size-3" />
              ) : null}
              {item.skill}
              <span className="opacity-60">×{item.count}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}