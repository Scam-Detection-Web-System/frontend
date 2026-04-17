import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    FileWarning,
    Users,
    Newspaper,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BrainCircuit,
    ShieldCheck,
    ClipboardList,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const navItems = [
    { href: "/admin", label: "Bảng điều khiển", icon: LayoutDashboard, allowedRoles: ['ADMIN', 'MANAGER'] },
    { href: "/admin/reports", label: "Báo cáo", icon: FileWarning, allowedRoles: ['ADMIN', 'MANAGER'] },
    { href: "/admin/assessments", label: "Đánh giá SĐT", icon: ClipboardList, allowedRoles: ['MANAGER'] },
    { href: "/admin/moderator-reports", label: "Duyệt báo cáo", icon: ShieldCheck, allowedRoles: ['MODERATOR'] },
    { href: "/admin/users/managers", label: "Quản lý Manager", icon: Users, allowedRoles: ['ADMIN'] },
    { href: "/admin/users/moderators", label: "Quản lý Moderator", icon: Users, allowedRoles: ['ADMIN', 'MANAGER'] },
    { href: "/admin/users/users", label: "Quản lý User", icon: Users, allowedRoles: ['ADMIN'] },
    { href: "/admin/quiz", label: "Quiz & Câu hỏi", icon: BrainCircuit, allowedRoles: ['ADMIN', 'MANAGER'] },
    { href: "/admin/news", label: "Tin tức", icon: Newspaper, allowedRoles: ['ADMIN', 'MANAGER'] },
    { href: "/admin/settings", label: "Cài đặt", icon: Settings, allowedRoles: ['ADMIN', 'MANAGER', 'MODERATOR'] },
]

export function AdminSidebar() {
    const location = useLocation()
    const { logout, user } = useAuth()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside
            className={cn(
                "flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-700/50 dark:bg-slate-900",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-700/50">
                <img
                    src="/logo.svg"
                    alt="AnTiScaQ"
                    className="h-8 w-8 shrink-0 dark:invert"
                />
                {!collapsed && (
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                        AnTiScaQ
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.filter(item => !item.allowedRoles || item.allowedRoles.includes(user?.role ?? '')).map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom section */}
            <div className="border-t border-slate-200 p-3 dark:border-slate-700/50">
                {/* User info */}
                {!collapsed && (
                    <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <p className="text-xs font-medium text-muted-foreground">Đăng nhập với</p>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user?.name}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className={cn(
                            "w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300",
                            collapsed ? "justify-center px-2" : "justify-start"
                        )}
                        title={collapsed ? "Đăng xuất" : undefined}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="ml-2">Đăng xuất</span>}
                    </Button>
                </div>

                {/* Collapse toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="mt-2 w-full text-muted-foreground"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Thu gọn
                        </>
                    )}
                </Button>
            </div>
        </aside>
    )
}
