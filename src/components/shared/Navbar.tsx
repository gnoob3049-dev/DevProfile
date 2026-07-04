'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentPage, navigate, token, user, logout } = useAppStore();

  const navLink = (page: string, label: string) => (
    <button
      onClick={() => { navigate(page); setMobileOpen(false); }}
      className={cn(
        'text-sm font-medium transition-colors px-3 py-2 rounded-lg',
        currentPage === page
          ? 'text-green-400 bg-green-500/10'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
    >
      {label}
    </button>
  );

  const links = (
    <>
      {navLink('landing', 'Home')}
      {navLink('explore', 'Explore')}
      {token && user && (
        <>
          {navLink('my-profile', 'My Profile')}
          <button
            onClick={() => { logout(); setMobileOpen(false); }}
            className="text-sm font-medium text-gray-400 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Logout
          </button>
        </>
      )}
      {!token && (
        <>
          {navLink('login', 'Login')}
          {navLink('register', 'Register')}
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-90 transition-opacity"
            >
              <Code2 className="size-6 text-green-400" />
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                DevProfile
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links}
            </nav>

            {/* Mobile hamburger */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl bg-[#0a0a0a]/95 border-b border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {links}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}