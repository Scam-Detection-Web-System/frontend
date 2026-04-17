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

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface UserCreationRequest {
    username: string
    email: string
    password: string
    gender: string
}

export interface UserUpdateRequest {
    username?: string
    gender?: string
    status?: string
}

export interface GetUsersParams {
    page?: number
    size?: number
}

// ===== User Service =====
export const userService = {
    /**
     * GET /users/{userId}
     * Lấy thông tin chi tiết một người dùng.
     */
    getUserById: (userId: string) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/${userId}`),

    /**
     * PUT /users/{userId}
     * Cập nhật thông tin người dùng (username, gender, v.v.)
     */
    updateUser: (userId: string, data: UserUpdateRequest) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /users/status/{userId}
     * Cập nhật trạng thái người dùng (Admin/Manager)
     */
    updateUserStatus: (userId: string, status: string) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/status/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ userStatus: status })
        }),

    /**
     * GET /users
     * Lấy danh sách tất cả người dùng (Admin/Manager).
     */
    getAllUsers: (params?: GetUsersParams) => {
        const searchParams = new URLSearchParams()
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<UserResponse[]>>(`/users${query ? `?${query}` : ''}`)
    },

    /**
     * GET /users/moderator
     * Lấy danh sách moderator (Admin).
     */
    getAllModerators: () => apiFetch<ApiResponse<UserResponse[]>>('/users/moderator'),

    /**
     * GET /users/manager
     * Lấy danh sách manager (Admin only).
     */
    getAllManagers: () => apiFetch<ApiResponse<UserResponse[]>>('/users/manager'),

    /**
     * POST /users
     * Tạo người dùng mới (Admin/Manager).
     */
    createUser: (data: UserCreationRequest) =>
        apiFetch<ApiResponse<UserResponse>>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * POST /users/manager
     * Tạo tài khoản Manager mới (Admin).
     */
    createManager: (data: UserCreationRequest) =>
        apiFetch<ApiResponse<UserResponse>>('/users/manager', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * POST /users/moderator
     * Tạo tài khoản Moderator mới (Admin/Manager).
     */
    createModerator: (data: UserCreationRequest) =>
        apiFetch<ApiResponse<UserResponse>>('/users/moderator', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * PUT /users/{userId}
     * Thay đổi trạng thái người dùng: ACTIVE | BLOCKED | ...
     */
    changeStatus: (userId: string, status: string) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),

    /** Chặn người dùng */
    blockUser: (userId: string) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'BLOCKED' }),
        }),

    /** Kích hoạt lại người dùng */
    activateUser: (userId: string) =>
        apiFetch<ApiResponse<UserResponse>>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'ACTIVE' }),
        }),
}
