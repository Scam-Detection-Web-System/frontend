import { useState, useEffect, useCallback } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    quizService,
    QuizTopicResponse,
    QuestionResponse,
    QuizTopicCreationRequest,
    QuestionCreationRequest,
} from "@/services/quiz.service"
import {
    Activity, Plus, RefreshCw, X, Loader2, Edit2,
    BookOpen, ChevronDown, ChevronUp, BrainCircuit, Upload
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── Types ─────────────────────────────────────────────────────────────────────
const OPTIONS = ["A", "B", "C", "D"] as const

// ─── Question Modal ────────────────────────────────────────────────────────────
interface QuestionModalProps {
    topicId: string
    question?: QuestionResponse
    onClose: () => void
    onSuccess: () => void
}

function QuestionModal({ topicId, question, onClose, onSuccess }: QuestionModalProps) {
    const isEdit = !!question
    const [form, setForm] = useState({
        content: question?.content ?? "",
        optionA: question?.optionA ?? "",
        optionB: question?.optionB ?? "",
        optionC: question?.optionC ?? "",
        optionD: question?.optionD ?? "",
        correctAnswer: question?.correctAnswer ?? "A",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const set = (field: string, val: string) => setForm(f => ({ ...f, [field]: val }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            if (isEdit && question) {
                await quizService.updateQuestion(question.questionId, form)
            } else {
                await quizService.createQuestion(topicId, form as QuestionCreationRequest)
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message ?? "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
            <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{isEdit ? "Sửa câu hỏi" : "Thêm câu hỏi"}</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label>Nội dung câu hỏi</Label>
                        <textarea
                            value={form.content}
                            onChange={e => set("content", e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Nhập nội dung câu hỏi..."
                        />
                    </div>
                    {(["A", "B", "C", "D"] as const).map(opt => (
                        <div key={opt} className="space-y-1.5">
                            <Label>Đáp án {opt}</Label>
                            <Input
                                value={form[`option${opt}` as keyof typeof form]}
                                onChange={e => set(`option${opt}`, e.target.value)}
                                placeholder={`Nhập đáp án ${opt}...`}
                                disabled={loading}
                            />
                        </div>
                    ))}
                    <div className="space-y-1.5">
                        <Label>Đáp án đúng</Label>
                        <select
                            value={form.correctAnswer}
                            onChange={e => set("correctAnswer", e.target.value)}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">Hủy</Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Lưu" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Bulk Import Modal ───────────────────────────────────────────────────────
function BulkImportModal({ topicId, topicName, onClose, onSuccess }: {
    topicId: string
    topicName: string
    onClose: () => void
    onSuccess: () => void
}) {
    const PLACEHOLDER = JSON.stringify([
        { content: "Câu hỏi mẫu?", optionA: "Đáp A", optionB: "Đáp B", optionC: "Đáp C", optionD: "Đáp D", correctAnswer: "A" },
    ], null, 2)

    const [json, setJson] = useState(PLACEHOLDER)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [result, setResult] = useState<{ success: number } | null>(null)

    const handleImport = async () => {
        setError("")
        let parsed: QuestionCreationRequest[]
        try {
            parsed = JSON.parse(json)
            if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Danh sách câu hỏi rỗng")
        } catch {
            setError("JSON không hợp lệ. Vui lòng kiểm tra lại cấu trúc mảng.")
            return
        }
        setLoading(true)
        try {
            await quizService.createQuestionsBulk(topicId, parsed)
            setResult({ success: parsed.length })
            onSuccess()
        } catch (err: any) {
            setError(err.message ?? "Lỗi khi import")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-base font-bold">Import hàng loạt câu hỏi</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Chủ đề: <strong>{topicName}</strong></p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-5 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Dán vào đây mảng JSON chứa danh sách câu hỏi. Mỗi phần tử cần có: 
                        <code className="mx-1 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            content, optionA, optionB, optionC, optionD, correctAnswer
                        </code>
                    </p>
                    <textarea
                        value={json}
                        onChange={e => setJson(e.target.value)}
                        rows={14}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    {result && (
                        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                            <AlertDescription>✅ Đã import thành công {result.success} câu hỏi!</AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="flex gap-3 p-5 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button className="flex-1 gap-2" onClick={handleImport} disabled={loading} id="bulk-import-submit">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Import {json ? (() => { try { const a = JSON.parse(json); return Array.isArray(a) ? a.length : "" } catch { return "" } })() : ""} câu hỏi
                    </Button>
                </div>
            </div>
        </div>
    )
}

// ─── Topic Modal ───────────────────────────────────────────────────────────────
interface TopicModalProps {
    topic?: QuizTopicResponse
    onClose: () => void
    onSuccess: () => void
}

function TopicModal({ topic, onClose, onSuccess }: TopicModalProps) {
    const isEdit = !!topic
    const [topicName, setTopicName] = useState(topic?.topicName ?? "")
    const [description, setDescription] = useState(topic?.description ?? "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            if (isEdit && topic) {
                await quizService.updateTopic(topic.topicId, { topicName, description })
            } else {
                await quizService.createTopic({ topicName, description } as QuizTopicCreationRequest)
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message ?? "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{isEdit ? "Sửa chủ đề" : "Thêm chủ đề Quiz"}</h2>
                    <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Tên chủ đề</Label>
                        <Input value={topicName} onChange={e => setTopicName(e.target.value)} required disabled={loading} placeholder="Ví dụ: Nhận biết phishing" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Mô tả</Label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={3}
                            disabled={loading}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Mô tả ngắn về chủ đề này..."
                        />
                    </div>
                    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">Hủy</Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Lưu" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Topic Row ─────────────────────────────────────────────────────────────────
function TopicRow({
    topic,
    onEdit,
    onDelete,
    onAddQuestion,
    onEditQuestion,
    onBulkImport,
}: {
    topic: QuizTopicResponse
    onEdit: () => void
    onDelete: () => void
    onAddQuestion: () => void
    onEditQuestion: (q: QuestionResponse) => void
    onBulkImport: () => void
}) {
    const [expanded, setExpanded] = useState(false)
    const [questions, setQuestions] = useState<QuestionResponse[]>([])
    const [loadingQ, setLoadingQ] = useState(false)

    const loadQuestions = async () => {
        setLoadingQ(true)
        try {
            const res = await quizService.getTopicWithQuestions(topic.topicId)
            setQuestions(res.data.questions ?? [])
        } finally {
            setLoadingQ(false)
        }
    }

    const handleDeleteQuestion = async (q: QuestionResponse) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa câu hỏi này không?`)) return
        setLoadingQ(true)
        try {
            await quizService.deleteQuestion(q.questionId)
            await loadQuestions()
        } catch (err: any) {
            alert(err.message ?? "Không thể xóa câu hỏi này")
            setLoadingQ(false)
        }
    }

    const toggleExpand = async () => {
        if (!expanded) await loadQuestions()
        setExpanded(e => !e)
    }

    return (
        <>
            <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                            <BrainCircuit className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{topic.topicName}</span>
                    </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{topic.description}</td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1.5">
                            <Edit2 className="h-3.5 w-3.5" /> Sửa
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onAddQuestion} className="gap-1.5 text-blue-600">
                            <Plus className="h-3.5 w-3.5" /> Thêm câu
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onBulkImport} className="gap-1.5 text-purple-600">
                            <Upload className="h-3.5 w-3.5" /> Import
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                            <X className="h-3.5 w-3.5" /> Xóa
                        </Button>
                        <Button variant="ghost" size="sm" onClick={toggleExpand} className="gap-1.5">
                            {loadingQ ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                                expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {expanded ? "Thu gọn" : "Xem câu hỏi"}
                        </Button>
                    </div>
                </td>
            </tr>
            {/* Expanded questions */}
            {expanded && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td colSpan={3} className="bg-slate-50 dark:bg-slate-800/30 px-8 py-4">
                        {questions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Chưa có câu hỏi nào.</p>
                        ) : (
                            <div className="space-y-3">
                                {questions.map((q, idx) => (
                                    <div key={q.questionId} className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 transition-all hover:border-slate-300">
                                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{q.content || <span className="text-muted-foreground italic">(Câu hỏi rỗng)</span>}</p>
                                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                {OPTIONS.map(opt => {
                                                    const txt = q[`option${opt}` as keyof QuestionResponse] as string
                                                    return txt ? (
                                                        <span key={opt} className={opt === q.correctAnswer ? "text-emerald-600 font-semibold" : ""}>
                                                            {opt}: {txt}
                                                        </span>
                                                    ) : null
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex opacity-50 transition-opacity group-hover:opacity-100">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditQuestion(q)}>
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400" onClick={() => handleDeleteQuestion(q)}>
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminQuiz() {
    const [topics, setTopics] = useState<QuizTopicResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    // Topic modal
    const [showTopicModal, setShowTopicModal] = useState(false)
    const [editingTopic, setEditingTopic] = useState<QuizTopicResponse | undefined>()

    // Question modal
    const [showQuestionModal, setShowQuestionModal] = useState(false)
    const [questionTopicId, setQuestionTopicId] = useState("")
    const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | undefined>()

    // Bulk import modal
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [bulkTopicId, setBulkTopicId] = useState("")
    const [bulkTopicName, setBulkTopicName] = useState("")

    const fetchTopics = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            const res = await quizService.getAllTopics()
            
            // Auto-delete 'test' and 'hello' topics
            const topicsToDelete = res.data?.filter(t => t.topicName.toLowerCase() === 'test' || t.topicName.toLowerCase() === 'hello') || []
            for (const t of topicsToDelete) {
                try {
                    await quizService.deleteTopic(t.topicId)
                } catch(e) {}
            }
            
            // Re-fetch if we deleted anything
            if (topicsToDelete.length > 0) {
                const updatedRes = await quizService.getAllTopics()
                setTopics(updatedRes.data ?? [])
            } else {
                setTopics(res.data ?? [])
            }
        } catch (err: any) {
            setError(err.message ?? "Không thể tải danh sách chủ đề")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchTopics() }, [fetchTopics])

    const filtered = topics.filter(t =>
        t.topicName.toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase())
    )

    const openAddTopic = () => { setEditingTopic(undefined); setShowTopicModal(true) }
    const openEditTopic = (t: QuizTopicResponse) => { setEditingTopic(t); setShowTopicModal(true) }
    const openAddQuestion = (topicId: string) => {
        setQuestionTopicId(topicId)
        setEditingQuestion(undefined)
        setShowQuestionModal(true)
    }
    const openEditQuestion = (topicId: string, q: QuestionResponse) => {
        setQuestionTopicId(topicId)
        setEditingQuestion(q)
        setShowQuestionModal(true)
    }
    const openBulkImport = (t: QuizTopicResponse) => {
        setBulkTopicId(t.topicId)
        setBulkTopicName(t.topicName)
        setShowBulkModal(true)
    }

    const handleDeleteTopic = async (topic: QuizTopicResponse) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.topicName}" không?\nTất cả câu hỏi trong chủ đề này cũng sẽ bị xóa vĩnh viễn.`)) {
            return
        }
        setLoading(true)
        try {
            // WORKAROUND: Gọi lấy chi tiết topic để lấy danh sách câu hỏi.
            // Xóa từng câu hỏi trước khi xóa topic để tránh lỗi 500 (Foreign Key Constraint) từ Backend.
            try {
                const detailRes = await quizService.getTopicWithQuestions(topic.topicId)
                if (detailRes.success && detailRes.data?.questions?.length > 0) {
                    const deletePromises = detailRes.data.questions.map(q => quizService.deleteQuestion(q.questionId).catch(() => {}))
                    await Promise.all(deletePromises)
                }
            } catch (ignore) {
                // Ignore errors fetching/deleting questions, try to delete topic anyway
            }
            
            await quizService.deleteTopic(topic.topicId)
            fetchTopics()
        } catch (err: any) {
            setError(err.message ?? "Không thể xóa chủ đề này")
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Quản lý Quiz</h1>
                        <p className="text-xs text-muted-foreground">Tạo chủ đề và câu hỏi trắc nghiệm</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Badge variant="outline" className="gap-1.5">
                            <Activity className="h-3 w-3 text-emerald-500" />
                            Hệ thống hoạt động
                        </Badge>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng chủ đề</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{topics.length}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Kết quả tìm kiếm</CardTitle>
                                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{filtered.length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Input
                                placeholder="Tìm kiếm chủ đề..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-4"
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={fetchTopics} title="Làm mới">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button onClick={openAddTopic} className="ml-auto gap-2">
                            <Plus className="h-4 w-4" />
                            Thêm chủ đề
                        </Button>
                    </div>

                    {/* Error */}
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Table */}
                    <Card className="border-slate-200 dark:border-slate-700/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Chủ đề</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mô tả</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                                            Đang tải...
                                        </td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                                            {search ? "Không tìm thấy chủ đề phù hợp." : "Chưa có chủ đề nào."}
                                        </td></tr>
                                    ) : (
                                        filtered.map(t => (
                                            <TopicRow
                                                key={t.topicId}
                                                topic={t}
                                                onEdit={() => openEditTopic(t)}
                                                onDelete={() => handleDeleteTopic(t)}
                                                onAddQuestion={() => openAddQuestion(t.topicId)}
                                                onEditQuestion={(q) => openEditQuestion(t.topicId, q)}
                                                onBulkImport={() => openBulkImport(t)}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </main>
            </div>

            {/* Modals */}
            {showTopicModal && (
                <TopicModal
                    topic={editingTopic}
                    onClose={() => setShowTopicModal(false)}
                    onSuccess={() => { setShowTopicModal(false); fetchTopics() }}
                />
            )}
            {showQuestionModal && (
                <QuestionModal
                    topicId={questionTopicId}
                    question={editingQuestion}
                    onClose={() => setShowQuestionModal(false)}
                    onSuccess={() => { setShowQuestionModal(false) }}
                />
            )}
            {showBulkModal && (
                <BulkImportModal
                    topicId={bulkTopicId}
                    topicName={bulkTopicName}
                    onClose={() => setShowBulkModal(false)}
                    onSuccess={() => setShowBulkModal(false)}
                />
            )}
        </div>
    )
}
