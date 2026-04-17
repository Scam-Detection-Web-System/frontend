import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, UserResponse, AuthResponse } from '@/services/auth.service'
import { userService } from '@/services/user.service'

export interface User {
    id: string
    email: string
    name: string
    isAdmin: boolean
    role: string
    avatar?: string // base64 data URL
    gender?: string
}

export interface LoginSession {
    id: string
    device: string
    browser: string
    os: string
    location: string // Tỉnh/Thành phố
    ip: string
    time: string
    isCurrent: boolean
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, username: string, gender: string) => Promise<void>
    logout: () => void
    updateProfile: (data: { name?: string; oldPassword?: string; newPassword?: string; confirmPassword?: string; avatar?: string }) => Promise<void>
    isAuthenticated: boolean
    isAdmin: boolean
    isLoggingOut: boolean
    loginSessions: LoginSession[]
}

// Mock login sessions
const mockLoginSessions: LoginSession[] = [
    {
        id: 'sess-001',
        device: 'Desktop',
        browser: 'Chrome 122',
        os: 'Windows 11',
        location: 'Hà Nội',
        ip: '113.161.xx.xx',
        time: '10/03/2026, 10:44',
        isCurrent: true,
    },
    {
        id: 'sess-002',
        device: 'Mobile',
        browser: 'Safari 17',
        os: 'iOS 18',
        location: 'TP. Hồ Chí Minh',
        ip: '171.252.xx.xx',
        time: '09/03/2026, 18:30',
        isCurrent: false,
    },
    {
        id: 'sess-003',
        device: 'Desktop',
        browser: 'Firefox 124',
        os: 'macOS Sonoma',
        location: 'Đà Nẵng',
        ip: '42.116.xx.xx',
        time: '08/03/2026, 14:15',
        isCurrent: false,
    },
    {
        id: 'sess-004',
        device: 'Tablet',
        browser: 'Chrome 122',
        os: 'Android 14',
        location: 'Cần Thơ',
        ip: '123.20.xx.xx',
        time: '07/03/2026, 09:22',
        isCurrent: false,
    },
    {
        id: 'sess-005',
        device: 'Desktop',
        browser: 'Edge 122',
        os: 'Windows 10',
        location: 'Hải Phòng',
        ip: '14.177.xx.xx',
        time: '05/03/2026, 20:10',
        isCurrent: false,
    },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Map UserResponse từ backend → User frontend ───
function mapUser(u: UserResponse, existingUser?: User | null): User {
    return {
        id: u.userId,
        email: u.email,
        name: u.username,
        isAdmin: u.role === 'ADMIN' || u.role === 'MANAGER' || u.role === 'MODERATOR',
        role: u.role,
        gender: u.gender,
        avatar: existingUser?.avatar ?? localStorage.getItem(`auth_avatar_${u.userId}`) ?? undefined,
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [loginSessions] = useState<LoginSession[]>(mockLoginSessions)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    // Listen for session expiry from apiFetch (token refresh failed)
    useEffect(() => {
        const handleExpired = () => {
            setUser(null)
            localStorage.removeItem('auth_user')
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_refresh_token')
        }
        window.addEventListener('auth:session-expired', handleExpired)
        return () => window.removeEventListener('auth:session-expired', handleExpired)
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const res = await authService.signin(email, password)
            const authData: AuthResponse = res.data

            // Lưu token vào localStorage
            if (authData.accessToken) {
                localStorage.setItem('auth_token', authData.accessToken)
            }
            if (authData.refreshToken) {
                localStorage.setItem('auth_refresh_token', authData.refreshToken)
            }

            const userData = mapUser(authData.userResponse)
            setUser(userData)
            localStorage.setItem('auth_user', JSON.stringify(userData))
        } catch (error: any) {
            let errorMsg = error.message || 'Đăng nhập thất bại'
            if (errorMsg === 'Phiên làm việc không hợp lệ hoặc bạn chưa đăng nhập') {
                errorMsg = 'Email hoặc mật khẩu không chính xác'
            }
            throw new Error(errorMsg)
        }
    }

    const register = async (email: string, password: string, username: string, gender: string) => {
        try {
            await authService.signup(username, email, password, gender)
            // Backend gửi OTP qua email — frontend chuyển sang màn hình thông báo
        } catch (error: any) {
            throw new Error(error.message || 'Đăng ký thất bại')
        }
    }

    const updateProfile = async (data: {
        name?: string
        oldPassword?: string
        newPassword?: string
        confirmPassword?: string
        avatar?: string
    }) => {
        if (!user) throw new Error('Chưa đăng nhập')

        // Cập nhật username qua API nếu tên thay đổi
        if (data.name && data.name !== user.name) {
            try {
                const res = await userService.updateUser(user.id, { username: data.name })
                const updatedUser = mapUser(res.data, { ...user, name: data.name })
                setUser(updatedUser)
                localStorage.setItem('auth_user', JSON.stringify(updatedUser))
            } catch (error: any) {
                throw new Error(error.message || 'Cập nhật tên thất bại')
            }
        }

        // Đổi mật khẩu qua API nếu có
        if (data.newPassword && data.oldPassword) {
            try {
                await authService.changePassword(
                    data.oldPassword,
                    data.newPassword,
                    data.confirmPassword || data.newPassword
                )
            } catch (error: any) {
                throw new Error(error.message || 'Đổi mật khẩu thất bại')
            }
        }

        // Cập nhật avatar cục bộ (chưa có API upload)
        if (data.avatar !== undefined) {
            const updatedUser = { ...user, avatar: data.avatar }
            setUser(updatedUser)
            localStorage.setItem(`auth_avatar_${user.id}`, data.avatar)
            localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        }
    }

    const logout = () => {
        return new Promise<void>((resolve) => {
            setIsLoggingOut(true)

            const refreshToken = localStorage.getItem('auth_refresh_token')

            // Gọi API logout (gỡ refreshToken phía server)
            const doLogout = async () => {
                if (refreshToken) {
                    try {
                        await authService.logout(refreshToken)
                    } catch {
                        // Nếu API lỗi vẫn tiếp tục đăng xuất phía client
                    }
                }
                // Delay để animation hiển thị đẹp
                await new Promise(r => setTimeout(r, 1500))
                setUser(null)
                setIsLoggingOut(false)
                localStorage.removeItem('auth_user')
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_refresh_token')
                resolve()
            }

            doLogout()
        })
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                updateProfile,
                isAuthenticated: !!user,
                isAdmin: !!user?.isAdmin,
                isLoggingOut,
                loginSessions,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
