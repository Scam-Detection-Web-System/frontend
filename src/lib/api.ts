export const BASE_URL = '/api'

/**
 * Hàm gọi API chung tự động đính kèm token.
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('auth_token')
    
    const headers = new Headers(options.headers || {})
    // Set default content type
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }
    // Attach token if available
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        let errorMsg = 'Lỗi kết nối đến máy chủ'
        try {
            const errorData = await res.json()
            errorMsg = errorData.message || errorMsg
        } catch (e) {
            // Fallback to text or status text if not JSON
            const text = await res.text().catch(() => '')
            if (text) errorMsg = text
            else errorMsg = res.statusText || errorMsg
        }
        throw new Error(errorMsg)
    }

    // Check if the response is empty (e.g. 204 No Content)
    const contentType = res.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
        return res.json()
    }
    
    return res.text() as unknown as T
}
