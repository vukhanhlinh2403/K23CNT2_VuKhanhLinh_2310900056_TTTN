import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  User,
  Phone,
  BookOpen,
  HelpCircle,
  Clock
} from 'lucide-react';
import { chatbotService } from '../../services/chatbot.service';
import { UNIVERSITY_INFO, INITIAL_COURSES } from '../../constants/adminssion';
import type { ChatMessage } from '../../types';

function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      text: `Xin chào quý phụ huynh và các bạn thí sinh! 👋\n\nEm là **Trợ lý AI Tư vấn Tuyển sinh Đại học** chính thức của ${UNIVERSITY_INFO.name}.\n\nEm có thể hỗ trợ giải đáp tức thì về:\n• Điểm chuẩn & chỉ tiêu xét tuyển các ngành 2026\n• Mức học phí từng học kỳ & lộ trình đóng\n• Chính sách học bổng tài năng đến 100%\n• Hướng dẫn hồ sơ xét học bạ THPT & thi ĐGNL\n\nBạn có thể chọn các câu hỏi gợi ý bên dưới hoặc gõ trực tiếp câu hỏi nhé!`,
      suggestedQuestions: [
        'Học phí ngành CNTT & AI?',
        'Điểm chuẩn xét tuyển năm ngoái?',
        'Chính sách học bổng 2026',
        'Hồ sơ xét tuyển học bạ cần gì?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.processUserMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Rất tiếc đã xảy ra lỗi kết nối. Bạn vui lòng liên hệ hotline 1900 6868 để được hỗ trợ trực tiếp!',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Chatbox AI Hỗ Trợ Tuyển Sinh</h1>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ONLINE 24/7
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              Hệ thống trả lời tự động ngôn ngữ tự nhiên về ngành học, học phí, điểm chuẩn & xét tuyển đại học
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold text-white transition self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Làm mới đoạn hội thoại</span>
        </button>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Chatbox */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                  <div
                    className={`rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 shadow-xs rounded-tl-xs whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggestion buttons */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="text-xs bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-full border border-blue-200/80 transition-colors shadow-2xs text-left cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Cards preview if any */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.cards.map((card, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
                          <h5 className="font-bold text-sm text-blue-900">{card.title}</h5>
                          <p className="text-xs text-gray-500 mb-2">{card.description}</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {card.details.map((d, dIdx) => (
                              <li key={dIdx}>• {d}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] text-gray-400 flex items-center gap-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-gray-400 text-xs italic">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-gray-200/80 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-gray-500 ml-1">AI đang tra cứu dữ liệu tuyển sinh...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-200/80">
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
                placeholder="Đặt câu hỏi về ngành đào tạo, điểm chuẩn, hồ sơ, học bổng..."
                className="flex-1 bg-gray-50 border border-gray-200 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer font-medium text-xs sm:text-sm"
              >
                <span>Gửi</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Hệ thống tự động thu thập SĐT để cán bộ tuyển sinh liên hệ
              </span>
              <span>Hotline: {UNIVERSITY_INFO.hotline}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Admission Prompts & Guide */}
        <div className="space-y-5">
          {/* Quick Major Inquiries */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Tra Cứu Ngành Hot</span>
            </div>
            <div className="space-y-2">
              {INITIAL_COURSES.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSend(`Thông tin tuyển sinh ngành ${c.name}`)}
                  className="w-full text-left p-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-600">
                      {c.name}
                    </p>
                    <span className="text-[10px] text-gray-400">Điểm chuẩn: {c.previousCutoffScore}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Common Topics */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Chủ Đề Phổ Biến</span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSend('Học phí của trường năm 2026 là bao nhiêu?')}
                className="text-left text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 p-2 rounded-lg transition text-left cursor-pointer"
              >
                💰 Học phí và lộ trình đóng
              </button>
              <button
                type="button"
                onClick={() => handleSend('Chính sách học bổng dành cho tân sinh viên')}
                className="text-left text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 p-2 rounded-lg transition text-left cursor-pointer"
              >
                🏆 Học bổng 30 tỷ đồng năm 2026
              </button>
              <button
                type="button"
                onClick={() => handleSend('Hồ sơ xét tuyển học bạ THPT cần chuẩn bị gì?')}
                className="text-left text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 p-2 rounded-lg transition text-left cursor-pointer"
              >
                📑 Thủ tục nộp hồ sơ học bạ
              </button>
              <button
                type="button"
                onClick={() => handleSend('Ký túc xá và chỗ ở cho sinh viên ngoại tỉnh')}
                className="text-left text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 p-2 rounded-lg transition text-left cursor-pointer"
              >
                🏢 Ký túc xá & đời sống sinh viên
              </button>
            </div>
          </div>

          {/* Admission Contact Hotline */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider mb-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Cần Tư Vấn Trực Tiếp?</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Bạn có thể để lại số điện thoại trong khung chat để cán bộ tư vấn gọi lại miễn phí!
            </p>
            <div className="text-xs font-bold text-blue-700">
              Hotline: {UNIVERSITY_INFO.hotline}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              Email: {UNIVERSITY_INFO.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;
