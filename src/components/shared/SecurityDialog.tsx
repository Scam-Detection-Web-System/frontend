"use client"

import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Check, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { LoginSessions } from "./LoginSessions"

interface SecurityDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SecurityDialog({ open, onOpenChange }: SecurityDialogProps) {
    const { updateProfile } = useAuth()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setNewPassword("")
            setConfirmPassword("")
            setError("")
            setShowNewPassword(false)
            setShowConfirmPassword(false)
        }
        onOpenChange(isOpen)
    }

    // Password match status
    const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp")
            return
        }

        setIsLoading(true)
        try {
            await updateProfile({ password: newPassword })
            toast.success("Đổi mật khẩu thành công", {
                description: "Mật khẩu của bạn đã được cập nhật.",
            })
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        Bảo mật
                    </DialogTitle>
                    <DialogDescription>
                        Quản lý mật khẩu và xem các phiên đăng nhập gần đây
                    </DialogDescription>
                </DialogHeader>

                {/* Password Change Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Đổi mật khẩu
                    </h3>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="sec-new-password">Mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="sec-new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                    minLength={6}
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
                            {newPassword.length > 0 && newPassword.length < 6 && (
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    ⚠ Mật khẩu phải có ít nhất 6 ký tự
                                </p>
                            )}
                            {newPassword.length >= 6 && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                    ✓ Độ dài mật khẩu hợp lệ
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
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
                            {/* Match status label */}
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

                        {/* Error */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Submit */}
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
                </div>

                <Separator className="my-2" />

                {/* Login Sessions Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Phiên đăng nhập gần đây
                    </h3>
                    <LoginSessions />
                </div>
            </DialogContent>
        </Dialog>
    )
}
