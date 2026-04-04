import { MessageCircle, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatbotButton() {
    return (
        <a
            href="https://t.me/antiscamaws_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
        >
            <div className="absolute right-full mr-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1 pointer-events-none whitespace-nowrap hidden sm:block">
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 relative flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span>Chat với AntiScam Bot</span>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-2 border-8 border-transparent border-l-white dark:border-l-slate-800" />
                </div>
            </div>
            
            <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-[#0088cc] hover:bg-[#0077b3] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgb(0,136,204,0.3)] hover:shadow-[0_8px_30px_rgb(0,136,204,0.5)] border-4 border-white dark:border-slate-900"
            >
                <MessageCircle className="h-6 w-6 text-white fill-white/20" />
                <span className="sr-only">Mở Telegram Bot</span>
            </Button>
        </a>
    )
}
