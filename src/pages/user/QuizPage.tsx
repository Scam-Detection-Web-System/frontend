import { useState, useEffect } from "react"
import { quizService, QuizTopicResponse, QuizDetailResponse, QuizSubmitResponse, QuizAnswerRequest } from "@/services/quiz.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Brain, ChevronRight, ChevronLeft, Trophy, RotateCcw,
    Loader2, CheckCircle, XCircle, BookOpen, Star, LogIn
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

// ─── Screen states ────────────────────────────────────────────────────────────
type Screen = "topics" | "quiz" | "result"

// ─── Topic Selection ──────────────────────────────────────────────────────────
function TopicCard({ topic, onSelect }: { topic: QuizTopicResponse; onSelect: () => void }) {
    return (
        <Card
            className="group cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
            onClick={onSelect}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                        <Brain className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="mt-3 text-lg leading-tight">{topic.topicName}</CardTitle>
                <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full gap-2" variant="outline" size="sm">
                    <BookOpen className="h-4 w-4" />
                    Bắt đầu làm bài
                </Button>
            </CardContent>
        </Card>
    )
}

// ─── Quiz Playing Screen ──────────────────────────────────────────────────────
const OPTIONS = ["A", "B", "C", "D"] as const

function QuizScreen({
    quiz,
    onFinish,
}: {
    quiz: QuizDetailResponse
    onFinish: (result: QuizSubmitResponse) => void
}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const question = quiz.questions[currentIndex]
    const totalQuestions = quiz.questions.length
    const progress = ((currentIndex + 1) / totalQuestions) * 100
    const selectedAnswer = answers[question.questionId]
    const isLast = currentIndex === totalQuestions - 1

    const optionText = (option: string) => {
        switch (option) {
            case "A": return question.optionA
            case "B": return question.optionB
            case "C": return question.optionC
            case "D": return question.optionD
            default: return ""
        }
    }

    const handleSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [question.questionId]: option }))
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError("")
        const payload: QuizAnswerRequest[] = quiz.questions.map(q => ({
            questionId: q.questionId,
            selectedAnswer: answers[q.questionId] ?? "",
        }))
        try {
            const res = await quizService.submitQuiz({ topicId: quiz.topicId, answers: payload })
            onFinish(res.data)
        } catch (err: any) {
            setError(err.message ?? "Nộp bài thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-2xl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Câu {currentIndex + 1} / {totalQuestions}
                    </span>
                    <Badge variant="outline" className="gap-1">
                        <Brain className="h-3 w-3" />
                        {quiz.topicName}
                    </Badge>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <Card className="mb-6 shadow-sm">
                <CardContent className="pt-6">
                    <p className="text-base font-medium leading-relaxed text-slate-900 dark:text-white">
                        {question.content}
                    </p>

                    <div className="mt-6 space-y-3">
                        {OPTIONS.map(option => {
                            const text = optionText(option)
                            if (!text) return null
                            const isSelected = selectedAnswer === option
                            return (
                                <button
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={cn(
                                        "w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-150",
                                        isSelected
                                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <span className={cn(
                                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                                        isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                    )}>
                                        {option}
                                    </span>
                                    <span className="text-sm text-slate-700 dark:text-slate-200">{text}</span>
                                </button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Error */}
            {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}

            {/* Navigation */}
            <div className="flex justify-between gap-3">
                <Button
                    variant="outline"
                    onClick={() => setCurrentIndex(i => i - 1)}
                    disabled={currentIndex === 0}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Quay lại
                </Button>

                {isLast ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || Object.keys(answers).length < totalQuestions}
                        className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
                        {submitting ? "Đang nộp..." : "Nộp bài"}
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentIndex(i => i + 1)}
                        disabled={!selectedAnswer}
                        className="gap-2"
                    >
                        Câu tiếp theo
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Answer progress dots */}
            <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {quiz.questions.map((q, i) => (
                    <button
                        key={q.questionId}
                        onClick={() => setCurrentIndex(i)}
                        className={cn(
                            "h-7 w-7 rounded-full text-xs font-medium transition-all",
                            i === currentIndex
                                ? "ring-2 ring-primary ring-offset-2 bg-primary text-white"
                                : answers[q.questionId]
                                    ? "bg-primary/20 text-primary"
                                    : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                        )}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Result Screen ────────────────────────────────────────────────────────────
function scoreConfig(score: number) {
    if (score >= 80) return { label: "Xuất sắc!", color: "text-emerald-600", icon: <Trophy className="h-16 w-16 text-yellow-500" />, stars: 3 }
    if (score >= 60) return { label: "Tốt!", color: "text-blue-600", icon: <Star className="h-16 w-16 text-blue-500" />, stars: 2 }
    return { label: "Cần cố gắng thêm!", color: "text-amber-600", icon: <RotateCcw className="h-16 w-16 text-amber-500" />, stars: 1 }
}

function ResultScreen({
    result,
    onRetry,
    onBack,
}: {
    result: QuizSubmitResponse
    onRetry: () => void
    onBack: () => void
}) {
    const pct = result.totalQuestions > 0
        ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
        : 0
    const cfg = scoreConfig(pct)

    return (
        <div className="mx-auto w-full max-w-2xl">
            {/* Score card */}
            <Card className="mb-6 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white text-center">
                    <div className="flex justify-center mb-4">{cfg.icon}</div>
                    <h2 className="text-3xl font-bold mb-1">{cfg.label}</h2>
                    <p className="text-blue-100 text-sm">{result.topicName}</p>
                    <div className="mt-6 flex justify-center gap-8">
                        <div>
                            <p className="text-4xl font-black">{pct}%</p>
                            <p className="text-sm text-blue-200">Điểm số</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black">{result.correctAnswers}/{result.totalQuestions}</p>
                            <p className="text-sm text-blue-200">Câu đúng</p>
                        </div>
                    </div>
                </div>
                <CardContent className="pt-4 pb-6">
                    <p className="text-center text-muted-foreground text-sm italic">"{result.message}"</p>
                </CardContent>
            </Card>

            {/* Question results */}
            <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white">Chi tiết kết quả</h3>
                {result.results.map((r, i) => (
                    <Card key={r.questionId} className={cn(
                        "border-l-4",
                        r.correct ? "border-l-emerald-500" : "border-l-red-500"
                    )}>
                        <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-3">
                                {r.correct
                                    ? <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    : <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                }
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                        Câu {i + 1}: {r.content}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        <span className={cn(
                                            "rounded-full px-2.5 py-1 font-medium",
                                            r.correct
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                        )}>
                                            Bạn chọn: {r.selectedAnswer || "Chưa trả lời"}
                                        </span>
                                        {!r.correct && (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">
                                                Đáp án: {r.correctAnswer}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1 gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Chọn chủ đề khác
                </Button>
                <Button onClick={onRetry} className="flex-1 gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Làm lại
                </Button>
            </div>
        </div>
    )
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────
export default function QuizPage() {
    const [screen, setScreen] = useState<Screen>("topics")
    const [topics, setTopics] = useState<QuizTopicResponse[]>([])
    const [loadingTopics, setLoadingTopics] = useState(true)
    const [loadingQuiz, setLoadingQuiz] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState<QuizTopicResponse | null>(null)
    const [quizDetail, setQuizDetail] = useState<QuizDetailResponse | null>(null)
    const [result, setResult] = useState<QuizSubmitResponse | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        quizService.getAllTopics()
            .then(res => setTopics(res.data ?? []))
            .catch(() => setError("Không thể tải danh sách chủ đề"))
            .finally(() => setLoadingTopics(false))
    }, [])

    const handleSelectTopic = async (topic: QuizTopicResponse) => {
        setSelectedTopic(topic)
        setLoadingQuiz(true)
        setError("")
        try {
            const res = await quizService.getTopicWithQuestions(topic.topicId)
            if (!res.data.questions || res.data.questions.length === 0) {
                setError("Chủ đề này chưa có câu hỏi. Vui lòng chọn chủ đề khác.")
                return
            }
            setQuizDetail(res.data)
            setScreen("quiz")
        } catch {
            setError("Không thể tải câu hỏi. Vui lòng thử lại.")
        } finally {
            setLoadingQuiz(false)
        }
    }

    const handleFinish = (r: QuizSubmitResponse) => {
        setResult(r)
        setScreen("result")
    }

    const handleRetry = async () => {
        if (!selectedTopic) return
        setResult(null)
        setScreen("quiz")
    }

    const handleBackToTopics = () => {
        setScreen("topics")
        setSelectedTopic(null)
        setQuizDetail(null)
        setResult(null)
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                {screen === "topics" && (
                    <div className="mb-10 text-center">
                        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-100 p-3 dark:bg-purple-900/40">
                            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Trắc nghiệm nhận thức về lừa đảo
                        </h1>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                            Kiểm tra kiến thức của bạn về các hình thức lừa đảo trực tuyến qua các bộ câu hỏi thú vị.
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        {error}
                    </div>
                )}

                {/* Topics Screen */}
                {screen === "topics" && (
                    loadingTopics || loadingQuiz ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm">{loadingQuiz ? "Đang tải câu hỏi..." : "Đang tải chủ đề..."}</p>
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="py-20 text-center text-muted-foreground">
                            <Brain className="mx-auto mb-4 h-12 w-12 opacity-30" />
                            <p>Chưa có chủ đề quiz nào. Vui lòng quay lại sau.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {topics.map(topic => (
                                <TopicCard
                                    key={topic.topicId}
                                    topic={topic}
                                    onSelect={() => handleSelectTopic(topic)}
                                />
                            ))}
                        </div>
                    )
                )}

                {/* Quiz Screen */}
                {screen === "quiz" && quizDetail && (
                    <QuizScreen quiz={quizDetail} onFinish={handleFinish} />
                )}

                {/* Result Screen */}
                {screen === "result" && result && (
                    <ResultScreen result={result} onRetry={handleRetry} onBack={handleBackToTopics} />
                )}
            </div>
        </section>
    )
}
