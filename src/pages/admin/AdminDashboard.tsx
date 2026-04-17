import {
    FileWarning,
    Users,
    PhoneOff,
    Clock,
    Activity,
    ShieldCheck,
    CalendarCheck,
} from "lucide-react"
import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminStatsCard } from "@/components/admin/AdminStatsCard"
import { AdminReportsTable } from "@/components/admin/AdminReportsTable"
import { DashboardPieChart } from "@/components/admin/DashboardPieChart"
import { DashboardProviderStats } from "@/components/admin/DashboardProviderStats"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Navigate } from "react-router-dom"
import AdminUsers from "./AdminUsers"
import AdminBlogs from "./AdminBlogs"
import AdminReports from "./AdminReports"
import { ManagerDashboardView } from "@/components/admin/ManagerDashboardView"
import { getDashboardPath } from "@/App"
import AdminQuiz from "./AdminQuiz"
import ModeratorReports from "./ModeratorReports"
import ManagerAssessments from "./ManagerAssessments"
import { userService } from "@/services/user.service"
import { reportService } from "@/services/report.service"
import { dashboardService } from "@/services/dashboard.service"
import { assessmentService } from "@/services/assessment.service"

interface DashboardStats {
    totalUsers: number
    totalReports: number
    pendingReports: number
    blockedUsers: number
    totalAssessments: number
    reportsToday: number
}

