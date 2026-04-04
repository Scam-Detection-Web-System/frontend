import { apiFetch } from '@/lib/api'

// ===== Types (matches Swagger exactly) =====
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface CommentResponse {
    commentId: string
    userId: string
    username?: string
    assessmentId: string
    scamLabel: string | null
    content: string
    createdAt: string
}

export interface AssessmentResponse {
    assessmentId: string
    userId: string | null
    phoneNumber: string
    phoneType: string | null   // MOBILE | LANDLINE | HOTLINE
    carrier: string | null
    area: string | null
    label: string | null
    riskLevel: string | null
    review: string | null
    comments: CommentResponse[]
}

export interface PageAssessmentResponse {
    totalElements: number
    totalPages: number
    content: AssessmentResponse[]
    size: number
    number: number
    numberOfElements: number
}

export interface AssessmentCreationRequest {
    phoneNumber: string
    label?: string
    riskLevel?: string
    review?: string
}

export interface AssessmentUpdateRequest {
    phoneNumber?: string
    phoneType?: string
    carrier?: string
    area?: string
    label?: string
    riskLevel?: string
    review?: string
}

export interface GetAssessmentsParams {
    page?: number
    size?: number
}

interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

// ===== Assessment Service =====
export const assessmentService = {
    /**
     * GET /assessments/{assessmentId}
     * Lấy assessment theo ID.
     */
    getAssessmentById: (assessmentId: string) =>
        apiFetch<ApiResponse<AssessmentResponse>>(`/assessments/${assessmentId}`),

    /**
     * PUT /assessments/{assessmentId}
     * Cập nhật assessment (Manager).
     */
    updateAssessment: (assessmentId: string, data: AssessmentUpdateRequest) =>
        apiFetch<ApiResponse<AssessmentResponse>>(`/assessments/${assessmentId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * POST /assessments
     * Tạo bài đánh giá mới (Manager).
     */
    createAssessment: (data: AssessmentCreationRequest) =>
        apiFetch<ApiResponse<AssessmentResponse>>('/assessments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * GET /assessments/phone-number?phoneNumber=xxx
     * Tìm kiếm assessment theo số điện thoại.
     * Dùng để hiển thị đánh giá chính thức trong ScamChecker.
     */
    searchByPhoneNumber: (phoneNumber: string) =>
        apiFetch<ApiResponse<AssessmentResponse>>(
            `/assessments/phone-number?phoneNumber=${encodeURIComponent(phoneNumber)}`
        ),

    /**
     * GET /assessments/page
     * Lấy danh sách assessment có phân trang (Manager).
     */
    getAssessmentsPage: (params?: GetAssessmentsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageAssessmentResponse>>(
            `/assessments/page${query ? `?${query}` : ''}`
        )
    },
}
