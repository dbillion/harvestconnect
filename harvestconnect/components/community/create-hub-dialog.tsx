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

export function CreateHubDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [church, setChurch] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.createChatRoom({
        name,
        church,
        location,
        room_type: 'group'
      });
      setOpen(false);
      setName("");
      setChurch("");
      setLocation("");
      if (onCreated) onCreated();
    } catch (error) {
      console.error('Failed to create hub:', error);
      alert('Failed to create community hub. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-10 py-5 rounded-[2rem] bg-[#1A1A1A] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:bg-primary active:scale-95 flex items-center gap-2">
           <Plus size={16} /> Initialize New Hub
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-10 bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter">Initialize Hub</DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground mt-2">
              Create a new church or community cooperative hub to coordinate local efforts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-8">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Hub Name</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. St. Jude's Cooperative"
                className="h-12 rounded-xl font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="church" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Church Affiliation</label>
              <Input
                id="church"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                placeholder="e.g. St. Jude's Episcopal"
                className="h-12 rounded-xl font-medium"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lancaster, PA"
                className="h-12 rounded-xl font-medium"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Community Hub"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