function DashboardHome() {
    const { user } = useAuth()
    const basePath = getDashboardPath(user?.role)
    
    // MODERATOR có trang riêng, redirect về moderator-reports
    if (user?.role === 'MODERATOR') {
        return <Navigate to={`${basePath}/moderator-reports`} replace />
    }
    // Roles khác ngoài ADMIN/MANAGER redirect về news
    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
        return <Navigate to={`${basePath}/news`} replace />
    }

    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalReports: 0,
        pendingReports: 0,
        blockedUsers: 0,
        totalAssessments: 0,
        reportsToday: 0,
    })
    const [statusStats, setStatusStats] = useState<import("@/services/dashboard.service").ReportStatusStats | null>(null)
    const [labelStats, setLabelStats] = useState<import("@/services/dashboard.service").LabelStatItem[]>([])
    const [statsLoading, setStatsLoading] = useState(true)

    useEffect(() => {
        async function loadStats() {
            setStatsLoading(true)
            try {
                const isAdmin = user?.role === 'ADMIN'
                const isManager = user?.role === 'MANAGER'

                // Fire all queries simultaneously to grab actual live data
                const [overviewRes, usersRes, assessmentsRes, allReportsRes, pendingReportsRes, statusRes, labelRes] = await Promise.allSettled([
                    // 1. Dashboard Overview API (may be blocked for non-admins, but try anyway)
                    dashboardService.getOverviewStats(),
                    // 2. Users API (Admin only)
                    isAdmin ? userService.getAllUsers({ page: 0, size: 1 }) : Promise.resolve({ data: [] }),
                    // 3. Assessments API (Manager handles this)
                    assessmentService.getAssessmentsPage({ page: 0, size: 1 }),
                    // 4. All Grouped Reports API
                    reportService.getGroupedReports({ page: 0, size: 1 }),
                    // 5. Pending Requires Action Reports (For Managers context, VALID status is pending assessment)
                    isManager ? reportService.getGroupedReports({ status: 'VALID', page: 0, size: 1 }) : reportService.getHotReports({ status: 'VALID', page: 0, size: 1 }),
                    // 6. Status Stats for Pie Chart
                    dashboardService.getReportStatusStats(),
                    // 7. Label Stats
                    dashboardService.getLabelStats()
                ])

                let totalReports = 0
                let pendingReports = 0
                let totalUsers = 0
                let blockedUsers = 0
                let totalAssessments = 0
                let reportsToday = 0

                // Attempt to use overview stats if successful
                if (overviewRes.status === 'fulfilled' && overviewRes.value.success) {
                    const od = overviewRes.value.data
                    totalReports = od.totalReports ?? 0
                    totalUsers = od.totalUsers ?? 0
                    reportsToday = od.reportsToday ?? 0
                    totalAssessments = od.totalAssessments ?? 0
                    // In overview, reportsToday was used as a generic proxy for "pending", but we will override it with actual pending count if available
                    pendingReports = od.reportsToday ?? 0
                }

                // Explicitly override with real data from direct services if they succeeded
                if (assessmentsRes.status === 'fulfilled') {
                    totalAssessments = assessmentsRes.value.data.totalElements ?? totalAssessments;
                }
                if (allReportsRes.status === 'fulfilled') {
                    // Update totalReports if direct query has more up-to-date data 
                    // (Dashboard Overview might cache or not count correctly)
                    totalReports = allReportsRes.value.data.totalElements ?? totalReports;
                }
                if (pendingReportsRes.status === 'fulfilled') {
                    pendingReports = pendingReportsRes.value.data.totalElements ?? pendingReports;
                }
                if (isAdmin && usersRes.status === 'fulfilled' && (usersRes.value as any)?.data?.totalElements) {
                    totalUsers = (usersRes.value as any).data.totalElements ?? totalUsers;
                    // Note: Cannot easily get blocked users count from page 0 size 1 without a filter endpoint,
                    // so we keep blockedUsers as 0 unless overview API provided it. 
                }

                if (statusRes.status === 'fulfilled' && statusRes.value.success) {
                    setStatusStats(statusRes.value.data)
                }

                if (labelRes.status === 'fulfilled' && labelRes.value.success) {
                    setLabelStats(labelRes.value.data)
                }

                setStats({ totalUsers, totalReports, pendingReports, blockedUsers, totalAssessments, reportsToday })

            } catch (err) {
                console.error("Dashboard stats error:", err)
            } finally {
                setStatsLoading(false)
            }
        }
        loadStats()
    }, [])

    const fmt = (n: number) => n.toLocaleString("vi-VN")

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Bảng điều khiển
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Tổng quan hệ thống chống lừa đảo
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

                {/* Dashboard content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {user?.role === 'MANAGER' ? (
                        <ManagerDashboardView stats={stats} loading={statsLoading} />
                    ) : (
                        <>
                            {/* Stats grid — 2 cols mobile, 4 cols tablet/large */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                        <AdminStatsCard
                            title="Tổng báo cáo"
                            value={statsLoading ? "..." : fmt(stats.totalReports)}
                            description="báo cáo trong hệ thống"
                            icon={<FileWarning className="h-6 w-6" />}
                            trend="up"
                            trendValue=""
                        />
                        <AdminStatsCard
                            title="Hôm nay"
                            value={statsLoading ? "..." : fmt(stats.reportsToday)}
                            description="báo cáo mới hôm nay"
                            icon={<CalendarCheck className="h-6 w-6" />}
                            trend={stats.reportsToday > 0 ? "up" : "down"}
                            trendValue=""
                        />
                        <AdminStatsCard
                            title="Người dùng"
                            value={statsLoading ? "..." : fmt(stats.totalUsers)}
                            description="tài khoản đã đăng ký"
                            icon={<Users className="h-6 w-6" />}
                            trend="up"
                            trendValue=""
                        />
                        <AdminStatsCard
                            title="Đánh giá"
                            value={statsLoading ? "..." : fmt(stats.totalAssessments)}
                            description="đánh giá chuyên gia"
                            icon={<ShieldCheck className="h-6 w-6" />}
                            trend="up"
                            trendValue=""
                        />
                    </div>

                    {/* Charts row: Pie chart + Scam type breakdown */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <DashboardPieChart data={{ valid: statusStats?.validReports ?? 0, pending: statusStats?.pendingReports ?? 0, invalid: statusStats?.invalidReports ?? 0 }} />
                        
                        {/* Scam type breakdown */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-lg">Loại lừa đảo</CardTitle>
                                <CardDescription>Phân loại theo loại hình</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {labelStats.length > 0 ? (
                                        labelStats.map((item, idx) => {
                                            const totalLabelCount = labelStats.reduce((sum, a) => sum + a.count, 0)
                                            const pct = totalLabelCount === 0 ? 0 : Math.round((item.count / totalLabelCount) * 100)
                                            
                                            const LABEL_TRANSLATIONS: Record<string, string> = {
                                                "SUSPICIOUS": "Đáng ngờ (Suspicious)",
                                                "ADVERTISING": "Quảng cáo/Tiếp thị",
                                                "SAFE": "An toàn",
                                                "SCAM": "Lừa đảo",
                                                "SPAM": "Làm phiền",
                                                "FINANCIAL_SCAM": "Lừa đảo tài chính",
                                                "IMPERSONATION": "Mạo danh",
                                                "EMPLOYMENT_SCAM": "Lừa đảo việc làm",
                                                "THREAT": "Đe doạ",
                                                "FRAUD": "Chiếm đoạt",
                                                "OTHER": "Khác"
                                            }
                                            const translatedLabel = LABEL_TRANSLATIONS[item.label.toUpperCase()] || item.label

                                            // Rotate through a set of vibrant colors
                                            const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-blue-500", "bg-slate-500", "bg-emerald-500", "bg-indigo-500"]
                                            const color = colors[idx % colors.length]
                                            return (
                                                <div key={item.label} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">{translatedLabel}</span>
                                                        <span className="font-medium">{item.count}</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={`h-full rounded-full ${color} transition-all duration-500`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Provider statistics table */}
                    <div className="mt-6">
                        <DashboardProviderStats />
                    </div>

                    {/* Content grid */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        {/* Reports table - 2 cols */}
                        <div className="lg:col-span-2">
                            <AdminReportsTable />
                        </div>

                        {/* Quick info sidebar - 1 col */}
                        <div className="space-y-6">
                            {/* Recent activity */}
                            <Card className="border-slate-200 dark:border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
                                    <CardDescription>Các thao tác mới nhất trong hệ thống</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { action: "Phê duyệt báo cáo", detail: "RPT-003", time: "2 phút trước", color: "bg-emerald-500" },
                                            { action: "Người dùng mới", detail: "Nguyễn Văn K", time: "15 phút trước", color: "bg-blue-500" },
                                            { action: "Từ chối báo cáo", detail: "RPT-005", time: "1 giờ trước", color: "bg-red-500" },
                                            { action: "Chặn số điện thoại", detail: "0912xxx789", time: "2 giờ trước", color: "bg-orange-500" },
                                            { action: "Phê duyệt báo cáo", detail: "RPT-004", time: "3 giờ trước", color: "bg-emerald-500" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                                                <div className="flex-1 space-y-0.5">
                                                    <p className="text-sm font-medium">{item.action}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.detail} · {item.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>


                        </div>
                    </div>
                    </>
                    )}
                </main>
            </div>
        </div>
    )
}


export default function AdminDashboard() {
    const { user } = useAuth()
    const basePath = getDashboardPath(user?.role)

    return (
        <Routes>
            <Route index element={<DashboardHome />} />
            {/* News/Blogs — accessible to ADMIN and MANAGER only */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <Route path="news" element={<AdminBlogs />} />
            )}
            {/* Managers — accessible to ADMIN only */}
            {user?.role === "ADMIN" && (
                <Route path="users/managers" element={<AdminUsers filterRole="MANAGER" />} />
            )}
            
            {/* Moderators — accessible to ADMIN and MANAGER */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <Route path="users/moderators" element={<AdminUsers filterRole="MODERATOR" />} />
            )}

            {/* Normal Users — accessible to ADMIN and MANAGER */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <Route path="users/users" element={<AdminUsers filterRole="USER" />} />
            )}

            {/* Reports — accessible to ADMIN and MANAGER */}
            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                <Route path="reports" element={<AdminReports />} />
            )}

            {/* Quiz — accessible to ADMIN and MANAGER */}
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                <Route path="quiz" element={<AdminQuiz />} />
            )}

            {/* Moderator Reports — accessible to MODERATOR only */}
            {user?.role === "MODERATOR" && (
                <Route path="moderator-reports" element={<ModeratorReports />} />
            )}

            {/* Assessments — accessible to MANAGER only */}
            {user?.role === "MANAGER" && (
                <Route path="assessments" element={<ManagerAssessments />} />
            )}

            {/* Fallback cho các URL không hợp lệ hoặc bị cấm */}
            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            user?.role === "ADMIN" || user?.role === "MANAGER"
                                ? basePath
                                : user?.role === "MODERATOR"
                                ? `${basePath}/moderator-reports`
                                : "/"
                        }
                        replace
                    />
                }
            />
        </Routes>
    )
}
