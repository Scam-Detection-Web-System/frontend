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
    PhoneReportFilterResponse,
    PhoneReportItem,
    ReportStatus,
} from "@/services/report.service"
import {
    Activity,
    RefreshCw,
    FileWarning,
    Clock,
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
    const statusMap: Record<ReportStatus, { label: string; className: string }> = {
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
    RESOLVED: { // ✅ thêm dòng này
        label: "Đã xử lý",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    }
    const s = statusMap[status] ?? { label: status, className: "bg-slate-100 text-slate-700" }
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
            {s.label}
        </span>
    )
}

// ─── Translation Maps ──────────────────────────────────────────────
export const LABEL_MAP: Record<string, string> = {
    "SCAM": "Lừa đảo",
    "ADVERTISING": "Quảng cáo",
    "SUSPICIOUS": "Đáng ngờ",
    "SPAM": "Làm phiền",
    "UNKNOWN": "Không rõ",
    "SAFE": "An toàn",
}

export const CONTACT_METHOD_MAP: Record<string, string> = {
    "ANSWERED": "Đã trả lời cuộc gọi",
    "MISSED_CALL": "Cuộc gọi nhỡ",
    "VOICEMAIL": "Hộp thư thoại",
    "SMS": "Tin nhắn SMS",
    "MMS": "Tin nhắn MMS",
    "OTHER": "Khác",
}

export const SCAM_TECHNIQUE_MAP: Record<string, string> = {
    "IMPERSONATION": "Giả mạo tổ chức",
    "LOTTERY": "Lừa trúng thưởng",
    "URGENCY": "Tạo áp lực khẩn cấp",
    "THREAT": "Đe dọa",
    "DEBT": "Đòi nợ",
    "PHISHING_LINK": "Liên kết lừa đảo",
    "APP_INSTALL": "Lừa cài ứng dụng",
    "GAMBLING": "Lừa cờ bạc",
    "WRONG_TRANSFER": "Giả chuyển nhầm tiền",
    "ZALO_FRIEND": "Kết bạn Zalo lừa đảo",
    "AI_VOICE": "Giả giọng nói AI",
    "FAKE_DOCUMENT": "Tài liệu giả mạo",
    "DATA_COLLECTION": "Thu thập thông tin cá nhân",
    "OTHER": "Khác",
}

