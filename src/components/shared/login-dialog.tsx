"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, ArrowLeft, Mail, KeyRound, ShieldCheck } from "lucide-react"

type DialogMode = "login" | "register" | "forgot" | "verify" | "reset" | "success"

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const OTP_LENGTH = 6
const RESEND_COUNTDOWN = 60

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
    const { login, register } = useAuth()
    const navigate = useNavigate()

    // ── Auth modes ──────────────────────────────────────────────
    const [mode, setMode] = useState<DialogMode>("login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // ── Forgot password flow ─────────────────────────────────────
    const [forgotEmail, setForgotEmail] = useState("")
    const [otpCode, setOtpCode] = useState<string[]>(Array(OTP_LENGTH).fill(""))
    const [simulatedOtp, setSimulatedOtp] = useState("")   // mock OTP stored in state
    const [countdown, setCountdown] = useState(0)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // ── Transition animation ─────────────────────────────────────
    const [animating, setAnimating] = useState(false)

    // Reset everything when dialog closes
    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                setMode("login")
                setUsername(""); setPassword(""); setName(""); setRegisterEmail("")
                setForgotEmail(""); setOtpCode(Array(OTP_LENGTH).fill(""))
                setSimulatedOtp(""); setNewPassword(""); setConfirmPassword("")
                setError(""); setIsLoading(false)
                if (countdownRef.current) clearInterval(countdownRef.current)
                setCountdown(0)
            }, 300)
        }
    }, [open])

    // Countdown timer for OTP resend
    const startCountdown = useCallback(() => {
        if (countdownRef.current) clearInterval(countdownRef.current)
        setCountdown(RESEND_COUNTDOWN)
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current!)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, [])

    // ── Mode transition helper ───────────────────────────────────
    const transitionTo = (next: DialogMode) => {
        setAnimating(true)
        setError("")
        setTimeout(() => {
            setMode(next)
            setAnimating(false)
        }, 200)
    }

    // ── Login / Register submit ──────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            if (mode === "login") {
                await login(username, password)
                onOpenChange(false)
                if (username === "admin") navigate("/admin")
            } else if (mode === "register") {
                if (!name.trim()) throw new Error("Vui lòng nhập tên của bạn")
                await register(registerEmail, password, name)
                onOpenChange(false)
            }
            setUsername(""); setPassword(""); setName(""); setRegisterEmail("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    // ── Step 1 — Send OTP ────────────────────────────────────────
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!forgotEmail.trim()) { setError("Vui lòng nhập địa chỉ email"); return }
        setError("")
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 800))  // simulate network delay
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setSimulatedOtp(code)
        console.log(`[DEV] Mã OTP mô phỏng: ${code}`)  // visible in browser console
        setIsLoading(false)
        startCountdown()
        setOtpCode(Array(OTP_LENGTH).fill(""))
        transitionTo("verify")
    }

    // ── Step 2 — Verify OTP ──────────────────────────────────────
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault()
        const entered = otpCode.join("")
        if (entered.length < OTP_LENGTH) { setError("Vui lòng nhập đủ 6 chữ số"); return }
        if (entered !== simulatedOtp) { setError("Mã xác nhận không đúng. Vui lòng thử lại."); return }
        setError("")
        setNewPassword(""); setConfirmPassword("")
        transitionTo("reset")
    }

    const handleResendOtp = async () => {
        if (countdown > 0) return
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 800))
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setSimulatedOtp(code)
        console.log(`[DEV] Mã OTP mới: ${code}`)
        setOtpCode(Array(OTP_LENGTH).fill(""))
        setError("")
        setIsLoading(false)
        startCountdown()
    }

    // ── OTP input handlers ───────────────────────────────────────
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const updated = [...otpCode]
        updated[index] = value.slice(-1)
        setOtpCode(updated)
        if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpCode[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
        if (pasted.length === OTP_LENGTH) {
            setOtpCode(pasted.split(""))
            otpRefs.current[OTP_LENGTH - 1]?.focus()
            e.preventDefault()
        }
    }

    // ── Step 3 — Reset password ──────────────────────────────────
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword.length < 6) { setError("Mật khẩu phải có ít nhất 6 ký tự"); return }
        if (newPassword !== confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return }
        setError("")
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 800))
        // Update password in localStorage (same as auth-context updateProfile)
        const usersJson = localStorage.getItem("auth_users") || "{}"
        const users = JSON.parse(usersJson)
        if (users[forgotEmail]) {
            users[forgotEmail].password = newPassword
            localStorage.setItem("auth_users", JSON.stringify(users))
        }
        setIsLoading(false)
        transitionTo("success")
    }

    // ── Helpers ──────────────────────────────────────────────────
    const toggleAuthMode = () => transitionTo(mode === "login" ? "register" : "login")

    // ── Dialog title / description by mode ──────────────────────
    const titleMap: Record<DialogMode, string> = {
        login: "Đăng nhập",
        register: "Đăng ký tài khoản",
        forgot: "Quên mật khẩu",
        verify: "Xác nhận email",
        reset: "Đặt lại mật khẩu",
        success: "Thành công!",
    }
    const descMap: Record<DialogMode, string> = {
        login: "Đăng nhập để báo cáo lừa đảo và sử dụng các tính năng khác",
        register: "Tạo tài khoản mới để bắt đầu",
        forgot: "Nhập địa chỉ email để nhận mã xác nhận",
        verify: `Mã xác nhận đã được gửi tới ${forgotEmail}`,
        reset: "Tạo mật khẩu mới cho tài khoản của bạn",
        success: "Mật khẩu của bạn đã được đặt lại thành công",
    }

    const iconMap: Record<string, React.ReactNode> = {
        forgot: <Mail className="h-10 w-10 text-primary" />,
        verify: <ShieldCheck className="h-10 w-10 text-primary" />,
        reset: <KeyRound className="h-10 w-10 text-primary" />,
        success: <CheckCircle2 className="h-10 w-10 text-green-500" />,
    }

    const isForgotFlow = ["forgot", "verify", "reset", "success"].includes(mode)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] overflow-hidden">
                <div
                    className="transition-all duration-200"
                    style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(8px)" : "translateY(0)" }}
                >
                    {/* ── Back button for forgot flow ── */}
                    {isForgotFlow && mode !== "success" && (
                        <button
                            type="button"
                            onClick={() => {
                                if (mode === "forgot") transitionTo("login")
                                else if (mode === "verify") transitionTo("forgot")
                                else if (mode === "reset") transitionTo("verify")
                            }}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 -mt-1 group"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            Quay lại
                        </button>
                    )}

                    {/* ── Icon (forgot flow only) ── */}
                    {iconMap[mode] && (
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-muted p-3">
                                {iconMap[mode]}
                            </div>
                        </div>
                    )}

                    <DialogHeader className={isForgotFlow ? "text-center" : ""}>
                        <DialogTitle>{titleMap[mode]}</DialogTitle>
                        <DialogDescription>{descMap[mode]}</DialogDescription>
                    </DialogHeader>

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* LOGIN FORM */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "login" && (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Tên đăng nhập / Email</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin hoặc email@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <button
                                        type="button"
                                        onClick={() => transitionTo("forgot")}
                                        className="text-xs text-primary hover:underline underline-offset-2 transition-colors"
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-col gap-2">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                                </Button>
                                <Button type="button" variant="ghost" onClick={toggleAuthMode} disabled={isLoading} className="w-full">
                                    Chưa có tài khoản? Đăng ký
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* REGISTER FORM */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "register" && (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên của bạn</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nguyen Van A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Mật khẩu</Label>
                                <Input
                                    id="reg-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                                <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 6 ký tự</p>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-col gap-2">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                                </Button>
                                <Button type="button" variant="ghost" onClick={toggleAuthMode} disabled={isLoading} className="w-full">
                                    Đã có tài khoản? Đăng nhập
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* STEP 1 — FORGOT: Enter email */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "forgot" && (
                        <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="forgot-email">Địa chỉ email</Label>
                                <Input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground">
                                Mã xác nhận sẽ được gửi tới địa chỉ email của bạn
                            </p>
                        </form>
                    )}

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* STEP 2 — VERIFY: Enter OTP */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "verify" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5 mt-4">
                            {/* Progress bar */}
                            <div className="flex gap-1.5 mb-1">
                                {["forgot", "verify", "reset"].map((s, i) => (
                                    <div
                                        key={s}
                                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                                        style={{
                                            background: i <= ["forgot", "verify", "reset"].indexOf(mode)
                                                ? "hsl(var(--primary))"
                                                : "hsl(var(--muted))"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="space-y-3">
                                <Label className="block text-center text-sm">Nhập mã xác nhận gồm 6 chữ số</Label>
                                <div className="flex justify-center gap-2">
                                    {otpCode.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => { otpRefs.current[i] = el }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            onPaste={handleOtpPaste}
                                            disabled={isLoading}
                                            className={`
                                                w-10 h-12 text-center text-lg font-semibold rounded-md border
                                                bg-background text-foreground
                                                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                                transition-all duration-150
                                                ${digit ? "border-primary bg-primary/5" : "border-input"}
                                                disabled:opacity-50
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" disabled={isLoading || otpCode.join("").length < OTP_LENGTH} className="w-full">
                                {isLoading ? "Đang xác nhận..." : "Xác nhận"}
                            </Button>

                            {/* Resend */}
                            <p className="text-center text-xs text-muted-foreground">
                                Không nhận được mã?{" "}
                                {countdown > 0 ? (
                                    <span className="text-primary font-medium">Gửi lại sau {countdown}s</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-primary hover:underline underline-offset-2 font-medium disabled:opacity-50"
                                    >
                                        Gửi lại
                                    </button>
                                )}
                            </p>
                        </form>
                    )}

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* STEP 3 — RESET: New password */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                            {/* Progress bar */}
                            <div className="flex gap-1.5 mb-1">
                                {["forgot", "verify", "reset"].map((s, i) => (
                                    <div
                                        key={s}
                                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                                        style={{
                                            background: i <= ["forgot", "verify", "reset"].indexOf(mode)
                                                ? "hsl(var(--primary))"
                                                : "hsl(var(--muted))"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 6 ký tự</p>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                            </Button>
                        </form>
                    )}

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* SUCCESS */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    {mode === "success" && (
                        <div className="mt-4 space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
                            </p>
                            <Button
                                className="w-full"
                                onClick={() => transitionTo("login")}
                            >
                                Đăng nhập ngay
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
