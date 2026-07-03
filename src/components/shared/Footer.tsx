'use client';

import { Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Code2 className="size-4 text-green-400" />
            <span>Built with Next.js & GitHub API</span>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} DevProfile. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}