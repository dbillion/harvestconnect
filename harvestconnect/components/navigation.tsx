'use client';

import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Database, LogOut, Menu, User, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { HarvestLogo } from './ui/harvest-logo';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    setIsMock(localStorage.getItem('harvestconnect_use_mock') === 'true');
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/community-hub', label: 'Community' },
    { href: '/membership', label: 'Membership' },
    { href: '/for-sellers', label: 'Sell' },
    { href: '/mission', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {isMock && (
        <div className="bg-primary/95 backdrop-blur-md text-primary-foreground py-1.5 px-4 text-center">
          <Link href="/dev/simulate" className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:underline">
            <Database className="size-3" />
            Simulation Mode Active • Click to Manage
          </Link>
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`my-4 flex items-center justify-between whitespace-nowrap rounded-xl border border-border bg-card p-3 shadow-glass backdrop-blur-xl dark:bg-card ${isMock ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <HarvestLogo className="size-7 text-primary transition-transform group-hover:scale-110" />
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-foreground">
              HarvestConnect
            </h2>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center gap-8 px-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium leading-normal transition-colors hover:text-primary dark:hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 group hover:bg-accent rounded-full transition-colors">
              <span className="material-symbols-outlined text-foreground hover:text-primary transition-colors text-xl">shopping_bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black size-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart ({totalItems} items)</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/profile"
                  className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  <User size={18} />
                  My Profile
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="hidden sm:inline-flex text-sm font-medium transition-colors hover:text-primary">
                  Sign In
                </Link>
                <Link href="/auth/register">
                  <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-primary-foreground text-sm font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                    Join Now
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Glassy dropdown */}
        {isOpen && (
          <div className="md:hidden mt-2 p-4 glass-card animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/10 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
