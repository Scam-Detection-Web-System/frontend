"use client"

import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AlertTriangle, Send, CheckCircle, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginDialog } from "@/components/shared/login-dialog"
import { useAuth } from "@/contexts/auth-context"
import { reportService } from "@/services/report.service"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Phân loại (label) — Radio cards ────────────────────────────────────────
const LABEL_OPTIONS = [
  {
    value: "SCAM",
    label: "Lừa đảo",
    desc: "Cuộc gọi/tin nhắn có dấu hiệu lừa đảo",
    color: "border-red-500 bg-red-50 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    value: "ADVERTISING",
    label: "Quảng cáo",
    desc: "Quảng cáo, tiếp thị, mời chào dịch vụ",
    color: "border-orange-400 bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    value: "SUSPICIOUS",
    label: "Đáng ngờ",
    desc: "Có dấu hiệu đáng ngờ nhưng chưa rõ mục đích",
    color: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  {
    value: "SPAM",
    label: "Làm phiền",
    desc: "Gọi nhiều lần, quấy rối, gây phiền toái",
    color: "border-purple-400 bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  {
    value: "UNKNOWN",
    label: "Không rõ",
    desc: "Không xác định được mục đích cuộc gọi",
    color: "border-slate-400 bg-slate-50 dark:bg-slate-800/50",
    textColor: "text-slate-600 dark:text-slate-400",
  },
  {
    value: "SAFE",
    label: "An toàn",
    desc: "Cuộc gọi hợp pháp, đã xác minh danh tính",
    color: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
]

// ─── Hình thức liên lạc (contactMethod) ─────────────────────────────────────
const CONTACT_METHOD_OPTIONS = [
  { value: "ANSWERED", label: "Đã trả lời cuộc gọi" },
  { value: "MISSED_CALL", label: "Cuộc gọi nhỡ" },
  { value: "VOICEMAIL", label: "Hộp thư thoại" },
  { value: "SMS", label: "Tin nhắn SMS" },
  { value: "MMS", label: "Tin nhắn MMS" },
  { value: "OTHER", label: "Khác" },
]

// ─── Thủ đoạn lừa đảo (scamTechnique) — Multi-select ────────────────────────
const SCAM_TECHNIQUE_OPTIONS = [
  { value: "IMPERSONATION", label: "Giả mạo tổ chức" },
  { value: "LOTTERY", label: "Lừa trúng thưởng" },
  { value: "URGENCY", label: "Tạo áp lực khẩn cấp" },
  { value: "THREAT", label: "Đe dọa" },
  { value: "DEBT", label: "Đòi nợ" },
  { value: "PHISHING_LINK", label: "Liên kết lừa đảo" },
  { value: "APP_INSTALL", label: "Lừa cài ứng dụng" },
  { value: "GAMBLING", label: "Lừa cờ bạc" },
  { value: "WRONG_TRANSFER", label: "Giả chuyển nhầm tiền" },
  { value: "ZALO_FRIEND", label: "Kết bạn Zalo lừa đảo" },
  { value: "AI_VOICE", label: "Giả giọng nói AI" },
  { value: "FAKE_DOCUMENT", label: "Tài liệu giả mạo" },
  { value: "DATA_COLLECTION", label: "Thu thập thông tin cá nhân" },
  { value: "OTHER", label: "Khác" },
]

export function ReportForm() {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Form state
  const [phoneNumber, setPhoneNumber] = useState(searchParams.get("phone") || "")
  const [label, setLabel] = useState("")
  const [contactMethod, setContactMethod] = useState("")
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const toggleTechnique = (value: string) => {
    setSelectedTechniques((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!label) {
      setSubmitError("Vui lòng chọn phân loại cuộc gọi.")
      return
    }
    if (!contactMethod) {
      setSubmitError("Vui lòng chọn hình thức liên lạc.")
      return
    }

    setIsSubmitting(true)
    try {
      await reportService.submitReport({
        phoneNumber,
        label,
        content: description,
        contactMethod,
        scamTechnique: selectedTechniques.length > 0 ? selectedTechniques.join(",") : undefined,
      })
      setIsSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message ?? "Không thể gửi báo cáo. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setPhoneNumber("")
    setLabel("")
    setContactMethod("")
    setSelectedTechniques([])
    setDescription("")
    setSubmitError("")
  }

  if (isSubmitted) {
    return (
      <section id="bao-cao" className="bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Cảm ơn bạn đã báo cáo!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Báo cáo của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
              </p>
              <Button className="mt-6" onClick={resetForm}>
                Gửi báo cáo khác
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="bao-cao" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Báo cáo Lừa đảo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Giúp cộng đồng bằng cách báo cáo các trang web và hành vi lừa đảo mà bạn gặp phải.
          </p>
        </div>

        {!isAuthenticated ? (
          <Card className="mx-auto mt-10 max-w-2xl">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <LogIn className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Yêu cầu đăng nhập
              </h3>
              <p className="mt-2 max-w-md text-muted-foreground">
                Bạn cần đăng nhập để gửi báo cáo lừa đảo. Điều này giúp chúng tôi xác minh và xử lý báo cáo tốt hơn.
              </p>
              <Button className="mt-6" onClick={() => setShowLoginDialog(true)}>
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mx-auto mt-10 max-w-2xl">
            <CardHeader>
              <CardTitle>Gửi báo cáo lừa đảo</CardTitle>
              <CardDescription>
                Điền đầy đủ thông tin để chúng tôi có thể xử lý báo cáo nhanh chóng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại lừa đảo <span className="text-destructive">*</span></Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0912 345 678"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* Phân loại — Radio cards */}
                <div className="space-y-2">
                  <Label>
                    Phân loại <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {LABEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        id={`label-${opt.value}`}
                        onClick={() => setLabel(opt.value)}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all",
                          label === opt.value
                            ? opt.color + " border-current"
                            : "border-border bg-background hover:border-muted-foreground/40"
                        )}
                      >
                        <span className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                          label === opt.value ? "border-current" : "border-muted-foreground"
                        )}>
                          {label === opt.value && (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </span>
                        <span>
                          <span className={cn(
                            "block text-sm font-semibold",
                            label === opt.value ? opt.textColor : "text-foreground"
                          )}>
                            {opt.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hình thức liên lạc */}
                <div className="space-y-2">
                  <Label htmlFor="contactMethod">
                    Họ liên lạc với bạn bằng cách nào? <span className="text-destructive">*</span>
                  </Label>
                  <Select value={contactMethod} onValueChange={setContactMethod}>
                    <SelectTrigger id="contactMethod">
                      <SelectValue placeholder="Chọn hình thức liên lạc" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thủ đoạn — Multi-select chips */}
                <div className="space-y-2">
                  <Label>
                    Họ đã dùng chiêu trò nào?{" "}
                    <span className="text-xs text-muted-foreground font-normal">(chọn nhiều nếu có)</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SCAM_TECHNIQUE_OPTIONS.map((opt) => {
                      const selected = selectedTechniques.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          id={`technique-${opt.value}`}
                          onClick={() => toggleTechnique(opt.value)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                          )}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Mô tả chi tiết <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả chi tiết về vụ lừa đảo bạn gặp phải..."
                    rows={4}
                    required
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {description.length}/500 ký tự
                  </p>
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi báo cáo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </div>
    </section>
  )
}
