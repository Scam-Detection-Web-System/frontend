import { apiFetch } from '@/lib/api'

// ===== Types =====
export type ReportStatus = 'PENDING' | 'VALID' | 'INVALID' | 'RESOLVED'

/** Kết quả dự đoán AI từ model nhận dạng lừa đảo */
export interface PredictionResult {
    score: number
    reason: string
    words: string[]
    toxic: boolean
}

/**
 * Matches backend PhoneReportResponse schema (returned by GET /reports/{reportId})
 * Có đầy đủ thông tin hơn PhoneReportGroupResponse
 */
export interface PhoneReportItem {
    reportId: string
    userId: string | null
    phoneNumber: string
    phoneType?: string | null
    carrier?: string | null
    area?: string | null
    label: string | null
    contactMethod?: string | null
    scamTechnique?: string | null
    content: string
    status: ReportStatus
    createdAt: string
    predictionResult?: PredictionResult | null
}

export interface GroupedPhoneReport {
    phoneNumber: string
    phoneType?: 'MOBILE' | 'LANDLINE' | 'HOTLINE' | null
    carrier?: string | null
    area?: string | null
    totalReports: number
    reports: PhoneReportItem[]
}


export interface PhoneReportFilterResponse {
    phoneNumber: string
    phoneType?: 'MOBILE' | 'LANDLINE' | 'HOTLINE' | null
    carrier?: string | null
    area?: string | null
    totalReports: string | number
    phoneReports: PhoneReportItem[]
}

/** Matches backend PhoneReportGroupResponse schema (returned by /reports/groups) */
export interface PhoneReportGroupResponse {
    phoneNumber: string
    phoneType: 'MOBILE' | 'LANDLINE' | 'HOTLINE' | null
    carrier: string | null
    area: string | null
    totalReports: number
}

export interface PageGroupedReports {
    totalElements: number
    totalPages: number
    content: PhoneReportGroupResponse[]
    size: number
    number: number
    numberOfElements: number
}

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface PhoneReportRequest {
    phoneNumber: string
    label?: string
    content: string
    contactMethod?: string
    scamTechnique?: string
}

/** Matches backend UserReportResponse schema (returned by GET /reports/my-reports) */
export interface UserReportResponse {
    reportId: string
    phoneNumber: string
    status: ReportStatus
    message: string
    createdAt: string
}

export interface ReportUpdateStatusRequest {
    reportStatus: ReportStatus
}

export interface GetReportsParams {
    status?: ReportStatus
    page?: number
    size?: number
}

// ===== Report Service =====
export const reportService = {
    /**
     * GET /reports/groups
     * Lấy danh sách nhóm báo cáo theo SĐT (MODERATOR).
     * Response: PhoneReportGroupResponse[] - chỉ có metadata, không có danh sách reportId
     */
    getGroupedReports: (params?: GetReportsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.status) searchParams.set('status', params.status)
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageGroupedReports>>(`/reports/groups${query ? `?${query}` : ''}`)
    },

    /**
     * GET /reports/groups?status=PENDING
     * Lấy danh sách báo cáo PENDING cho Moderator duyệt.
     */
    getModeratorPendingReports: (params?: { page?: number; size?: number }) => {
        const searchParams = new URLSearchParams()
        searchParams.set('status', 'PENDING')
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        return apiFetch<ApiResponse<PageGroupedReports>>(`/reports/groups?${searchParams.toString()}`)
    },

    /**
     * GET /reports/status
     * Lấy danh sách báo cáo chi tiết theo status (Dành cho chức năng mở rộng danh sách)
     */
    getReportByStatus: (status: ReportStatus) => {
        return apiFetch<ApiResponse<PhoneReportFilterResponse[]>>(`/reports/status?status=${status}`)
    },

    /**
     * GET /reports/groups/hot
     * Lấy các report group có count > 5 (ADMIN/MANAGER).
     * Chỉ filter VALID theo backend swagger.
     */
    getHotReports: (params?: GetReportsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageGroupedReports>>(`/reports/groups/hot${query ? `?${query}` : ''}`)
    },

    /**
     * GET /reports/{reportId}
     * Lấy chi tiết đầy đủ một báo cáo theo ID.
     * Trả về PhoneReportItem bao gồm predictionResult, phoneType, carrier, area.
     */
    getReportById: (reportId: string) =>
        apiFetch<ApiResponse<PhoneReportItem>>(`/reports/${reportId}`),

    /**
     * POST /reports
     * Nộp báo cáo lừa đảo mới (Authenticated user).
     */
    submitReport: (data: PhoneReportRequest) =>
        apiFetch<ApiResponse<PhoneReportItem>>('/reports', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * GET /reports/my-reports
     * Lấy danh sách báo cáo đã gửi của user hiện tại (cần đăng nhập).
     * Dùng trong trang tài khoản cá nhân.
     */
    getMyReports: () =>
        apiFetch<ApiResponse<UserReportResponse[]>>('/reports/my-reports'),

    /**
     * PUT /reports/status/{reportId}
     * Cập nhật trạng thái một báo cáo.
     * Moderator: PENDING → VALID | INVALID
     * Manager/Admin: VALID → RESOLVED
     */
    updateReportStatus: (reportId: string, reportStatus: ReportStatus) =>
        apiFetch<ApiResponse<PhoneReportItem>>(`/reports/status/${reportId}`, {
            method: 'PUT',
            body: JSON.stringify({ reportStatus }),
        }),
}
