import { useState, useEffect, useCallback } from "react"
import { ModeratorSidebar } from "@/components/admin/ModeratorSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
    reportService,
    GroupedPhoneReport,
    PhoneReportItem,
    ReportStatus,
} from "@/services/report.service"
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
    Search,
    ShieldCheck,
    ShieldX,
    MessageSquare,
    Tag,
    Calendar,
    User,
    AlertTriangle,
    X,
} from "lucide-react"

// ─── Status badge ────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReportStatus }) {
    const map: Record<ReportStatus, { label: string; className: string }> = {
        PENDING: {
            label: "Chờ duyệt",
            className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        },
        VALID: {
            label: "Đã duyệt",
            className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        },
        INVALID: {
            label: "Từ chối",
            className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        },
        RESOLVED: {
            label: "Đã xử lý",
            className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        },
    }
    const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-700" }
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
            {s.label}
        </span>
    )
}

// ─── Detail Modal ──────────────────────────────────────────────────
function ReportDetailModal({
    report,
    onClose,
    onAction,
    updating,
}: {
    report: PhoneReportItem
    onClose: () => void
    onAction: (reportId: string, status: ReportStatus) => Promise<void>
    updating: boolean
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                            <Phone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                {report.phoneNumber}
                            </h2>
                            <StatusBadge status={report.status} />
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-5 space-y-4">
                    {/* Nội dung */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Nội dung báo cáo
                            </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {report.content}
                        </p>
                    </div>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {report.label && (
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Nhãn</span>
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {report.label}
                                </p>
                            </div>
                        )}
                        {report.contactMethod && (
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">Kênh liên hệ</span>
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {report.contactMethod}
                                </p>
                            </div>
                        )}
                        {report.scamTechnique && (
                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-800/30 dark:bg-amber-950/20">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase">Kỹ thuật lừa đảo</span>
                                </div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                    {report.scamTechnique}
                                </p>
                            </div>
                        )}
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Thời gian</span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit", month: "2-digit", year: "numeric",
                                    hour: "2-digit", minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="flex items-center gap-1.5 mb-1">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Người báo cáo</span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 font-mono">
                                {report.userId ? report.userId.slice(0, 12) + "..." : "Ẩn danh"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {report.status === "PENDING" && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                            disabled={updating}
                            onClick={() => onAction(report.reportId, "INVALID")}
                            id={`modal-reject-${report.reportId}`}
                        >
                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                            Từ chối
                        </Button>
                        <Button
                            className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={updating}
                            onClick={() => onAction(report.reportId, "VALID")}
                            id={`modal-approve-${report.reportId}`}
                        >
                            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            Duyệt báo cáo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Grouped Report Row ────────────────────────────────────────────
function ReportGroupRow({
    group,
    onUpdateStatus,
    onViewDetail,
    statusFilter,
}: {
    group: GroupedPhoneReport
    onUpdateStatus: (reportId: string, status: ReportStatus) => Promise<void>
    onViewDetail: (report: PhoneReportItem) => void
    statusFilter: ReportStatus | "ALL"
}) {
    const [expanded, setExpanded] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [reports, setReports] = useState<PhoneReportItem[]>(group.reports || [])
    const [fetched, setFetched] = useState((group.reports || []).length > 0)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const handleExpand = async () => {
        const next = !expanded
        setExpanded(next)
        if (next && !fetched) {
            setLoadingDetail(true)
            try {
                const status = statusFilter === "ALL" ? undefined : statusFilter as ReportStatus
                const items = await reportService.getReportsByPhone(group.phoneNumber, status)
                setReports(items)
                setFetched(true)
            } catch {
                // silent
            } finally {
                setLoadingDetail(false)
            }
        }
    }

    const handleAction = async (reportId: string, status: ReportStatus) => {
        setUpdatingId(reportId)
        await onUpdateStatus(reportId, status)
        try {
            const filterStatus = statusFilter === "ALL" ? undefined : statusFilter as ReportStatus
            const items = await reportService.getReportsByPhone(group.phoneNumber, filterStatus)
            setReports(items)
        } catch { /* silent */ }
        setUpdatingId(null)
    }

    const pendingInGroup = reports.filter(r => r.status === "PENDING").length

    return (
        <>
            {/* Group header */}
            <tr
                className="border-b border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                onClick={handleExpand}
            >
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 shrink-0">
                            <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                            {group.phoneNumber}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            {group.totalReports} báo cáo
                        </span>
                        {pendingInGroup > 0 && (
                            <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2.5 py-0.5 text-xs font-semibold">
                                {pendingInGroup} chờ duyệt
                            </span>
                        )}
                    </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm" colSpan={3}>
                    {loadingDetail ? (
                        <span className="flex items-center gap-1.5 text-xs">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Đang tải...
                        </span>
                    ) : fetched ? (
                        <span className="text-xs">{reports.length} báo cáo chi tiết</span>
                    ) : (
                        <span className="text-xs">Nhấn để tải {group.totalReports} báo cáo chi tiết</span>
                    )}
                </td>
            </tr>

            {/* Loading row */}
            {expanded && loadingDetail && (
                <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-sm text-muted-foreground">
                        <Loader2 className="mx-auto h-5 w-5 animate-spin mb-1" />
                        Đang tải chi tiết...
                    </td>
                </tr>
            )}

            {/* Empty row */}
            {expanded && !loadingDetail && reports.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-sm text-muted-foreground bg-slate-50/30 dark:bg-slate-800/20">
                        Không có báo cáo nào.
                    </td>
                </tr>
            )}

            {/* Expanded detail rows */}
            {expanded && !loadingDetail && reports.map((report) => (
                <tr
                    key={report.reportId}
                    className="border-b border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                    <td className="px-4 py-3 pl-14">
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 max-w-xs">
                            {report.content}
                        </p>
                        {report.label && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Tag className="h-3 w-3" />
                                {report.label}
                            </span>
                        )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                        })}
                    </td>
                    <td className="px-4 py-3">
                        <StatusBadge status={report.status} />
                    </td>
                    <td className="px-4 py-3">
                        <span className="text-xs text-muted-foreground font-mono">
                            {report.userId ? report.userId.slice(0, 8) + "..." : "Ẩn danh"}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetail(report)}
                                className="gap-1 text-violet-600 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/30"
                                id={`view-${report.reportId}`}
                            >
                                Chi tiết
                            </Button>
                            {report.status === "PENDING" && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={updatingId === report.reportId}
                                        onClick={() => handleAction(report.reportId, "VALID")}
                                        className="gap-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
                                        id={`approve-${report.reportId}`}
                                    >
                                        {updatingId === report.reportId ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        )}
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={updatingId === report.reportId}
                                        onClick={() => handleAction(report.reportId, "INVALID")}
                                        className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                                        id={`reject-${report.reportId}`}
                                    >
                                        {updatingId === report.reportId ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <XCircle className="h-3.5 w-3.5" />
                                        )}
                                        Từ chối
                                    </Button>
                                </>
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    )
}

// ─── Main Page ──────────────────────────────────────────────────────
const PAGE_SIZE = 15

const FILTER_OPTIONS: { value: ReportStatus | "ALL"; label: string }[] = [
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "VALID", label: "Đã duyệt" },
    { value: "INVALID", label: "Từ chối" },
    { value: "ALL", label: "Tất cả" },
]

export default function ModeratorReports() {
    const [groups, setGroups] = useState<GroupedPhoneReport[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(0)
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("PENDING")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    // Detail modal
    const [detailReport, setDetailReport] = useState<PhoneReportItem | null>(null)
    const [modalUpdating, setModalUpdating] = useState(false)

    // Stats
    const [pendingTotal, setPendingTotal] = useState(0)
    const [validTotal, setValidTotal] = useState(0)
    const [invalidTotal, setInvalidTotal] = useState(0)

    const fetchReports = useCallback(
        async (status: ReportStatus | "ALL" = statusFilter, p = page) => {
            setLoading(true)
            setError("")
            try {
                const params = {
                    status: status === "ALL" ? undefined : status,
                    page: p,
                    size: PAGE_SIZE,
                }
                const res = await reportService.getGroupedReports(params)
                const pageData = res.data
                setGroups((pageData.content ?? []).map(g => ({ ...g, reports: g.reports ?? [] })))
                setTotalElements(pageData.totalElements ?? 0)
                setTotalPages(pageData.totalPages ?? 0)
            } catch (err: any) {
                setError(err.message ?? "Không thể tải danh sách báo cáo")
            } finally {
                setLoading(false)
            }
        },
        [statusFilter, page]
    )

    const loadStats = useCallback(async () => {
        try {
            const [pendingRes, validRes, invalidRes] = await Promise.allSettled([
                reportService.getGroupedReports({ status: "PENDING", page: 0, size: 1 }),
                reportService.getGroupedReports({ status: "VALID", page: 0, size: 1 }),
                reportService.getGroupedReports({ status: "INVALID", page: 0, size: 1 }),
            ])
            if (pendingRes.status === "fulfilled") setPendingTotal(pendingRes.value.data.totalElements ?? 0)
            if (validRes.status === "fulfilled") setValidTotal(validRes.value.data.totalElements ?? 0)
            if (invalidRes.status === "fulfilled") setInvalidTotal(invalidRes.value.data.totalElements ?? 0)
        } catch {
            // silent
        }
    }, [])

    useEffect(() => {
        fetchReports(statusFilter, page)
    }, [statusFilter, page])

    useEffect(() => {
        loadStats()
    }, [])

    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
        try {
            await reportService.updateReportStatus(reportId, status)
            await fetchReports(statusFilter, page)
            await loadStats()
            if (detailReport?.reportId === reportId) {
                setDetailReport(null)
            }
        } catch (err: any) {
            setError(err.message ?? "Không thể cập nhật trạng thái")
        }
    }

    const handleModalAction = async (reportId: string, status: ReportStatus) => {
        setModalUpdating(true)
        await handleUpdateStatus(reportId, status)
        setModalUpdating(false)
    }

    // Filter by search (client-side on current page)
    const filtered = groups.filter((g) =>
        g.phoneNumber.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <ModeratorSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Duyệt báo cáo lừa đảo
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Xem xét và phê duyệt các báo cáo từ người dùng
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
                        <Card
                            className="border-amber-200 dark:border-amber-800/40 cursor-pointer hover:border-amber-400 transition-colors"
                            onClick={() => { setStatusFilter("PENDING"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Chờ duyệt</CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-amber-600">{pendingTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Cần xử lý</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="border-emerald-200 dark:border-emerald-800/40 cursor-pointer hover:border-emerald-400 transition-colors"
                            onClick={() => { setStatusFilter("VALID"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Đã duyệt</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-emerald-600">{validTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Gửi lên Manager</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="border-red-200 dark:border-red-800/40 cursor-pointer hover:border-red-400 transition-colors"
                            onClick={() => { setStatusFilter("INVALID"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Từ chối</CardTitle>
                                <ShieldX className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600">{invalidTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Không hợp lệ</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Flow info banner */}
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-800/40 dark:bg-violet-950/20">
                        <FileWarning className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                        <p className="text-xs text-violet-700 dark:text-violet-300">
                            <strong>Quy trình:</strong> Người dùng gửi báo cáo →
                            <span className="font-semibold"> Moderator duyệt</span> (PENDING → VALID/INVALID) →
                            <span className="font-semibold"> Manager xem xét</span> (VALID → RESOLVED)
                        </p>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        {/* Status filter */}
                        <div className="flex gap-1 flex-wrap">
                            {FILTER_OPTIONS.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant={statusFilter === opt.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setStatusFilter(opt.value as ReportStatus | "ALL")
                                        setPage(0)
                                    }}
                                    id={`filter-${opt.value}`}
                                    className={
                                        statusFilter !== opt.value && opt.value === "PENDING"
                                            ? "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400"
                                            : ""
                                    }
                                >
                                    {opt.label}
                                    {opt.value === "PENDING" && pendingTotal > 0 && statusFilter !== "PENDING" && (
                                        <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                            {pendingTotal}
                                        </span>
                                    )}
                                </Button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm số điện thoại..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                                id="moderator-search"
                            />
                        </div>

                        {/* Refresh */}
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
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Số điện thoại / Nội dung
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Thời gian
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Người dùng
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                            Hành động
                                        </th>
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
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                                                {search
                                                    ? "Không tìm thấy số điện thoại phù hợp."
                                                    : statusFilter === "PENDING"
                                                        ? "🎉 Không có báo cáo nào chờ duyệt!"
                                                        : "Không có báo cáo nào."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((group) => (
                                            <ReportGroupRow
                                                key={group.phoneNumber}
                                                group={group}
                                                onUpdateStatus={handleUpdateStatus}
                                                onViewDetail={setDetailReport}
                                                statusFilter={statusFilter}
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
                            <p>Trang {page + 1} / {totalPages} · {totalElements} nhóm</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Count */}
                    {!loading && filtered.length > 0 && (
                        <p className="mt-3 text-right text-xs text-muted-foreground">
                            Hiển thị {filtered.length} / {groups.length} nhóm trên trang này
                        </p>
                    )}
                </main>
            </div>

            {/* Detail Modal */}
            {detailReport && (
                <ReportDetailModal
                    report={detailReport}
                    onClose={() => setDetailReport(null)}
                    onAction={handleModalAction}
                    updating={modalUpdating}
                />
            )}
        </div>
    )
}
