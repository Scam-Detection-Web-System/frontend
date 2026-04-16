"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TrendingUp, Phone, AlertTriangle, ChevronRight, Loader2 } from "lucide-react"
import { dashboardService, TopPhoneStatItem } from "@/services/dashboard.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function getRankColor(rank: number): string {
    if (rank === 1) return "bg-red-500 text-white shadow-red-200 dark:shadow-red-900"
    if (rank === 2) return "bg-orange-500 text-white shadow-orange-200 dark:shadow-orange-900"
    if (rank === 3) return "bg-amber-500 text-white shadow-amber-200 dark:shadow-amber-900"
    if (rank <= 5) return "bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900"
    return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
}

function getBarColor(rank: number): string {
    if (rank === 1) return "bg-gradient-to-r from-red-500 to-red-400"
    if (rank === 2) return "bg-gradient-to-r from-orange-500 to-orange-400"
    if (rank === 3) return "bg-gradient-to-r from-amber-500 to-amber-400"
    if (rank <= 5) return "bg-gradient-to-r from-slate-600 to-slate-500"
    return "bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-500 dark:to-slate-600"
}

function getDangerBadge(rank: number) {
    if (rank === 1) return <Badge variant="destructive" className="text-xs">Nguy hiểm nhất</Badge>
    if (rank <= 3) return <Badge className="text-xs bg-orange-500 text-white hover:bg-orange-600">Nguy hiểm cao</Badge>
    if (rank <= 5) return <Badge variant="secondary" className="text-xs">Đáng ngờ</Badge>
    return null
}

export function TopPhonesSection() {
    const navigate = useNavigate()
    const [phones, setPhones] = useState<TopPhoneStatItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchTopPhones() {
            try {
                const res = await dashboardService.getTopPhoneStats()
                if (res.success && Array.isArray(res.data)) {
                    // Limit to top 15
                    setPhones(res.data.slice(0, 15))
                } else {
                    setError("Không thể tải dữ liệu.")
                }
            } catch {
                setError("Lỗi kết nối. Vui lòng thử lại sau.")
            } finally {
                setLoading(false)
            }
        }
        fetchTopPhones()
    }, [])

    const maxReports = phones.length > 0 ? phones[0].totalReports : 1

    return (
        <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center mb-10">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-red-100 p-3 dark:bg-red-900/40">
                        <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Top 15 số điện thoại bị báo cáo nhiều nhất
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                        Danh sách các số điện thoại được cộng đồng báo cáo lừa đảo nhiều nhất. Hãy cẩn thận khi nhận cuộc gọi từ những số này.
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-red-500" />
                        <p className="text-slate-500 dark:text-slate-400">Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <AlertTriangle className="h-10 w-10 text-amber-500" />
                        <p className="text-slate-500 dark:text-slate-400">{error}</p>
                    </div>
                ) : phones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Phone className="h-10 w-10 text-slate-400" />
                        <p className="text-slate-500 dark:text-slate-400">Chưa có dữ liệu báo cáo.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left: Top 3 highlight cards */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                                🏆 Top nguy hiểm nhất
                            </h3>
                            {phones.slice(0, 3).map((phone, idx) => (
                                <button
                                    key={phone.phoneNumber}
                                    onClick={() => navigate(`/tracuu/${phone.phoneNumber}`)}
                                    className="w-full text-left"
                                >
                                    <Card className="group border-2 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 hover:shadow-lg cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* Rank Badge */}
                                                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ${getRankColor(idx + 1)}`}>
                                                    {idx + 1}
                                                </div>
                                                {/* Phone Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-slate-900 dark:text-white font-mono text-base group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                            {phone.phoneNumber}
                                                        </span>
                                                        {getDangerBadge(idx + 1)}
                                                    </div>
                                                    <div className="mt-2">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {phone.totalReports} báo cáo
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {Math.round((phone.totalReports / maxReports) * 100)}%
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-700 ${getBarColor(idx + 1)}`}
                                                                style={{ width: `${Math.max(10, (phone.totalReports / maxReports) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </button>
                            ))}
                        </div>

                        {/* Right: Full list #4–15 */}
                        <Card className="border-slate-200 dark:border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Danh sách đầy đủ (Top 4–15)
                                </CardTitle>
                                <CardDescription>Nhấn vào số điện thoại để xem chi tiết báo cáo</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {phones.slice(3).map((phone, idx) => {
                                        const rank = idx + 4
                                        const pct = Math.max(6, (phone.totalReports / maxReports) * 100)
                                        return (
                                            <button
                                                key={phone.phoneNumber}
                                                onClick={() => navigate(`/tracuu/${phone.phoneNumber}`)}
                                                className="group flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                                            >
                                                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${getRankColor(rank)}`}>
                                                    {rank}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                            {phone.phoneNumber}
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex-shrink-0">
                                                            {phone.totalReports} BC
                                                        </span>
                                                    </div>
                                                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={`h-full rounded-full ${getBarColor(rank)} transition-all duration-500`}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-red-400 transition-colors flex-shrink-0" />
                                            </button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-10 text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/kiemtra")}
                        className="gap-2"
                    >
                        <Phone className="h-4 w-4" />
                        Kiểm tra số điện thoại của bạn
                    </Button>
                </div>
            </div>
        </section>
    )
}
