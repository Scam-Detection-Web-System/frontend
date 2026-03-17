import {
    FileWarning,
    Users,
    PhoneOff,
    Clock,
    Activity,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminStatsCard } from "@/components/admin/AdminStatsCard"
import { AdminReportsTable } from "@/components/admin/AdminReportsTable"
import { DashboardPieChart } from "@/components/admin/DashboardPieChart"
import { DashboardFeatureChart } from "@/components/admin/DashboardFeatureChart"
import { DashboardProviderStats } from "@/components/admin/DashboardProviderStats"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
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
                    {/* Stats grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <AdminStatsCard
                            title="Tổng báo cáo"
                            value="1,284"
                            description="so với tháng trước"
                            icon={<FileWarning className="h-6 w-6" />}
                            trend="up"
                            trendValue="+12.5%"
                        />
                        <AdminStatsCard
                            title="Người dùng"
                            value="8,432"
                            description="so với tháng trước"
                            icon={<Users className="h-6 w-6" />}
                            trend="up"
                            trendValue="+8.2%"
                        />
                        <AdminStatsCard
                            title="SĐT bị chặn"
                            value="3,156"
                            description="so với tháng trước"
                            icon={<PhoneOff className="h-6 w-6" />}
                            trend="up"
                            trendValue="+23.1%"
                        />
                        <AdminStatsCard
                            title="Chờ duyệt"
                            value="47"
                            description="báo cáo cần xử lý"
                            icon={<Clock className="h-6 w-6" />}
                            trend="down"
                            trendValue="-5.4%"
                        />
                    </div>

                    {/* Charts row: Pie chart + Feature chart */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <DashboardPieChart />
                        <DashboardFeatureChart />
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

                            {/* Scam type breakdown */}
                            <Card className="border-slate-200 dark:border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Loại lừa đảo</CardTitle>
                                    <CardDescription>Phân loại theo loại hình</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Lừa đảo tài chính", count: 342, pct: 27, color: "bg-red-500" },
                                            { label: "Giả mạo ngân hàng", count: 289, pct: 23, color: "bg-orange-500" },
                                            { label: "Lừa đảo việc làm", count: 218, pct: 17, color: "bg-amber-500" },
                                            { label: "Mạo danh công an", count: 187, pct: 15, color: "bg-blue-500" },
                                            { label: "Khác", count: 248, pct: 18, color: "bg-slate-400" },
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span className="font-medium">{item.count}</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                                                        style={{ width: `${item.pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
