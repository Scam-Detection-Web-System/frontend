"use client"

import { useState } from "react"
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Loader2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ResultData = {
    status: "safe" | "suspicious" | "dangerous"
    message: string
    details: string[]
}

type CheckResult = ResultData | null

export function PhoneChecker({ variant = "full" }: { variant?: "hero" | "full" }) {
    const [phone, setPhone] = useState("")
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<CheckResult>(null)

    const isValidVietnamesePhone = (phone: string) => {
        const digits = phone.replace(/\D/g, "")
        return /^0\d{9}$/.test(digits)
    }

    const checkPhone = async () => {
        const digits = phone.replace(/\D/g, "")
        if (!digits) return

        setIsChecking(true)
        setResult(null)

        await new Promise((resolve) => setTimeout(resolve, 2000))

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
        const isDangerous = dangerousPrefixes.some((prefix) => digits.startsWith(prefix))
        const isSuspicious = suspiciousPrefixes.some((prefix) => digits.startsWith(prefix))

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

    const getStatusIcon = (status: ResultData["status"]) => {
        switch (status) {
            case "safe":
                return <CheckCircle className="h-10 w-10 text-green-500" />
            case "suspicious":
                return <AlertTriangle className="h-10 w-10 text-amber-500" />
            case "dangerous":
                return <XCircle className="h-10 w-10 text-red-500" />
            default:
                return null
        }
    }

    const getStatusColor = (status: ResultData["status"]) => {
        switch (status) {
            case "safe":
                return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
            case "suspicious":
                return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
            case "dangerous":
                return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
            default:
                return ""
        }
    }

    // Result block (shared between both variants)
    const resultBlock = result && (
        <div className={`mt-6 rounded-2xl border p-6 ${getStatusColor(result.status)}`}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {getStatusIcon(result.status)}
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {result.message}
                    </h3>
                    <ul className="mt-3 space-y-2">
                        {result.details.map((detail, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                            >
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                {detail}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )

    // ─── Hero variant: pill-shaped search bar ───
    if (variant === "hero") {
        return (
            <div className="mx-auto mt-10 max-w-xl">
                <div className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg shadow-blue-500/5 transition-shadow focus-within:shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-800">
                    <Phone className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400" />
                    <input
                        type="tel"
                        placeholder="Số điện thoại..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && checkPhone()}
                        className="flex-1 border-0 bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
                    />
                    <button
                        onClick={checkPhone}
                        disabled={isChecking || !phone.trim()}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isChecking ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <p className="mt-3 text-center text-sm text-slate-400 dark:text-slate-500">
                    Ví dụ: 0912345678, 02838xxxxxx, 1800xxxx
                </p>

                {/* Result shown below search bar */}
                <div className="mx-auto max-w-xl">
                    {resultBlock}
                </div>
            </div>
        )
    }

    // ─── Full variant: card-based (for /kiemtra page) ───
    return (
        <section id="kiem-tra" className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
                        <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Kiểm tra Số điện thoại đáng ngờ
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                        Nhập số điện thoại vào ô bên dưới để kiểm tra xem số đó có liên quan đến lừa đảo hay không.
                    </p>
                </div>

                <Card className="mx-auto mt-10 max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Công cụ kiểm tra Số điện thoại
                        </CardTitle>
                        <CardDescription>
                            Nhập số điện thoại bạn muốn kiểm tra và nhận kết quả ngay lập tức
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="tel"
                                    placeholder="0912 345 678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === "Enter" && checkPhone()}
                                />
                            </div>
                            <Button onClick={checkPhone} disabled={isChecking || !phone.trim()}>
                                {isChecking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang kiểm tra...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Kiểm tra
                                    </>
                                )}
                            </Button>
                        </div>
                        {resultBlock}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
