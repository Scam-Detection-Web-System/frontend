import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, Tag, AlertCircle, RefreshCw, User, Share2, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blogService, BlogResponse } from "@/services/blog.service"

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ArticleSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="flex gap-3">
                <div className="h-6 w-20 rounded-full bg-muted" />
                <div className="h-6 w-32 rounded bg-muted" />
            </div>
            <div className="space-y-3">
                <div className="h-10 w-4/5 rounded bg-muted" />
                <div className="h-10 w-2/3 rounded bg-muted" />
            </div>
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-80 w-full rounded-2xl bg-muted" />
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-11/12 rounded bg-muted" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                </div>
            ))}
        </div>
    )
}

// ─── Render rich content (newline-separated paragraphs) ───────────────────────
function ArticleContent({ content }: { content: string }) {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim() !== "")
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90">
            {paragraphs.map((para, idx) => {
                const lines = para.split(/\n/)
                const isBullet = lines.every(l => l.trim().startsWith("•") || l.trim().startsWith("-"))
                if (isBullet) {
                    return (
                        <ul key={idx} className="my-4 pl-5 space-y-1 list-disc text-foreground/80 text-[1.05rem] leading-relaxed">
                            {lines.map((l, i) => (
                                <li key={i}>{l.replace(/^[•\-]\s*/, "")}</li>
                            ))}
                        </ul>
                    )
                }
                return (
                    <p key={idx} className="mb-5 text-[1.05rem] sm:text-[1.1rem] leading-[1.9] font-[450]">
                        {lines.map((line, i) => (
                            <span key={i}>
                                {line}
                                {i < lines.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                )
            })}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewsDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [blog, setBlog] = useState<BlogResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchBlog = async () => {
        if (!id) return
        setLoading(true)
        setError("")
        try {
            const res = await blogService.getBlogById(id)
            if (res.success && res.data) {
                setBlog(res.data)
            } else {
                setError(res.message || "Không tìm thấy bài viết.")
            }
        } catch (err: any) {
            const msg: string = err?.message ?? ""
            // Lỗi xác thực do endpoint getBlogById yêu cầu login
            if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("401") ||
                msg.toLowerCase().includes("forbidden") || msg.toLowerCase().includes("403")) {
                
                // WORKAROUND: Endpoint /blogs không yêu cầu login và trả về đủ content
                try {
                    const fallbackRes = await blogService.getBlogs({ page: 0, size: 200 })
                    if (fallbackRes.success && fallbackRes.data?.content) {
                        const found = fallbackRes.data.content.find((b: BlogResponse) => b.blogId === id)
                        if (found) {
                            setBlog(found)
                            return
                        }
                    }
                    setError("Bài viết không tồn tại hoặc yêu cầu quyền truy cập.")
                } catch (fallbackErr) {
                    setError("Vui lòng đăng nhập để xem chi tiết bài viết này.")
                }
            } else {
                setError("Lỗi kết nối hoặc bài viết không tồn tại.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlog()
        window.scrollTo({ top: 0 })
    }, [id])

    const formattedDate = blog?.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : ""

    const tags = blog?.label ? blog.label.split(",").map(t => t.trim()).filter(Boolean) : []

    const handleShare = async () => {
        try {
            await navigator.share({ title: blog?.title, url: window.location.href })
        } catch {
            await navigator.clipboard.writeText(window.location.href)
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Back button */}
            <Button
                variant="ghost"
                onClick={() => navigate("/tintuc")}
                className="mb-8 -ml-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Quay lại tin tức
            </Button>

            {/* Loading */}
            {loading && <ArticleSkeleton />}

            {/* Error */}
            {!loading && error && (
                <div className="flex flex-col items-center gap-5 py-32 text-center">
                    <AlertCircle className="h-14 w-14 text-destructive" />
                    <h2 className="text-2xl font-bold text-foreground">Không tìm thấy bài viết</h2>
                    <p className="text-muted-foreground max-w-sm">{error}</p>
                    <div className="flex gap-3">
                        <Button onClick={fetchBlog} variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Thử lại
                        </Button>
                        <Button onClick={() => navigate("/tintuc")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Về danh sách
                        </Button>
                    </div>
                </div>
            )}

            {/* Article */}
            {!loading && !error && blog && (
                <article>
                    {/* Header */}
                    <header className="mb-8">
                        {/* Tags + date */}
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mr-auto">
                                <BookOpen className="h-3.5 w-3.5" />
                                Tin tức &amp; Cảnh báo
                            </div>
                            {tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                                    <Tag className="h-2.5 w-2.5" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                            {blog.title}
                        </h1>

                        {/* Lead / snippet */}
                        {blog.snippet && (
                            <p className="mt-6 text-lg font-semibold text-foreground/80 border-l-4 border-primary pl-5 italic leading-relaxed">
                                {blog.snippet}
                            </p>
                        )}

                        {/* Author + date + share */}
                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                Ban biên tập AntiScam
                            </div>
                            {formattedDate && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formattedDate}
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto gap-1.5 text-muted-foreground"
                                onClick={handleShare}
                            >
                                <Share2 className="h-3.5 w-3.5" />
                                Chia sẻ
                            </Button>
                        </div>
                    </header>

                    <hr className="border-border mb-8" />

                    {/* Cover image */}
                    {blog.imageUrl && (
                        <div className="mb-8 overflow-hidden rounded-2xl shadow-md">
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-auto max-h-[460px] object-cover"
                            />
                        </div>
                    )}

                    {/* Body content */}
                    {blog.content && <ArticleContent content={blog.content} />}

                    {/* Footer */}
                    <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-sm text-muted-foreground">
                            Nguồn: Ban biên tập An toàn mạng
                            {formattedDate && <> &bull; {formattedDate}</>}
                        </div>
                        <Button variant="outline" onClick={() => navigate("/tintuc")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Xem tất cả tin tức
                        </Button>
                    </div>
                </article>
            )}
        </div>
    )
}
