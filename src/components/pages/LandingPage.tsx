'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Users,
  Globe,
  Star,
  UserPlus,
  Code2,
  TrendingUp,
  GitBranch,
  Activity,
  Network,
  Award,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { DeveloperCard } from '@/components/shared/DeveloperCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const featureBadges = [
  { label: 'GitHub Integration', icon: GitBranch },
  { label: 'Real-time Data', icon: Activity },
  { label: 'Developer Network', icon: Network },
  { label: 'Skill Endorsements', icon: Award },
];

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create Profile',
    desc: 'Sign up and connect your GitHub',
  },
  {
    num: '02',
    icon: Code2,
    title: 'Showcase Skills',
    desc: 'Add your skills and let your repos speak',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Get Discovered',
    desc: 'Connect with developers and get endorsed',
  },
];

const testimonials = [
  {
    quote:
      'DevProfile helped me land my dream job. Recruiters found me through my GitHub portfolio!',
    name: 'Sarah Chen',
    role: 'Frontend Engineer',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    quote:
      "The endorsement feature is brilliant. It's like LinkedIn but for developers.",
    name: 'Marcus Johnson',
    role: 'Full-Stack Dev',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    quote:
      'I connected with three co-founders here. Best developer networking platform.',
    name: 'Priya Patel',
    role: 'DevOps Engineer',
    gradient: 'from-purple-400 to-pink-500',
  },
];

export function LandingPage() {
  const { navigate, token, profile } = useAppStore();
  const [developers, setDevelopers] = useState<
    Awaited<ReturnType<typeof api.getDevelopers>>['developers']
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDevelopers({ limit: 3 })
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
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Animated dot grid background */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none" />

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
              Your developer portfolio, powered by GitHub. Showcase your skills,
              connect with developers, and let your code speak for itself.
            </p>

            {/* Feature Badges Row */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {featureBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 text-xs text-gray-300"
                >
                  <badge.icon className="size-3 text-green-400" />
                  {badge.label}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Button
                  size="lg"
                  onClick={handleCTA}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 h-12 text-base shadow-lg shadow-green-500/20 rounded-xl"
                >
                  Create Your Profile
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </motion.div>
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

      {/* ===== STATS ===== */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Users,
              label: 'Developers',
              value: '2,500+',
              color: 'text-green-400',
            },
            {
              icon: Globe,
              label: 'Countries',
              value: '80+',
              color: 'text-blue-400',
            },
            {
              icon: Star,
              label: 'Endorsements',
              value: '15,000+',
              color: 'text-yellow-400',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <stat.icon className={`size-6 ${stat.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Three simple steps to build your developer presence
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-px -translate-y-1/2 bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-cyan-500/30" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center step-card-glow">
                  {/* Step number */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-400 bg-[#0a0a0a] px-2.5 py-0.5 rounded-full border border-green-500/20">
                    {step.num}
                  </span>

                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <step.icon className="size-5 text-green-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== FEATURED DEVELOPERS ===== */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Featured Developers
          </h2>
          <p className="text-gray-400 mb-8">
            Discover talented developers on the platform
          </p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-48 rounded-2xl bg-white/5"
                />
              ))}
            </div>
          ) : developers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {developers.map(
                (dev: {
                  id: string;
                  username: string;
                  bio: string;
                  location: string;
                  githubUsername: string;
                  skills: string[];
                  lookingFor: string;
                  followerCount: number;
                  followingCount: number;
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
                )
              )}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-gray-400">
                No developers yet. Be the first to join!
              </p>
            </div>
          )}
        </motion.div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Loved by Developers
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Hear what our community has to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
              >
                <Quote className="size-5 text-green-400/40 mb-3 shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                  {/* Avatar placeholder with gradient */}
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== JOIN CTA ===== */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/20" />
          <div className="absolute inset-0 dot-grid-bg opacity-50" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-green-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Join the{' '}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base sm:text-lg leading-relaxed">
              Thousands of developers are already showcasing their work.
              Build your profile in minutes and start connecting with the
              best in the industry.
            </p>
            <Button
              size="lg"
              onClick={handleCTA}
              className="bg-green-500 hover:bg-green-600 text-white px-10 h-13 text-base shadow-lg shadow-green-500/25 rounded-xl"
            >
              Create Your Profile
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}