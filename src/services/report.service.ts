import { apiFetch } from '@/lib/api'

// ===== Types =====
export type ReportStatus = 'PENDING' | 'VALID' | 'INVALID' | 'RESOLVED'

export interface PhoneReportItem {
    reportId: string
    phoneNumber: string
    label: string | null
    content: string
    status: ReportStatus
    createdAt: string
    userId: string | null
    contactMethod?: string | null
    scamTechnique?: string | null
}

export interface GroupedPhoneReport {
    phoneNumber: string
    totalReports: number
    reports: PhoneReportItem[]
}

/** Matches backend PhoneReportGroupResponse schema */
export interface PhoneReportGroupResponse {
    phoneNumber: string
    phoneType: 'MOBILE' | 'LANDLINE' | 'HOTLINE' | null
    carrier: string | null
    area: string | null
    totalReports: number
    reports?: PhoneReportItem[] 
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
     * Lấy danh sách báo cáo nhóm theo số điện thoại (ADMIN/MANAGER).
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
     * GET /reports/groups (page 0, size 200)
     * Tìm PhoneReportGroupResponse theo số điện thoại cụ thể.
     * Trả về null nếu không tìm thấy hoặc lỗi auth.
     */
    getGroupByPhone: async (phoneNumber: string): Promise<PhoneReportGroupResponse | null> => {
        try {
            const res = await apiFetch<ApiResponse<PageGroupedReports>>('/reports/groups?page=0&size=200')
            if (!res?.data?.content) return null
            return res.data.content.find(g => g.phoneNumber === phoneNumber) ?? null
        } catch {
            return null
        }
    },

    /**
     * GET /reports/groups?status=PENDING
     * Lấy danh sách báo cáo PENDING cho Moderator duyệt.
     * Dùng cùng endpoint GET /reports/groups nhưng filter status=PENDING.
     */
    getModeratorPendingReports: (params?: { page?: number; size?: number }) => {
        const searchParams = new URLSearchParams()
        searchParams.set('status', 'PENDING')
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        return apiFetch<ApiResponse<PageGroupedReports>>(`/reports/groups?${searchParams.toString()}`)
    },

    /**
     * GET /reports/groups/hot
     * Lấy các report group có count > 5 (ADMIN/MANAGER).
     */
    getHotReports: (params?: GetReportsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.status) searchParams.set('status', params.status)
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageGroupedReports>>(`/reports/groups/hot${query ? `?${query}` : ''}`)
    },

    /**
     * GET /reports/{reportId}
     * Lấy chi tiết một báo cáo cụ thể.
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
