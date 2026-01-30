'use client';

import AdminDashboard from '@/components/dashboard/admin-dashboard';
import BuyerDashboard from '@/components/dashboard/buyer-dashboard';
import FarmerDashboard from '@/components/dashboard/farmer-dashboard';
import TradesmanDashboard from '@/components/dashboard/tradesman-dashboard';
import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { useAuth } from '@/lib/auth-context';
import { Leaf, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Maps roles to their theme class and display names
const ROLE_CONFIG = {
  farmer: {
    theme: 'theme-farmer',
    displayName: 'Farmer',
    description: 'Manage your farm products and orders',
    icon: '🌾',
  },
  seller: {
    theme: 'theme-farmer',
    displayName: 'Seller',
    description: 'Track your sales and inventory',
    icon: '🛒',
  },
  tradesman: {
    theme: 'theme-tradesman',
    displayName: 'Tradesman',
    description: 'Manage projects and client work',
    icon: '🔧',
  },
  artisan: {
    theme: 'theme-tradesman',
    displayName: 'Artisan',
    description: 'Showcase your craft and services',
    icon: '🎨',
  },
  buyer: {
    theme: 'theme-buyer',
    displayName: 'Member',
    description: 'Your community activity hub',
    icon: '👤',
  },
  admin: {
    theme: 'theme-admin',
    displayName: 'Administrator',
    description: 'Platform oversight and management',
    icon: '⚙️',
  },
} as const;

type UserRole = keyof typeof ROLE_CONFIG;

export default function DashboardRouter() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [viewOverride, setViewOverride] = useState<UserRole | null>(null);

  // Get current role with fallback
  const currentRole = useMemo(() => {
    if (viewOverride) return viewOverride;
    const role = user?.profile?.role as UserRole | undefined;
    return role && ROLE_CONFIG[role] ? role : 'buyer';
  }, [user?.profile?.role, viewOverride]);

  const roleConfig = ROLE_CONFIG[currentRole];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Premium Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 size-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="size-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
              <Leaf className="size-10 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          </div>
          
          {/* Loading Text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              Loading Your Dashboard
              <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            </p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Preparing your personalized experience
            </p>
          </div>
          
          {/* Subtle Loading Bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full animate-pulse"
              style={{
                animation: 'loading-bar 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Determine which dashboard to show based on role
  const renderDashboard = () => {
    switch (currentRole) {
      case 'farmer':
      case 'seller':
        return <FarmerDashboard />;
      case 'tradesman':
      case 'artisan':
        return <TradesmanDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <BuyerDashboard />;
    }
  };

  return (
    <div className={roleConfig.theme}>
      <Navigation />
      
      {/* Role Indicator & Switcher Bar */}
      <div className="bg-muted/50 border-b border-border/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg" role="img" aria-label={roleConfig.displayName}>
              {roleConfig.icon}
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                {roleConfig.displayName} Dashboard
              </p>
              <p className="text-xs text-muted-foreground">
                {roleConfig.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 whitespace-nowrap">Switch View:</p>
            {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setViewOverride(role)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  currentRole === role 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-background hover:bg-muted text-muted-foreground'
                }`}
              >
                {role}
              </button>
            ))}
            {viewOverride && (
              <button 
                onClick={() => setViewOverride(null)}
                className="size-6 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:scale-110 transition-transform ml-2"
                title="Reset to default role"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      
      <main className="min-h-screen bg-background">
        {renderDashboard()}
      </main>
      
      <Footer />
    </div>
  );
}

