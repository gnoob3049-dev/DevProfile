'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowRight, Sparkles, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const { navigate, setAuth } = useAppStore();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.login(form.email, form.password);
      setAuth(data.token, { id: data.user.id, name: data.user.name, email: data.user.email });
      toast({ title: 'Welcome back!' });
      navigate('my-profile');
    } catch (err: unknown) {
      toast({ title: 'Login failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-green-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-emerald-500/6 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative"
      >
        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          {/* Subtle top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 mb-4"
            >
              <Shield className="size-7 text-green-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  'bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11 transition-all duration-300',
                  focusedField === 'email'
                    ? 'border-green-500/50 focus:border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.08)]'
                    : 'focus:border-green-500/50'
                )}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={cn(
                    'bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-11 transition-all duration-300',
                    focusedField === 'password'
                      ? 'border-green-500/50 focus:border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.08)]'
                      : 'focus:border-green-500/50'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white h-11 shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-green-500/30"
              >
                {loading ? (
                  <span className="inline-block size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="size-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0a0a0a] text-gray-500">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('register')}
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-[10px] text-gray-600 mt-4 flex items-center justify-center gap-1.5">
          <Sparkles className="size-3 text-green-500/40" />
          Secure authentication. Your code, your profile.
        </p>
      </motion.div>
    </div>
  );
}