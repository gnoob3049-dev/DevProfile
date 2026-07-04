'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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

export function EditProfilePage() {
  const { profile, setProfile, navigate } = useAppStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bio: profile?.bio || '',
    location: profile?.location || '',
    githubUsername: profile?.githubUsername || '',
    username: profile?.username || '',
    skills: profile?.skills || [],
    lookingFor: profile?.lookingFor || '',
  });

  const handleSave = async () => {
    if (!form.username.trim()) {
      toast({ title: 'Username is required', variant: 'destructive' });
      return;
    }
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
      toast({ title: 'Profile updated!' });
      navigate('my-profile');
    } catch (err: unknown) {
      toast({ title: 'Failed to update', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Username</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Bio</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 min-h-[100px] resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">Location</Label>
            <Input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
          </div>

          {/* GitHub Username */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">GitHub Username</Label>
            <Input
              value={form.githubUsername}
              onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
            />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-gray-300 text-sm">Skills</Label>
            <SkillChips selected={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
          </div>

          {/* Looking For */}
          <div className="space-y-3">
            <Label className="text-gray-300 text-sm">What are you looking for?</Label>
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
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('my-profile')}
              className="border-white/10 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}