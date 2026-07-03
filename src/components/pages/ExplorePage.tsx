'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { DeveloperCard } from '@/components/shared/DeveloperCard';

const ALL_SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'Java',
  'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'AWS',
  'Vue.js', 'Angular', 'Next.js', 'Django', 'Flutter', 'GraphQL', 'MongoDB',
  'PostgreSQL', 'Redis',
];

export function ExplorePage() {
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [page, setPage] = useState(1);
  const [developers, setDevelopers] = useState<Array<{
    id: string; username: string; name?: string; bio: string; location: string;
    githubUsername: string; skills: string[]; lookingFor: string;
    followerCount: number; followingCount: number;
  }>>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDevelopers({
        search: search || undefined,
        skill: skill || undefined,
        lookingFor: lookingFor || undefined,
        page,
        limit: 12,
      });
      setDevelopers(data.developers || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, [search, skill, lookingFor, page]);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, skill, lookingFor]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Explore Developers</h1>
        <p className="text-gray-400 text-sm mb-6">Discover and connect with talented developers</p>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              placeholder="Search developers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 pl-10 h-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-gray-300 h-10">
                <SlidersHorizontal className="size-3.5 mr-2 text-gray-400" />
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                {ALL_SKILLS.map((s) => (
                  <SelectItem key={s} value={s} className="text-gray-300 focus:bg-white/10 focus:text-white">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={lookingFor} onValueChange={setLookingFor}>
              <SelectTrigger className="w-[170px] bg-white/5 border-white/10 text-gray-300 h-10">
                <SelectValue placeholder="Looking for" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="job" className="text-gray-300 focus:bg-white/10 focus:text-white">Job</SelectItem>
                <SelectItem value="collaboration" className="text-gray-300 focus:bg-white/10 focus:text-white">Collaboration</SelectItem>
                <SelectItem value="freelance" className="text-gray-300 focus:bg-white/10 focus:text-white">Freelance</SelectItem>
                <SelectItem value="open-source" className="text-gray-300 focus:bg-white/10 focus:text-white">Open Source</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : developers.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400">No developers found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {developers.map((dev) => (
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="border-white/10 text-gray-400 hover:text-white"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-400 px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="border-white/10 text-gray-400 hover:text-white"
            >
              Next
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}