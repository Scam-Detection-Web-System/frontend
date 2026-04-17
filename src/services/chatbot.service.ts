import { apiFetch } from '@/lib/api'

// ===== Types =====
export interface ChatbotRequest {
    text: string
    chatId?: string
}

export interface AIResponse {
    answer: string
}

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

// ===== Chatbot Service =====
export const chatbotService = {
    /**
     * POST /chatbot/ask
     * Gửi câu hỏi tới AI chatbot và nhận câu trả lời.
     * @param text - Nội dung câu hỏi
     * @param chatId - Session chat ID (optional, để giữ context)
     */
    ask: (text: string, chatId?: string, image?: File | null) => {
        const formData = new FormData();
        formData.append("text", text);
        if (chatId) formData.append("chatId", chatId);
        if (image) formData.append("image", image);

        return apiFetch<ApiResponse<AIResponse>>('/chatbot/ask', {
            method: 'POST',
            body: formData,
        });
    },
}
