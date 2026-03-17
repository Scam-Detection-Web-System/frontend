import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
    id: string
    email: string
    name: string
    isAdmin: boolean
    avatar?: string // base64 data URL
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
    login: (username: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => void
    updateProfile: (data: { name?: string; password?: string; avatar?: string }) => Promise<void>
    isAuthenticated: boolean
    isAdmin: boolean
    loginSessions: LoginSession[]
}

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '123456'

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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loginSessions] = useState<LoginSession[]>(mockLoginSessions)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Check admin credentials first
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const storedAvatar = localStorage.getItem('auth_avatar_admin-001')
            const adminUser: User = {
                id: 'admin-001',
                email: 'admin@antiscaq.vn',
                name: 'Quản trị viên',
                isAdmin: true,
                avatar: storedAvatar || undefined,
            }
            setUser(adminUser)
            localStorage.setItem('auth_user', JSON.stringify(adminUser))
            return
        }

        // Get stored users (fall back to regular user login via email)
        const usersJson = localStorage.getItem('auth_users') || '{}'
        const users = JSON.parse(usersJson)

        // Check if user exists and password matches
        const storedUser = users[username]
        if (!storedUser || storedUser.password !== password) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng')
        }

        // Create user object without password
        const storedAvatar = localStorage.getItem(`auth_avatar_${storedUser.id}`)
        const userData: User = {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            isAdmin: false,
            avatar: storedAvatar || undefined,
        }

        // Save to state and localStorage
        setUser(userData)
        localStorage.setItem('auth_user', JSON.stringify(userData))
    }

    const register = async (email: string, password: string, name: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Get stored users
        const usersJson = localStorage.getItem('auth_users') || '{}'
        const users = JSON.parse(usersJson)

        // Check if user already exists
        if (users[email]) {
            throw new Error('Email đã được sử dụng')
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password, // In real app, this would be hashed
            name,
        }

        // Save to users collection
        users[email] = newUser
        localStorage.setItem('auth_users', JSON.stringify(users))

        // Auto-login after registration
        const userData: User = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAdmin: false,
        }

        setUser(userData)
        localStorage.setItem('auth_user', JSON.stringify(userData))
    }

    const updateProfile = async (data: { name?: string; password?: string; avatar?: string }) => {
        if (!user) throw new Error('Chưa đăng nhập')

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const updatedUser = { ...user }

        if (data.name) {
            updatedUser.name = data.name
        }

        if (data.avatar !== undefined) {
            updatedUser.avatar = data.avatar
            // Store avatar separately to avoid bloating auth_user
            localStorage.setItem(`auth_avatar_${user.id}`, data.avatar)
        }

        if (data.password) {
            // Update password in stored users (for non-admin)
            if (!user.isAdmin) {
                const usersJson = localStorage.getItem('auth_users') || '{}'
                const users = JSON.parse(usersJson)
                if (users[user.email]) {
                    users[user.email].password = data.password
                    localStorage.setItem('auth_users', JSON.stringify(users))
                }
            }
        }

        setUser(updatedUser)
        localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('auth_user')
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
