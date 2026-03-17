"use client"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Pencil, X, Check, ShieldCheck, Mail, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

interface PersonalPageDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onGoToSecurity: () => void
}

export function PersonalPageDialog({ open, onOpenChange, onGoToSecurity }: PersonalPageDialogProps) {
    const { user, updateProfile } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isEditing, setIsEditing] = useState(false)
    const [editName, setEditName] = useState(user?.name || "")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setIsEditing(false)
            setAvatarPreview(null)
        }
        onOpenChange(isOpen)
    }

    const startEditing = () => {
        setEditName(user?.name || "")
        setAvatarPreview(null)
        setIsEditing(true)
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setAvatarPreview(null)
    }

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click()
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ảnh đại diện không được vượt quá 2MB")
            return
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn tệp hình ảnh")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            setAvatarPreview(event.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        if (!editName.trim()) {
            toast.error("Vui lòng nhập tên hiển thị")
            return
        }

        setIsLoading(true)
        try {
            const updateData: { name?: string; avatar?: string } = {}

            if (editName !== user?.name) {
                updateData.name = editName
            }
            if (avatarPreview) {
                updateData.avatar = avatarPreview
            }

            if (Object.keys(updateData).length === 0) {
                toast.info("Không có thay đổi nào")
                setIsEditing(false)
                setIsLoading(false)
                return
            }

            await updateProfile(updateData)
            toast.success("Cập nhật hồ sơ thành công")
            setIsEditing(false)
            setAvatarPreview(null)
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra")
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
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Trang cá nhân
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Avatar + Info Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border-4 border-slate-100 shadow-xl dark:border-slate-800 transition-transform group-hover:scale-105">
                                {displayAvatar ? (
                                    <AvatarImage src={displayAvatar} alt={user?.name} />
                                ) : null}
                                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-3xl font-bold text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                                >
                                    <Camera className="h-7 w-7 text-white" />
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        {isEditing && (
                            <p className="text-xs text-muted-foreground">
                                Nhấp vào ảnh để thay đổi · Tối đa 2MB
                            </p>
                        )}
                    </div>

                    {/* Profile Info */}
                    {!isEditing ? (
                        // View mode
                        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-700/50 dark:bg-slate-800/30">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <UserIcon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tên hiển thị</p>
                                    <p className="text-sm font-semibold">{user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-semibold">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Edit mode
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Tên hiển thị</Label>
                                <Input
                                    id="edit-name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Nhập tên hiển thị"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-slate-50 dark:bg-slate-800/50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email không thể thay đổi
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                        {!isEditing ? (
                            <>
                                <Button onClick={startEditing} variant="default" className="w-full gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Chỉnh sửa hồ sơ
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => {
                                        onOpenChange(false)
                                        onGoToSecurity()
                                    }}
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Bảo mật & Quyền riêng tư
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 gap-2"
                                    onClick={cancelEditing}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                    Hủy
                                </Button>
                                <Button
                                    className="flex-1 gap-2"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        "Đang lưu..."
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
