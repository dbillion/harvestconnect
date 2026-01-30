'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { HarvestLogo } from '@/components/ui/harvest-logo';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { getGithubAuthUrl, getGoogleAuthUrl } from '@/lib/auth-utils';
import { AlertCircle, ArrowRight, Github, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] size-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] size-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Navigation />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-12 relative z-10">
        <div className="w-full max-w-lg">
          <div className="glass-card rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden animate-in zoom-in duration-500">
            <div className="p-8 md:p-12 text-center bg-primary/5 border-b border-border/30 relative overflow-hidden">
              <div className="absolute top-[-50%] left-[-50%] size-full bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center size-16 bg-white rounded-2xl shadow-xl shadow-primary/10 mb-6 group hover:scale-110 transition-transform cursor-pointer">
                  <HarvestLogo className="size-10 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Welcome Back</h1>
                <p className="text-muted-foreground font-medium text-sm md:text-base">Enter your credentials to access your dashboard.</p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in shake-in">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium text-lg px-6"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Password
                    </label>
                    <Link href="/auth/reset" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all font-medium text-lg px-6"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In 
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                    <span className="bg-background px-6 text-muted-foreground/60">Or continue with</span>
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
                <span className="text-muted-foreground">New to HarvestConnect? </span>
                <Link href="/auth/register" className="text-primary font-black uppercase tracking-widest text-xs hover:underline ml-1">
                  Create an account
                </Link>
              </div>
            </div>

            <div className="p-6 bg-muted/30 border-t border-border/30 text-center flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Secure Authentication powered by HarvestConnect</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
