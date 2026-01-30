'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { HarvestLogo } from '@/components/ui/harvest-logo';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { getGithubAuthUrl, getGoogleAuthUrl } from '@/lib/auth-utils';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Github,
    Hammer,
    Loader2,
    Sprout,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'buyer' as const
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await apiClient.register(
        formData.email,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.role
      );
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      const data = err.data;
      if (data) {
        if (data.email) {
          setError(`Email error: ${data.email[0]}`);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else if (typeof data === 'object') {
          // Flatten first validation error
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          setError(`${firstKey}: ${Array.isArray(firstVal) ? firstVal[0] : firstVal}`);
        } else {
          setError('Registration failed. Please check your details.');
        }
      } else {
        setError('Connection failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'buyer', label: 'Community Member', icon: <Users size={18} />, desc: 'Marketplace access' },
    { id: 'farmer', label: 'Local Farmer', icon: <Sprout size={18} />, desc: 'Sell produce' },
    { id: 'tradesman', label: 'Master Tradesman', icon: <Hammer size={18} />, desc: 'Service portal' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-12 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="glass-card rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            <div className="p-8 md:p-12 text-center bg-primary/5 border-b border-border/30 relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-50%] size-full bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center size-14 bg-white rounded-2xl shadow-xl shadow-primary/10 mb-6 group hover:scale-110 transition-transform cursor-pointer">
                  <HarvestLogo className="size-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Join HarvestConnect</h1>
                <p className="text-muted-foreground font-medium text-sm md:text-base">Start your journey in our faith-led marketplace.</p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in shake-in">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-8 p-4 bg-primary/10 border border-primary/20 text-primary-dark rounded-2xl text-sm font-bold flex items-center gap-3">
                  <CheckCircle2 size={18} />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Role Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setFormData({...formData, role: r.id as any})}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 group ${
                          formData.role === r.id 
                          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-1 ring-primary' 
                          : 'bg-background border-border/50 hover:border-primary/30'
                        }`}
                      >
                        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                          formData.role === r.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                        }`}>
                          {r.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest">{r.label}</p>
                          <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      First Name
                    </label>
                    <Input
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                      className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Last Name
                    </label>
                    <Input
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                      className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium px-6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium px-6"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium px-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                      Confirm
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                      className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium px-6"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account 
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="bg-background px-6 text-muted-foreground/60 backdrop-blur-xl">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => window.location.href = getGoogleAuthUrl()}
                    className="h-14 flex items-center justify-center gap-3 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.312 2.696-6.912 2.696-5.576 0-10.08-4.504-10.08-10.08s4.504-10.08 10.08-10.08c3.032 0 5.272 1.192 6.912 2.76l2.312-2.312C18.424 1.248 15.584 0 12.48 0 5.592 0 0 5.592 0 12.48S5.592 24.96 12.48 24.96c3.712 0 6.544-1.224 8.784-3.552 2.272-2.272 2.992-5.464 2.992-8.08 0-.8-.064-1.56-.192-2.28h-11.584z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = getGithubAuthUrl()}
                    className="h-14 flex items-center justify-center gap-3 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                    <Github size={20} />
                    GitHub
                  </button>
                </div>
              </form>

              <div className="mt-12 text-center text-sm font-medium">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/auth/login" className="text-primary font-black uppercase tracking-widest text-xs hover:underline ml-1">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
