import { useState, useEffect, useCallback, useRef } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { blogService, BlogResponse } from "@/services/blog.service"
import {
    Activity,
    Plus,
    Search,
    Edit2,
    RefreshCw,
    Newspaper,
    X,
    Loader2,
    ImageIcon,
    ChevronLeft,
    ChevronRight,
    Eye,
} from "lucide-react"

// ─── Utility ────────────────────────────────────────────────────────
const compressImage = (file: File, maxWidth = 1000): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        })
                        resolve(newFile)
                    } else {
                        resolve(file)
                    }
                }, 'image/jpeg', 0.8) // 80% quality JPEG
            }
            img.onerror = () => resolve(file)
        }
        reader.onerror = () => resolve(file)
    })
}

// ─── Blog Modal (Create / Edit) ────────────────────────────────────────

interface BlogModalProps {
    mode: "create" | "edit"
    blog?: BlogResponse
    onClose: () => void
    onSuccess: () => void
}

function BlogModal({ mode, blog, onClose, onSuccess }: BlogModalProps) {
    const [title, setTitle] = useState(blog?.title ?? "")
    const [label, setLabel] = useState(blog?.label ?? "")
    const [snippet, setSnippet] = useState(blog?.snippet ?? "")
    const [content, setContent] = useState(blog?.content ?? "")
    const [image, setImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string>(blog?.imageUrl ?? "")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        let finalFile = file;
        // Nếu ảnh lớn hơn 500KB, tự động nén lại để không bị lỗi Nginx 413 / Connection Reset
        if (file.size > 500 * 1024) {
             finalFile = await compressImage(file);
        }

        setImage(finalFile)
        setPreview(URL.createObjectURL(finalFile))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const data = { title, label, snippet, content }
            if (mode === "create") {
                if (!image) throw new Error("Vui lòng chọn ảnh bìa cho bài viết.")
                await blogService.createBlog(data, image)
            } else if (mode === "edit" && blog) {
                await blogService.updateBlog(blog.blogId, data, image ?? undefined)
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message ?? "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {mode === "create" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="blog-title">Tiêu đề <span className="text-red-500">*</span></Label>
                        <Input
                            id="blog-title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề bài viết..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Label */}
                    <div className="space-y-1.5">
                        <Label htmlFor="blog-label">Nhãn / Danh mục <span className="text-red-500">*</span></Label>
                        <Input
                            id="blog-label"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                            placeholder="Ví dụ: Cảnh báo, Hướng dẫn, Tin tức..."
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Snippet */}
                    <div className="space-y-1.5">
                        <Label htmlFor="blog-snippet">Mô tả ngắn <span className="text-red-500">*</span></Label>
                        <textarea
                            id="blog-snippet"
                            value={snippet}
                            onChange={e => setSnippet(e.target.value)}
                            placeholder="Mô tả ngắn gọn về bài viết..."
                            required
                            disabled={loading}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                        <Label htmlFor="blog-content">Nội dung <span className="text-red-500">*</span></Label>
                        <textarea
                            id="blog-content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Nội dung chi tiết bài viết..."
                            required
                            disabled={loading}
                            rows={8}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 resize-none"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-1.5">
                        <Label>
                            Ảnh bìa {mode === "create" && <span className="text-red-500">*</span>}
                            {mode === "edit" && <span className="text-xs text-muted-foreground ml-2">(để trống nếu không thay đổi)</span>}
                        </Label>
                        <div
                            className="relative cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-4 hover:border-primary dark:border-slate-600 dark:hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mx-auto max-h-40 rounded-md object-cover"
                                    />
                                    <p className="mt-2 text-center text-xs text-muted-foreground">
                                        Click để thay đổi ảnh
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <ImageIcon className="h-8 w-8" />
                                    <p className="text-sm">Click để chọn ảnh bìa</p>
                                    <p className="text-xs">PNG, JPG, WEBP tối đa 5MB</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : mode === "create" ? "Đăng bài" : "Lưu thay đổi"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Blog Detail Modal ─────────────────────────────────────────────────

function BlogDetailModal({ blog, onClose, onEdit }: { blog: BlogResponse; onClose: () => void; onEdit: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">{blog.title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {blog.imageUrl && (
                        <img src={blog.imageUrl} alt={blog.title} className="w-full rounded-lg object-cover max-h-48" />
                    )}
                    <div className="flex gap-2 flex-wrap">
                        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">{blog.label}</span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic border-l-4 border-primary/30 pl-3">{blog.snippet}</p>
                    <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {blog.content}
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">Đóng</Button>
                        <Button onClick={onEdit} className="flex-1 gap-2">
                            <Edit2 className="h-4 w-4" /> Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────

const PAGE_SIZE = 10

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<BlogResponse[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [keyword, setKeyword] = useState("")

    // Modal state
    const [modalMode, setModalMode] = useState<"create" | "edit">("create")
    const [selectedBlog, setSelectedBlog] = useState<BlogResponse | undefined>()
    const [showModal, setShowModal] = useState(false)
    const [viewBlog, setViewBlog] = useState<BlogResponse | undefined>()

    const fetchBlogs = useCallback(async (kw = keyword, p = page) => {
        setLoading(true)
        setError("")
        try {
            const res = await blogService.getBlogs({ keyword: kw || undefined, page: p, size: PAGE_SIZE })
            const pageData = res.data
            setBlogs(pageData.content ?? [])
            setTotalElements(pageData.totalElements ?? 0)
            setTotalPages(pageData.totalPages ?? 0)
        } catch (err: any) {
            setError(err.message ?? "Không thể tải danh sách bài viết")
        } finally {
            setLoading(false)
        }
    }, [keyword, page])

    useEffect(() => {
        fetchBlogs(keyword, page)
    }, [keyword, page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setKeyword(search)
        setPage(0)
    }

    const openCreate = () => {
        setModalMode("create")
        setSelectedBlog(undefined)
        setShowModal(true)
    }

    const openEdit = (blog: BlogResponse) => {
        setViewBlog(undefined)
        setModalMode("edit")
        setSelectedBlog(blog)
        setShowModal(true)
    }

    const handleModalSuccess = () => {
        setShowModal(false)
        fetchBlogs(keyword, page)
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700/50 dark:bg-slate-900">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Quản lý bài viết
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Xem, thêm và chỉnh sửa bài viết / blog
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ModeToggle />
                        <Badge variant="outline" className="gap-1.5">
                            <Activity className="h-3 w-3 text-emerald-500" />
                            Hệ thống hoạt động
                        </Badge>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng bài viết</CardTitle>
                                <Newspaper className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{totalElements}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Trang hiện tại</CardTitle>
                                <Newspaper className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{blogs.length}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toolbar */}
                    <form onSubmit={handleSearch} className="mb-4 flex items-center gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm tiêu đề..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9"
                                id="blog-search"
                            />
                        </div>
                        <Button type="submit" variant="outline">Tìm</Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => { setSearch(""); setKeyword(""); setPage(0) }}
                            title="Làm mới"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button type="button" onClick={openCreate} className="ml-auto gap-2">
                            <Plus className="h-4 w-4" />
                            Thêm bài viết
                        </Button>
                    </form>

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
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Bài viết</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nhãn</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ngày đăng</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : blogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                                                {keyword ? "Không tìm thấy bài viết phù hợp." : "Chưa có bài viết nào."}
                                            </td>
                                        </tr>
                                    ) : (
                                        blogs.map(blog => (
                                            <tr
                                                key={blog.blogId}
                                                className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                            >
                                                {/* Blog info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {blog.imageUrl ? (
                                                            <img
                                                                src={blog.imageUrl}
                                                                alt={blog.title}
                                                                className="h-12 w-16 shrink-0 rounded-md object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{blog.title}</p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{blog.snippet}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                        {blog.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                                    {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setViewBlog(blog)}
                                                            className="gap-1.5"
                                                            id={`view-blog-${blog.blogId}`}
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Xem
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEdit(blog)}
                                                            className="gap-1.5"
                                                            id={`edit-blog-${blog.blogId}`}
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" />
                                                            Sửa
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                            <p>
                                Trang {page + 1} / {totalPages} &middot; {totalElements} bài viết
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Trước
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="gap-1"
                                >
                                    Sau
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Create / Edit Modal */}
            {showModal && (
                <BlogModal
                    mode={modalMode}
                    blog={selectedBlog}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}

            {/* Detail View Modal */}
            {viewBlog && (
                <BlogDetailModal
                    blog={viewBlog}
                    onClose={() => setViewBlog(undefined)}
                    onEdit={() => openEdit(viewBlog)}
                />
            )}
        </div>
    )
}
