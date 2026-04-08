import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { reportService, GroupedPhoneReport, PhoneReportItem, ReportStatus } from "@/services/report.service"
import {
    Activity,
    RefreshCw,
    FileWarning,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronRight,
    Loader2,
    Phone,
} from "lucide-react"

const STATUS_OPTIONS: { value: ReportStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "VALID", label: "Hợp lệ" },
    { value: "INVALID", label: "Không hợp lệ" },
    { value: "RESOLVED", label: "Đã xử lý" },
]

function getStatusBadge(status: ReportStatus) {
    const map: Record<ReportStatus, { label: string; className: string }> = {
        PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
        VALID: { label: "Hợp lệ", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
        INVALID: { label: "Không hợp lệ", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
        RESOLVED: { label: "Đã xử lý", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    }
    const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-700" }
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>
}

// ─── Grouped Report Row (Expandable) ──────────────────────────────────────
function ReportGroupRow({ group, onUpdateStatus }: {
    group: GroupedPhoneReport
    onUpdateStatus: (reportId: string, status: ReportStatus) => Promise<void>
}) {
    const [expanded, setExpanded] = useState(false)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const handleAction = async (reportId: string, status: ReportStatus) => {
        setUpdatingId(reportId)
        await onUpdateStatus(reportId, status)
        setUpdatingId(null)
    }

    return (
        <>
            {/* Group header row */}
            <tr
                className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        {expanded
                            ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                            : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        }
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-slate-900 dark:text-white">{group.phoneNumber}</span>
                    </div>
                </td>
                <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {group.totalReports} báo cáo
                    </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm" colSpan={3}>
                    Click để xem chi tiết
                </td>
            </tr>

            {/* Expanded detail rows */}
            {expanded && group.reports.map((report) => (
                <ReportDetailRow
                    key={report.reportId}
                    report={report}
                    onAction={handleAction}
                    updatingId={updatingId}
                />
            ))}
        </>
    )
}

function ReportDetailRow({ report, onAction, updatingId }: {
    report: PhoneReportItem
    onAction: (id: string, status: ReportStatus) => void
    updatingId: string | null
}) {
    const isUpdating = updatingId === report.reportId

    return (
        <tr className="border-b border-slate-100 bg-white pl-8 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3 pl-12">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{report.content}</p>
                {report.label && (
                    <span className="mt-1 inline-block text-xs text-muted-foreground"># {report.label}</span>
                )}
            </td>
            <td className="px-4 py-3 text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                })}
            </td>
            <td className="px-4 py-3">{getStatusBadge(report.status)}</td>
            <td className="px-4 py-3">
                <span className="text-xs text-muted-foreground font-mono">
                    {report.userId ? report.userId.slice(0, 8) + "..." : "Ẩn danh"}
                </span>
            </td>
            <td className="px-4 py-3">
                {report.status === "PENDING" ? (
                    <div className="flex gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => onAction(report.reportId, "VALID")}
                            className="gap-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50"
                            id={`approve-${report.reportId}`}
                        >
                            {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            Duyệt
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => onAction(report.reportId, "INVALID")}
                            className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
                            id={`reject-${report.reportId}`}
                        >
                            {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                            Từ chối
                        </Button>
                    </div>
                ) : report.status === "VALID" ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => onAction(report.reportId, "RESOLVED")}
                        className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50"
                        id={`resolve-${report.reportId}`}
                    >
                        {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        Đánh dấu xử lý
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                )}
            </td>
        </tr>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
const PAGE_SIZE = 20

export default function AdminReports() {
    const [groups, setGroups] = useState<GroupedPhoneReport[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(0)
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchReports = useCallback(async (status: ReportStatus | "ALL" = statusFilter, p = page) => {
        setLoading(true)
        setError("")
        try {
            const res = await reportService.getGroupedReports({
                status: status === "ALL" ? undefined : status,
                page: p,
                size: PAGE_SIZE,
            })
            const pageData = res.data
            setGroups((pageData.content ?? []).map(g => ({ ...g, reports: g.reports ?? [] })))
            setTotalElements(pageData.totalElements ?? 0)
            setTotalPages(pageData.totalPages ?? 0)
        } catch (err: any) {
            setError(err.message ?? "Không thể tải danh sách báo cáo")
        } finally {
            setLoading(false)
        }
    }, [statusFilter, page])

    useEffect(() => {
        fetchReports(statusFilter, page)
    }, [statusFilter, page])

    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
        try {
            await reportService.updateReportStatus(reportId, status)
            // Re-fetch to reflect changes
            await fetchReports(statusFilter, page)
        } catch (err: any) {
            setError(err.message ?? "Không thể cập nhật trạng thái")
        }
    }

    // Stats from current data
    const pendingCount = groups.reduce((acc, g) =>
        acc + g.reports.filter(r => r.status === "PENDING").length, 0)

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Quản lý báo cáo
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Xem và phê duyệt các báo cáo lừa đảo từ người dùng
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
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số điện thoại</CardTitle>
                                <Phone className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{groups.length}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">trên trang này · {totalElements} tổng</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Chờ duyệt</CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng báo cáo</CardTitle>
                                <FileWarning className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {groups.reduce((acc, g) => acc + g.totalReports, 0)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1 flex-wrap">
                            {STATUS_OPTIONS.map(opt => (
                                <Button
                                    key={opt.value}
                                    variant={statusFilter === opt.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => { setStatusFilter(opt.value as ReportStatus | "ALL"); setPage(0) }}
                                    id={`filter-${opt.value}`}
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fetchReports(statusFilter, page)}
                            title="Làm mới"
                            className="ml-auto"
                        >
                            <RefreshCw className="h-4 w-4" />
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
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Số điện thoại / Nội dung</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Thời gian</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trạng thái</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Người dùng</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : groups.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                                Không có báo cáo nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        groups.map(group => (
                                            <ReportGroupRow
                                                key={group.phoneNumber}
                                                group={group}
                                                onUpdateStatus={handleUpdateStatus}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                            <p>Trang {page + 1} / {totalPages} · {totalElements} số điện thoại</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >Trước</Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                >Sau</Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
