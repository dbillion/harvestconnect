'use client';

import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    Calendar as CalendarIcon,
    FolderOpen,
    LayoutDashboard,
    LayoutList,
    MessageSquare,
    Trello,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChatWindow from '../chat/chat-window';
import { CreateProjectDialog } from '../tradesman/create-project-dialog';
import ProjectCalendar from '../tradesman/project-calendar';
import ProjectKanban from '../tradesman/project-kanban';
import ProjectTable from '../tradesman/project-table';

export default function TradesmanDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    earnings: 0,
    rating: 0,
    inquiries: 8
  });
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'calendar'>('overview');
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const statsData = await apiClient.getDashboardStats();
      const s = statsData.stats;
      setStats({
        activeProjects: (s.pipeline?.in_progress || 0) + (s.pipeline?.quote_sent || 0),
        earnings: s.earnings || 3840,
        rating: s.rating_avg || 4.9,
        inquiries: s.pipeline?.inquiry || 2
      });

      const projectsData = await apiClient.getProjects();
      setProjects(projectsData.results || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProject = async (id: number, data: any) => {
    try {
      await apiClient.updateProject(id, data);
      fetchData();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await apiClient.deleteProject(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-border/10 hidden lg:flex flex-col p-10 h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-20">
          <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3">
            <LayoutDashboard size={24} />
          </div>
          <span className="font-black tracking-tighter text-2xl text-[#1A1A1A]">Foreman.</span>
        </div>

        <nav className="flex-1 space-y-3">
          {[
            { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: 'projects', label: 'Project Pipeline', icon: <FolderOpen size={20} /> },
            { id: 'calendar', label: 'Work Calendar', icon: <CalendarIcon size={20} /> },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-[#1A1A1A] text-white shadow-2xl scale-105' 
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <Link href="/community/discovery" className="block">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:bg-muted/50 transition-all">
              <MessageSquare size={20} /> Discussions
            </button>
          </Link>
        </nav>

        <div className="mt-auto space-y-6">
          <CreateProjectDialog onCreated={fetchData} />
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 p-10 md:p-16 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-16">
          
          <header className="flex justify-between items-end">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <div className="size-2 rounded-full bg-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Systems Online</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-[#1A1A1A]">Artisan Hub.</h1>
              <p className="text-xl font-medium text-muted-foreground">Portfolio of {projects.length} active and historic commitments.</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-border/10 flex gap-1">
                   <button 
                    onClick={() => setViewMode('board')}
                    className={`p-3 rounded-xl transition-all ${viewMode === 'board' ? 'bg-[#1A1A1A] text-white' : 'text-muted-foreground hover:bg-muted'}`}
                   >
                     <Trello size={20} />
                   </button>
                   <button 
                    onClick={() => setViewMode('table')}
                    className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#1A1A1A] text-white' : 'text-muted-foreground hover:bg-muted'}`}
                   >
                     <LayoutList size={20} />
                   </button>
                </div>
            </div>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-border/5 group hover:shadow-2xl transition-all duration-500">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Total Commitment Value</p>
                        <div className="flex items-baseline gap-4 mb-4">
                          <h2 className="text-6xl font-black tracking-tighter text-[#1A1A1A] group-hover:text-primary transition-colors">${stats.earnings.toLocaleString()}</h2>
                          <TrendingUp className="size-6 text-primary" />
                        </div>
                        <p className="text-xs font-black text-primary uppercase tracking-widest">Growth Index: +22%</p>
                      </div>
                      
                      <div className="bg-[#1A1A1A] rounded-[2.5rem] p-10 shadow-2xl shadow-black/10 text-white relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Pipeline Velocity</p>
                        <h2 className="text-6xl font-black tracking-tighter mb-4">{stats.activeProjects}</h2>
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                           Projects in development
                        </div>
                      </div>
                   </div>

                   <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-border/10">
                      <div className="flex items-center justify-between mb-10">
                         <h3 className="text-2xl font-black tracking-tighter text-[#1A1A1A]">Recent Commitments</h3>
                      </div>
                      <ProjectTable projects={projects.slice(0, 3)} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} />
                   </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-10">
                   <div className="bg-white rounded-[3rem] p-4 shadow-xl border border-border/5 flex-1 min-h-[500px] overflow-hidden group">
                      <div className="p-6 border-b border-border/10 flex items-center justify-between">
                         <h4 className="font-black text-sm uppercase tracking-widest">Project Chat</h4>
                         <div className="size-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <ChatWindow roomName="General" />
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-12 transition-all">
               <div className="flex items-end justify-between">
                  <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A]">Project Pipeline.</h2>
               </div>
               {viewMode === 'board' ? (
                 <ProjectKanban initialProjects={projects} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} onRefresh={fetchData} />
               ) : (
                 <ProjectTable projects={projects} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} />
               )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-12">
               <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A]">Operation Schedule.</h2>
               <ProjectCalendar projects={projects} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
