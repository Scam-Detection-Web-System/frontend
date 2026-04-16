import {
    Activity,
    Clock,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    Inbox,
    FileText,
    CheckCircle2
} from "lucide-react"
import { AdminReportsTable } from "./AdminReportsTable"

interface DashboardStats {
    totalUsers: number
    totalReports: number
    pendingReports: number
    blockedUsers: number
    totalAssessments: number
    reportsToday: number
}

interface ManagerDashboardViewProps {
    stats: DashboardStats
    loading: boolean
}

export function ManagerDashboardView({ stats, loading }: ManagerDashboardViewProps) {
    const fmt = (n: number) => n.toLocaleString("vi-VN")

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">


            {/* Core Metrics Grid */}
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Đã đánh giá</p>
                        <div className="rounded-full bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                            {loading ? "..." : fmt(stats.totalAssessments)}
                        </h3>
                        <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Tăng trưởng đều</span>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">Tổng báo cáo</p>
                        <div className="rounded-full bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Inbox className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                            {loading ? "..." : fmt(stats.totalReports)}
                        </h3>
                        <div className="mt-2 flex items-center text-xs font-medium text-slate-500 gap-1 dark:text-slate-400">
                            <FileText className="h-3.5 w-3.5" />
                            <span>Báo cáo hợp lệ từ hệ thống</span>
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm border border-amber-100 dark:from-amber-950/30 dark:to-orange-900/20 dark:border-amber-900/30 transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider dark:text-amber-400">Chờ xử lý</p>
                        <div className="rounded-full bg-amber-200/50 p-2.5 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 group-hover:scale-110 transition-transform">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 tabular-nums">
                            {loading ? "..." : fmt(stats.pendingReports)}
                        </h3>
                        <div className="mt-2 flex items-center text-xs font-medium text-amber-700 dark:text-amber-400 gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Nhiệm vụ cần giải quyết ngay</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Dive Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Action Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-indigo-500" /> Báo cáo cần phân tích
                        </h3>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                        <AdminReportsTable />
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" /> Trạng thái & Tiện ích
                    </h3>
                    <div className="gap-3 grid grid-cols-1">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors hover:border-indigo-200 dark:hover:border-indigo-800">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Đánh giá độ an toàn</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Tiến hành viết báo cáo đánh giá chuyên sâu.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors hover:border-fuchsia-200 dark:hover:border-fuchsia-800">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Viết Blog Cảnh báo</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">Chia sẻ thông tin và thủ đoạn lừa đảo mới.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Placeholder for small visual illustration */}
                    <div className="mt-6 rounded-3xl bg-gradient-to-t from-slate-100 to-slate-50 p-6 text-center border border-slate-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-800/80">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
                            <TrendingUp className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Hiệu suất hoạt động</h4>
                        <p className="text-xs text-muted-foreground mt-1">Hệ thống phân tích và báo cáo đang hoạt động trơn tru.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
