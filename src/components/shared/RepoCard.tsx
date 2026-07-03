'use client';

import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Vue: '#41b883',
  CSS: '#563d7c',
  HTML: '#e34c26',
  SCSS: '#c6538c',
};

interface Props {
  repo: {
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
  };
  index: number;
}

export function RepoCard({ repo, index }: Props) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group block"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-green-400 truncate">{repo.name}</h4>
            <ExternalLink className="size-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          {repo.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{repo.description}</p>
          )}
        </div>
        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1 text-yellow-400 shrink-0">
            <Star className="size-3.5 fill-current" />
            <span className="text-xs font-medium">{repo.stargazers_count}</span>
          </div>
        )}
      </div>
      {repo.language && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: langColors[repo.language] || '#8b8b8b' }}
          />
          <span className="text-xs text-gray-400">{repo.language}</span>
        </div>
      )}
    </motion.a>
  );
}