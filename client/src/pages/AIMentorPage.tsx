import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AIMessage } from '../../../shared/types';
import {
  Sparkles,
  Send,
  User,
  Bot,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const AIMentorPage: React.FC = () => {
  const { profile, targetCareer, skillGaps } = useAuth();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const topGap = skillGaps.find(g => g.priority === 'critical') || skillGaps[0];

  useEffect(() => {
    if (profile) {
      api.getChatHistory(profile.id).then(data => {
        if (data.history && data.history.length > 0) {
          setMessages(data.history);
        } else {
          // Welcome default message
          setMessages([
            {
              id: 'init-msg',
              sender: 'assistant',
              content: `Hello **${profile.fullName}**! I am your context-aware **CareerBridge AI Mentor**.\n\nI have loaded your profile for **${targetCareer?.title || 'Data Analyst'}** (${profile.readinessScore.overallPercentage}% Ready). Your most critical lever right now is closing the gap in **${topGap?.skillName || 'SQL'}**.\n\nHow can I help guide your career journey today?`,
              timestamp: new Date().toISOString(),
              suggestedActions: [
                'Why is this career recommended for me?',
                'What should I learn today?',
                'Recommend a standout resume project',
                'How can I pivot to an adjacent role?'
              ]
            }
          ]);
        }
      });
    }
  }, [profile, targetCareer, topGap]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim() || !profile || sending) return;

    setInputText('');
    setSending(true);

    const tempUserMsg: AIMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await api.sendAIMessage(profile.id, message);
      setMessages(prev => [...prev, res.message]);
    } catch (err) {
      console.error('Failed to send AI message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!profile) {
    return <div className="p-8 text-center text-slate-400">Loading student context...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4 pb-4">
      {/* Context Snapshot Banner */}
      <div className="rounded-2xl border border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 p-4 shadow-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Context-Aware AI Career Mentor</h2>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
                Live Profile Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assisting <strong>{profile.fullName}</strong> • Goal: <strong>{targetCareer?.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Current Readiness</div>
            <div className="font-bold text-emerald-400">{profile.readinessScore.overallPercentage}% ({profile.readinessScore.status})</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Top Deficit Focus</div>
            <div className="font-bold text-rose-400">{topGap?.skillName || 'Core Foundation'}</div>
          </div>
        </div>
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isUser ? 'bg-blue-600 text-white' : 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className="space-y-2">
                <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(action)}
                        className="rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 transition-colors"
                      >
                        {action} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex gap-3 mr-auto max-w-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs text-slate-400 animate-pulse">
              Synthesizing personalized advice with student profile...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask anything (e.g. 'Why is this career recommended for me?', 'Suggest a portfolio project')..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
