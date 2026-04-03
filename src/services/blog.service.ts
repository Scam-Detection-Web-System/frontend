import { apiFetch } from '@/lib/api'

// ===== Types =====
export interface BlogResponse {
    userId: string
    blogId: string
    title: string
    label: string
    snippet: string
    content: string
    imageUrl: string
    createdAt: string
}

export interface ApiResponse<T> {
    code: number
    message: string
    success: boolean
    data: T
    timestamp: string
}

export interface PageBlogResponse {
    totalElements: number
    totalPages: number
    content: BlogResponse[]
    size: number
    number: number
    numberOfElements: number
}

export interface GetBlogsParams {
    keyword?: string
    page?: number
    size?: number
}

export interface BlogCreationData {
    title: string
    label: string
    snippet: string
    content: string
}

// ===== Blog Service =====
export const blogService = {
    /**
     * GET /blogs
     * Lấy danh sách blog có phân trang và tìm kiếm theo keyword.
     */
    getBlogs: (params?: GetBlogsParams) => {
        const searchParams = new URLSearchParams()
        if (params?.keyword) searchParams.set('keyword', params.keyword)
        if (params?.page !== undefined) searchParams.set('page', String(params.page))
        if (params?.size !== undefined) searchParams.set('size', String(params.size))
        const query = searchParams.toString()
        return apiFetch<ApiResponse<PageBlogResponse>>(`/blogs${query ? `?${query}` : ''}`)
    },

    /**
     * GET /blogs/{blogId}
     * Lấy thông tin chi tiết một bài blog.
     */
    getBlogById: (blogId: string) =>
        apiFetch<ApiResponse<BlogResponse>>(`/blogs/${blogId}`),

    /**
     * POST /blogs
     * Tạo bài blog mới (multipart/form-data: data + image).
     */
    createBlog: (data: BlogCreationData, image: File) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        formData.append('image', image)
        return apiFetch<ApiResponse<BlogResponse>>('/blogs', {
            method: 'POST',
            body: formData,
        })
    },

    /**
     * PUT /blogs/{blogId}
     * Cập nhật bài blog (multipart/form-data: data + image tùy chọn).
     */
    updateBlog: (blogId: string, data: Partial<BlogCreationData>, image?: File) => {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (image) formData.append('image', image)
        return apiFetch<ApiResponse<BlogResponse>>(`/blogs/${blogId}`, {
            method: 'PUT',
            body: formData,
        })
    },
}
