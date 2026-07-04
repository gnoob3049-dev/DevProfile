'use client';

import { Code2, Github, Twitter, Heart, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

const footerLinks = {
  platform: [
    { label: 'Explore', page: 'explore' },
    { label: 'Create Profile', page: 'register' },
    { label: 'Sign In', page: 'login' },
  ],
  features: [
    { label: 'GitHub Integration', page: 'landing' },
    { label: 'Skill Endorsements', page: 'landing' },
    { label: 'Developer Network', page: 'explore' },
  ],
  resources: [
    { label: 'Documentation', page: 'landing' },
    { label: 'API Reference', page: 'landing' },
    { label: 'Open Source', page: 'landing' },
  ],
};

export function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-90 transition-opacity mb-3"
            >
              <Code2 className="size-5 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                DevProfile
              </span>
            </button>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your developer portfolio, powered by GitHub. Showcase skills, connect with developers worldwide.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-2">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Twitter, label: 'Twitter' },
                { icon: MessageSquare, label: 'Discord' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-green-400 hover:bg-green-500/10 hover:border-green-500/20 transition-all"
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-300 mb-3 capitalize">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.page)}
                      className="text-sm text-gray-500 hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Built with <Heart className="size-3 text-red-500/60 inline" /> using Next.js & GitHub API
          </p>
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} DevProfile. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}