'use client';

import apiClient from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    Bell,
    ChevronDown,
    Hash,
    Info,
    LayoutGrid,
    Plus,
    Search,
    Send,
    Settings,
    Smile,
    Sparkles,
    User
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  id: number;
  message: string;
  user_id: number;
  username: string;
  timestamp: string;
}

interface UserPresence {
  user_id: number;
  username: string;
  status: 'online' | 'offline';
}

export default function CommunityHub() {
  const { user } = useAuth();
  const [activeHub, setActiveHub] = useState('St. Jude\'s Cooperative');
  const [activeRoom, setActiveRoom] = useState('General');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Map<number, UserPresence>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // WebSocket Setup
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/chat/${activeRoom}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        setMessages(prev => [...prev, {
            id: Date.now(),
            message: data.message,
            user_id: data.user_id,
            username: data.username,
            timestamp: new Date().toISOString()
        }]);
      } else if (data.type === 'typing') {
        setTypingUsers(prev => {
          const next = new Set(prev);
          if (data.typing) next.add(data.username);
          else next.delete(data.username);
          return next;
        });
      } else if (data.type === 'presence') {
        setOnlineUsers(prev => {
          const next = new Map(prev);
          next.set(data.user_id, { user_id: data.user_id, username: data.username, status: data.status });
          return next;
        });
      }
    };

    return () => socketRef.current?.close();
  }, [activeRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  const handleSendMessage = () => {
    if (!input.trim() || !user) return;
    
    socketRef.current?.send(JSON.stringify({
      type: 'message',
      message: input,
      user_id: user.id,
      username: `${user.first_name} ${user.last_name}`
    }));
    
    setInput('');
    handleTyping(false);
  };

  const handleTyping = (isTyping: boolean) => {
    if (!user) return;
    socketRef.current?.send(JSON.stringify({
      type: 'typing',
      typing: isTyping,
      username: user.first_name,
      user_id: user.id
    }));
  };

  const onInputChange = (val: string) => {
    setInput(val);
    if (!typingUsers.has(user?.first_name || '')) {
      handleTyping(true);
    }
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-[85vh] bg-[#FDFCFB] rounded-[3rem] overflow-hidden shadow-2xl border border-border/10">
      
      {/* 1. Hubs Sidebar (Far Left) */}
      <aside className="w-20 bg-[#F8F9FA] border-r border-border/10 flex flex-col items-center py-8 gap-6">
        <div className="size-12 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-all cursor-pointer">
          <Sparkles size={24} />
        </div>
        <div className="w-8 h-px bg-border/50" />
        {['S', 'F', 'P', 'Y'].map((hub, i) => (
          <div 
            key={i} 
            className={`size-12 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer ${
              i === 0 ? 'bg-white shadow-md text-primary translate-x-1' : 'bg-muted/50 text-muted-foreground hover:bg-white hover:text-primary'
            }`}
          >
            {hub}
          </div>
        ))}
        <button className="mt-auto size-12 rounded-2xl bg-muted/30 border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-white hover:border-primary transition-all">
          <Plus size={20} />
        </button>
      </aside>

      {/* 2. Channel Sidebar */}
      <aside className="w-72 bg-[#F8F9FA] border-r border-border/10 flex flex-col p-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-black text-xl tracking-tighter">Church Hubs</h2>
          <ChevronDown size={18} className="text-muted-foreground" />
        </div>

        <nav className="flex-1 space-y-8">
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-2">Text Channels</h3>
            <div className="space-y-1">
              {['general', 'farmers-market', 'trade-services', 'prayer-requests'].map((ch) => (
                <button 
                  key={ch}
                  onClick={() => setActiveRoom(ch)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all ${
                    activeRoom === ch ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                  }`}
                >
                  <Hash size={16} className={activeRoom === ch ? 'text-primary' : 'opacity-40'} />
                  {ch.split('-').join(' ')}
                </button>
              ))}
            </div>
          </section>

          <section>
             <div className="flex items-center justify-between mb-4 ml-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Direct Messages</h3>
                <Plus size={14} className="text-muted-foreground cursor-pointer" />
             </div>
             <div className="space-y-1">
               {['Brother John', 'Sister Sarah', 'David Wood'].map((person) => (
                 <button key={person} className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 text-muted-foreground hover:bg-white/50 hover:text-foreground transition-all">
                   <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                   {person}
                 </button>
               ))}
             </div>
          </section>
        </nav>

        <div className="mt-auto pt-6 border-t border-border/10 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white shadow-sm border border-border/5 overflow-hidden">
            {user?.profile?.avatar ? (
              <img src={apiClient.getMediaUrl(user.profile.avatar)} className="size-full object-cover" alt="" />
            ) : <User className="m-auto text-muted-foreground" size={20} />}
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-xs font-black truncate">{user?.first_name} {user?.last_name}</p>
             <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Active Member</p>
          </div>
          <Settings size={18} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
        </div>
      </aside>

      {/* 3. Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="h-20 px-8 border-b border-border/10 flex items-center justify-between bg-[#FDFCFB]/50 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-4">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <Hash size={20} />
              </div>
              <div>
                 <h2 className="font-black text-lg tracking-tight capitalize">{activeRoom.split('-').join(' ')}</h2>
                 <p className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                   <div className="size-1.5 rounded-full bg-green-600 animate-pulse" /> Live Discussion
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search messages..."
                   className="bg-[#F8F9FA] border-none rounded-xl pl-10 pr-4 py-2 text-xs font-bold w-64 focus:ring-2 focus:ring-primary/10 transition-all"
                 />
              </div>
              <Bell className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" size={20} />
              <Info className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" size={20} />
           </div>
        </header>

        {/* Message List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-6 group ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}>
               <div className={`size-12 rounded-[1.25rem] bg-muted shadow-sm flex-shrink-0 transition-transform group-hover:scale-110 overflow-hidden ${msg.user_id === user?.id ? 'ring-2 ring-primary/20' : ''}`}>
                 <div className="size-full flex items-center justify-center bg-primary/5 text-primary">
                    <User size={24} />
                 </div>
               </div>
               <div className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-xs font-black text-[#1A1A1A]">{msg.username}</span>
                     <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                  </div>
                  <div className={`px-6 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed max-w-xl shadow-sm ${
                    msg.user_id === user?.id 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-[#F8F9FA] text-[#1A1A1A] rounded-tl-none border border-border/5'
                  }`}>
                    {msg.message}
                  </div>
               </div>
            </div>
          ))}
          
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-3 text-muted-foreground ml-2">
               <div className="flex gap-1">
                  <div className="size-1 rounded-full bg-muted-foreground/30 animate-bounce" />
                  <div className="size-1 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:0.2s]" />
                  <div className="size-1 rounded-full bg-muted-foreground/30 animate-bounce [animation-delay:0.4s]" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest italic">
                 {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
               </span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-border/10">
           <div className="max-w-4xl mx-auto relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Message #${activeRoom}`}
                className="w-full bg-[#F8F9FA] border-none rounded-2xl px-16 py-6 font-bold text-lg focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40 shadow-inner"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                 <LayoutGrid size={24} />
              </div>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                 <Smile size={24} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                 <button 
                   onClick={handleSendMessage}
                   className="bg-primary text-white size-12 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
                 >
                   <Send size={20} />
                 </button>
              </div>
           </div>
        </div>
      </main>

      {/* 4. Right Utility/Profile Sidebar */}
      <aside className="w-80 bg-[#F8F9FA] border-l border-border/10 hidden xl:flex flex-col p-8">
         <div className="text-center mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10">Community Context</h3>
            
            <div className="size-32 rounded-[2.5rem] bg-white shadow-xl mx-auto mb-6 p-2 ring-1 ring-border/10 relative">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400" className="size-full rounded-[2rem] object-cover" alt="" />
               <div className="absolute bottom-1 right-1 size-6 bg-green-500 rounded-full border-4 border-white" />
            </div>
            
            <h4 className="text-xl font-black tracking-tight">{activeHub}</h4>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Vibrant Cooperative</p>
         </div>

         <div className="space-y-8">
            <section>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Channel Details</h3>
               <div className="bg-white rounded-2xl p-5 border border-border/5 shadow-sm">
                  <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
                    "The heart of our local food system. Coordinate harvests, share knowledge, and lift each other up."
                  </p>
               </div>
            </section>

            <section>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center justify-between">
                 Active Members <span>{onlineUsers.size || 0}</span>
               </h3>
               <div className="space-y-4">
                  {['Marcus T.', 'Brother John', 'Sister Sarah'].map((m) => (
                    <div key={m} className="flex items-center gap-3">
                       <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary border border-border/5">
                          <User size={16} />
                       </div>
                       <span className="text-sm font-bold">{m}</span>
                       <div className="size-1.5 rounded-full bg-green-500 ml-auto" />
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <div className="mt-auto bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <h5 className="text-[10px] font-black uppercase text-primary mb-2">Member Tip</h5>
            <p className="text-[10px] font-medium leading-relaxed">Use #trade-services for plumbing, carpentry, and electrical inquiries.</p>
         </div>
      </aside>

    </div>
  );
}
