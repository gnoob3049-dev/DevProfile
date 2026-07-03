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

export function RegisterPage() {
  const { navigate, setAuth } = useAppStore();
  const { toast } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api.register(form.name, form.email, form.password);
      setAuth(data.token, { id: data.user.id, name: data.user.name, email: data.user.email });
      toast({ title: 'Welcome! Complete your profile.' });
      navigate('onboarding');
    } catch (err: unknown) {
      toast({ title: 'Registration failed', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const field = (name: string, label: string, type = 'text', placeholder = '') => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-300 text-sm">{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type={type === 'password' && showPw ? 'text' : type}
          placeholder={placeholder}
          value={form[name as keyof typeof form]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 h-11"
        />
        {name === 'password' && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-gray-400 text-sm mt-2">Join the developer community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field('name', 'Name', 'text', 'John Doe')}
            {field('email', 'Email', 'email', 'john@example.com')}
            {field('password', 'Password', 'password', '••••••••')}
            {field('confirmPassword', 'Confirm Password', 'password', '••••••••')}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white h-11 shadow-lg shadow-green-500/20"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('login')}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}