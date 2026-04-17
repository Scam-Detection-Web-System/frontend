import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userService, UserResponse } from "@/services/user.service"
import {
    Activity,
    Plus,
    Search,
    Edit2,
    RefreshCw,
    Users,
    X,
    Loader2,
    UserCheck,
    UserX,
    ShieldOff,
    ShieldCheck,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── Create / Edit Modal Component ────────────────────────────────────
interface UserModalProps {
    mode: "create" | "edit"
    user?: UserResponse
    currentUserRole?: string
    filterRole?: "MANAGER" | "MODERATOR" | "USER"
    onClose: () => void
    onSuccess: () => void
}

function UserModal({ mode, user, currentUserRole, filterRole, onClose, onSuccess }: UserModalProps) {
    const [username, setUsername] = useState(user?.username ?? "")
    const [email, setEmail] = useState(user?.email ?? "")
    const [password, setPassword] = useState("")
    const [gender, setGender] = useState(user?.gender ?? "")
    const [role, setRole] = useState(filterRole ?? (currentUserRole === "MANAGER" ? "MODERATOR" : "USER"))
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            if (mode === "create") {
                if (role === "MANAGER") {
                    await userService.createManager({ username, email, password, gender })
                } else if (role === "MODERATOR") {
                    await userService.createModerator({ username, email, password, gender })
                } else {
                    await userService.createUser({ username, email, password, gender })
                }
            } else if (mode === "edit" && user) {
                await userService.updateUser(user.userId, { username, gender })
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message ?? "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {mode === "create" ? "Thêm người dùng mới" : "Chỉnh sửa người dùng"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="space-y-1.5">
                        <Label htmlFor="modal-username">Tên đăng nhập</Label>
                        <Input
                            id="modal-username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Email (chỉ khi tạo mới) */}
                    {mode === "create" && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="modal-email">Email</Label>
                                <Input
                                    id="modal-email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="modal-password">Mật khẩu</Label>
                                <Input
                                    id="modal-password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <Label htmlFor="modal-gender">Giới tính</Label>
                        <select
                            id="modal-gender"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        >
                            <option value="">-- Chọn giới tính --</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    {/* Role Selection (Chỉ khi tạo mới) */}
                    {mode === "create" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="modal-role">Vai trò</Label>
                            <select
                                id="modal-role"
                                value={role}
                                onChange={e => setRole(e.target.value as "MANAGER" | "MODERATOR" | "USER")}
                                disabled={loading || filterRole !== undefined || currentUserRole === "MANAGER"}
                                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                            >
                                <option value="USER">User (Người dùng thường)</option>
                                <option value="MODERATOR">Moderator (Kiểm duyệt viên)</option>
                                {currentUserRole === "ADMIN" && <option value="MANAGER">Manager (Quản lý)</option>}
                            </select>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "create" ? "Tạo mới" : "Lưu"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminUsers({ filterRole }: { filterRole?: "MANAGER" | "MODERATOR" | "USER" }) {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<UserResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [blockingId, setBlockingId] = useState<string | null>(null)

    // Modal state
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>()
    const [showModal, setShowModal] = useState(false)

    // Fetch users
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            if (filterRole === "MANAGER") {
                const res = await userService.getAllManagers()
                setUsers(res.data ?? [])
            } else if (filterRole === "MODERATOR") {
                const res = await userService.getAllModerators()
                setUsers(res.data ?? [])
            } else if (filterRole === "USER") {
                const res = await userService.getAllUsers({ page: 0, size: 500 })
                let all = res.data ?? []
                all = all.filter(u => u.role === "USER")
                setUsers(all)
            } else {
                if (currentUser?.role === 'MANAGER') {
                    const res = await userService.getAllModerators()
                    setUsers(res.data ?? [])
                } else {
                    const res = await userService.getAllUsers({ page: 0, size: 500 })
                    setUsers(res.data ?? [])
                }
            }
        } catch (err: any) {
            setError(err.message ?? 'Không thể tải danh sách người dùng')
        } finally {
            setLoading(false)
        }
    }, [currentUser?.role, filterRole])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const openCreate = () => {
        setModalMode("create")
        setSelectedUser(undefined)
        setShowModal(true)
    }

    const openEdit = (user: UserResponse) => {
        setModalMode("edit")
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleModalSuccess = () => {
        setShowModal(false)
        fetchUsers()
    }

    const handleChangeStatus = async (user: UserResponse, newStatus: string) => {
        setBlockingId(user.userId)
        setError("")
        try {
            await userService.updateUserStatus(user.userId, newStatus)
            await fetchUsers()
        } catch (err: any) {
            setError(err.message ?? "Không thể thay đổi trạng thái người dùng")
        } finally {
            setBlockingId(null)
        }
    }

    // Filter by search
    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    // Helpers
    const getRoleBadge = (role: string) => {
        const map: Record<string, string> = {
            ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
            MANAGER: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
            USER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        }
        return map[role] ?? "bg-slate-100 text-slate-700"
    }

    const getStatusInfo = (status: string) => {
        const s = status.toUpperCase()
        if (s === "ACTIVE") return { class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", label: "Hoạt động" }
        if (s === "PENDING") return { class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", label: "Chờ duyệt" }
        if (s === "INACTIVE") return { class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", label: "Không HĐ" }
        if (s === "SUSPENDED" || s === "BLOCKED") return { class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300", label: "Đình chỉ" }
        if (s === "DELETED") return { class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 line-through opacity-80", label: "Đã xóa" }
        return { class: "bg-slate-100 text-slate-700", label: status }
    }

    const getGenderLabel = (gender: string) => {
        const map: Record<string, string> = { MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" }
        return map[gender] ?? gender
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {filterRole === "MANAGER" ? "Quản lý Manager" : filterRole === "MODERATOR" ? "Quản lý Moderator" : filterRole === "USER" ? "Quản lý Tài khoản Trực tuyến" : "Quản lý người dùng"}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Xem, thêm và chỉnh sửa tài khoản người dùng
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Badge variant="outline" className="gap-1.5">
                            <Activity className="h-3 w-3 text-emerald-500" />
                            Hệ thống hoạt động
                        </Badge>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
                                <UserCheck className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {users.filter(u => u.status === "ACTIVE" || u.status === "active").length}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Bị vô hiệu hóa</CardTitle>
                                <UserX className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600">
                                    {users.filter(u => u.status !== "ACTIVE" && u.status !== "active").length}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tên hoặc email..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9"
                                id="user-search"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={fetchUsers} title="Làm mới">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button onClick={openCreate} className="ml-auto gap-2">
                            <Plus className="h-4 w-4" />
                            Thêm người dùng
                        </Button>
                    </div>

                    {/* Error */}
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Table */}
                    <Card className="border-slate-200 dark:border-slate-700/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Người dùng</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Giới tính</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vai trò</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trạng thái</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                                {search ? "Không tìm thấy người dùng phù hợp." : "Chưa có người dùng nào."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(u => (
                                            <tr
                                                key={u.userId}
                                                className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                            {u.username?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {u.username}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{getGenderLabel(u.gender)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadge(u.role)}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {(() => {
                                                        const info = getStatusInfo(u.status)
                                                        return (
                                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${info.class}`}>
                                                                {info.label}
                                                            </span>
                                                        )
                                                    })()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEdit(u)}
                                                            className="gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                                                            id={`edit-user-${u.userId}`}
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                            Sửa
                                                        </Button>

                                                        {/* Phân quyền thay đổi trạng thái */}
                                                        {(currentUser?.role === 'ADMIN' || (currentUser?.role === 'MANAGER' && u.role === 'MODERATOR')) && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="gap-1.5" disabled={blockingId === u.userId}>
                                                                        {blockingId === u.userId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldOff className="h-3.5 w-3.5" />}
                                                                        Trạng thái
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => handleChangeStatus(u, 'ACTIVE')}>
                                                                        🟢 Kích hoạt (Active)
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleChangeStatus(u, 'PENDING')}>
                                                                        🟡 Chờ duyệt (Pending)
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleChangeStatus(u, 'INACTIVE')}>
                                                                        ⚪ Vô hiệu hóa (Inactive)
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleChangeStatus(u, 'SUSPENDED')}>
                                                                        🟠 Đình chỉ (Suspended)
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleChangeStatus(u, 'DELETED')}>
                                                                        🔴 Xóa tài khoản (Deleted)
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Count */}
                    {!loading && filtered.length > 0 && (
                        <p className="mt-3 text-xs text-muted-foreground text-right">
                            Hiển thị {filtered.length} / {users.length} người dùng
                        </p>
                    )}
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <UserModal
                    mode={modalMode}
                    user={selectedUser}
                    currentUserRole={currentUser?.role}
                    filterRole={filterRole}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    )
}
