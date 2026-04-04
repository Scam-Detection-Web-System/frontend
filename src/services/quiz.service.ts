import { apiFetch } from '@/lib/api'

// ===== Types =====
export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface QuizTopicResponse {
    topicId: string
    topicName: string
    description: string
}

export interface QuizTopicCreationRequest {
    topicName: string
    description: string
}

export interface QuizTopicUpdateRequest {
    topicName?: string
    description?: string
}

export interface QuestionResponse {
    questionId: string
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
}

export interface QuizDetailResponse {
    topicId: string
    topicName: string
    description: string
    questions: QuestionResponse[]
}

export interface QuestionCreationRequest {
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
}

export interface QuestionUpdateRequest {
    content?: string
    optionA?: string
    optionB?: string
    optionC?: string
    optionD?: string
    correctAnswer?: string
}

export interface QuizAnswerRequest {
    questionId: string
    selectedAnswer: string
}

export interface QuizSubmitRequest {
    topicId: string
    answers: QuizAnswerRequest[]
}

export interface QuestionResultResponse {
    questionId: string
    content: string
    optionA: string
    optionB: string
    optionC: string
    optionD: string
    correctAnswer: string
    selectedAnswer: string
    correct: boolean
}

export interface QuizSubmitResponse {
    topicName: string
    score: number
    totalQuestions: number
    correctAnswers: number
    message: string
    results: QuestionResultResponse[]
}

// ===== Quiz Service =====
export const quizService = {
    /**
     * GET /quiz-topics
     * Lấy danh sách các quiz topic.
     */
    getAllTopics: () =>
        apiFetch<ApiResponse<QuizTopicResponse[]>>('/quiz-topics'),

    /**
     * GET /quiz-topics/{topicId}
     * Lấy chi tiết topic kèm danh sách câu hỏi.
     */
    getTopicWithQuestions: (topicId: string) =>
        apiFetch<ApiResponse<QuizDetailResponse>>(`/quiz-topics/${topicId}`),

    /**
     * POST /quiz-topics
     * Tạo mới topic.
     */
    createTopic: (data: QuizTopicCreationRequest) =>
        apiFetch<ApiResponse<QuizTopicResponse>>('/quiz-topics', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /quiz-topics/{topicId}
     * Cập nhật topic.
     */
    updateTopic: (topicId: string, data: QuizTopicUpdateRequest) =>
        apiFetch<ApiResponse<QuizTopicResponse>>(`/quiz-topics/${topicId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * POST /questions/topic/{topicId}
     * Thêm câu hỏi vào topic.
     */
    createQuestion: (topicId: string, data: QuestionCreationRequest) =>
        apiFetch<ApiResponse<QuestionResponse>>(`/questions/topic/${topicId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /questions/{questionId}
     * Cập nhật câu hỏi.
     */
    updateQuestion: (questionId: string, data: QuestionUpdateRequest) =>
        apiFetch<ApiResponse<QuestionResponse>>(`/questions/${questionId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * POST /quiz/submit
     * Nộp bài quiz và nhận kết quả.
     */
    submitQuiz: (data: QuizSubmitRequest) =>
        apiFetch<ApiResponse<QuizSubmitResponse>>('/quiz/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
}
