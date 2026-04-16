import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Phone, Clock, FileWarning, MessageSquare, AlertTriangle, Loader2 } from "lucide-react"
import { reportService, PhoneReportItem } from "@/services/report.service"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    PENDING: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    VALID:   { label: "Đã duyệt",   className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
    INVALID: { label: "Từ chối",  className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
    RESOLVED:{ label: "Đã duyệt", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
}

const LABEL_MAP: Record<string, string> = {
    "SCAM": "Lừa đảo",
    "ADVERTISING": "Quảng cáo",
    "SUSPICIOUS": "Đáng ngờ",
    "SPAM": "Làm phiền",
    "UNKNOWN": "Không rõ",
    "SAFE": "An toàn",
}

const CONTACT_METHOD_MAP: Record<string, string> = {
    "ANSWERED": "Đã trả lời cuộc gọi",
    "MISSED_CALL": "Cuộc gọi nhỡ",
    "VOICEMAIL": "Hộp thư thoại",
    "SMS": "Tin nhắn SMS",
    "MMS": "Tin nhắn MMS",
    "OTHER": "Khác",
}

const SCAM_TECHNIQUE_MAP: Record<string, string> = {
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

export default function ReportDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [report, setReport] = useState<PhoneReportItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!id) return
        setLoading(true)
        reportService.getReportById(id)
            .then(res => setReport(res.data))
            .catch(err => setError(err.message || "Không thể tải chi tiết báo cáo. Báo cáo có thể không tồn tại hoặc bạn không có quyền xem."))
            .finally(() => setLoading(false))
    }, [id])

    return (
        <div className="flex flex-1 justify-center px-4 py-8 bg-slate-50 dark:bg-slate-950">
            <div className="w-full max-w-3xl space-y-6">
                {/* Back Button */}
                <Link to="/taikhoan">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-slate-900 dark:hover:text-white -ml-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại trang cá nhân
                    </Button>
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                        <p>Đang tải dữ liệu báo cáo...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/40 dark:bg-slate-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                            <FileWarning className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đã có lỗi xảy ra</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
                    </div>
                ) : report ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Header Card */}
                        <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
                            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start sm:items-center gap-5">
                                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0 ring-1 ring-primary/20">
                                        <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                                            {report.phoneNumber}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            Gửi lúc {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                                                day: "2-digit", month: "2-digit", year: "numeric",
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 flex self-start md:self-auto">
                                    {(() => {
                                        const cfg = STATUS_CONFIG[report.status] ?? { label: report.status, className: "bg-slate-100 text-slate-600 border-slate-200" }
                                        return (
                                            <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold border shadow-sm ${cfg.className} ${cfg.className.replace('bg-', 'border-').replace('text-', '')}`}>
                                                {cfg.label}
                                            </span>
                                        )
                                    })()}
                                </div>
                            </div>
                            
                            <CardContent className="p-6 sm:p-8 space-y-8">
                                {/* Nội dung báo cáo */}
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                        Nội dung bạn đã gửi
                                    </h3>
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800/60 dark:bg-slate-950/50 shadow-inner">
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {report.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Chi tiết kỹ thuật */}
                                {(report.label || report.contactMethod || report.scamTechnique) && (
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Chi tiết kỹ thuật</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {report.label && (
                                                <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-white p-4 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phân loại</span>
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                        {LABEL_MAP[report.label] || report.label}
                                                    </span>
                                                </div>
                                            )}
                                            {report.contactMethod && (
                                                <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-white p-4 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Phương thức liên hệ</span>
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                        {CONTACT_METHOD_MAP[report.contactMethod] || report.contactMethod}
                                                    </span>
                                                </div>
                                            )}
                                            {report.scamTechnique && (
                                                <div className="flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-white p-4 dark:bg-slate-900 dark:border-slate-800 shadow-sm sm:col-span-2">
                                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Kỹ thuật lừa đảo</span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {report.scamTechnique.split(',').map(t => {
                                                            const key = t.trim();
                                                            return (
                                                                <span key={key} className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                    {SCAM_TECHNIQUE_MAP[key] || key}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}


                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
