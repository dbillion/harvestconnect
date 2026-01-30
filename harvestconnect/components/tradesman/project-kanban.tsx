'use client';

import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MoreVertical, Plus, User } from 'lucide-react';
import { useMemo, useState } from 'react';

interface Project {
  id: number;
  title: string;
  client_name: string;
  status: 'inquiry' | 'quote_sent' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
}

const COLUMNS = [
  { id: 'inquiry', label: 'New Inquiries', color: 'bg-blue-500' },
  { id: 'quote_sent', label: 'Quotes Sent', color: 'bg-indigo-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-orange-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export default function ProjectKanban({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectMap = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project.id] = project;
      return acc;
    }, {} as Record<number, Project>);
  }, [projects]);

  const activeProject = activeId ? projectMap[activeId] : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string | number;

    const activeProject = projectMap[activeId];
    if (!activeProject) return;

    // Find the container the item is being dragged over
    const overStatus = COLUMNS.find(c => c.id === overId)?.id || 
                      projects.find(p => p.id === overId)?.status;

    if (overStatus && activeProject.status !== overStatus) {
      setProjects(prev => prev.map(p => 
        p.id === activeId ? { ...p, status: overStatus as any } : p
      ));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    if (activeId !== overId) {
      const oldIndex = projects.findIndex(p => p.id === activeId);
      const newIndex = projects.findIndex(p => p.id === overId);
      if (newIndex !== -1) {
        setProjects(prev => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[600px] overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <KanbanColumn 
            key={column.id} 
            id={column.id} 
            column={column} 
            projects={projects.filter(p => p.status === column.id)} 
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeProject ? (
          <ProjectCard project={activeProject} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ id, column, projects }: { id: string, column: any, projects: Project[] }) {
  return (
    <div className="flex flex-col gap-4 min-w-[280px]">
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${column.color}`} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">{column.label}</h3>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={14} />
        </button>
      </div>

      <SortableContext id={id} items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-4 p-3 rounded-[2rem] bg-[#F8F9FA]/50 border border-border/10 min-h-[150px]">
          {projects.map(project => (
            <SortableProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="h-24 flex items-center justify-center text-center opacity-20 border-2 border-dashed border-border/20 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest italic">Awaiting leads</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableProjectCard({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectCard project={project} />
    </div>
  );
}

function ProjectCard({ project, isOverlay }: { project: Project, isOverlay?: boolean }) {
  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-orange-600 bg-orange-50',
    low: 'text-green-600 bg-green-50'
  };

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-border/5 group transition-all duration-300 cursor-grab active:cursor-grabbing ${isOverlay ? 'shadow-2xl ring-2 ring-primary/20 scale-105' : 'hover:shadow-lg hover:-translate-y-1'}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${priorityColors[project.priority]}`}>
          {project.priority} Priority
        </span>
        <button className="text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={14} />
        </button>
      </div>

      <h4 className="font-black text-sm text-[#1A1A1A] mb-3 leading-tight transition-colors group-hover:text-primary">
        {project.title}
      </h4>

      <div className="flex items-center gap-2 mb-4">
        <div className="size-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <User size={10} />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground truncate">{project.client_name}</span>
      </div>

      <div className="pt-3 border-t border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock size={10} />
          <span className="text-[8px] font-black uppercase tracking-tighter">
            {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}
          </span>
        </div>
        <span className="text-[10px] font-black text-[#1A1A1A]">${project.budget.toLocaleString()}</span>
      </div>
    </div>
  );
}
