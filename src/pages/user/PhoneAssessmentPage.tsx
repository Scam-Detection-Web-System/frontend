import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    Shield,
    Phone,
    AlertTriangle,
    CheckCircle,
    ArrowLeft,
    Loader2,
    MessageSquare,
    User,
    Calendar,
    MapPin,
    Network,
    Smartphone,
    PhoneCall,
    Send,
    LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { assessmentService, AssessmentResponse } from "@/services/assessment.service"
import { useAuth } from "@/contexts/auth-context"
import { commentService } from "@/services/comment.service"

// ===== Risk Config =====
const RISK_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
    CRITICAL: { label: "Cực kỳ nguy hiểm", color: "text-red-700 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/30",      border: "border-red-300 dark:border-red-700",     icon: AlertTriangle },
    HIGH:     { label: "Nguy hiểm cao",    color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-300 dark:border-orange-700", icon: AlertTriangle },
    MEDIUM:   { label: "Trung bình",       color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/30",   border: "border-amber-300 dark:border-amber-700",   icon: AlertTriangle },
    LOW:      { label: "An toàn",          color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-700", icon: CheckCircle },
}

// ===== Phone Type Labels =====
const PHONE_TYPE_LABELS: Record<string, { label: string; icon: any; color: string }> = {
    MOBILE:   { label: "Số di động",  icon: Smartphone, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
    LANDLINE: { label: "Số cố định",  icon: PhoneCall,  color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    HOTLINE:  { label: "Hotline",     icon: Phone,      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
}

// ===== Carrier Colors =====
const CARRIER_COLORS: Record<string, string> = {
    "Viettel":      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    "Vinaphone":    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    "Mobifone":     "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    "Vietnamobile": "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    "Gmobile":      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    "Reddi":        "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
}

// ===== Client-side phone number detection (Vietnam) =====
interface PhoneInfo {
    carrier: string | null
    phoneType: "MOBILE" | "LANDLINE" | "HOTLINE" | null
    area: string | null
}

function detectPhoneInfo(rawPhone: string): PhoneInfo {
    const phone = rawPhone.replace(/[\s\-\.]/g, "")

    // Hotline patterns (1800, 1900, 18xx, 19xx)
    if (/^(1800|1900|18|19)\d{2,6}$/.test(phone)) {
        return { carrier: null, phoneType: "HOTLINE", area: null }
    }

    // Landline detection by area code prefix
    const landlinePrefixes = [
        "024", "028", "0210", "0211", "0213", "0214", "0215", "0216", "0218", "0219",
        "0220", "0221", "0222", "0225", "0226", "0227", "0228", "0229",
        "0232", "0233", "0234", "0235", "0236", "0237", "0238", "0239",
        "0240", "0241", "0243", "0245", "0246", "0247", "0248", "0249",
        "0251", "0252", "0254", "0255", "0256", "0257", "0258", "0259",
        "0260", "0261", "0262", "0263", "0269", "0270", "0271", "0272",
        "0274", "0275", "0276", "0277", "0290", "0291", "0292", "0293",
        "0294", "0296", "0297",
    ]
    for (const prefix of landlinePrefixes) {
        if (phone.startsWith(prefix)) {
            let area: string | null = null
            if (phone.startsWith("024"))  area = "Hà Nội"
            else if (phone.startsWith("028"))  area = "TP. Hồ Chí Minh"
            else if (phone.startsWith("0236")) area = "Đà Nẵng"
            return { carrier: null, phoneType: "LANDLINE", area }
        }
    }

    // Mobile carrier detection (10-digit, starts with 0)
    const mobileMap: Array<{ prefixes: string[]; carrier: string }> = [
        { prefixes: ["086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039"], carrier: "Viettel" },
        { prefixes: ["088", "091", "094", "083", "084", "085", "081", "082"],                            carrier: "Vinaphone" },
        { prefixes: ["089", "090", "093", "070", "079", "077", "076", "078"],                            carrier: "Mobifone" },
        { prefixes: ["092", "056", "058"],                                                                carrier: "Vietnamobile" },
        { prefixes: ["059", "099"],                                                                       carrier: "Gmobile" },
        { prefixes: ["055", "044"],                                                                       carrier: "Reddi" },
    ]
    for (const { prefixes, carrier } of mobileMap) {
        for (const prefix of prefixes) {
            if (phone.startsWith(prefix) && phone.length === 10) {
                return { carrier, phoneType: "MOBILE", area: null }
            }
        }
    }

    return { carrier: null, phoneType: null, area: null }
}

// ===== Main Component =====
export default function PhoneAssessmentPage() {
    const { phone } = useParams<{ phone: string }>()
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null)
    const [loading, setLoading] = useState(true)
    
    // Comment state
    const { isAuthenticated, user } = useAuth()
    const [newComment, setNewComment] = useState('')
    const [selectedLabel, setSelectedLabel] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)

    const SCAM_LABELS = [
        "Lừa đảo",
        "Spam",
        "Đòi nợ",
        "Quảng cáo",
        "Giả danh",
        "Khác"
    ]

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !assessment || !isAuthenticated) return
        setSubmittingComment(true)
        try {
            const payload = {
                content: newComment.trim(),
                scamLabel: selectedLabel || null
            }
            const res = await commentService.createComment(assessment.assessmentId, payload)
            // Thêm comment mới lên đầu danh sách
            setAssessment(prev => prev ? {
                ...prev,
                comments: [res.data as any, ...(prev.comments || [])]
            } : null)
            setNewComment('')
        } catch (e: any) {
            alert(e.message || "Lỗi khi gửi bình luận")
        } finally {
            setSubmittingComment(false)
        }
    }

    useEffect(() => {
        if (!phone) return
        async function fetchAssessment() {
            setLoading(true)
            try {
                const res = await assessmentService.searchByPhoneNumber(phone!)
                setAssessment(res?.data ?? null)
            } catch {
                setAssessment(null)
            } finally {
                setLoading(false)
            }
        }
        fetchAssessment()
    }, [phone])

    if (!phone) return null

    const formatPhone = (p: string) => p.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")

    // Merge: API data takes priority, client-side detection as fallback
    const detected = detectPhoneInfo(phone)
    const carrier   = assessment?.carrier   ?? detected.carrier
    const phoneType = assessment?.phoneType ?? detected.phoneType
    const area      = assessment?.area      ?? detected.area

    const phoneTypeConfig   = phoneType ? PHONE_TYPE_LABELS[phoneType] : null
    const carrierColorClass = carrier ? (CARRIER_COLORS[carrier] ?? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700") : null

    return (
        <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
            <div className="container mx-auto max-w-4xl px-4">

                {/* Back button */}
                <Link to="/kiemtra">
                    <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-slate-900 dark:hover:text-white">
                        <ArrowLeft className="h-4 w-4" /> Quay lại công cụ kiểm tra
                    </Button>
                </Link>

                {/* Header Profile */}
                <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                            <Phone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                                {formatPhone(phone)}
                            </h1>
                            <p className="mt-2 text-slate-500 max-w-2xl">
                                Nền tảng đánh giá và chia sẻ thông tin mức độ an toàn của số điện thoại do chuyên gia chống lừa đảo thẩm định.
                            </p>

                            {/* Info Badges */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                {carrier && (
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${carrierColorClass}`}>
                                        <Network className="h-3.5 w-3.5" />
                                        {carrier}
                                    </span>
                                )}
                                {phoneTypeConfig && (
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${phoneTypeConfig.color}`}>
                                        <phoneTypeConfig.icon className="h-3.5 w-3.5" />
                                        {phoneTypeConfig.label}
                                    </span>
                                )}
                                {area && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {area}
                                    </span>
                                )}
                                {!assessment && (carrier || phoneType) && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500">
                                        Phân tích tự động
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p>Đang tải dữ liệu đánh giá...</p>
                    </div>
                ) : !assessment ? (
                    <div className="space-y-6">
                        <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                            <Shield className="h-5 w-5" />
                            <AlertTitle className="text-lg font-semibold">Chưa có đánh giá chính thức</AlertTitle>
                            <AlertDescription className="mt-2 text-sm leading-relaxed">
                                Hiện tại hệ thống chưa có nhận xét chuyên sâu từ chuyên gia về số điện thoại này. Nếu bạn từng bị số này làm phiền hoặc lừa đảo, hãy gửi báo cáo về cho chúng tôi.
                            </AlertDescription>
                        </Alert>
                        <div className="flex justify-center pt-4">
                            <Link to={`/baocao?phone=${phone}`}>
                                <Button size="lg" className="gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Báo cáo số này ngay
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Official Assessment Card */}
                        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                            {(() => {
                                const risk = RISK_CONFIG[assessment.riskLevel ?? 'LOW'] ?? RISK_CONFIG['LOW']
                                const Icon = risk.icon
                                return (
                                    <>
                                        <div className={`p-6 sm:p-8 ${risk.bg} border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4`}>
                                            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm ${risk.color}`}>
                                                <Icon className="h-8 w-8" />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h2 className={`text-2xl font-bold ${risk.color}`}>
                                                    {risk.label}
                                                </h2>
                                                {assessment.label && (
                                                    <p className="mt-2 inline-flex items-center rounded-full bg-white/60 dark:bg-slate-900/60 px-3 py-1 text-sm font-medium border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-200">
                                                        Phân loại: <span className="ml-1 font-bold">{assessment.label}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                                                <Shield className="h-5 w-5 text-blue-600" />
                                                <h3 className="text-lg font-bold">Nhận xét từ chuyên gia</h3>
                                            </div>
                                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                                                {assessment.review ? (
                                                    <p className="whitespace-pre-wrap">{assessment.review}</p>
                                                ) : (
                                                    <p className="italic text-slate-400">Chuyên gia chưa để lại nhận xét chi tiết.</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>

                        {/* Comments Section */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-indigo-500" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cộng đồng báo cáo</h3>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {assessment.comments?.length ?? 0} lượt chia sẻ
                                </span>
                            </div>

                            {/* Comment Input */}
                            <div className="mb-8 border-b border-slate-100 pb-8 dark:border-slate-800">
                                {!isAuthenticated ? (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
                                        <p className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                                            Vui lòng đăng nhập để tham gia bình luận và báo cáo
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                                            onClick={() => window.dispatchEvent(new CustomEvent("open-login-dialog"))}
                                        >
                                            <LogIn className="h-4 w-4" /> Đăng nhập
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {SCAM_LABELS.map(label => (
                                                    <button
                                                        key={label}
                                                        onClick={() => setSelectedLabel(prev => prev === label ? '' : label)}
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                                                            selectedLabel === label
                                                                ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50"
                                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800/80"
                                                        }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                            <Textarea
                                                placeholder="Chia sẻ trải nghiệm của bạn về số điện thoại này..."
                                                className="min-h-[100px] resize-none bg-slate-50 dark:bg-slate-900"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleCommentSubmit}
                                                    disabled={!newComment.trim() || submittingComment}
                                                    className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    {submittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    Gửi báo cáo
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {(!assessment.comments || assessment.comments.length === 0) ? (
                                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                                    <p className="text-slate-500">Chưa có bình luận hoặc báo cáo từ cộng đồng.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {assessment.comments.map((cmt) => (
                                        <div key={cmt.commentId} className="flex gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0 dark:border-slate-800">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {cmt.username || "Người dùng ẩn danh"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                                {cmt.scamLabel && (
                                                    <span className="inline-block rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                                                        # {cmt.scamLabel}
                                                    </span>
                                                )}
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {cmt.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
