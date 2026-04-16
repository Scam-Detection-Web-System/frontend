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
}
