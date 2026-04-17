import { apiFetch } from '@/lib/api'

// ===== Types =====

export interface TopPhoneStatItem {
    phoneNumber: string
    totalReports: number
    lastReported: string
}

export interface OverviewStats {
    totalReports: number
    reportsToday: number
    totalAssessments: number
    totalUsers: number
}

export interface ReportStatusStats {
    totalReports: number
    pendingReports: number
    validReports: number
    invalidReports: number
}

export interface AssessmentStats {
    totalAssessments: number
    totalReports: number
    pendingReports: number
}

export interface LabelStatItem {
    label: string
    count: number
}

interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

// ===== Dashboard Service =====
export const dashboardService = {
    /**
     * GET /dashboards/top/stats
     * Lấy danh sách top các số điện thoại bị báo cáo nhiều nhất.
     * Không cần authentication.
     */
    getTopPhoneStats: () =>
        apiFetch<ApiResponse<TopPhoneStatItem[]>>('/reports/top'),

    /**
     * GET /dashboards/overview/stats
     * Lấy tổng quan thống kê hệ thống (tổng báo cáo, hôm nay, assessments, users).
     * Không cần authentication.
     */
    getOverviewStats: () =>
        apiFetch<ApiResponse<OverviewStats>>('/dashboards/overview/stats'),

    /**
     * GET /dashboards/status/stats
     * Thống kê báo cáo theo trạng thái (Đã duyệt, chờ duyệt, từ chối)
     */
    getReportStatusStats: () =>
        apiFetch<ApiResponse<ReportStatusStats>>('/dashboards/status/stats'),

    /**
     * GET /dashboards/label/stats
     * Thống kê số lượng báo cáo theo loại hình lừa đảo (label)
     */
    getLabelStats: () =>
        apiFetch<ApiResponse<LabelStatItem[]>>('/dashboards/label/stats'),

    /**
     * GET /dashboards/assessment/stats
     * Thống kê số liệu đánh giá cho manager
     */
    getAssessmentStats: () =>
        apiFetch<ApiResponse<AssessmentStats>>('/dashboards/assessment/stats'),
}
