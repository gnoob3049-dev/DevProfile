'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, FileText, MapPin, Github, Sparkles, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { SkillChips } from '@/components/shared/SkillChips';
import { cn } from '@/lib/utils';

const LOOKING_FOR_OPTIONS = [
  { value: 'job', label: 'Job', icon: '💼', desc: 'Full-time, part-time, or contract' },
  { value: 'collaboration', label: 'Collaboration', icon: '🤝', desc: 'Open to side projects' },
  { value: 'freelance', label: 'Freelance', icon: '⚡', desc: 'Available for hire' },
  { value: 'open-source', label: 'Open Source', icon: '🌐', desc: 'Contributor & maintainer' },
];

const STEPS = [
  { label: 'Basics', icon: User },
  { label: 'Details', icon: FileText },
  { label: 'GitHub', icon: Github },
  { label: 'Skills', icon: Target },
];

export function OnboardingPage() {
  const { navigate, setProfile } = useAppStore();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    location: '',
    bio: '',
    githubUsername: '',
    skills: [] as string[],
    lookingFor: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !form.username.trim()) e.username = 'Username is required';
    if (step === 0 && form.username && !/^[a-zA-Z0-9_-]+$/.test(form.username)) e.username = 'Only letters, numbers, _ and -';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!form.lookingFor) {
      setErrors({ lookingFor: 'Select what you are looking for' });
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
      toast({ title: 'Profile created!', description: 'Welcome to DevProfile' });
      navigate('my-profile');
    } catch (err: unknown) {
      toast({ title: 'Failed to create profile', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepIcon = STEPS[step].icon;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-start justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === step;
              const isComplete = i < step;

              return (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border',
                        isComplete
                          ? 'bg-green-500/20 border-green-500/30 text-green-400'
                          : isActive
                          ? 'bg-green-500/10 border-green-500/40 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                          : 'bg-white/5 border-white/10 text-gray-600'
                      )}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <StepIcon className="size-4" />
                      )}
                    </motion.div>
                    <span className={cn(
                      'text-[10px] sm:text-xs font-medium transition-colors',
                      isActive ? 'text-green-400' : isComplete ? 'text-green-400/60' : 'text-gray-600'
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-8 sm:w-12 h-px mx-1 sm:mx-2 mt-[-1.25rem]">
                      <div className={cn(
                        'h-full transition-colors duration-300',
                        i < step ? 'bg-green-500/40' : 'bg-white/10'
                      )} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {step === 0 && 'Choose Your Identity'}
            {step === 1 && 'Tell Your Story'}
            {step === 2 && 'Connect GitHub'}
            {step === 3 && 'Show Your Skills'}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {step === 0 && 'Pick a unique username to get started'}
            {step === 1 && 'Share your bio and location'}
            {step === 2 && 'Link your GitHub for automatic portfolio data'}
            {step === 3 && 'Select your skills and what you\'re looking for'}
          </p>
        </div>

        {/* Form card */}
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step 0: Username + Location */}
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-2">
                      Username <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                      <Input
                        placeholder="johndoe"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11 pl-8"
                      />
                    </div>
                    {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
                    <p className="text-xs text-gray-600">Your public profile URL: devprofile.app/<span className="text-green-400">{form.username || 'username'}</span></p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-2">
                      <MapPin className="size-3.5" /> Location
                    </Label>
                    <Input
                      placeholder="San Francisco, CA"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                    />
                  </div>
                </>
              )}

              {/* Step 1: Bio */}
              {step === 1 && (
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm flex items-center gap-2">
                    <FileText className="size-3.5" /> Bio
                  </Label>
                  <Textarea
                    placeholder="Tell us about yourself, your experience, and what you love about coding..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 min-h-[140px] resize-none"
                  />
                  <div className="flex justify-end">
                    <span className={cn(
                      'text-xs transition-colors',
                      form.bio.length > 200 ? 'text-yellow-400' : 'text-gray-600'
                    )}>
                      {form.bio.length}/200
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: GitHub */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm flex items-center gap-2">
                      <Github className="size-3.5" /> GitHub Username
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Github className="size-4" />
                      </span>
                      <Input
                        placeholder="octocat"
                        value={form.githubUsername}
                        onChange={(e) => setForm({ ...form, githubUsername: e.target.value.replace(/[^a-zA-Z0-9-]/g, '') })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11 pl-10"
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Sparkles className="size-3 text-green-500/40" />
                      We&apos;ll automatically fetch your repos, stats, and contribution history
                    </p>
                  </div>

                  {form.githubUsername && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-3"
                    >
                      <img
                        src={`https://github.com/${form.githubUsername}.png`}
                        alt=""
                        className="size-10 rounded-full border border-white/10"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{form.githubUsername}</p>
                        <p className="text-xs text-gray-400">github.com/{form.githubUsername}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Skills + Looking For */}
              {step === 3 && (
                <>
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm flex items-center gap-2">
                      <Target className="size-3.5" /> Skills
                    </Label>
                    <SkillChips selected={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
                    {form.skills.length > 0 && (
                      <p className="text-xs text-green-400/60">{form.skills.length} skill{form.skills.length !== 1 ? 's' : ''} selected</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm">
                      What are you looking for? <span className="text-red-400">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LOOKING_FOR_OPTIONS.map((opt) => (
                        <motion.button
                          key={opt.value}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setForm({ ...form, lookingFor: opt.value });
                            setErrors({});
                          }}
                          className={cn(
                            'p-4 rounded-xl text-left border transition-all duration-200',
                            form.lookingFor === opt.value
                              ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.05)]'
                              : 'bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl">{opt.icon}</span>
                            <div>
                              <p className={cn(
                                'text-sm font-medium',
                                form.lookingFor === opt.value ? 'text-green-400' : 'text-gray-300'
                              )}>
                                {opt.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {errors.lookingFor && <p className="text-xs text-red-400">{errors.lookingFor}</p>}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            {step > 0 ? (
              <Button
                variant="ghost"
                onClick={prevStep}
                className="text-gray-400 hover:text-white gap-1.5"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <Button
                onClick={nextStep}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 gap-1.5"
              >
                Continue
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 gap-1.5"
              >
                {loading ? (
                  <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Profile
                    <Sparkles className="size-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Skip link */}
        {step < STEPS.length - 1 && (
          <p className="text-center text-xs text-gray-600 mt-4">
            You can always complete your profile later
          </p>
        )}
      </motion.div>
    </div>
  );
}