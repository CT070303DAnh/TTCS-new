import { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faXmark, 
    faRobot, 
    faCommentDots, 
    faUser,
    faStethoscope 
} from '@fortawesome/free-solid-svg-icons';

type Msg = { sender: 'user' | 'bot'; text: string };

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<Msg[]>([]);
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs, loading, open]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        
        setLogs((l) => [...l, { sender: 'user', text }]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatWithBot(text);
            const botText =
                res?.answer ||
                res?.output?.answer ||
                (typeof res === 'string' ? res : JSON.stringify(res));
            
            setLogs((l) => [...l, { sender: 'bot', text: botText }]);
        } catch (e: any) {
            setLogs((l) => [...l, { sender: 'bot', text: "Xin lỗi, tôi đang gặp sự cố kết nối." }]);
        } finally {
            setLoading(false);
        }
    };

    // --- HÀM XỬ LÝ HIỂN THỊ VĂN BẢN (MỚI) ---
    // Hàm này giúp in đậm chữ trong cặp dấu **...** và giữ nguyên xuống dòng
    const formatMessage = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
            <div className={`
                transition-all duration-300 ease-in-out origin-bottom-right
                ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'}
                w-[380px] h-[550px] max-w-[calc(100vw-2rem)] max-h-[80vh]
                bg-white shadow-2xl rounded-2xl border border-gray-100 flex flex-col overflow-hidden
            `}>
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 flex items-center justify-between text-white shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <FontAwesomeIcon icon={faStethoscope} className="text-lg" />
                        </div>
                        <div>
                            <div className="font-bold text-base">Trợ lý Y tế AI</div>
                            <div className="text-xs text-blue-100 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Luôn sẵn sàng
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 scroll-smooth">
                    {logs.length === 0 && (
                        <div className="text-center mt-8 mb-4 space-y-3 opacity-80">
                            <div className="w-16 h-16 bg-blue-100 text-primary-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                                <FontAwesomeIcon icon={faRobot} />
                            </div>
                            <div className="text-gray-500 text-sm px-6">
                                Xin chào! Tôi có thể giúp bạn giải đáp thắc mắc về sức khỏe.
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {logs.map((m, i) => (
                            <div key={i} className={`flex items-end gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white
                                    ${m.sender === 'user' ? 'bg-gray-400' : 'bg-primary-600'}
                                `}>
                                    <FontAwesomeIcon icon={m.sender === 'user' ? faUser : faRobot} />
                                </div>

                                {/* Bubble Chat - ĐÃ SỬA: thêm class whitespace-pre-wrap */}
                                <div className={`
                                    max-w-[85%] px-4 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap
                                    ${m.sender === 'user' 
                                        ? 'bg-primary-600 text-white rounded-2xl rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'}
                                `}>
                                    {/* Dùng hàm formatMessage để hiển thị */}
                                    {formatMessage(m.text)}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 text-xs text-white">
                                    <FontAwesomeIcon icon={faRobot} />
                                </div>
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-center bg-gray-100 rounded-full px-2 py-1.5 border border-transparent focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <input
                            className="flex-1 bg-transparent px-3 py-1 text-sm outline-none text-gray-700 placeholder-gray-400"
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            disabled={loading}
                        />
                        <button
                            onClick={send}
                            disabled={loading || !input.trim()}
                            className={`
                                w-9 h-9 rounded-full flex items-center justify-center transition-all
                                ${input.trim() && !loading 
                                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md transform hover:scale-105 active:scale-95' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                            `}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-sm ml-[-2px] mt-[1px]" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setOpen(!open)}
                className={`
                    group w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110
                    ${open ? 'bg-gray-200 text-gray-600 rotate-90' : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-primary-500/50'}
                `}
            >
                {open ? (
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                ) : (
                    <>
                        <FontAwesomeIcon icon={faCommentDots} className="text-2xl" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}