'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { SkillChips } from '@/components/shared/SkillChips';

const LOOKING_FOR_OPTIONS = [
  { value: 'job', label: 'Job' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'open-source', label: 'Open Source' },
];

export function OnboardingPage() {
  const { navigate, setProfile } = useAppStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    githubUsername: '',
    skills: [] as string[],
    lookingFor: '',
    username: '',
    location: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) e.username = 'Only letters, numbers, _ and -';
    if (!form.lookingFor) e.lookingFor = 'Select what you are looking for';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.createOrUpdateProfile({
        username: form.username,
        bio: form.bio,
        location: form.location,
        githubUsername: form.githubUsername,
        skills: form.skills,
        lookingFor: form.lookingFor,
      });
      setProfile(data.profile);
      toast({ title: 'Profile created!', description: 'Welcome to DevProfile' });
      navigate('my-profile');
    } catch (err: unknown) {
      toast({ title: 'Failed to create profile', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-start justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-400 mb-4">
            <CheckCircle2 className="size-5" />
          </div>
          <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-gray-400 mt-2">Tell the community about yourself</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Username <span className="text-red-400">*</span></Label>
            <Input
              placeholder="johndoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
            {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Bio</Label>
            <Textarea
              placeholder="Tell us about yourself, your experience, and what you love about coding..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 min-h-[100px] resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Location</Label>
            <Input
              placeholder="San Francisco, CA"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
          </div>

          {/* GitHub Username */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">GitHub Username</Label>
            <Input
              placeholder="octocat"
              value={form.githubUsername}
              onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
            <p className="text-xs text-gray-500">We&apos;ll fetch your repos and stats automatically</p>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-gray-300 text-sm">Skills</Label>
            <SkillChips selected={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
          </div>

          {/* Looking For */}
          <div className="space-y-3">
            <Label className="text-gray-300 text-sm">What are you looking for? <span className="text-red-400">*</span></Label>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, lookingFor: opt.value })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.lookingFor === opt.value
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.lookingFor && <p className="text-xs text-red-400">{errors.lookingFor}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-11 shadow-lg shadow-green-500/20 mt-2"
          >
            {loading ? 'Creating profile...' : 'Complete Profile'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}