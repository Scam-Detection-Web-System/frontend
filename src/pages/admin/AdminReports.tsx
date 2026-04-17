import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { reportService, PhoneReportFilterResponse, PhoneReportItem, ReportStatus } from "@/services/report.service"
import { dashboardService } from "@/services/dashboard.service"
import {
    Activity,
    RefreshCw,
    FileWarning,
    Clock,
    ChevronDown,
    ChevronRight,
    Loader2,
    Phone,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ReportDetailModal, LABEL_MAP } from "./ModeratorReports"

const ALL_STATUS_OPTIONS: { value: ReportStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "VALID", label: "Đã duyệt" },
    { value: "INVALID", label: "Từ chối" },
]

function getStatusBadge(status: ReportStatus) {
    const map: Record<ReportStatus, { label: string; className: string }> = {
        PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
        VALID: { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
        INVALID: { label: "Từ chối", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
        RESOLVED: { label: "Đã xử lý", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    }
    const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-700" }
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>
}

// ─── Grouped Report Row (Expandable) ──────────────────────────────────────
function ReportGroupRow({ group, onUpdateStatus, onViewDetail }: {
    group: PhoneReportFilterResponse
    onUpdateStatus: (reportId: string, status: ReportStatus) => Promise<void>
    statusFilter: ReportStatus | "ALL"
    onViewDetail: (reportId: string) => void
}) {
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()

    const handleCreateAssessment = (report: PhoneReportItem) => {
        const query = new URLSearchParams({
            newPhone: report.phoneNumber,
            label: report.label ? (LABEL_MAP[report.label] || report.label) : "",
            review: report.content || "",
        })
        navigate(`/admin/assessments?${query.toString()}`)
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
                    <span className="text-xs">{expanded ? "Thu gọn" : "Mở rộng để xem chi tiết"}</span>
                </td>
            </tr>

            {/* Expanded info row */}
            {expanded && (
                <tr>
                    <td colSpan={5} className="px-4 py-4 bg-slate-50/40 dark:bg-slate-800/20">
                        <div className="pl-10 space-y-3">
                            <div className="flex gap-4 mb-2">
                                {group.carrier && (
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium mr-1 text-slate-700 dark:text-slate-300">Nhà mạng:</span> {group.carrier}
                                    </p>
                                )}
                                {group.phoneType && (
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium mr-1 text-slate-700 dark:text-slate-300">Loại số:</span> {group.phoneType}
                                    </p>
                                )}
                                {group.area && (
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium mr-1 text-slate-700 dark:text-slate-300">Khu vực:</span> {group.area}
                                    </p>
                                )}
                            </div>
                            
                            {/* Inner Reports List */}
                            <div className="space-y-2">
                                {group.phoneReports && group.phoneReports.length > 0 ? (
                                    group.phoneReports.map(report => (
                                        <div key={report.reportId} className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                                            <div className="flex-1 min-w-[250px] space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(report.status)}
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                                                            day: "2-digit", month: "2-digit", year: "numeric", 
                                                            hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                                    {report.content}
                                                </p>
                                            </div>
                                            
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="flex-1 md:flex-none text-xs h-8"
                                                    onClick={() => onViewDetail(report.reportId)}
                                                >
                                                    Mở Modal
                                                </Button>
                                                {report.status === "PENDING" ? (
                                                    <>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="flex-1 md:flex-none text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                                                            onClick={() => onUpdateStatus(report.reportId, "INVALID")}
                                                        >
                                                            Từ chối
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            className="flex-1 md:flex-none text-xs h-8 bg-emerald-600 hover:bg-emerald-700"
                                                            onClick={() => onUpdateStatus(report.reportId, "VALID")}
                                                        >
                                                            Duyệt
                                                        </Button>
                                                    </>
                                                ) : report.status === "VALID" ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCreateAssessment(report)}
                                                        className="flex-1 md:flex-none text-xs h-8 text-amber-600 hover:bg-amber-50 dark:text-amber-500"
                                                    >
                                                        Viết đánh giá cảnh báo
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Không tìm thấy báo cáo chi tiết.</p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function AdminReports() {
    const [groups, setGroups] = useState<PhoneReportFilterResponse[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(0)
    const { user } = useAuth()
    const isManager = user?.role === 'MANAGER'
    const defaultStatus = isManager ? "VALID" : "ALL"

    const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">(defaultStatus)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [detailReportId, setDetailReportId] = useState<string | null>(null)
    const [modalUpdating, setModalUpdating] = useState(false)
    const [actionCount, setActionCount] = useState(0)
    // Allow Managers to see all options including PENDING
    const availableOptions = ALL_STATUS_OPTIONS;

    const fetchReports = useCallback(async (status: ReportStatus | "ALL" = statusFilter) => {
        setLoading(true)
        setError("")
        try {
            if (status === "ALL") {
                const [pRes, vRes, iRes] = await Promise.allSettled([
                    reportService.getReportByStatus("PENDING"),
                    reportService.getReportByStatus("VALID"),
                    reportService.getReportByStatus("INVALID"),
                ])
                let allReports: PhoneReportFilterResponse[] = []
                if (pRes.status === "fulfilled") allReports = [...allReports, ...(pRes.value.data ?? [])]
                if (vRes.status === "fulfilled") allReports = [...allReports, ...(vRes.value.data ?? [])]
                if (iRes.status === "fulfilled") allReports = [...allReports, ...(iRes.value.data ?? [])]
                
                const mergedMap = new Map<string, PhoneReportFilterResponse>()
                allReports.forEach(r => {
                    if (!mergedMap.has(r.phoneNumber)) {
                        mergedMap.set(r.phoneNumber, { ...r })
                    } else {
                        const existing = mergedMap.get(r.phoneNumber)!
                        existing.phoneReports = [...existing.phoneReports, ...r.phoneReports]
                        existing.totalReports = Number(existing.totalReports) + Number(r.totalReports)
                    }
                })
                
                const mergedReports = Array.from(mergedMap.values())
                setGroups(mergedReports)
                setTotalElements(mergedReports.length)
                setTotalPages(1) 
            } else {
                const res = await reportService.getReportByStatus(status)
                const data = res.data ?? []
                setGroups(data)
                setTotalElements(data.length)
                setTotalPages(1)
            }
        } catch (err: any) {
            setError(err.message ?? "Không thể tải danh sách báo cáo")
        } finally {
            setLoading(false)
        }
    }, [statusFilter, page])

    const loadStats = useCallback(async () => {
        try {
            if (isManager) {
                const res = await dashboardService.getAssessmentStats()
                if (res?.success) {
                    setActionCount(res.data.pendingReports)
                }
            } else {
                const res = await dashboardService.getReportStatusStats()
                if (res?.success) {
                    setActionCount(res.data.pendingReports)
                }
            }
        } catch { /* silent */ }
    }, [isManager])

    useEffect(() => {
        fetchReports(statusFilter)
    }, [statusFilter, page])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
        try {
            await reportService.updateReportStatus(reportId, status)
            // Re-fetch to reflect changes
            await fetchReports(statusFilter)
            await loadStats()
            if (detailReportId === reportId) {
                setDetailReportId(null)
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
                                <CardTitle className="text-sm font-medium text-muted-foreground">{isManager ? "Cần xử lý" : "Chờ duyệt"}</CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-amber-600">{actionCount}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng báo cáo</CardTitle>
                                <FileWarning className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">
                                    {groups.reduce((acc, g) => acc + Number(g.totalReports), 0)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1 flex-wrap">
                            {availableOptions.map(opt => (
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
                            onClick={() => fetchReports(statusFilter)}
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
                                                statusFilter={statusFilter}
                                                onViewDetail={setDetailReportId}
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


            {/* Modal */}
            {detailReportId && (
                <ReportDetailModal
                    reportId={detailReportId}
                    onClose={() => setDetailReportId(null)}
                    onAction={handleModalAction}
                    updating={modalUpdating}
                />
            )}
        </div>
    )
}
