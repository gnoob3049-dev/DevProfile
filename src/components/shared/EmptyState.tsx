'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center"
    >
      {/* Animated icon container */}
      <div className="relative mx-auto mb-6 w-24 h-24">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/5 animate-pulse" />
        {/* Inner circle */}
        <div className="absolute inset-2 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
          <Icon className="size-10 text-gray-500" strokeWidth={1.5} />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500/40" />
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
        <div className="absolute top-1/2 -right-3 w-1 h-1 rounded-full bg-cyan-500/30" />
      </div>

      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="mt-6 border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 transition-all"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}