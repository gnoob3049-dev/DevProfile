'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/app-store';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const { navigate, setAuth } = useAppStore();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white h-11 shadow-lg shadow-green-500/20"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('register')}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}