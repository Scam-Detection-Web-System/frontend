"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Camera, Check, User, History } from "lucide-react"
import { toast } from "sonner"
import { LoginSessions } from "./LoginSessions"

interface ProfileEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
    const { user, updateProfile } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [name, setName] = useState(user?.name || "")
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // Reset form when dialog opens
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setName(user?.name || "")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setAvatarPreview(null)
            setError("")
        }
        onOpenChange(isOpen)
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            setError("Ảnh đại diện không được vượt quá 2MB")
            return
        }

        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn tệp hình ảnh")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setAvatarPreview(event.target?.result as string)
            setError("")
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate passwords
        if (newPassword && !oldPassword) {
            setError("Vui lòng nhập mật khẩu cũ để đổi mật khẩu")
            return
        }

        if (newPassword && newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự")
            return
        }

        if (newPassword && newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp")
            return
        }

        if (!name.trim()) {
            setError("Vui lòng nhập tên hiển thị")
            return
        }

        setIsLoading(true)

        try {
            const updateData: { name?: string; oldPassword?: string; newPassword?: string; confirmPassword?: string; avatar?: string } = {}

            if (name !== user?.name) {
                updateData.name = name
            }

            if (newPassword && oldPassword) {
                updateData.oldPassword = oldPassword
                updateData.newPassword = newPassword
                updateData.confirmPassword = confirmPassword
            }

            if (avatarPreview) {
                updateData.avatar = avatarPreview
            }

            if (Object.keys(updateData).length === 0) {
                setError("Không có thay đổi nào để cập nhật")
                setIsLoading(false)
                return
            }

            await updateProfile(updateData)

            toast.success("Cập nhật hồ sơ thành công", {
                description: "Thông tin tài khoản của bạn đã được cập nhật.",
            })

            handleOpenChange(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
        } finally {
            setIsLoading(false)
        }
    }

    const displayAvatar = avatarPreview || user?.avatar
    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Quản lý tài khoản</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin cá nhân và xem phiên đăng nhập
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" />
                            Hồ sơ
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-2">
                            <History className="h-4 w-4" />
                            Phiên đăng nhập
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="mt-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-4 border-slate-100 dark:border-slate-800 shadow-lg transition-transform group-hover:scale-105">
                                        {displayAvatar ? (
                                            <AvatarImage src={displayAvatar} alt={user?.name} />
                                        ) : null}
                                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-2xl font-bold text-primary-foreground">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <Camera className="h-6 w-6 text-white" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Nhấp vào ảnh để thay đổi · Tối đa 2MB
                                </p>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="profile-name">Tên hiển thị</Label>
                                <Input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nhập tên hiển thị"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email (read-only) */}
                            <div className="space-y-2">
                                <Label htmlFor="profile-email">Email</Label>
                                <Input
                                    id="profile-email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-slate-50 dark:bg-slate-800/50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email không thể thay đổi
                                </p>
                            </div>

                            {/* Old Password */}
                            <div className="space-y-2">
                                <Label htmlFor="old-password">Mật khẩu cũ</Label>
                                <Input
                                    id="old-password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại để đổi mật khẩu"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Để trống nếu không đổi mật khẩu"
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Confirm Password */}
                            {newPassword && (
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Submit */}
                            <Button type="submit" disabled={isLoading} className="w-full gap-2">
                                {isLoading ? (
                                    "Đang cập nhật..."
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions" className="mt-4">
                        <LoginSessions />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
