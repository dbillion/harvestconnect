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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export function CreateProjectDialog({ 
  onCreated, 
  defaultStatus = 'inquiry',
  trigger
}: { 
  onCreated?: () => void,
  defaultStatus?: 'inquiry' | 'quote_sent' | 'in_progress' | 'completed' | 'cancelled',
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    priority: "medium" as "low" | "medium" | "high",
    end_date: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.createProject({
        ...formData,
        status: defaultStatus
      });
      setOpen(false);
      setFormData({ title: "", description: "", budget: "", priority: "medium", end_date: "" });
      if (onCreated) onCreated();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project commitment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95">
            <Plus size={20} /> Create Commitment
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-10 bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter text-[#1A1A1A]">New Commitment</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground mt-2">
              Initialize a new project pipeline for a client engagement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Oak Dining Table Set"
                className="h-12 rounded-xl font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Details / Scope</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe the project scope..."
                className="w-full h-24 rounded-xl border border-input bg-transparent px-3 py-2 text-sm font-medium shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                  placeholder="2500"
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
              {loading ? <Loader2 className="animate-spin" /> : "Establish Pipeline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
