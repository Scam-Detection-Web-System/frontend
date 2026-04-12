"use client"

import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Pencil, Settings,
    Mail, ShieldCheck, Zap,
    Star, Search, FileWarning, Bell, ChevronRight,
    LogOut, Phone, Newspaper, Brain,
} from "lucide-react"

export default function PersonalPage() {
    const { user, logout } = useAuth()

    const displayAvatar = user?.avatar
    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"

    return (
        <div className="flex flex-1 justify-center px-4 pb-10">
            <div className="w-full max-w-5xl">
                {/* ===== GRADIENT BANNER ===== */}
                <div className="relative h-40 sm:h-48 rounded-b-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-[oklch(0.205_0_0)] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_70%)]" />
                </div>

                {/* ===== PROFILE OVERLAY ===== */}
                <div className="relative -mt-16 sm:-mt-20 mx-4 sm:mx-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        {/* Avatar */}
                        <div className="relative group">
                            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-xl dark:border-slate-900 ring-2 ring-primary/30">
                                {displayAvatar ? (
                                    <AvatarImage src={displayAvatar} alt={user?.name} />
                                ) : null}
                                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-2xl sm:text-3xl font-bold text-white">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {/* Online indicator */}
                            <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
                        </div>

                        {/* Name + Email */}
                        <div className="flex-1 pb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                                    {user?.name}
                                </h1>
                                <Badge className={`text-[11px] px-2 ${user?.isAdmin
                                    ? "bg-teal-500 hover:bg-teal-500 text-white"
                                    : "bg-sky-500 hover:bg-sky-500 text-white"
                                    }`}>
                                    {user?.isAdmin ? "Quản trị viên" : "Thành viên"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-sm text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{user?.email}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:pb-1">
                            <Link to="/taikhoan/chinhsua">
                                <Button variant="outline" className="gap-1.5 h-9 text-sm">
                                    <Pencil className="h-3.5 w-3.5" />
                                    Chỉnh sửa
                                </Button>
                            </Link>
                            <Link to="/baomat">
                                <Button className="gap-1.5 h-9 text-sm">
                                    <Settings className="h-3.5 w-3.5" />
                                    Cài đặt
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ===== TWO-COLUMN CONTENT ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-0 sm:mx-2">
                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Thông tin tài khoản */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Zap className="h-4 w-4 text-primary" />
                                    Thông tin tài khoản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <p className="text-xs text-muted-foreground mb-1">Tên đăng nhập</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Đã xác thực</p>
                                    </div>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50 sm:max-w-[calc(50%-0.375rem)]">
                                    <p className="text-xs text-muted-foreground mb-1">Bảo mật 2 lớp</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Chưa bật</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hoạt động */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Hoạt động
                                    </CardTitle>
                                    <Link to="/" className="text-sm font-medium text-primary hover:text-primary/80">
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10">
                                        <p className="text-xs text-muted-foreground mb-1">SĐT đã kiểm tra</p>
                                        <p className="text-xl font-bold text-primary">12</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <p className="text-xs text-muted-foreground mb-1">Báo cáo đã gửi</p>
                                        <p className="text-xl font-bold text-primary">3</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <p className="text-xs text-muted-foreground mb-1">Đóng góp</p>
                                        <p className="text-xl font-bold text-primary">5</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-5">
                        {/* Truy cập nhanh */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Star className="h-4 w-4 text-primary" />
                                    Truy cập nhanh
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Link to="/kiemtra" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Kiểm tra SĐT</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link to="/baocao" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                                        <FileWarning className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Báo cáo lừa đảo</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link to="/quiz/history" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                                        <Brain className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Lịch sử Quiz</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link to="/tintuc" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                        <Newspaper className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Tin tức</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Cài đặt */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">Cài đặt</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Link to="/baomat" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Bảo mật & Quyền riêng tư</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link to="#" className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <span className="flex-1 text-sm font-medium">Thông báo</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                
                            </CardContent>
                        </Card>

                        {/* Đăng xuất */}
                        <Button
                            variant="outline"
                            onClick={async () => {
                                await logout();
                                window.location.href = "/";
                            }}
                            className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
