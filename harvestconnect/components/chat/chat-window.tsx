'use client';

import { useAuth } from '@/lib/auth-context';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  message: string;
  user_id: number;
  username: string;
}

export default function ChatWindow({ roomName }: { roomName: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}/ws/chat/${roomName}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [roomName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    socketRef.current?.send(JSON.stringify({
      message: input,
      user_id: user.id
    }));

    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-border/5">
      <div className="p-6 border-b border-border/10 bg-[#FDFCFB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight capitalize">{roomName}</h3>
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-green-600 flex items-center gap-1.5">
               <span className="size-1.5 rounded-full bg-green-600 animate-pulse" /> Live Discussion
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm font-medium shadow-sm leading-relaxed ${
              msg.user_id === user?.id 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-[#F8F9FA] text-[#1A1A1A] rounded-tl-none border border-border/5'
            }`}>
              <p>{msg.message}</p>
            </div>
            <span className="text-[9px] mt-2 text-muted-foreground font-black uppercase tracking-widest opacity-60">
              {msg.username} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
            <Sparkles size={48} className="mb-4 text-primary" />
            <p className="text-xs font-black uppercase tracking-widest">Awaiting local connection...</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border/10 bg-[#FDFCFB]">
        <div className="relative flex items-center gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share a message..."
            className="flex-1 h-14 bg-white border border-border/20 rounded-2xl px-6 font-bold text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner"
          />
          <button 
            onClick={sendMessage}
            className="size-14 bg-[#1A1A1A] text-white rounded-2xl flex items-center justify-center hover:bg-primary active:scale-95 transition-all shadow-xl shadow-black/10"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
