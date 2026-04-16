import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { quizService, QuizHistoryItem } from "@/services/quiz.service"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Brain, Trophy, Star, RotateCcw, Loader2,
    ChevronRight, Calendar, CheckCircle2, XCircle,
    LogIn, History, TrendingUp, Award,
} from "lucide-react"
import { cn } from "@/lib/utils"

function scoreConfig(pct: number) {
    if (pct >= 80) return {
        label: "Xuất sắc",
        color: "text-slate-900 dark:text-white",
        bg: "bg-white dark:bg-slate-900",
        border: "border-slate-200 dark:border-slate-700/50",
        badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: <Trophy className="h-5 w-5 text-slate-600 dark:text-slate-400" />,
    }
    if (pct >= 60) return {
        label: "Tốt",
        color: "text-slate-900 dark:text-white",
        bg: "bg-white dark:bg-slate-900",
        border: "border-slate-200 dark:border-slate-700/50",
        badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: <Star className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
    }
    return {
        label: "Cần cố gắng",
        color: "text-slate-900 dark:text-white",
        bg: "bg-white dark:bg-slate-900",
        border: "border-slate-200 dark:border-slate-700/50",
        badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        icon: <RotateCcw className="h-5 w-5 text-slate-400 dark:text-slate-500" />,
    }
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return "—"
    try {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch {
        return dateStr
    }
}

function HistoryCard({ item, index }: { item: QuizHistoryItem; index: number }) {
    const pct = item.totalQuestions > 0
        ? Math.round((item.correctAnswers / item.totalQuestions) * 100)
        : 0
    const cfg = scoreConfig(pct)
    const dateStr = item.completedAt ?? item.createdAt ?? item.submittedAt

    return (
        <div
            className={cn(
                "rounded-2xl border p-5 transition-all duration-200 hover:shadow-md",
                cfg.bg, cfg.border
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                        {cfg.icon}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {item.topicName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{formatDate(dateStr)}</span>
                        </div>
                    </div>
                </div>

                {/* Score badge */}
                <div className="shrink-0 text-right">
                    <p className={cn("text-2xl font-black", cfg.color)}>{(pct / 10).toFixed(1).replace('.0', '')}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", cfg.badge)}>
                        {cfg.label}
                    </span>
                </div>
            </div>

            {/* Stats row */}
            <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                        <strong>{item.correctAnswers}</strong>/{item.totalQuestions} đúng
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                        <strong>{item.totalQuestions - item.correctAnswers}</strong> sai
                    </span>
                </div>
                <Badge variant="outline" className="ml-auto text-[11px] font-medium">
                    #{index + 1}
                </Badge>
            </div>

            {/* Score bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/60 dark:bg-slate-700/60">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        pct >= 80 ? "bg-slate-800 dark:bg-slate-200" : pct >= 60 ? "bg-slate-500 dark:bg-slate-400" : "bg-slate-300 dark:bg-slate-600"
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}

export default function QuizHistoryPage() {
    const { isAuthenticated } = useAuth()
    const [history, setHistory] = useState<QuizHistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!isAuthenticated) { setLoading(false); return }
        quizService.getQuizHistory()
            .then(res => {
                const data = res.data
                if (Array.isArray(data)) setHistory(data)
                else setHistory([])
            })
            .catch(err => setError(err.message ?? "Không thể tải lịch sử quiz"))
            .finally(() => setLoading(false))
    }, [isAuthenticated])

    // Stats
    const total = history.length
    const avgPct = total > 0
        ? Math.round(history.reduce((sum, h) => {
            const pct = h.totalQuestions > 0 ? (h.correctAnswers / h.totalQuestions) * 100 : 0
            return sum + pct
        }, 0) / total)
        : 0
    const best = total > 0
        ? Math.max(...history.map(h => h.totalQuestions > 0 ? Math.round((h.correctAnswers / h.totalQuestions) * 100) : 0))
        : 0

    return (
        <section className="py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                        <History className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                        Lịch sử làm quiz
                    </h1>
                    <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
                        Xem lại các lần bạn đã hoàn thành bài kiểm tra nhận thức lừa đảo.
                    </p>
                </div>

                {/* Not logged in */}
                {!isAuthenticated && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
                        <LogIn className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Cần đăng nhập để xem lịch sử
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Lịch sử làm bài chỉ được lưu khi bạn đã đăng nhập vào tài khoản.
                        </p>
                        <Link to="/quiz">
                            <Button className="gap-2">
                                <Brain className="h-4 w-4" />
                                Làm quiz ngay
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Loading */}
                {isAuthenticated && loading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                        <p className="text-sm">Đang tải lịch sử...</p>
                    </div>
                )}

                {/* Error */}
                {isAuthenticated && !loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 gap-2"
                            onClick={() => {
                                setError("")
                                setLoading(true)
                                quizService.getQuizHistory()
                                    .then(r => setHistory(Array.isArray(r.data) ? r.data : []))
                                    .catch(e => setError(e.message ?? "Lỗi"))
                                    .finally(() => setLoading(false))
                            }}
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Thử lại
                        </Button>
                    </div>
                )}

                {/* Empty */}
                {isAuthenticated && !loading && !error && history.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
                        <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-30" />
                        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Chưa có lịch sử
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Bạn chưa hoàn thành bài quiz nào. Hãy thử ngay!
                        </p>
                        <Link to="/quiz">
                            <Button className="gap-2">
                                <Brain className="h-4 w-4" />
                                Bắt đầu làm quiz
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Content */}
                {isAuthenticated && !loading && !error && history.length > 0 && (
                    <>
                        {/* Stats cards */}
                        <div className="mb-6 grid grid-cols-3 gap-3">
                            <Card className="border-slate-200 dark:border-slate-700/50 text-center">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex justify-center mb-1">
                                        <History className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{total}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Lần làm bài</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 dark:border-slate-700/50 text-center">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex justify-center mb-1">
                                        <TrendingUp className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{(avgPct / 10).toFixed(1).replace('.0', '')}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Điểm trung bình (thang 10)</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 dark:border-slate-700/50 text-center">
                                <CardContent className="pt-4 pb-4">
                                    <div className="flex justify-center mb-1">
                                        <Award className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{(best / 10).toFixed(1).replace('.0', '')}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">Điểm cao nhất (thang 10)</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* History list */}
                        <div className="space-y-3">
                            {history.map((item, idx) => (
                                <HistoryCard key={item.historyId ?? item.id ?? idx} item={item} index={idx} />
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="mt-8 text-center">
                            <Link to="/quiz">
                                <Button className="gap-2">
                                    <Brain className="h-4 w-4" />
                                    Làm bài mới
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}
