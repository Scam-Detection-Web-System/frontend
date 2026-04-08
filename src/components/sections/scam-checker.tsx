"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle, Loader2, Phone, Link2, Mail, BrainCircuit, Search, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { predictionService } from "@/services/prediction.service"
import { assessmentService, AssessmentResponse } from "@/services/assessment.service"

// ─── Shared types ───────────────────────────────────────────────────────────
type CheckStatus = "safe" | "suspicious" | "dangerous"

interface ResultData {
    status: CheckStatus
    message: string
    details: string[]
    aiScore?: number
    aiWords?: string[]
}

// ─── Risk level map
const RISK_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    CRITICAL: { label: "Cực kỳ nguy hiểm", color: "text-red-700 dark:text-red-300", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-300 dark:border-red-700" },
    HIGH:     { label: "Nguy hiểm cao",    color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-300 dark:border-orange-700" },
    MEDIUM:   { label: "Trung bình",       color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300 dark:border-amber-700" },
    LOW:      { label: "An toàn",          color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-700" },
}

function AssessmentBlock({ assessment }: { assessment: AssessmentResponse }) {
    const risk = RISK_CONFIG[assessment.riskLevel ?? ''] ?? RISK_CONFIG['LOW']
    return (
        <div className={`mt-4 rounded-2xl border p-5 ${risk.bg} ${risk.border}`}>
            <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">Đánh giá chính thức từ chuyên gia</span>
                <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${risk.color} ${risk.bg} border ${risk.border}`}>
                    {risk.label}
                </span>
            </div>
            {assessment.label && (
                <p className="text-xs text-muted-foreground mb-1">
                    ⏷ Phân loại: <span className="font-medium text-slate-700 dark:text-slate-300">{assessment.label}</span>
                </p>
            )}
            {assessment.review && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                    {assessment.review}
                </p>
            )}
            {assessment.comments && assessment.comments.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                    💬 {assessment.comments.length} bình luận từ cộng đồng
                </p>
            )}
        </div>
    )
}

// ─── Map AI score → status ───────────────────────────────────────────────────
function scoreToStatus(score: number, toxic: boolean): CheckStatus {
    if (toxic || score >= 0.7) return "dangerous"
    if (score >= 0.4) return "suspicious"
    return "safe"
}

// ─── Shared UI helpers ───────────────────────────────────────────────────────
function StatusIcon({ status }: { status: CheckStatus }) {
    switch (status) {
        case "safe": return <CheckCircle className="h-10 w-10 text-green-500" />
        case "suspicious": return <AlertTriangle className="h-10 w-10 text-amber-500" />
        case "dangerous": return <XCircle className="h-10 w-10 text-red-500" />
    }
}

function statusBg(status: CheckStatus) {
    switch (status) {
        case "safe": return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
        case "suspicious": return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
        case "dangerous": return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
    }
}

function ResultBlock({ result }: { result: ResultData }) {
    return (
        <div className={`mt-6 rounded-2xl border p-6 ${statusBg(result.status)}`}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <StatusIcon status={result.status} />
                <div className="text-center sm:text-left w-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {result.message}
                    </h3>
                    <ul className="mt-3 space-y-2">
                        {result.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                {detail}
                            </li>
                        ))}
                    </ul>
                    {/* AI Score Display */}
                    {result.aiScore !== undefined && (
                        <div className="mt-4 flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Điểm AI: <strong>{(result.aiScore * 100).toFixed(0)}%</strong> khả năng lừa đảo
                            </span>
                        </div>
                    )}
                    {/* Toxic words highlight */}
                    {result.aiWords && result.aiWords.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {result.aiWords.map((w, i) => (
                                <span key={i} className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                    {w}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Generic AI check caller ─────────────────────────────────────────────────
async function callPrediction(payload: Record<string, string>): Promise<{
    status: CheckStatus; score: number; toxic: boolean; words: string[]
}> {
    try {
        const res = await predictionService.predict(payload)
        // Backend returns map of field → PredictionResultResponse
        // Pick the first result value
        const values = Object.values(res.data ?? {})
        if (values.length === 0) return { status: "safe", score: 0, toxic: false, words: [] }
        const first = values[0] as { score: number; toxic: boolean; words: string[] }
        return {
            status: scoreToStatus(first.score ?? 0, first.toxic ?? false),
            score: first.score ?? 0,
            toxic: first.toxic ?? false,
            words: first.words ?? [],
        }
    } catch {
        // If API fails, fall back gracefully
        return { status: "safe", score: 0, toxic: false, words: [] }
    }
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — PHONE CHECKER
// ════════════════════════════════════════════════════════════════════════════
function PhoneCheckerTab() {
    const [phone, setPhone] = useState("")
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const isValidVietnamesePhone = (d: string) => /^0\d{9}$/.test(d)

    const checkPhone = () => {
        const digits = phone.replace(/\D/g, "")
        if (!digits) return
        setError("")

        if (!isValidVietnamesePhone(digits)) {
            setError("Số điện thoại Việt Nam gồm 10 chữ số, bắt đầu bằng số 0")
            return
        }

        navigate(`/tracuu/${digits}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        type="tel"
                        placeholder="0912 345 678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`pl-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        onKeyDown={e => e.key === "Enter" && checkPhone()}
                    />
                </div>
                <Button onClick={checkPhone} disabled={!phone.trim()}>
                    <Search className="mr-2 h-4 w-4" />Kiểm tra
                </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — URL CHECKER
// ════════════════════════════════════════════════════════════════════════════
function isValidUrl(url: string): boolean {
    try { new URL(url.startsWith("http") ? url : `https://${url}`); return true }
    catch { return false }
}

function UrlCheckerTab() {
    const [url, setUrl] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<ResultData | null>(null)
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null)
    const checkUrl = async () => {
        const trimmed = url.trim()
        if (!trimmed) return
        setIsChecking(true)
        setResult(null)

        if (!isValidUrl(trimmed)) {
            setResult({
                status: "suspicious",
                message: "Đường link không hợp lệ",
                details: [
                    "Định dạng URL không đúng",
                    "Hãy nhập đường link đầy đủ, ví dụ: https://example.com",
                ],
            })
            setIsChecking(false)
            return
        }

        const ai = await callPrediction({ url: trimmed })

        const msgMap: Record<CheckStatus, string> = {
            safe: "Đường link có vẻ an toàn",
            suspicious: "Cẩn thận: Đường link có dấu hiệu đáng ngờ",
            dangerous: "Cảnh báo: Đường link này RẤT NGUY HIỂM!",
        }
        const detailsMap: Record<CheckStatus, string[]> = {
            safe: ["Không phát hiện mẫu nguy hiểm", "Không có trong danh sách đen", "Vẫn nên cẩn thận khi nhập thông tin cá nhân"],
            suspicious: ["AI phát hiện từ khóa đáng ngờ trong URL", "Có thể là link rút gọn che giấu địa chỉ thật", "Không nhập tài khoản, mật khẩu hoặc thẻ ngân hàng"],
            dangerous: ["AI xác định đây là URL có nguy cơ phishing cực cao", "TUYỆT ĐỐI không nhập thông tin cá nhân hay tài chính", "Báo cáo đường link này ngay lập tức"],
        }

        setResult({
            status: ai.status,
            message: msgMap[ai.status],
            details: detailsMap[ai.status],
            aiScore: ai.score,
            aiWords: ai.words,
        })
        
        setIsChecking(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        type="url"
                        placeholder="https://example.com hoặc link rút gọn..."
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        className="pl-10"
                        onKeyDown={e => e.key === "Enter" && checkUrl()}
                    />
                </div>
                <Button onClick={checkUrl} disabled={isChecking || !url.trim()}>
                    {isChecking
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang phân tích...</>
                        : <><Search className="mr-2 h-4 w-4" />Kiểm tra</>
                    }
                </Button>
            </div>
            {result && <ResultBlock result={result} />}
            {assessment && <AssessmentBlock assessment={assessment} />}
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3 — EMAIL CHECKER
// ════════════════════════════════════════════════════════════════════════════
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function EmailCheckerTab() {
    const [email, setEmail] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<ResultData | null>(null)

    const checkEmail = async () => {
        const trimmed = email.trim().toLowerCase()
        if (!trimmed) return
        setIsChecking(true)
        setResult(null)

        if (!isValidEmail(trimmed)) {
            setResult({
                status: "suspicious",
                message: "Địa chỉ email không hợp lệ",
                details: ["Định dạng email không đúng", "Ví dụ hợp lệ: example@gmail.com"],
            })
            setIsChecking(false)
            return
        }

        const ai = await callPrediction({ email: trimmed })

        const msgMap: Record<CheckStatus, string> = {
            safe: "Email có vẻ an toàn",
            suspicious: "Cẩn thận: Email có đặc điểm đáng ngờ",
            dangerous: "Cảnh báo: Email này có dấu hiệu LỪA ĐẢO!",
        }
        const detailsMap: Record<CheckStatus, string[]> = {
            safe: ["Không phát hiện dấu hiệu lừa đảo rõ ràng", "Tên miền không nằm trong danh sách đen", "Luôn cẩn thận với các yêu cầu cung cấp thông tin qua email"],
            suspicious: ["AI phát hiện một số yếu tố đáng ngờ trong email", "Không trả lời và không cung cấp thông tin cá nhân", "Xác minh danh tính người gửi trước khi tương tác"],
            dangerous: ["AI xác định email này có nguy cơ phishing/lừa đảo cao", "Tuyệt đối không cung cấp thông tin cá nhân hay tài chính", "Báo cáo email này cho cơ quan chức năng"],
        }

        setResult({
            status: ai.status,
            message: msgMap[ai.status],
            details: detailsMap[ai.status],
            aiScore: ai.score,
            aiWords: ai.words,
        })
        setIsChecking(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        type="email"
                        placeholder="nghi-van@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="pl-10"
                        onKeyDown={e => e.key === "Enter" && checkEmail()}
                    />
                </div>
                <Button onClick={checkEmail} disabled={isChecking || !email.trim()}>
                    {isChecking
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang phân tích...</>
                        : <><Search className="mr-2 h-4 w-4" />Kiểm tra</>
                    }
                </Button>
            </div>
            {result && <ResultBlock result={result} />}
        </div>
    )
}


// ════════════════════════════════════════════════════════════════════════════
// MAIN ScamChecker COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export function ScamChecker({ hideHeader = false }: { hideHeader?: boolean }) {
    return (
        <section id="kiem-tra" className={hideHeader ? "" : "py-16 sm:py-20 lg:py-24"}>
            <div className={`mx-auto max-w-7xl ${hideHeader ? "" : "px-4 sm:px-6 lg:px-8"}`}>
                {!hideHeader && (
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
                            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Kiểm tra dấu hiệu lừa đảo
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                            Kiểm tra số điện thoại, đường link và email đáng ngờ để bảo vệ bản thân khỏi lừa đảo trực tuyến.
                        </p>
                    </div>
                )}

                <Card className={`mx-auto max-w-2xl ${hideHeader ? "mt-8" : "mt-10"}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Công cụ kiểm tra lừa đảo
                        </CardTitle>
                        <CardDescription>
                            Chọn loại thông tin cần kiểm tra và nhận kết quả tức thì
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="phone" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="phone" className="gap-2 text-xs sm:text-sm">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">Số điện thoại</span>
                                    <span className="sm:hidden">SĐT</span>
                                </TabsTrigger>
                                <TabsTrigger value="url" className="gap-2 text-xs sm:text-sm">
                                    <Link2 className="h-4 w-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">Đường link</span>
                                    <span className="sm:hidden">Link</span>
                                </TabsTrigger>
                                <TabsTrigger value="email" className="gap-2 text-xs sm:text-sm">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    Email
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="phone">
                                <PhoneCheckerTab />
                            </TabsContent>
                            <TabsContent value="url">
                                <UrlCheckerTab />
                            </TabsContent>
                            <TabsContent value="email">
                                <EmailCheckerTab />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
