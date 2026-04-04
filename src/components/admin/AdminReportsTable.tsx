import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { reportService, PhoneReportItem, ReportStatus } from "@/services/report.service"

const statusConfig: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Chờ duyệt", variant: "outline" },
    VALID: { label: "Hợp lệ", variant: "default" },
    INVALID: { label: "Từ chối", variant: "destructive" },
    RESOLVED: { label: "Đã xử lý", variant: "secondary" },
}

export function AdminReportsTable() {
    const [reports, setReports] = useState<PhoneReportItem[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const loadReports = async () => {
        setLoading(true)
        try {
            // Fetch PENDING reports (most actionable) — take first page, size 8
            const res = await reportService.getGroupedReports({ status: "PENDING", page: 0, size: 8 })
            // Flatten grouped → individual report items (up to 8)
            const flat: PhoneReportItem[] = []
            for (const group of res.data.content ?? []) {
                for (const r of group.reports || []) {
                    flat.push(r)
                    if (flat.length >= 8) break
                }
                if (flat.length >= 8) break
            }
            setReports(flat)
        } catch {
            setReports([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadReports() }, [])

    const handleAction = async (reportId: string, status: ReportStatus) => {
        setUpdatingId(reportId)
        try {
            await reportService.updateReportStatus(reportId, status)
            await loadReports()
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <Card className="border-slate-200 dark:border-slate-700/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Báo cáo chờ duyệt</CardTitle>
                        <CardDescription>Các báo cáo lừa đảo cần xử lý</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/reports">Xem tất cả</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Đang tải...</span>
                        </div>
                    ) : reports.length === 0 ? (
                        <p className="py-10 text-center text-sm text-muted-foreground">
                            Không có báo cáo nào đang chờ duyệt.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Nội dung</TableHead>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.reportId} className="group">
                                        <TableCell className="font-mono text-xs font-medium">
                                            {report.phoneNumber}
                                        </TableCell>
                                        <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                                            {report.content}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-xs">
                                            {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusConfig[report.status].variant}>
                                                {statusConfig[report.status].label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {report.status === "PENDING" && (
                                                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700"
                                                        title="Phê duyệt"
                                                        disabled={updatingId === report.reportId}
                                                        onClick={() => handleAction(report.reportId, "VALID")}
                                                    >
                                                        {updatingId === report.reportId
                                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                                            : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                        title="Từ chối"
                                                        disabled={updatingId === report.reportId}
                                                        onClick={() => handleAction(report.reportId, "INVALID")}
                                                    >
                                                        {updatingId === report.reportId
                                                            ? <Loader2 className="h-4 w-4 animate-spin" />
                                                            : <X className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
