'use client';

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  client_name: string;
  tradesman_name: string;
  status: 'inquiry' | 'quote_sent' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  budget: number;
  progress: number;
  due_date?: string;
}

const statusConfig = {
  inquiry: { label: 'Inquiry', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Clock size={12} /> },
  quote_sent: { label: 'Quote Sent', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: <ArrowUpRight size={12} /> },
  in_progress: { label: 'In Progress', color: 'bg-orange-50 text-orange-700 border-orange-100', icon: <Clock size={12} className="animate-spin-slow" /> },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-100', icon: <CheckCircle2 size={12} /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-100', icon: <AlertCircle size={12} /> }
};

const priorityConfig = {
  high: 'text-red-600',
  medium: 'text-orange-600',
  low: 'text-green-600'
};

export default function ProjectTable({ projects: initialProjects = [] }: { projects?: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const updateStatus = (id: number, newStatus: any) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="bg-white rounded-[2rem] border border-border/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-border/10">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-1/3">Project Details</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Priority</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Investment</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right pr-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-[#FDFCFB] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-[#1A1A1A] group-hover:text-primary transition-colors">{project.title}</span>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                       {project.client_name} • Ref: #HC-{project.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 font-bold">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusConfig[project.status].color}`}>
                    {statusConfig[project.status].icon}
                    {statusConfig[project.status].label}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                     <div className={`size-1.5 rounded-full bg-current ${priorityConfig[project.priority]}`} />
                     <span className={`text-[10px] font-black uppercase tracking-widest ${priorityConfig[project.priority]}`}>
                       {project.priority}
                     </span>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-[#1A1A1A]">${project.budget.toLocaleString()}</span>
                    <div className="w-24 h-1 bg-muted rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-right pr-12">
                   <Dialog>
                     <DialogTrigger asChild>
                       <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">
                          Manage Phase
                       </button>
                     </DialogTrigger>
                     <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white">
                        <DialogHeader>
                           <DialogTitle className="text-2xl font-black tracking-tighter">Update Project Phase</DialogTitle>
                           <p className="text-muted-foreground text-sm font-medium mt-2">Adjust the status for {project.title}.</p>
                        </DialogHeader>
                        <div className="grid grid-cols-1 gap-3 mt-6">
                           {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
                             <button
                               key={status}
                               onClick={() => updateStatus(project.id, status)}
                               className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                                 project.status === status ? 'border-primary bg-primary/5' : 'border-border/10 hover:border-primary/50'
                               }`}
                             >
                               <div className="flex items-center gap-3">
                                  <div className={`size-2 rounded-full ${statusConfig[status].color.split(' ')[2]}`} />
                                  <span className="font-black text-sm uppercase tracking-widest">{statusConfig[status].label}</span>
                               </div>
                               {project.status === status && <CheckCircle2 className="text-primary" size={18} />}
                             </button>
                           ))}
                        </div>
                     </DialogContent>
                   </Dialog>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-20">
                     <CheckCircle2 size={40} />
                     <p className="font-black text-sm uppercase tracking-widest">No active project commitments</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
