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
import { Check, X, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ReportStatus = "pending" | "approved" | "rejected"

interface Report {
    id: string
    phone: string
    type: string
    reporter: string
    date: string
    status: ReportStatus
}

const mockReports: Report[] = [
    { id: "RPT-001", phone: "0912345678", type: "Lừa đảo tài chính", reporter: "Nguyễn Văn A", date: "09/03/2026", status: "pending" },
    { id: "RPT-002", phone: "0987654321", type: "Giả mạo ngân hàng", reporter: "Trần Thị B", date: "08/03/2026", status: "pending" },
    { id: "RPT-003", phone: "0356789012", type: "Lừa đảo việc làm", reporter: "Lê Văn C", date: "08/03/2026", status: "approved" },
    { id: "RPT-004", phone: "0945678901", type: "Vay tiền online", reporter: "Phạm Thị D", date: "07/03/2026", status: "approved" },
    { id: "RPT-005", phone: "0867890123", type: "Mạo danh công an", reporter: "Hoàng Văn E", date: "07/03/2026", status: "rejected" },
    { id: "RPT-006", phone: "0778901234", type: "Lừa đảo đầu tư", reporter: "Vũ Thị F", date: "06/03/2026", status: "pending" },
    { id: "RPT-007", phone: "0689012345", type: "Giả mạo app", reporter: "Đỗ Văn G", date: "06/03/2026", status: "approved" },
    { id: "RPT-008", phone: "0590123456", type: "Tin nhắn lừa đảo", reporter: "Ngô Thị H", date: "05/03/2026", status: "pending" },
]

const statusConfig: Record<ReportStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Chờ duyệt", variant: "outline" },
    approved: { label: "Đã duyệt", variant: "default" },
    rejected: { label: "Từ chối", variant: "destructive" },
}

export function AdminReportsTable() {
    return (
        <Card className="border-slate-200 dark:border-slate-700/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Báo cáo gần đây</CardTitle>
                        <CardDescription>Quản lý các báo cáo lừa đảo từ người dùng</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Xem tất cả</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Mã</TableHead>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Loại lừa đảo</TableHead>
                                <TableHead>Người báo cáo</TableHead>
                                <TableHead>Ngày</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockReports.map((report) => (
                                <TableRow key={report.id} className="group">
                                    <TableCell className="font-mono text-xs font-medium">{report.id}</TableCell>
                                    <TableCell className="font-mono">{report.phone}</TableCell>
                                    <TableCell>{report.type}</TableCell>
                                    <TableCell>{report.reporter}</TableCell>
                                    <TableCell className="text-muted-foreground">{report.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusConfig[report.status].variant}>
                                            {statusConfig[report.status].label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Xem chi tiết">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {report.status === "pending" && (
                                                <>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700" title="Phê duyệt">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" title="Từ chối">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
