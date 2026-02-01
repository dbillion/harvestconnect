'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  type: 'project' | 'meeting' | 'deadline';
  client: string;
}

export default function ProjectCalendar({ projects = [] }: { projects?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
 const startOffset = firstDayOfMonth(year, month);

  // Fill empty days
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  // Fill actual days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return projects
      .filter(project => {
        // Parse and normalize dates to handle different formats
        const startDate = project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : null;
        const endDate = project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : null;
        const currentDateStr = dateStr;
        
        // Check if project starts or ends on this day, or spans this day
        return (
          startDate === currentDateStr || 
          endDate === currentDateStr ||
          (startDate && endDate && 
           new Date(startDate) <= new Date(currentDateStr) && 
           new Date(endDate) >= new Date(currentDateStr))
        );
      })
      .map(project => ({
        id: project.id,
        title: project.title,
        date: dateStr,
        type: 'project',
        client: project.client?.first_name || project.client?.email || 'Client'
      }));
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-border/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-[#1A1A1A]">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Project Schedule</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1))}
            className="size-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1))}
            className="size-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border/20 rounded-2xl overflow-hidden border border-border/20">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-[#F8F9FA] p-4 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{day}</span>
          </div>
        ))}
        {days.map((day, i) => (
          <div key={i} className={`min-h-[120px] bg-white p-4 transition-colors group ${day ? 'hover:bg-[#FDFCFB]' : 'bg-[#F8F9FA]/30'}`}>
            {day && (
              <>
                <span className={`text-sm font-black ${day === new Date().getDate() && month === new Date().getMonth() ? 'text-primary size-7 rounded-lg bg-primary/10 flex items-center justify-center' : 'text-slate-400'}`}>
                  {day}
                </span>
                <div className="mt-2 space-y-1">
                  {getEventsForDay(day).map(event => (
                    <div 
                      key={event.id}
                      className={`px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter truncate ${
                        event.type === 'deadline' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
