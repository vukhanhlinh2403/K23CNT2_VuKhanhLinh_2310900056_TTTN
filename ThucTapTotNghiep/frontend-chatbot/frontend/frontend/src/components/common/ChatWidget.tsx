import { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { chatbotService } from '../../services/chatbot.service';
import type { ChatMessage } from '../../types';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'widget-welcome',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      text: 'Chào bạn! Em là Chatbot AI Tuyển Sinh 2026. Bạn cần hỏi về điểm chuẩn, học phí hay hồ sơ xét tuyển ngành nào ạ?',
      suggestedQuestions: ['Điểm chuẩn CNTT?', 'Học phí năm 2026', 'Hồ sơ xét học bạ'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `uw-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const botReply = await chatbotService.processUserMessage(text);
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Rất tiếc kết nối bị gián đoạn. Vui lòng thử lại sau giây lát!',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-full shadow-2xl transition-transform hover:scale-105 cursor-pointer"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">Hỏi Chatbot AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Chat Popup Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[390px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">Trợ Lý AI Tuyển Sinh</h4>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-200" /> Trực tuyến 24/7
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[80%] space-y-1.5">
                  <div
                    className={`p-3 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 shadow-2xs rounded-tl-xs whitespace-pre-line'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.suggestedQuestions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="text-[11px] bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full cursor-pointer transition font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>AI đang suy nghĩ...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl cursor-pointer transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
