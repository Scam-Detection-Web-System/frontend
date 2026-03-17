import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProviderData {
    provider: string
    prefix: string
    total: number
    scam: number       // Lừa đảo
    nuisance: number   // Quấy rối
    safe: number       // An toàn
    unverified: number // Chưa xác minh
}

const providerData: ProviderData[] = [
    { provider: "Viettel", prefix: "086, 096, 097, 098, 032-036", total: 1245, scam: 389, nuisance: 234, safe: 412, unverified: 210 },
    { provider: "Mobifone", prefix: "089, 090, 093, 070, 079", total: 987, scam: 312, nuisance: 187, safe: 321, unverified: 167 },
    { provider: "Vinaphone", prefix: "088, 091, 094, 081-085", total: 856, scam: 267, nuisance: 156, safe: 298, unverified: 135 },
    { provider: "Vietnamobile", prefix: "092, 056, 058", total: 342, scam: 156, nuisance: 89, safe: 43, unverified: 54 },
    { provider: "Gmobile", prefix: "099, 059", total: 128, scam: 67, nuisance: 34, safe: 12, unverified: 15 },
    { provider: "Reddi (Mạng ảo)", prefix: "055", total: 45, scam: 23, nuisance: 11, safe: 5, unverified: 6 },
]

function LabelBadge({ count, variant }: { count: number; variant: "scam" | "nuisance" | "safe" | "unverified" }) {
    const styles = {
        scam: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 hover:bg-red-100",
        nuisance: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400 hover:bg-orange-100",
        safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 hover:bg-emerald-100",
        unverified: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-100",
    }

    return (
        <Badge variant="secondary" className={`font-mono text-xs ${styles[variant]}`}>
            {count.toLocaleString()}
        </Badge>
    )
}

function PercentBar({ value, total, color }: { value: number; total: number; color: string }) {
    const pct = total > 0 ? (value / total) * 100 : 0
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                    className={`h-full rounded-full ${color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
        </div>
    )
}

export function DashboardProviderStats() {
    const totalAll = providerData.reduce((s, p) => s + p.total, 0)

    return (
        <Card className="border-slate-200 dark:border-slate-700/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Thống kê theo nhà mạng</CardTitle>
                        <CardDescription>
                            Phân loại nhãn số điện thoại theo từng nhà mạng
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono">
                        Tổng: {totalAll.toLocaleString()} SĐT
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[130px]">Nhà mạng</TableHead>
                                <TableHead className="min-w-[160px]">Đầu số</TableHead>
                                <TableHead className="text-center">Tổng SĐT</TableHead>
                                <TableHead className="text-center">
                                    <span className="text-red-600 dark:text-red-400">Lừa đảo</span>
                                </TableHead>
                                <TableHead className="text-center">
                                    <span className="text-orange-600 dark:text-orange-400">Quấy rối</span>
                                </TableHead>
                                <TableHead className="text-center">
                                    <span className="text-emerald-600 dark:text-emerald-400">An toàn</span>
                                </TableHead>
                                <TableHead className="text-center">Chưa xác minh</TableHead>
                                <TableHead className="min-w-[120px]">Tỉ lệ lừa đảo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {providerData.map((row) => (
                                <TableRow key={row.provider} className="group">
                                    <TableCell className="font-semibold">{row.provider}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {row.prefix}
                                    </TableCell>
                                    <TableCell className="text-center font-mono font-medium">
                                        {row.total.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <LabelBadge count={row.scam} variant="scam" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <LabelBadge count={row.nuisance} variant="nuisance" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <LabelBadge count={row.safe} variant="safe" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <LabelBadge count={row.unverified} variant="unverified" />
                                    </TableCell>
                                    <TableCell>
                                        <PercentBar
                                            value={row.scam}
                                            total={row.total}
                                            color="bg-red-500"
                                        />
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
