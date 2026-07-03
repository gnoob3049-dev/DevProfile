'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = [
  '#22c55e', '#3b82f6', '#a855f7', '#f97316', '#eab308',
  '#ec4899', '#06b6d4', '#ef4444', '#14b8a6', '#8b5cf6',
];

interface Props {
  languages: { [lang: string]: number };
}

export function LanguageChart({ languages }: Props) {
  const entries = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const data = entries.map(([lang, bytes]) => ({
    name: lang,
    bytes,
    pct: ((bytes / total) * 100).toFixed(1),
  }));

  if (data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4">Top Languages</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={data} margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            width={90}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [`${(value / 1024).toFixed(1)} KB`, name]}
          />
          <Bar dataKey="bytes" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}