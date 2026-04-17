"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    AlertCircle, Check, ShieldCheck, Eye, EyeOff, ArrowLeft,
    Monitor, AlertTriangle, Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { LoginSessions } from "@/components/shared/LoginSessions"

export default function SecurityPage() {
    const { updateProfile } = useAuth()

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!oldPassword) {
            setError("Vui lòng nhập mật khẩu cũ")
            return
        }

        if (newPassword.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp")
            return
        }

        setIsLoading(true)
        try {
            await updateProfile({ oldPassword, newPassword, confirmPassword })
            toast.success("Đổi mật khẩu thành công", {
                description: "Mật khẩu của bạn đã được cập nhật.",
            })
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
            <div className="w-full max-w-2xl space-y-6">
                {/* Page header */}
                <div className="flex items-center gap-3">
                    <Link to="/taikhoan">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bảo mật</h1>
                        <p className="text-sm text-muted-foreground">Quản lý mật khẩu và phiên đăng nhập</p>
                    </div>
                </div>

                {/* Password Change Card */}
                <Card className="border-slate-200 dark:border-slate-700/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5" />
                            Đổi mật khẩu
                        </CardTitle>
                        <CardDescription>
                            Sử dụng mật khẩu mạnh mà bạn không dùng ở nơi khác
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="sec-old-password">Mật khẩu hiện tại</Label>
                                <div className="relative">
                                    <Input
                                        id="sec-old-password"
                                        type={showOldPassword ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sec-new-password">Mật khẩu mới</Label>
                                <div className="relative">
                                    <Input
                                        id="sec-new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                                        minLength={8}
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {newPassword.length > 0 && newPassword.length < 8 && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        ⚠ Mật khẩu phải có ít nhất 8 ký tự
                                    </p>
                                )}
                                {newPassword.length >= 8 && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                        ✓ Độ dài mật khẩu hợp lệ
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sec-confirm-password">Xác nhận mật khẩu mới</Label>
                                <div className="relative">
                                    <Input
                                        id="sec-confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                        disabled={isLoading}
                                        className={`pr-10 ${passwordsMatch
                                                ? "border-emerald-500 focus-visible:ring-emerald-500"
                                                : passwordsMismatch
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordsMatch && (
                                    <p className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <Check className="h-3.5 w-3.5" />
                                        Mật khẩu khớp
                                    </p>
                                )}
                                {passwordsMismatch && (
                                    <p className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Mật khẩu không khớp
                                    </p>
                                )}
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading || !passwordsMatch}
                                className="w-full gap-2"
                            >
                                {isLoading ? (
                                    "Đang cập nhật..."
                                ) : (
                                    <>
                                        <ShieldCheck className="h-4 w-4" />
                                        Đổi mật khẩu
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Login Sessions Card */}
                <Card className="border-slate-200 dark:border-slate-700/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-primary" />
                                <div>
                                    <CardTitle className="text-lg">Phiên đăng nhập</CardTitle>
                                    <CardDescription>
                                        Quản lý các thiết bị đã đăng nhập tài khoản
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="link"
                                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 px-0 h-auto font-medium"
                            >
                                Đăng xuất tất cả
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <LoginSessions />
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 dark:border-red-900/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Vùng nguy hiểm
                        </CardTitle>
                        <CardDescription>
                            Các hành động không thể hoàn tác
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Xóa tài khoản</p>
                                <p className="text-xs text-muted-foreground">
                                    Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300 gap-1.5"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Xóa tài khoản
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
