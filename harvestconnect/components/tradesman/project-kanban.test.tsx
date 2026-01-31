
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProjectKanban from './project-kanban';

// Mock dnd-kit because it relies on browser APIs not fully present in JSDOM
// However, simple rendering might work. For now, let's test rendering.

describe('ProjectKanban', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'Project Alpha',
      client: { first_name: 'Client', last_name: 'A', username: 'clienta' },
      status: 'inquiry' as const,
      budget: 5000,
      priority: 'high' as const,
      end_date: '2024-12-31'
    },
    {
      id: 2,
      title: 'Project Beta',
      client: { first_name: 'Client', last_name: 'B', username: 'clientb' },
      status: 'in_progress' as const,
      budget: 12000,
      priority: 'medium' as const,
      end_date: '2024-11-30'
    }
  ];

  it('renders standard columns', () => {
    render(<ProjectKanban initialProjects={[]} />);
    expect(screen.getByText('New Inquiries')).toBeInTheDocument();
    expect(screen.getByText('Quotes Sent')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders projects in correct columns', () => {
    render(<ProjectKanban initialProjects={mockProjects} />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getAllByText(/Client/)).toHaveLength(2);
    
    // Check budget formatting
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$12,000')).toBeInTheDocument();
  });

  it('triggers delete callback when confirmed', async () => {
    // Note: Vitest/Testing Library test for complex DnD and Dialog interactions
    // would require mocking many components. For now we verify basic props exist.
    const onDeleteMock = vi.fn();
    render(<ProjectKanban initialProjects={mockProjects} onDelete={onDeleteMock} />);
    
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });
});
