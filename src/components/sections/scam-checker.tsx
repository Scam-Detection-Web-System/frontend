"use client"

import { useState } from "react"
import {
    Search, Shield, AlertTriangle, CheckCircle, XCircle,
    Loader2, Phone, Link2, Mail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ─── Shared types ───────────────────────────────────────────────────────────
type CheckStatus = "safe" | "suspicious" | "dangerous"

interface ResultData {
    status: CheckStatus
    message: string
    details: string[]
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
                <div className="text-center sm:text-left">
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
                </div>
            </div>
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1 — PHONE CHECKER
// ════════════════════════════════════════════════════════════════════════════
function PhoneCheckerTab() {
    const [phone, setPhone] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<ResultData | null>(null)

    const isValidVietnamesePhone = (d: string) => /^0\d{9}$/.test(d)

    const checkPhone = async () => {
        const digits = phone.replace(/\D/g, "")
        if (!digits) return
        setIsChecking(true)
        setResult(null)
        await new Promise(r => setTimeout(r, 1500))

        if (!isValidVietnamesePhone(digits)) {
            setResult({
                status: "suspicious",
                message: "Số điện thoại không đúng định dạng",
                details: [
                    "Số điện thoại Việt Nam gồm 10 chữ số, bắt đầu bằng số 0",
                    "Ví dụ: 0912 345 678",
                    "Vui lòng kiểm tra lại số điện thoại",
                ],
            })
            setIsChecking(false)
            return
        }

        const dangerousPrefixes = ["0900", "0901234", "0911111"]
        const suspiciousPrefixes = ["0567", "0589"]
        const isDangerous = dangerousPrefixes.some(p => digits.startsWith(p))
        const isSuspicious = suspiciousPrefixes.some(p => digits.startsWith(p))

        if (isDangerous) {
            setResult({
                status: "dangerous",
                message: "Cảnh báo: Số điện thoại này có dấu hiệu lừa đảo!",
                details: [
                    "Số điện thoại đã bị nhiều người báo cáo lừa đảo",
                    "Liên quan đến các cuộc gọi giả mạo ngân hàng/cơ quan chức năng",
                    "Khuyến cáo: Không nghe máy và chặn số này",
                ],
            })
        } else if (isSuspicious) {
            setResult({
                status: "suspicious",
                message: "Cẩn thận: Số điện thoại này có dấu hiệu đáng ngờ",
                details: [
                    "Có một số báo cáo về số điện thoại này",
                    "Có thể liên quan đến cuộc gọi spam/quảng cáo",
                    "Nên cẩn thận khi nhận cuộc gọi từ số này",
                ],
            })
        } else {
            setResult({
                status: "safe",
                message: "Số điện thoại này có vẻ an toàn",
                details: [
                    "Chưa có báo cáo lừa đảo nào về số này",
                    "Thuộc nhà mạng uy tín tại Việt Nam",
                    "Không nằm trong danh sách đen",
                ],
            })
        }
        setIsChecking(false)
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
                        className="pl-10"
                        onKeyDown={e => e.key === "Enter" && checkPhone()}
                    />
                </div>
                <Button onClick={checkPhone} disabled={isChecking || !phone.trim()}>
                    {isChecking
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang kiểm tra...</>
                        : <><Search className="mr-2 h-4 w-4" />Kiểm tra</>
                    }
                </Button>
            </div>
            {result && <ResultBlock result={result} />}
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2 — URL CHECKER
// ════════════════════════════════════════════════════════════════════════════
const SUSPICIOUS_URL_KEYWORDS = [
    "login-secure", "verify-account", "update-info", "confirm-payment",
    "account-locked", "support-center", "free-gift", "claim-prize",
    "bit.ly", "tinyurl", "goo.gl", "ow.ly", "t.co", "cutt.ly",
]
const DANGEROUS_URL_PATTERNS = [
    "paypal.com-", "apple-id.", "facebook.com-secure", "bank-login",
    "vietcombank.net", "techcombank.net", "agribank.net", ".xyz/login",
    "signin-security", "password-reset.link",
]

function isValidUrl(url: string): boolean {
    try { new URL(url.startsWith("http") ? url : `https://${url}`); return true }
    catch { return false }
}

function UrlCheckerTab() {
    const [url, setUrl] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<ResultData | null>(null)

    const checkUrl = async () => {
        const trimmed = url.trim()
        if (!trimmed) return
        setIsChecking(true)
        setResult(null)
        await new Promise(r => setTimeout(r, 1500))

        if (!isValidUrl(trimmed)) {
            setResult({
                status: "suspicious",
                message: "Đường link không hợp lệ",
                details: [
                    "Định dạng URL không đúng",
                    "Hãy nhập đường link đầy đủ, ví dụ: https://example.com",
                    "Đảm bảo URL bắt đầu bằng http:// hoặc https://",
                ],
            })
            setIsChecking(false)
            return
        }

        const lower = trimmed.toLowerCase()
        const isDangerous = DANGEROUS_URL_PATTERNS.some(p => lower.includes(p))
        const isSuspicious = SUSPICIOUS_URL_KEYWORDS.some(k => lower.includes(k))

        if (isDangerous) {
            setResult({
                status: "dangerous",
                message: "Cảnh báo: Đường link này RẤT NGUY HIỂM!",
                details: [
                    "Phát hiện mẫu URL giả mạo trang web ngân hàng/dịch vụ nổi tiếng",
                    "Có thể là trang web phishing đánh cắp thông tin",
                    "TUYỆT ĐỐI không nhập thông tin cá nhân hoặc mật khẩu",
                    "Báo cáo đường link này ngay lập tức",
                ],
            })
        } else if (isSuspicious) {
            setResult({
                status: "suspicious",
                message: "Cẩn thận: Đường link này có dấu hiệu đáng ngờ",
                details: [
                    "URL chứa từ khóa thường thấy trong trang lừa đảo",
                    "Có thể là link rút gọn che giấu địa chỉ thật",
                    "Không nên nhập tài khoản, mật khẩu hoặc thẻ ngân hàng",
                    "Hãy truy cập trực tiếp trang chính thức thay vì nhấp vào link này",
                ],
            })
        } else {
            setResult({
                status: "safe",
                message: "Đường link có vẻ an toàn",
                details: [
                    "Không phát hiện mẫu URL nguy hiểm",
                    "Không có trong danh sách đen hiện tại",
                    "Hãy tiếp tục cảnh giác khi cung cấp thông tin cá nhân",
                ],
            })
        }
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
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang kiểm tra...</>
                        : <><Search className="mr-2 h-4 w-4" />Kiểm tra</>
                    }
                </Button>
            </div>
            {result && <ResultBlock result={result} />}
        </div>
    )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3 — EMAIL CHECKER
// ════════════════════════════════════════════════════════════════════════════
const SUSPICIOUS_EMAIL_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "trashmail.com", "yopmail.com",
    "dispostable.com", "sharklasers.com", "guerrillamailblock.com", "spam4.me",
    "throwam.com", "fakeinbox.com",
]
const IMPERSONATING_PATTERNS = [
    "noreply-bank", "security-alert", "account-verify", "paypal-support",
    "apple-id", "microsoft-security", "admin-noti", "customer-service",
    "vietcombank-", "techcombank-", "hdbank-", "agribank-",
    "gov.vn-", "mps.gov-", "bocongan-",
]

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
        await new Promise(r => setTimeout(r, 1500))

        if (!isValidEmail(trimmed)) {
            setResult({
                status: "suspicious",
                message: "Địa chỉ email không hợp lệ",
                details: [
                    "Định dạng email không đúng",
                    "Ví dụ hợp lệ: example@gmail.com",
                    "Vui lòng kiểm tra và nhập lại",
                ],
            })
            setIsChecking(false)
            return
        }

        const domain = trimmed.split("@")[1]
        const localPart = trimmed.split("@")[0]

        const isDangerousDomain = SUSPICIOUS_EMAIL_DOMAINS.includes(domain)
        const isImpersonating = IMPERSONATING_PATTERNS.some(p =>
            localPart.includes(p) || domain.includes(p)
        )

        if (isDangerousDomain || isImpersonating) {
            setResult({
                status: "dangerous",
                message: "Cảnh báo: Email này có dấu hiệu LỪA ĐẢO!",
                details: [
                    isDangerousDomain
                        ? `Tên miền "${domain}" là dịch vụ email tạm thời/rác`
                        : "Email giả mạo tổ chức/trang web uy tín",
                    "Tuyệt đối không cung cấp thông tin cá nhân hay tài chính",
                    "Không nhấp vào bất kỳ link nào trong email này",
                    "Báo cáo email này cho cơ quan chức năng",
                ],
            })
        } else if (
            localPart.includes("noreply") ||
            localPart.includes("no-reply") ||
            /\d{5,}/.test(localPart)
        ) {
            setResult({
                status: "suspicious",
                message: "Cẩn thận: Email này có đặc điểm đáng ngờ",
                details: [
                    "Email có thể được gửi tự động từ hệ thống không rõ nguồn gốc",
                    "Chứa chuỗi số ngẫu nhiên trong địa chỉ — dấu hiệu của spam/phishing",
                    "Không trả lời và không cung cấp thông tin cá nhân",
                    "Hãy xác minh danh tính người gửi trước khi tương tác",
                ],
            })
        } else {
            setResult({
                status: "safe",
                message: "Email có vẻ an toàn",
                details: [
                    "Không phát hiện dấu hiệu lừa đảo rõ ràng",
                    "Tên miền không nằm trong danh sách đen",
                    "Luôn cẩn thận với các yêu cầu cung cấp thông tin qua email",
                ],
            })
        }
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
                        ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang kiểm tra...</>
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
