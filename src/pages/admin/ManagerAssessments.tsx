import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    assessmentService,
    AssessmentResponse,
    AssessmentCreationRequest,
    AssessmentUpdateRequest,
} from "@/services/assessment.service"
import {
    Activity,
    RefreshCw,
    Plus,
    Edit3,
    Loader2,
    Phone,
    ShieldCheck,
    AlertTriangle,
    X,
    Search,
    ClipboardList,
} from "lucide-react"

// ─── Risk Level config ───────────────────────────────────────────────────────
const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const

type RiskKey = (typeof RISK_LEVELS)[number]

const RISK_CONFIG: Record<RiskKey, { label: string; className: string }> = {
    LOW:      { label: "An toàn",           className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
    MEDIUM:   { label: "Trung bình",        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
    HIGH:     { label: "Nguy hiểm cao",     className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
    CRITICAL: { label: "Cực kỳ nguy hiểm", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
}

function RiskBadge({ level }: { level: string | null }) {
    const cfg = RISK_CONFIG[(level ?? "") as RiskKey] ?? { label: level ?? "—", className: "bg-slate-100 text-slate-700" }
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
            {cfg.label}
        </span>
    )
}

// ─── Assessment Form Modal ────────────────────────────────────────────────────
interface FormState {
    phoneNumber: string
    label: string
    riskLevel: RiskKey
    review: string
    actions: string[]
    advices: string[]
}

function AssessmentFormModal({
    editing,
    initialData,
    onClose,
    onSaved,
}: {
    editing: AssessmentResponse | null  // null = create mode
    initialData?: Partial<FormState>
    onClose: () => void
    onSaved: () => void
}) {
    const isEdit = editing !== null

    const [form, setForm] = useState<FormState>({
        phoneNumber: editing?.phoneNumber ?? initialData?.phoneNumber ?? "",
        label:       editing?.label ?? initialData?.label ?? "",
        riskLevel:   (editing?.riskLevel as RiskKey) ?? initialData?.riskLevel ?? "LOW",
        review:      editing?.review ?? initialData?.review ?? "",
        actions:     editing?.actions ?? [],
        advices:     editing?.advices ?? [],
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [newAction, setNewAction] = useState("")
    const [newAdvice, setNewAdvice] = useState("")

    const handleChange = (field: keyof FormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const addTag = (field: "actions" | "advices", value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return
        setForm(prev => ({ ...prev, [field]: [...prev[field], trimmed] }))
        if (field === "actions") setNewAction("")
        else setNewAdvice("")
    }

    const removeTag = (field: "actions" | "advices", idx: number) => {
        setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))
    }

    const handleSave = async () => {
        if (!form.phoneNumber.trim()) {
            setError("Số điện thoại không được để trống")
            return
        }
        setSaving(true)
        setError("")
        try {
            if (isEdit && editing) {
                const req: AssessmentUpdateRequest = {
                    label:     form.label || undefined,
                    riskLevel: form.riskLevel,
                    review:    form.review || undefined,
                    actions:   form.actions.length > 0 ? form.actions : undefined,
                    advices:   form.advices.length > 0 ? form.advices : undefined,
                }
                await assessmentService.updateAssessment(editing.assessmentId, req)
            } else {
                const req: AssessmentCreationRequest = {
                    phoneNumber: form.phoneNumber.trim(),
                    label:       form.label || undefined,
                    riskLevel:   form.riskLevel,
                    review:      form.review || undefined,
                    actions:     form.actions.length > 0 ? form.actions : undefined,
                    advices:     form.advices.length > 0 ? form.advices : undefined,
                }
                await assessmentService.createAssessment(req)
            }
            onSaved()
            onClose()
        } catch (err: any) {
            setError(err.message ?? "Không thể lưu đánh giá")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            {isEdit ? <Edit3 className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                {isEdit ? "Cập nhật đánh giá" : "Tạo đánh giá mới"}
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                {isEdit ? `SĐT: ${editing?.phoneNumber}` : "Đánh giá chính thức cho số điện thoại"}
                            </p>
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
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Phone number — only editable in create mode */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Số điện thoại *
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={form.phoneNumber}
                                onChange={e => handleChange("phoneNumber", e.target.value)}
                                disabled={isEdit}
                                placeholder="0912 345 678"
                                className="pl-9 font-mono"
                            />
                        </div>
                    </div>

                    {/* Risk Level */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Mức độ nguy hiểm
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {RISK_LEVELS.map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleChange("riskLevel", level)}
                                    className={`rounded-lg border-2 px-3 py-2 text-xs font-semibold transition-all ${
                                        form.riskLevel === level
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                            : "border-slate-200 dark:border-slate-700 text-muted-foreground hover:border-slate-300"
                                    }`}
                                    id={`risk-${level}`}
                                >
                                    {RISK_CONFIG[level].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Label */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Phân loại lừa đảo
                        </label>
                        <Input
                            value={form.label}
                            onChange={e => handleChange("label", e.target.value)}
                            placeholder="VD: Giả mạo ngân hàng, Lừa đảo tài chính..."
                        />
                    </div>

                    {/* Review */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Nội dung đánh giá
                        </label>
                        <Textarea
                            value={form.review}
                            onChange={e => handleChange("review", e.target.value)}
                            placeholder="Nhập nhận xét chuyên gia về số điện thoại này..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Hành động khuyến nghị <span className="text-[10px] text-slate-400 normal-case">(nếu gặp số này)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
                            {form.actions.map((a, i) => (
                                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2.5 py-1 text-xs font-medium">
                                    {a}
                                    <button type="button" onClick={() => removeTag("actions", i)} className="hover:text-orange-900 dark:hover:text-orange-100">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newAction}
                                onChange={e => setNewAction(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag("actions", newAction))}
                                placeholder="VD: Không nhấc máy, Chặn số..."
                                className="text-sm"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => addTag("actions", newAction)} className="shrink-0">Thêm</Button>
                        </div>
                    </div>

                    {/* Advices */}
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                            Lời khuyên phòng tránh <span className="text-[10px] text-slate-400 normal-case">(tư vấn cho cộng đồng)</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px]">
                            {form.advices.map((a, i) => (
                                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 text-xs font-medium">
                                    {a}
                                    <button type="button" onClick={() => removeTag("advices", i)} className="hover:text-blue-900 dark:hover:text-blue-100">×</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newAdvice}
                                onChange={e => setNewAdvice(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag("advices", newAdvice))}
                                placeholder="VD: Kiểm tra kỹ trước chuyển tiền..."
                                className="text-sm"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => addTag("advices", newAdvice)} className="shrink-0">Thêm</Button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                        Hủy
                    </Button>
                    <Button className="flex-1 gap-2" onClick={handleSave} disabled={saving} id="save-assessment">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        {isEdit ? "Cập nhật" : "Tạo đánh giá"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─── Assessment Row ───────────────────────────────────────────────────────────
function AssessmentRow({
    assessment,
    onEdit,
}: {
    assessment: AssessmentResponse
    onEdit: (a: AssessmentResponse) => void
}) {
    return (
        <tr className="border-b border-slate-100 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
                        <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{assessment.phoneNumber}</span>
                </div>
            </td>
            <td className="px-4 py-3">
                <RiskBadge level={assessment.riskLevel} />
            </td>
            <td className="px-4 py-3">
                <span className="text-sm text-muted-foreground">{assessment.label ?? "—"}</span>
            </td>
            <td className="px-4 py-3 max-w-xs">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                    {assessment.review ?? <span className="text-muted-foreground italic">Chưa có nhận xét</span>}
                </p>
            </td>
            <td className="px-4 py-3">
                <div className="text-xs text-muted-foreground space-y-0.5">
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">{assessment.totalReports ?? 0}</span> báo cáo</p>
                    <p><span className="font-semibold text-emerald-600">{assessment.validReports ?? 0}</span> hợp lệ</p>
                </div>
            </td>
            <td className="px-4 py-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(assessment)}
                    className="gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30"
                    id={`edit-${assessment.assessmentId}`}
                >
                    <Edit3 className="h-3.5 w-3.5" />
                    Sửa
                </Button>
            </td>
        </tr>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 15

export default function ManagerAssessments() {
    const [assessments, setAssessments] = useState<AssessmentResponse[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    // Modal state
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<AssessmentResponse | null>(null)
    const [initialData, setInitialData] = useState<Partial<FormState>>({})
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const newPhone = searchParams.get("newPhone")
        if (newPhone) {
            setInitialData({
                phoneNumber: newPhone,
                label: searchParams.get("label") || "",
                review: searchParams.get("review") || "",
            })
            setEditing(null)
            setShowModal(true)
            
            // Clean up url to not trigger again on reload
            searchParams.delete("newPhone")
            searchParams.delete("label")
            searchParams.delete("review")
            setSearchParams(searchParams, { replace: true })
        }
    }, [])

    const fetchAssessments = useCallback(async (p = page) => {
        setLoading(true)
        setError("")
        try {
            const res = await assessmentService.getAssessmentsPage({ page: p, size: PAGE_SIZE })
            setAssessments(res.data.content ?? [])
            setTotalPages(res.data.totalPages ?? 0)
            setTotalElements(res.data.totalElements ?? 0)
        } catch (err: any) {
            setError(err.message ?? "Không thể tải danh sách đánh giá")
        } finally {
            setLoading(false)
        }
    }, [page])

    useEffect(() => {
        fetchAssessments(page)
    }, [page])

    const openCreate = () => {
        setEditing(null)
        setInitialData({})
        setShowModal(true)
    }

    const openEdit = (a: AssessmentResponse) => {
        setEditing(a)
        setShowModal(true)
    }

    // Search by phone — call API if search has 10 digits, else local filter
    const handleSearch = async () => {
        const digits = search.replace(/\D/g, "")
        if (digits.length < 10) return
        setLoading(true)
        setError("")
        try {
            const res = await assessmentService.searchByPhoneNumber(digits)
            if (res?.data) {
                setAssessments([res.data])
                setTotalPages(1)
                setTotalElements(1)
            } else {
                setAssessments([])
                setTotalPages(0)
                setTotalElements(0)
            }
        } catch {
            setAssessments([])
            setError("Không tìm thấy đánh giá cho số điện thoại này")
        } finally {
            setLoading(false)
        }
    }

    const clearSearch = () => {
        setSearch("")
        fetchAssessments(0)
        setPage(0)
    }

    const filtered = assessments

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Đánh giá số điện thoại
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Quản lý bài đánh giá chính thức cho các số điện thoại bị báo cáo
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
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đánh giá</CardTitle>
                                <ClipboardList className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-blue-600">{totalElements}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">số điện thoại được đánh giá</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Nguy hiểm cao</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-red-600">
                                    {assessments.filter(a => a.riskLevel === "HIGH" || a.riskLevel === "CRITICAL").length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">trên trang này</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">An toàn</CardTitle>
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {assessments.filter(a => a.riskLevel === "LOW").length}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">trên trang này</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[220px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Nhập số điện thoại cần tìm..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                className="pl-9 pr-20"
                                id="assessment-search"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-700 p-1"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <Button
                                size="sm"
                                onClick={handleSearch}
                                disabled={!search.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                            >
                                Tìm
                            </Button>
                        </div>

                        {/* Refresh */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fetchAssessments(page)}
                            title="Làm mới"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>

                        {/* Create */}
                        <Button
                            onClick={openCreate}
                            className="ml-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            id="create-assessment"
                        >
                            <Plus className="h-4 w-4" />
                            Tạo đánh giá mới
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
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Số điện thoại</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mức độ nguy hiểm</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phân loại</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nội dung đánh giá</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bình luận</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                                Chưa có đánh giá nào. Nhấn <strong>Tạo đánh giá mới</strong> để bắt đầu.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(a => (
                                            <AssessmentRow
                                                key={a.assessmentId}
                                                assessment={a}
                                                onEdit={openEdit}
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
                            <p>Trang {page + 1} / {totalPages} · {totalElements} đánh giá</p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                >
                                    Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {showModal && (
                <AssessmentFormModal
                    editing={editing}
                    initialData={initialData}
                    onClose={() => setShowModal(false)}
                    onSaved={() => fetchAssessments(page)}
                />
            )}
        </div>
    )
}
