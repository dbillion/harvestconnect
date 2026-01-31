'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function EditProjectDialog({ 
  project,
  onUpdated,
  trigger,
  open: externalOpen,
  onOpenChange
}: { 
  project: any,
  onUpdated?: () => void,
  trigger?: React.ReactNode,
  open?: boolean,
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    status: "" as "inquiry" | "quote_sent" | "in_progress" | "completed" | "cancelled" | "",
    priority: "medium" as "low" | "medium" | "high",
    end_date: ""
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        budget: project.budget?.toString() || "",
        status: project.status || "inquiry",
        priority: project.priority || "medium",
        end_date: project.end_date || ""
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.updateProject(project.id, formData as any);
      setOpen(false);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-10 bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter text-[#1A1A1A]">Edit Commitment</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground mt-2">
              Update the details of this project engagement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-12 rounded-xl font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Details / Scope</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full h-24 rounded-xl border border-input bg-transparent px-3 py-2 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Budget ($)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  className="h-12 rounded-xl font-bold"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
                <select 
                  className="w-full h-12 rounded-xl border border-border bg-background px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
              <select 
                className="w-full h-12 rounded-xl border border-border bg-background px-4 font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="inquiry">New Inquiry</option>
                <option value="quote_sent">Quote Sent</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deadline (Optional)</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="h-12 rounded-xl font-medium"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
