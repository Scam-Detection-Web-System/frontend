import { Link, useLocation } from "react-router-dom"
import {
    FileWarning,
    Newspaper,
    Settings,
    ShieldCheck,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Clock,
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { reportService } from "@/services/report.service"

const navItems = [
    {
        href: "/admin/moderator-reports",
        label: "Báo cáo chờ duyệt",
        icon: FileWarning,
        showBadge: true,
    },
    {
        href: "/admin/news",
        label: "Tin tức",
        icon: Newspaper,
        showBadge: false,
    },
    {
        href: "/admin/settings",
        label: "Cài đặt",
        icon: Settings,
        showBadge: false,
    },
]

export function ModeratorSidebar() {
    const location = useLocation()
    const { logout, user } = useAuth()
    const [collapsed, setCollapsed] = useState(false)
    const [pendingCount, setPendingCount] = useState(0)

    const loadPendingCount = useCallback(async () => {
        try {
            const res = await reportService.getModeratorPendingReports({ page: 0, size: 1 })
            setPendingCount(res.data?.totalElements ?? 0)
        } catch {
            // silence – badge count is non-critical
        }
    }, [])

    useEffect(() => {
        loadPendingCount()
        // Refresh count every 60 seconds
        const interval = setInterval(loadPendingCount, 60_000)
        return () => clearInterval(interval)
    }, [loadPendingCount])

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
                    <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            AnTiScaQ
                        </span>
                        <p className="text-[10px] text-violet-600 font-semibold leading-tight">
                            Kiểm duyệt viên
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive =
                        location.pathname === item.href ||
                        (item.href !== "/admin" && location.pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span className="flex-1">{item.label}</span>}
                            {/* Badge số lượng PENDING */}
                            {item.showBadge && pendingCount > 0 && (
                                <span
                                    className={cn(
                                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                                        isActive
                                            ? "bg-violet-600 text-white"
                                            : "bg-amber-500 text-white",
                                        collapsed && "absolute translate-x-3 -translate-y-2 text-[9px] h-4 min-w-4"
                                    )}
                                >
                                    {pendingCount > 99 ? "99+" : pendingCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Pending info card */}
            {!collapsed && pendingCount > 0 && (
                <div className="mx-3 mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/40 dark:bg-amber-950/20">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                                {pendingCount} báo cáo chờ duyệt
                            </p>
                            <p className="text-[10px] text-amber-600 dark:text-amber-400">
                                Cần xử lý sớm
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom section */}
            <div className="border-t border-slate-200 p-3 dark:border-slate-700/50">
                {/* User info */}
                {!collapsed && (
                    <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                        <p className="text-xs font-medium text-muted-foreground">Đăng nhập với</p>
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user?.name}
                        </p>
                        <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                            Moderator
                        </span>
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
