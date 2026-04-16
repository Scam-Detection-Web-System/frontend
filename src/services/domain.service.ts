import { apiFetch } from '@/lib/api'

// ===== Types =====

export interface DomainCheckRequest {
    domain: string
}

export interface DomainCheckResult {
    domain: string
    rootDomain: string
    riskScore: number
    riskLevel: string
    warnings: string[]
}

interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

// ===== Domain Service =====
export const domainService = {
    /**
     * POST /domains/check
     * Kiểm tra điểm rủi ro và mức độ nguy hiểm của một tên miền.
     * Không cần authentication.
     */
    checkDomain: (domain: string) =>
        apiFetch<ApiResponse<DomainCheckResult>>('/domains/check', {
            method: 'POST',
            body: JSON.stringify({ domain }),
        }),
}
