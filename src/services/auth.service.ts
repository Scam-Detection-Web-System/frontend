import { apiFetch } from '@/lib/api'

// ===== Types =====
export interface UserResponse {
    userId: string
    username: string
    email: string
    gender: string
    role: string
    status: string
}

export interface AuthResponse {
    userResponse: UserResponse
    accessToken: string
    refreshToken: string
    authenticated: boolean
}

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

// ===== Auth Service =====
export const authService = {
    /**
     * POST /auth/signup
     * Đăng ký tài khoản mới. Backend gửi OTP qua email.
     */
    signup: (username: string, email: string, password: string, gender: string) =>
        apiFetch<ApiResponse<void>>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, gender }),
        }),

    /**
     * POST /auth/login
     * Đăng nhập, nhận accessToken + refreshToken.
     */
    signin: (email: string, password: string) =>
        apiFetch<ApiResponse<AuthResponse>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    /**
     * POST /auth/verify-email
     * Xác minh email bằng OTP sau khi đăng ký.
     */
    verifyEmail: (email: string, otp: string) =>
        apiFetch<ApiResponse<void>>('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        }),

    /**
     * POST /auth/resend-otp
     * Gửi lại OTP (đăng ký hoặc quên mật khẩu).
     */
    resendOtp: (email: string) =>
        apiFetch<ApiResponse<void>>('/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    /**
     * POST /auth/forgot-password
     * Gửi OTP để đặt lại mật khẩu.
     */
    forgotPassword: (email: string) =>
        apiFetch<ApiResponse<void>>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    /**
     * POST /auth/reset-password
     * Đặt lại mật khẩu bằng OTP.
     */
    resetPassword: (email: string, otp: string, newPassword: string, confirmNewPassword: string) =>
        apiFetch<ApiResponse<void>>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, otp, newPassword, confirmNewPassword }),
        }),

    /**
     * POST /auth/change-password
     * Đổi mật khẩu khi đã đăng nhập (yêu cầu Bearer token).
     */
    changePassword: (oldPassword: string, newPassword: string, confirmNewPassword: string) =>
        apiFetch<ApiResponse<void>>('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
        }),

    /**
     * POST /auth/refresh
     * Làm mới accessToken bằng refreshToken.
     */
    refreshToken: (refreshToken: string) =>
        apiFetch<ApiResponse<AuthResponse>>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        }),

    /**
     * POST /auth/logout
     * Vô hiệu hoá refreshToken, đăng xuất người dùng.
     */
    logout: (refreshToken: string) =>
        apiFetch<ApiResponse<void>>('/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        }),
}
