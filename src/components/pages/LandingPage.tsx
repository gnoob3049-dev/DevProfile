'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { DeveloperCard } from '@/components/shared/DeveloperCard';

export function LandingPage() {
  const { navigate, token, profile } = useAppStore();
  const [developers, setDevelopers] = useState<Awaited<ReturnType<typeof api.getDevelopers>>['developers']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDevelopers({ limit: 3 })
      .then((d) => setDevelopers(d.developers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCTA = () => {
    if (token && profile) {
      navigate('my-profile');
    } else if (token && !profile) {
      navigate('onboarding');
    } else {
      navigate('register');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
              <Sparkles className="size-3" />
              Open Source Developer Platform
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                DevProfile
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Your developer portfolio, powered by GitHub.
              Showcase your skills, connect with developers, and let your code speak for itself.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleCTA}
                className="bg-green-500 hover:bg-green-600 text-white px-8 h-12 text-base shadow-lg shadow-green-500/20 rounded-xl"
              >
                Create Your Profile
                <ArrowRight className="size-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('explore')}
                className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 px-8 h-12 text-base rounded-xl"
              >
                Explore Developers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: Users, label: 'Developers', value: '2,500+', color: 'text-green-400' },
            { icon: Globe, label: 'Countries', value: '80+', color: 'text-blue-400' },
            { icon: Star, label: 'Endorsements', value: '15,000+', color: 'text-yellow-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <stat.icon className={`size-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Featured Developers */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Featured Developers</h2>
          <p className="text-gray-400 mb-8">Discover talented developers on the platform</p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : developers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {developers.map((dev: {
                id: string; username: string; bio: string; location: string; githubUsername: string;
                skills: string[]; lookingFor: string; followerCount: number; followingCount: number;
                name?: string;
              }) => (
                <DeveloperCard
                  key={dev.id}
                  profile={{
                    username: dev.username,
                    bio: dev.bio,
                    location: dev.location,
                    githubUsername: dev.githubUsername,
                    skills: dev.skills,
                    lookingFor: dev.lookingFor,
                    followerCount: dev.followerCount,
                    followingCount: dev.followingCount,
                  }}
                  userId={dev.id}
                  name={dev.name}
                />
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-gray-400">No developers yet. Be the first to join!</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}