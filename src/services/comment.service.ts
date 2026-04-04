import { apiFetch } from '@/lib/api'

// ===== Types =====
export interface CommentResponse {
    commentId: string
    content: string
    userId: string
    username: string
    assessmentId: string
    createdAt: string
}

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface PageCommentResponse {
    totalElements: number
    totalPages: number
    content: CommentResponse[]
    size: number
    number: number
    numberOfElements: number
}

export interface CommentCreationRequest {
    scamLabel?: string | null
    content: string
}

export interface GetCommentsParams {
    page?: number
    size?: number
}

// ===== Comment Service =====
export const commentService = {
    /**
     * GET /comments/assessment/{assessmentId}
     * Lấy danh sách comment theo assessment ID (phân trang).
     */
    getCommentsByAssessment: (assessmentId: string, params?: GetCommentsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageCommentResponse>>(
            `/comments/assessment/${assessmentId}${query ? `?${query}` : ''}`
        )
    },

    /**
     * POST /comments/assessment/{assessmentId}
     * Tạo comment cho một bài đánh giá (Authenticated user).
     */
    createComment: (assessmentId: string, data: CommentCreationRequest) =>
        apiFetch<ApiResponse<CommentResponse>>(`/comments/assessment/${assessmentId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),
}
