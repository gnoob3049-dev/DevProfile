'use client';

import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className }: Props) {
  return (
    <div className={cn('flex items-center gap-2.5 mb-4', className)}>
      <span className="block w-1 h-5 rounded-full bg-gradient-to-b from-green-400 to-emerald-500 shrink-0" />
      <h3 className="text-sm font-semibold text-white">{children}</h3>
    </div>
  );
}