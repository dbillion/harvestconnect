'use client';

import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { Camera, Church, Save, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
    homeChurch: '',
    latitude: '',
    longitude: '',
    avatar: null as File | null,
    avatarPreview: '',
    banner: null as File | null,
    bannerPreview: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        bio: user.profile?.bio || '',
        phone: user.profile?.phone || '',
        location: user.profile?.location || '',
        homeChurch: user.profile?.home_church || '',
        latitude: user.profile?.latitude?.toString() || '',
        longitude: user.profile?.longitude?.toString() || '',
        avatar: null,
        avatarPreview: apiClient.getMediaUrl(user.profile?.avatar),
        banner: null,
        bannerPreview: apiClient.getMediaUrl(user.profile?.banner)
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Preview`]: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = new FormData();
      data.append('first_name', formData.firstName);
      data.append('last_name', formData.lastName);
      data.append('bio', formData.bio);
      data.append('phone', formData.phone);
      data.append('location', formData.location);
      data.append('home_church', formData.homeChurch);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      
      if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }
      if (formData.banner) {
        data.append('banner', formData.banner);
      }

      await apiClient.updateProfile(data);
      setMessage('Profile updated successfully! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/10">
        {/* Dynamic Poster Header */}
        <div className="h-64 relative group/poster border-b border-border/10">
          {formData.bannerPreview ? (
            <img src={formData.bannerPreview} className="size-full object-cover" alt="Poster" />
          ) : formData.avatarPreview ? (
            <div className="relative size-full overflow-hidden">
                <img src={formData.avatarPreview} className="size-full object-cover blur-2xl scale-125 opacity-40" alt="" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10" />
            </div>
          ) : (
            <div className="size-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          )}
          
          <label className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-white/40 transition-all opacity-0 group-hover/poster:opacity-100 shadow-xl">
             Change Poster
             <input type="file" className="hidden" onChange={e => handleFileChange(e, 'banner')} />
          </label>

          <div className="absolute -bottom-16 left-12 flex items-end gap-6">
            <div className="relative group/avatar">
              <div className="size-32 rounded-[2rem] border-4 border-white overflow-hidden shadow-2xl bg-white">
                {formData.avatarPreview ? (
                  <img src={formData.avatarPreview} alt="Profile" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center bg-muted">
                    <UserIcon size={48} className="text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 size-10 bg-primary text-white rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white">
                <Camera size={20} />
                <input type="file" className="hidden" onChange={e => handleFileChange(e, 'avatar')} />
              </label>
            </div>
          </div>
        </div>

        <div className="p-12 pt-28">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tighter">Identity</h1>
              <p className="text-muted-foreground font-medium mt-1">Manage your presence across the community marketplace.</p>
            </div>
            {message && (
              <div className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Story & Personal Mission</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Share your story and how you contribute to our community..."
                className="w-full bg-[#F8F9FA] border-none rounded-[2.5rem] px-8 py-6 font-medium text-lg focus:ring-2 focus:ring-primary/10 transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Church size={14} className="text-primary" /> Congregational Home
                </label>
                <input 
                  type="text" 
                  value={formData.homeChurch}
                  onChange={e => setFormData(prev => ({ ...prev, homeChurch: e.target.value }))}
                  placeholder="Where do you worship?"
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                   Phone Number
                </label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Geographical Latitude</label>
                <input 
                  type="text" 
                  value={formData.latitude}
                  onChange={e => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Geographical Longitude</label>
                <input 
                  type="text" 
                  value={formData.longitude}
                  onChange={e => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  className="w-full bg-[#F8F9FA] border-none rounded-2xl px-8 py-5 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#1A1A1A] text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#333] transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl hover:-translate-y-1 active:scale-95"
              >
                {loading ? 'Processing...' : <><Save size={20} /> Persist Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
