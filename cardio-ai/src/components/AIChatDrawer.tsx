import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  HelpCircle,
  Activity,
  Heart,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, PatientInfo, CardiacMetrics } from '../types/cardiac';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { askGeminiChatbot } from '../services/gemini';
import { FormattedMarkdown } from './FormattedMarkdown';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  metrics: CardiacMetrics;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  metrics,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call real Gemini API (with context of current predicted scan)
    const replyText = await askGeminiChatbot(query, {
      edv: metrics.edv,
      esv: metrics.esv,
      sv: metrics.sv,
      lvef: metrics.lvef,
      status: metrics.status,
      patientId: patient.id,
      rvEdv: metrics.rvEdv,
      rvEsv: metrics.rvEsv,
      myoMass: metrics.myocardialMass,
      cardiacOutput: metrics.cardiacOutput,
    });

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
  };

  const SUGGESTED_CHIPS = [
    { label: 'What is EDV?', icon: '⚡' },
    { label: 'Explain segmentation', icon: '📊' },
    { label: 'EDV vs ESV Difference', icon: '🫀' },
    { label: 'Summarize Diagnostic Report', icon: '📄' },
  ];

  if (!isOpen) return null;

  return (
    <div className="chat-backdrop" onClick={onClose}>
      <div 
        className="chat-drawer animate-slide-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="chat-header">
          <div className="flex-align-gap">
            <div className="bot-avatar">
              <Sparkles size={18} className="text-cyan" />
            </div>
            <div>
              <div className="chat-title-text">Cardio-AI</div>
              <div className="chat-status-text">
                <span className="online-indicator"></span>
                <span>Active • Case {patient.id}</span>
              </div>
            </div>
          </div>

          <div className="flex-align-gap">
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={handleResetChat}
              title="Reset conversation"
            >
              <RotateCcw size={15} />
            </button>
            <button
              className="btn btn-ghost btn-icon-sm"
              onClick={onClose}
              title="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="chat-messages-container">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`chat-bubble-row ${isBot ? 'bot-row' : 'user-row'}`}
              >
                {isBot && (
                  <div className="msg-avatar bot">
                    <Sparkles size={13} className="text-cyan" />
                  </div>
                )}

                <div className={`chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
                  <div className="bubble-text">
                    <FormattedMarkdown content={msg.text} />
                  </div>
                  <div className="bubble-footer">
                    <span className="bubble-time">{msg.timestamp}</span>
                    {isBot && (
                      <button
                        className="btn-copy-bubble"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check size={12} className="text-emerald" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="msg-avatar user">
                    <User size={14} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble-row bot-row animate-fade-scale">
              <div className="msg-avatar bot">
                <Sparkles size={14} className="text-cyan" />
              </div>
              <div className="chat-bubble bot-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="chat-chips-tray">
          <div className="chips-title-row">
            <Sparkles size={11} className="text-cyan" />
            <span className="chips-title">Suggested Inquiries</span>
          </div>
          <div className="chips-grid">
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="chip-pill-btn"
                onClick={() => handleSend(chip.label)}
                title={`Ask: ${chip.label}`}
              >
                <span className="chip-icon">{chip.icon}</span>
                <span className="chip-text">{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Bar */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder="Ask about EDV, ESV, LVEF, or segmentation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary btn-icon chat-send-btn"
            disabled={!inputValue.trim()}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
