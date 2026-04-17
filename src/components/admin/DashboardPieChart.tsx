import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

const COLORS = [
    "hsl(152, 69%, 41%)",   // emerald - approved
    "hsl(38, 92%, 50%)",    // amber - pending
    "hsl(347, 77%, 50%)",   // rose - rejected
]



interface DashboardPieChartProps {
    data?: {
        valid: number;
        pending: number;
        invalid: number;
    }
}

export function DashboardPieChart({ data }: DashboardPieChartProps) {
    const reportStatusData = [
        { name: "approved", value: data?.valid ?? 0, label: "Đã duyệt" },
        { name: "pending", value: data?.pending ?? 0, label: "Chờ duyệt" },
        { name: "rejected", value: data?.invalid ?? 0, label: "Từ chối" },
    ]
    const total = reportStatusData.reduce((sum, item) => sum + item.value, 0)
    const pct = (val: number) => total === 0 ? "0" : ((val / total) * 100).toFixed(1)

    const dynamicChartConfig = {
        approved: {
            label: `Đã duyệt ${data?.valid ?? 0} (${pct(data?.valid ?? 0)}%)`,
            color: COLORS[0],
        },
        pending: {
            label: `Chờ duyệt ${data?.pending ?? 0} (${pct(data?.pending ?? 0)}%)`,
            color: COLORS[1],
        },
        rejected: {
            label: `Từ chối ${data?.invalid ?? 0} (${pct(data?.invalid ?? 0)}%)`,
            color: COLORS[2],
        },
    } satisfies ChartConfig

    return (
        <Card className="border-slate-200 dark:border-slate-700/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Thống kê báo cáo</CardTitle>
                <CardDescription>Phân bổ trạng thái báo cáo lừa đảo</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={dynamicChartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => {
                                        const labels: Record<string, string> = {
                                            approved: "Đã duyệt",
                                            pending: "Chờ duyệt",
                                            rejected: "Từ chối"
                                        }
                                        const labelText = labels[name as string] || name
                                        return (
                                            <div className="flex items-center gap-2">
                                                <span>{labelText}</span>
                                                <span className="font-mono font-bold">
                                                    {value} ({((Number(value) / total) * 100).toFixed(1)}%)
                                                </span>
                                            </div>
                                        )
                                    }}
                                    hideLabel
                                />
                            }
                        />
                        <Pie
                            data={reportStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            strokeWidth={3}
                            stroke="hsl(var(--background))"
                            paddingAngle={3}
                        >
                            {reportStatusData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index]}
                                    className="transition-opacity hover:opacity-80"
                                />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        {/* Center label */}
                        <text
                            x="50%"
                            y="45%"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-foreground text-2xl font-bold"
                        >
                            {total.toLocaleString()}
                        </text>
                        <text
                            x="50%"
                            y="55%"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-muted-foreground text-xs"
                        >
                            Tổng báo cáo
                        </text>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
