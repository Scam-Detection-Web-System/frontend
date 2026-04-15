import { useState, useRef, useEffect } from "react"
import { MessageCircle, Bot, X, Send, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { chatbotService } from "@/services/chatbot.service"

interface Message {
    id: string
    role: "user" | "bot"
    content: string
    timestamp: Date
}

export function ChatbotButton() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "bot",
            content: "Xin chào! Tôi là AntiScam AI 👋\n\nTôi có thể giúp bạn:\n• Kiểm tra xem một số điện thoại/tình huống có phải lừa đảo không\n• Tư vấn cách xử lý khi bị lừa đảo\n• Giải thích các chiêu trò lừa đảo phổ biến\n\nHãy nhập câu hỏi của bạn!",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [chatId] = useState(() => crypto.randomUUID())
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    const sendMessage = async () => {
        const text = input.trim()
        if (!text || loading) return

        const userMsg: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            timestamp: new Date(),
        }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await chatbotService.ask(text, chatId)
            const botMsg: Message = {
                id: crypto.randomUUID(),
                role: "bot",
                content: res.data?.answer || "Xin lỗi, tôi không thể xử lý yêu cầu lúc này.",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, botMsg])
        } catch {
            const errorMsg: Message = {
                id: crypto.randomUUID(),
                role: "bot",
                content: "⚠️ Không thể kết nối đến AI. Vui lòng thử lại sau.",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const resetChat = () => {
        setMessages([{
            id: "welcome",
            role: "bot",
            content: "Xin chào! Tôi là AntiScam AI 👋\n\nTôi có thể giúp bạn:\n• Kiểm tra xem một số điện thoại/tình huống có phải lừa đảo không\n• Tư vấn cách xử lý khi bị lừa đảo\n• Giải thích các chiêu trò lừa đảo phổ biến\n\nHãy nhập câu hỏi của bạn!",
            timestamp: new Date(),
        }])
    }

    return (
        <>
            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
                    style={{ height: "520px" }}>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">AntiScam AI</p>
                                <p className="text-xs text-blue-100">Trợ lý chống lừa đảo</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={resetChat}
                                className="rounded-full p-1.5 text-white/70 hover:bg-white/20 transition-colors"
                                title="Bắt đầu lại"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-full p-1.5 text-white/70 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "bot" && (
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mr-2 mt-0.5">
                                        <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                                        msg.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mr-2 mt-0.5">
                                    <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập câu hỏi... (Enter để gửi)"
                                rows={1}
                                className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 max-h-28 overflow-y-auto"
                                style={{ minHeight: "42px" }}
                            />
                            <Button
                                size="icon"
                                className="h-[42px] w-[42px] shrink-0 bg-blue-600 hover:bg-blue-700 rounded-xl"
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                id="chatbot-send"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <p className="mt-1.5 text-center text-[10px] text-slate-400">
                            AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-2">
                {!open && (
                    <div className="absolute right-full mr-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1 pointer-events-none whitespace-nowrap hidden sm:block">
                        <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 relative flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-500" />
                            <span>Chat với AntiScam AI</span>
                            <div className="absolute top-1/2 -translate-y-1/2 -right-2 border-8 border-transparent border-l-white dark:border-l-slate-800" />
                        </div>
                    </div>
                )}
                <Button
                    size="icon"
                    onClick={() => setOpen(o => !o)}
                    className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgb(37,99,235,0.4)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.6)] border-4 border-white dark:border-slate-900"
                    id="chatbot-toggle"
                >
                    {open ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <MessageCircle className="h-6 w-6 text-white fill-white/20" />
                    )}
                    <span className="sr-only">{open ? "Đóng" : "Mở"} AntiScam AI</span>
                </Button>
            </div>
        </>
    )
}
