"use client"

import { useState, useEffect, useCallback } from "react"
import { Newspaper, Clock, ArrowRight, Search, ChevronLeft, ChevronRight, Tag, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { blogService, BlogResponse, PageBlogResponse } from "@/services/blog.service"

const PAGE_SIZE = 9

// ─── Skeleton card ────────────────────────────────────────────────────────────
function BlogCardSkeleton() {
    return (
        <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-16 rounded-full bg-muted" />
                    <div className="h-4 w-24 rounded bg-muted ml-auto" />
                </div>
                <div className="h-5 w-full rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted mt-1" />
                <div className="h-4 w-5/6 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="mt-auto h-4 w-20 rounded bg-muted" />
            </div>
        </div>
    )
}

// ─── Single blog card ─────────────────────────────────────────────────────────
function BlogCard({ blog }: { blog: BlogResponse }) {
    const navigate = useNavigate()
    const tags = blog.label ? blog.label.split(",").map(t => t.trim()).filter(Boolean) : []
    const formattedDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
        : ""

    return (
        <article
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            onClick={() => navigate(`/tintuc/${blog.blogId}`)}
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-muted">
                {blog.imageUrl ? (
                    <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none"
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
                        <Newspaper className="h-12 w-12 text-primary/40" />
                    </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Meta row */}
                <div className="flex items-center gap-2 flex-wrap">
                    {tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                        </Badge>
                    ))}
                    {formattedDate && (
                        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <Clock className="h-3 w-3" />
                            {formattedDate}
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                    {blog.title}
                </h3>

                {/* Snippet */}
                {blog.snippet && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                        {blog.snippet}
                    </p>
                )}

                {/* Read more */}
                <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-auto pt-2 border-t border-border">
                    Đọc tiếp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </article>
    )
}

// ─── Main NewsSection ─────────────────────────────────────────────────────────
export function NewsSection() {
    const [blogs, setBlogs] = useState<BlogResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [keyword, setKeyword] = useState("")
    const [searchInput, setSearchInput] = useState("")

    const fetchBlogs = useCallback(async (pg: number, kw: string) => {
        setLoading(true)
        setError("")
        try {
            const res = await blogService.getBlogs({ page: pg, size: PAGE_SIZE, keyword: kw || undefined })
            if (res.success && res.data) {
                const data = res.data as PageBlogResponse
                setBlogs(data.content || [])
                setTotalPages(data.totalPages || 0)
                setTotalElements(data.totalElements || 0)
            } else {
                setError(res.message || "Không thể tải danh sách bài viết.")
            }
        } catch (err: any) {
            const msg: string = err?.message ?? ""
            if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("401")) {
                setError("Vào trang này bạn cần đăng nhập để xem bài viết.")
            } else {
                setError("Lỗi kết nối. Vui lòng thử lại sau.")
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBlogs(page, keyword)
    }, [page, keyword, fetchBlogs])

    const handleSearch = () => {
        setPage(0)
        setKeyword(searchInput.trim())
    }

    const handleClearSearch = () => {
        setSearchInput("")
        setPage(0)
        setKeyword("")
    }

    return (
        <section id="tin-tuc" className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mx-auto max-w-3xl text-center mb-12">
                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                        <Newspaper className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Tin tức &amp; Cảnh báo mới nhất
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Cập nhật thông tin về các chiêu trò lừa đảo mới để bạn luôn cảnh giác và bảo vệ mình.
                    </p>

                    {/* Search bar */}
                    <div className="mt-8 flex gap-2 max-w-xl mx-auto">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm bài viết..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSearch()}
                                className="pl-9"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2 hidden sm:inline">Tìm kiếm</span>
                        </Button>
                        {keyword && (
                            <Button variant="ghost" onClick={handleClearSearch}>
                                Xóa
                            </Button>
                        )}
                    </div>

                    {/* Active search info */}
                    {keyword && !loading && (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Tìm thấy <strong>{totalElements}</strong> kết quả cho "<strong>{keyword}</strong>"
                        </p>
                    )}
                </div>

                {/* Error state */}
                {error && !loading && (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <p className="text-lg font-semibold text-foreground">{error}</p>
                        <Button variant="outline" onClick={() => fetchBlogs(page, keyword)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Thử lại
                        </Button>
                    </div>
                )}

                {/* Blog grid */}
                {!error && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {loading
                            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <BlogCardSkeleton key={i} />)
                            : blogs.map(blog => <BlogCard key={blog.blogId} blog={blog} />)
                        }
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && blogs.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-24 text-center">
                        <Newspaper className="h-14 w-14 text-muted-foreground/40" />
                        <p className="text-lg font-semibold text-foreground">
                            {keyword ? "Không tìm thấy bài viết phù hợp" : "Chưa có bài viết nào"}
                        </p>
                        {keyword && (
                            <Button variant="outline" onClick={handleClearSearch}>
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            // Show limited page buttons for large pages
                            if (totalPages > 7 && Math.abs(i - page) > 2 && i !== 0 && i !== totalPages - 1) {
                                if (i === 1 && page > 3) return <span key={i} className="text-muted-foreground px-1">…</span>
                                if (i === totalPages - 2 && page < totalPages - 4) return <span key={i} className="text-muted-foreground px-1">…</span>
                                if (Math.abs(i - page) > 2) return null
                            }
                            return (
                                <Button
                                    key={i}
                                    variant={page === i ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setPage(i)}
                                    className="w-9 h-9"
                                >
                                    {i + 1}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Pagination info */}
                {!loading && !error && totalElements > 0 && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Trang {page + 1} / {totalPages} &bull; {totalElements} bài viết
                    </p>
                )}
            </div>
        </section>
    )
}