// ─── Detail Modal ──────────────────────────────────────────────────
export function ReportDetailModal({
    reportId,
    onClose,
    onAction,
    updating,
}: {
    reportId: string
    onClose: () => void
    onAction: (reportId: string, status: ReportStatus) => Promise<void>
    updating: boolean
}) {
    const [report, setReport] = useState<PhoneReportItem | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(true)
    const [fetchError, setFetchError] = useState("")

    useEffect(() => {
        setLoadingDetail(true)
        setFetchError("")
        reportService.getReportById(reportId)
            .then(res => setReport(res.data))
            .catch(() => setFetchError("Không thể tải chi tiết báo cáo."))
            .finally(() => setLoadingDetail(false))
    }, [reportId])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                            <Phone className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                                {report?.phoneNumber ?? "..."}
                            </h2>
                            {report && <StatusBadge status={report.status} />}
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
                    {loadingDetail ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <p className="text-sm">Đang tải chi tiết báo cáo...</p>
                        </div>
                    ) : fetchError ? (
                        <p className="text-sm text-red-500 text-center py-6">{fetchError}</p>
                    ) : report ? (
                        <>
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

                            {/* AI Prediction Result */}
                            {report.predictionResult && (
                                <div className={`rounded-xl border p-4 ${report.predictionResult.toxic
                                        ? "border-red-200 bg-red-50 dark:border-red-800/40 dark:bg-red-950/20"
                                        : "border-emerald-200 bg-emerald-50 dark:border-emerald-800/40 dark:bg-emerald-950/20"
                                    }`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangle className={`h-4 w-4 ${report.predictionResult.toxic ? "text-red-600" : "text-emerald-600"
                                            }`} />
                                        <span className={`text-xs font-semibold uppercase tracking-wide ${report.predictionResult.toxic ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                                            }`}>
                                            Phân tích AI — Điểm số: {(report.predictionResult.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                                        {report.predictionResult.reason}
                                    </p>
                                    {report.predictionResult.words.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {report.predictionResult.words.map((w, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                >
                                                    {w}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Meta info grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {report.label && (
                                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Đặc điểm</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                            {LABEL_MAP[report.label] || report.label}
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
                                            {CONTACT_METHOD_MAP[report.contactMethod] || report.contactMethod}
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
                                            {report.scamTechnique.split(',').map(t => SCAM_TECHNIQUE_MAP[t.trim()] || t.trim()).join(', ')}
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
                        </>
                    ) : null}
                </div>

                {/* Actions */}
                {!loadingDetail && report && report.status === "PENDING" && (
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
}: {
    group: PhoneReportFilterResponse
    onUpdateStatus: (reportId: string, status: ReportStatus) => Promise<void>
    onViewDetail: (reportId: string) => void
}) {
    const [expanded, setExpanded] = useState(false)

    return (
        <>
            {/* Group header */}
            <tr
                className="border-b border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        {expanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                            <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                            {group.phoneNumber}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {group.totalReports} báo cáo
                    </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm" colSpan={3}>
                    <span className="text-xs text-muted-foreground">
                        {expanded ? "Thu gọn" : "Mở rộng để xem chi tiết"}
                    </span>
                </td>
            </tr>

            {/* Expanded info */}
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
                                                    <StatusBadge status={report.status} />
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
                                                {report.status === "PENDING" && (
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
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Không tìm thấy báo cáo chi tiết cho số điện thoại này theo bộ lọc hiện tại.</p>
                                )}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
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
    const [groups, setGroups] = useState<PhoneReportFilterResponse[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(0)
    const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("PENDING")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    // Detail modal — lưu reportId thay vì toàn bộ object, để modal tự fetch qua getReportById
    const [detailReportId, setDetailReportId] = useState<string | null>(null)
    const [modalUpdating, setModalUpdating] = useState(false)

    // Stats
    const [pendingTotal, setPendingTotal] = useState(0)
    const [validTotal, setValidTotal] = useState(0)
    const [invalidTotal, setInvalidTotal] = useState(0)

    const fetchReports = useCallback(
        async (status: ReportStatus | "ALL" = statusFilter) => {
            setLoading(true)
            setError("")
            try {
                if (status === "ALL") {
                    // Cần fetch tất cả status vì API chỉ cho phép tìm theo status cụ thể
                    const [pRes, vRes, iRes] = await Promise.allSettled([
                        reportService.getReportByStatus("PENDING"),
                        reportService.getReportByStatus("VALID"),
                        reportService.getReportByStatus("INVALID"),
                    ])
                    let allReports: PhoneReportFilterResponse[] = []
                    if (pRes.status === "fulfilled") allReports = [...allReports, ...(pRes.value.data ?? [])]
                    if (vRes.status === "fulfilled") allReports = [...allReports, ...(vRes.value.data ?? [])]
                    if (iRes.status === "fulfilled") allReports = [...allReports, ...(iRes.value.data ?? [])]
                    
                    // Gộp các report trùng phoneNumber
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
                    setTotalPages(1) // Flat list không có phân trang
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
        fetchReports(statusFilter)
    }, [statusFilter, page])

    useEffect(() => {
        loadStats()
    }, [])

    const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
        try {
            await reportService.updateReportStatus(reportId, status)
            await fetchReports(statusFilter)
            await loadStats()
            // Đóng modal sau khi cập nhật
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
                            className="border-slate-200 dark:border-slate-700/50 cursor-pointer hover:border-slate-300 transition-colors"
                            onClick={() => { setStatusFilter("PENDING"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Chờ duyệt</CardTitle>
                                <Clock className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Cần xử lý</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="border-slate-200 dark:border-slate-700/50 cursor-pointer hover:border-slate-300 transition-colors"
                            onClick={() => { setStatusFilter("VALID"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Đã duyệt</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{validTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Gửi lên Manager</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="border-slate-200 dark:border-slate-700/50 cursor-pointer hover:border-slate-300 transition-colors"
                            onClick={() => { setStatusFilter("INVALID"); setPage(0) }}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Từ chối</CardTitle>
                                <ShieldX className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{invalidTotal}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Không hợp lệ</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Flow info banner */}
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                        <FileWarning className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                            <strong>Quy trình:</strong> Người dùng gửi báo cáo →
                            <span className="font-semibold"> Moderator duyệt</span> (PENDING → VALID/INVALID) →
                            <span className="font-semibold"> Manager xem xét</span> (viết đánh giá cảnh báo)
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
