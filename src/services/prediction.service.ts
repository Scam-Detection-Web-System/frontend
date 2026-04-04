import { apiFetch } from '@/lib/api'

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface PredictionResult {
    score: number
    reason: string
    words: string[]
    toxic: boolean
}

export const predictionService = {
    /**
     * POST /predictions/predict
     * Gửi nội dung văn bản để AI phân tích mức độ lừa đảo.
     * Input: { "text": "..." } hoặc bất kỳ field nào backend yêu cầu.
     */
    predict: (input: Record<string, string>) =>
        apiFetch<ApiResponse<Record<string, PredictionResult>>>('/predictions/predict', {
            method: 'POST',
            body: JSON.stringify(input),
        }),
}
