
import { useAuth } from '@/lib/auth-context';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatWindow from './chat-window';

// Mock useAuth
vi.mock('@/lib/auth-context', () => ({
  useAuth: vi.fn(),
}));

describe('ChatWindow', () => {
  const mockUser = { id: 1, username: 'testuser' };
  
  beforeEach(() => {
    (useAuth as any).mockReturnValue({ user: mockUser });
    
    // Mock WebSocket as a class
    class MockWebSocket {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
      send = vi.fn();
      close = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
      onmessage = null;
      onopen = null;
      onclose = null;
      onerror = null;
    }
    
    global.WebSocket = MockWebSocket as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders chat window with room name', () => {
    render(<ChatWindow roomName="general" />);
    expect(screen.getByText('general')).toBeInTheDocument();
  });

  it('renders input and send button', () => {
    render(<ChatWindow roomName="general" />);
    expect(screen.getByPlaceholderText('Share a message...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('sends a message when clicking send button', async () => {
    const mockSend = vi.fn();
    class MockWebSocketWithSend {
      static CONNECTING = 0;
      static OPEN = 1;
      static CLOSING = 2;
      static CLOSED = 3;
      send = mockSend;
      close = vi.fn();
      addEventListener = vi.fn();
      removeEventListener = vi.fn();
    }
    global.WebSocket = MockWebSocketWithSend as any;

    render(<ChatWindow roomName="general" />);
    
    const input = screen.getByPlaceholderText('Share a message...');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith(JSON.stringify({
        message: 'Hello World',
        user_id: mockUser.id
      }));
    });
    
    expect(input).toHaveValue('');
  });
});
