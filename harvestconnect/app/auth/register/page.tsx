'use client';

import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Call API to register
      await apiClient.register(
        formData.email,
        formData.password1,
        formData.first_name,
        formData.last_name,
        'buyer' // Default role
      );

      setSuccess(
        'Registration successful! Please check your email to confirm your account. Redirecting to login...'
      );

      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Join HarvestConnect
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Create an account to start buying and selling
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  id="first_name"
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  id="last_name"
                  type="text"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password1" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password1"
                type="password"
                name="password1"
                placeholder="••••••••"
                value={formData.password1}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <Input
                id="password2"
                type="password"
                name="password2"
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
