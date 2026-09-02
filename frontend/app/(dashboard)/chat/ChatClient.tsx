"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { Button, Spinner } from '@heroui/react';
import { SparklesIcon, SendIcon, AlertCircleIcon } from 'lucide-react';
import { ChatService, ChatMessage, Conversation } from '@/services/chatService';
import MarkdownContent from '@/components/MarkdownContent';
import KelanaAI from '@/components/KelanaAI';
import DashboardHeader from '@/components/DashboardHeader';
import { useRouter, useSearchParams } from 'next/navigation';

function ChatClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [messages, loading]);

  // Load messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadMessages(Number(conversationId));
      loadConversationData(Number(conversationId));
    } else {
      setMessages([]);
      setActiveConversation(null);
      setError(null);
    }
  }, [conversationId]);

  const loadConversationData = async (id: number) => {
    try {
      const conv = await ChatService.getConversation(id);
      setActiveConversation(conv);
    } catch (err) {
      console.error("Failed to load conversation details", err);
    }
  };

  const loadMessages = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const msgs = await ChatService.getMessages(id);
      setMessages(msgs || []);
    } catch (err) {
      console.error(err);
      setError(ChatService.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { content: userMessage, role: 'user' }]);

    try {
      let activeId = conversationId ? Number(conversationId) : null;

      // Create a conversation if one doesn't exist
      if (!activeId) {
        const title = userMessage.split(' ').slice(0, 5).join(' ') + '...';
        const newConv = await ChatService.createConversation(title);
        activeId = newConv.id;

        // Dispatch event for sidebar to refresh
        window.dispatchEvent(new Event('chat-created'));

        // Update URL
        router.replace(`/chat?id=${activeId}`);
      }

      // Send the message to the backend
      const aiMessage = await ChatService.sendMessage(activeId, userMessage);

      // Add the AI response to the state
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      setError(ChatService.handleError(err));
      // Remove the optimistic message on failure
      setMessages(prev => prev.filter((_, idx) => idx !== prev.length - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      {messages.length === 0 && (
        <>
          <KelanaAI />

          <DashboardHeader
            title="KelanaAI Chat"
            subtitle="Ask me anything about travel planning, destinations, or itineraries."
          />
        </>
      )}

      {/* Conversation Title when active */}
      {messages.length > 0 && activeConversation && (
        <div className="flex flex-col items-center justify-center pb-6 border-b border-white/5 shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold tracking-tight text-white">{activeConversation.title}</h2>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex flex-col flex-1 overflow-y-auto space-y-6 w-full pt-4">

        {/* Empty State */}

        {/* Message Bubbles */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 flex flex-col ${msg.role === 'user'
                ? 'bg-accent text-white rounded-tr-sm shadow-[0_4px_14px_0_rgba(147,83,211,0.39)]' // User Bubble (Primary)
                : 'bg-zinc-800/80 border border-white/10 text-zinc-100 rounded-tl-sm shadow-xl' // AI Bubble (Gray)
                }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              ) : (
                <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10">
                  <MarkdownContent content={msg.content} />
                </div>
              )}
              
              <div className={`mt-3 text-[10px] font-medium tracking-wide flex items-center gap-1.5 opacity-70 ${msg.role === 'user' ? 'justify-end text-white' : 'justify-start text-zinc-400'}`}>
                <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex w-full justify-start animate-fade-in">
            <div className="bg-zinc-800/80 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 shadow-xl flex items-center gap-3">
              <SparklesIcon className="w-5 h-5 text-accent animate-pulse" />
              <div className="flex gap-1 items-center h-5">
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
      </div>

      <div className="w-full relative transition-all duration-500 mt-4 shrink-0">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl focus-within:border-accent/50 focus-within:bg-zinc-900 transition-all">
          <div className="flex items-center gap-2 sm:gap-3 px-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0 min-w-0"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              disabled={loading}
            />
            <Button
              isIconOnly
              variant="primary"
              className="shrink-0 text-black bg-accent hover:bg-accent-hover"
              size="sm"
              isPending={loading}
              onPress={handleSend}
            >
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : <SendIcon className="w-4 h-4" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ChatClient() {
  return (
    <Suspense fallback={
      <div className="flex w-full h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <ChatClientInner />
    </Suspense>
  );
}
