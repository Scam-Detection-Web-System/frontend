"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    ArrowLeft, Camera, User as UserIcon, Mail, Phone, MapPin, Calendar, Save,
} from "lucide-react"
import { toast } from "sonner"

export default function EditProfilePage() {
    const { user, updateProfile } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [editName, setEditName] = useState(user?.name || "")
    const [editPhone, setEditPhone] = useState("")
    const [editAddress, setEditAddress] = useState("")
    const [editBirthday, setEditBirthday] = useState("")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const displayAvatar = avatarPreview || user?.avatar
    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ảnh đại diện không được vượt quá 5MB")
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

    const handleRemoveAvatar = () => {
        setAvatarPreview(null)
        // Could also set a flag to remove the stored avatar
    }

    const handleSave = async () => {
        if (!editName.trim()) {
            toast.error("Vui lòng nhập họ và tên")
            return
        }
        setIsLoading(true)
        try {
            const updateData: { name?: string; avatar?: string } = {}
            if (editName !== user?.name) updateData.name = editName
            if (avatarPreview) updateData.avatar = avatarPreview
            if (Object.keys(updateData).length === 0) {
                toast.info("Không có thay đổi nào")
                navigate("/taikhoan")
                return
            }
            await updateProfile(updateData)
            toast.success("Cập nhật hồ sơ thành công")
            navigate("/taikhoan")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra")
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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa hồ sơ</h1>
                        <p className="text-sm text-muted-foreground">Cập nhật thông tin cá nhân của bạn</p>
                    </div>
                </div>

                {/* Avatar Section */}
                <Card className="border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-6">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Ảnh đại diện</h2>
                        <div className="flex items-start gap-5">
                            {/* Avatar with camera overlay */}
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Avatar className="h-24 w-24 border-2 border-slate-200 dark:border-slate-700">
                                    {displayAvatar ? (
                                        <AvatarImage src={displayAvatar} alt={user?.name} />
                                    ) : null}
                                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-xl font-bold text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md border-2 border-white dark:border-slate-900">
                                    <Camera className="h-4 w-4" />
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

                            {/* Instructions */}
                            <div className="flex-1 pt-2">
                                <p className="text-sm text-muted-foreground">
                                    Chọn ảnh đại diện mới. JPG, PNG hoặc GIF, tối đa 5MB.
                                </p>
                                {(displayAvatar) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAvatar}
                                        className="mt-2 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                    >
                                        Xóa ảnh hiện tại
                                    </button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Info Section */}
                <Card className="border-slate-200 dark:border-slate-700/50">
                    <CardContent className="p-6 space-y-5">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Thông tin cơ bản</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Họ và tên */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Họ và tên</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Email (read-only) */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={user?.email || ""}
                                        disabled
                                        className="pl-10 bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Số điện thoại */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Số điện thoại</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        placeholder="0912345678"
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Ngày sinh</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={editBirthday}
                                        onChange={(e) => setEditBirthday(e.target.value)}
                                        className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ (full width) */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Địa chỉ</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={editAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    placeholder="Nhập địa chỉ"
                                    className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full gap-2 h-11"
                >
                    {isLoading ? (
                        "Đang lưu..."
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Lưu thay đổi
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
